import Phaser from "phaser"
import { GameComponent } from "../components/GameComponent";
import { DefaultSettings } from "../settings/DefaultSettings";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";

interface UserCock {
  cock_colour: number,
  cock_style: number,
}

interface UserPipe {
  pipe_colour: number,
  pipe_style: number,
}

interface UserSettingsJson {
  user_name: string,
  user_score: number,

  user_cock: UserCock
  user_pipe: UserPipe,
}

class FlappyBird extends Phaser.Scene {
  private static FlappyBird_: FlappyBird  //instancja

  private constructor() {
    super()
  }

  public static Instance = (): FlappyBird => {
    if (this.FlappyBird_ === null || this.FlappyBird_ === undefined) {
      this.FlappyBird_ = new FlappyBird();
    }
    return this.FlappyBird_;
  }

  static player;

  static pipes: Phaser.GameObjects.Sprite[] = [];
  static pipe;

  static velocityX = 0.2; //poruszanie się rur
  static pipeSpacing = 100; //odstęp między rurami
  static pipeX = window.innerWidth;
  static pipeY = 0;

  private pipeInterval: NodeJS.Timer;
  private gameStarted: boolean = false;
  private gameOver: boolean = false;
  public score: number = 0;
  private scoreText: Phaser.GameObjects.Text;

  private settings: UserSettingsJson = JSON.parse(localStorage.getItem('settings') || '');

  preload() {
    //this.load.image('background', `../../assets/Background/Background${DefaultSettings.background_colour}.png`);
    this.load.image('pipeTop', '../../assets/Tiles/pipe-green-top.png');
    this.load.image('pipeBot', '../../assets/Tiles/pipe-green-bot.png');
    this.load.spritesheet('bird', `../../assets/Player/StyleBird${this.settings.user_cock.cock_style}/Bird${this.settings.user_cock.cock_style}-${this.settings.user_cock.cock_colour}.png`, {
      frameHeight: 16,
      frameWidth: 16,
    });
  }

  create() {
    const startText = this.add.text(DefaultSettings.width / 2, DefaultSettings.height / 2, 'Press space to start a game', { fontSize: '32px', color: '#fff' });
    startText.setOrigin(0.5);

    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, { fontSize: '32px', color: '#fff' });

    FlappyBird.pipe = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    FlappyBird.player = this.physics.add.sprite(200, DefaultSettings.height / 2, 'bird').setScale(3);
    FlappyBird.player.setBounce(0.2);
    FlappyBird.player.setCollideWorldBounds(true);

    FlappyBird.player.body.allowGravity = false;

    console.log(this.settings.user_cock.cock_style)

    this.input.keyboard?.on('keydown-SPACE', () => {
      if (!this.gameStarted) {
        this.gameStarted = true;
        this.gameOver = false;
        this.score = 0;
        this.scoreText.setText(`Score: ${this.score}`);

        FlappyBird.player.body.allowGravity = true;

        startText.destroy();
        this.pipeInterval = setInterval(this.GeneratePipes, 2500);
      } else if (this.gameOver) {
        alert('gameover')
        this.GameOver();
      }
    });

    this.physics.world.on('worldbounds', (body) => {
      if (body.gameObject === FlappyBird.player) {
        this.cleanup();
        this.scene.restart();
      }
    }, this);


    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 3 }),
      frameRate: 50,
      repeat: -1,
    });


    this.physics.add.collider(FlappyBird.player, FlappyBird.pipe, () => {
      if (!this.gameOver) {
        this.GameOver();
        // console.log('GameOver')
        //console.log(settings.user_name)

        this.tweens.add({
          targets: FlappyBird.player,
          alpha: 0,
          duration: 0,
          yoyo: true,
          repeat: 5,
          onComplete: () => {
            this.scene.restart();
          },
        });
      }
    });
  }

  cleanup() {
    clearInterval(this.pipeInterval)

    console.log(`GameStart: ${this.gameStarted} GameOver: ${this.gameOver}`)
  }


  update() {
    if (!this.gameStarted || this.gameOver) {
      return;
    }

    FlappyBird.pipes.forEach((pipe) => {
      if (!pipe.getData('scored') && pipe.x + pipe.width < FlappyBird.player.x) {
        if (pipe.texture.key === 'pipeTop') {

          this.score += 1;
          pipe.setData('scored', true);
          this.scoreText.setText(`Score: ${this.score}`);
        }
      }
    });

    const cursor = this.input.keyboard?.createCursorKeys();
    if (cursor?.space.isDown) {
      FlappyBird.player.setVelocityY(-300);
      FlappyBird.player.anims.play('up', true);
    } else if (cursor?.space.isUp) {
      FlappyBird.player.anims.play('up', false);
    }

    this.PipeMove();
  }


  PipeMove = () => {
    for (let i = FlappyBird.pipes.length - 1; i >= 0; i--) {
      const pipe = FlappyBird.pipes[i];

      if (pipe.x < -pipe.width) {
        pipe.destroy();
        FlappyBird.pipes.splice(i, 1);

      } else {
        pipe.x -= 3;
      }
    }
  }

  GeneratePipes = () => {
    if (this.gameOver) return;
    const pipeBotTexture = this.textures.get('pipeBot');
    const pipeTopTexture = this.textures.get('pipeTop');

    const pipeBotHeight = pipeBotTexture.getSourceImage().height;

    let randomY = FlappyBird.pipeY - (pipeBotHeight / 4) - Math.random() * (pipeBotHeight / 2);
    let emptySpace = DefaultSettings.height / 2;

    let pipeTop = FlappyBird.pipe.create(FlappyBird.pipeX, randomY, 'pipeTop') as Phaser.Physics.Arcade.Sprite;
    let pipeBot = FlappyBird.pipe.create(FlappyBird.pipeX, randomY + emptySpace + pipeBotHeight, 'pipeBot') as Phaser.Physics.Arcade.Sprite;

    pipeTop.setData('scored', false);
    pipeBot.setData('scored', false);

    FlappyBird.pipes.push(pipeTop);
    FlappyBird.pipes.push(pipeBot);
  }

  GameOver = () => {
    console.log(`Score: ${this.score}`)

    const user_cock = {
      user_name: this.settings.user_name,
      user_score: this.score
    }

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    if (leaderboard === null) {
      localStorage.handleClick("leaderboard", JSON.stringify([user_cock]));
    }

    if (leaderboard.find((entry) => (entry.user_name === user_cock.user_name))) {
      if (leaderboard.find((entry) => (entry.user_name === user_cock.user_name && entry.user_score < user_cock.user_score)))
        leaderboard.find((entry) => (entry.user_name === user_cock.user_name)).user_score = user_cock.user_score;
    }
    else {
      leaderboard.push(user_cock);
    }

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    this.settings.user_score = this.score;
    localStorage.setItem('settings', JSON.stringify(this.settings));


    this.gameOver = true;
    this.gameStarted = false;
    this.score = 0;

    this.cleanup();
    this.scene.restart();


  };

}

export const GamePage = () => {
  const flappy_score = FlappyBird.Instance();
  console.log(flappy_score.score);

  useEffect(() => {
    console.log(flappy_score.score);
  }, [flappy_score])

  const config = {
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width: DefaultSettings.width,
    height: DefaultSettings.height,
    scale: {
      mode: Phaser.Scale.FIT,
      //autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: FlappyBird,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 600 },
        debug: false,
      },
    },
  };

  return (
    <>
      <GameComponent config={config} />
      <NavLink to={'/'}>
        <button className={'btn btn-primary btn-lg rounded-pill shadow px-4'}>Back</button>
      </NavLink>
      <NavLink to={'/leaderboard'}>
        <button className={'btn btn-success btn-lg rounded-pill shadow px-4'}>Leaderboard</button>
      </NavLink>
      <NavLink to={'/settings'}>
        <button className={'btn btn-danger btn-lg rounded-pill shadow px-4'}>Settings</button>
      </NavLink>


    </>
  )
}
