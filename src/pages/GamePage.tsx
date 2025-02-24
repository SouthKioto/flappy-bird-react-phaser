import Phaser from "phaser"
import { GameComponent } from "../components/GameComponent";
import { DefaultSettings } from "../settings/DefaultSettings";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";

import Settings from "../settings/DefaultUserSettings.json";
import { useState } from "react";
import { Placeholder } from "react-bootstrap";

//na razie interface nie potrzebne 
//ale moga sie przydac pozniej podczas

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
  private score: number = 0;
  private scoreText: Phaser.GameObjects.Text;

  preload() {
    this.load.image('background', `../../assets/Background/Background${DefaultSettings.background_colour}.png`);

    /*this.load.spritesheet('pipe', `../../assets/Tiles/Style ${DefaultSettings.pipe_style}/PipeStyle${DefaultSettings.pipe_style}.png`, {
      frameHeight: 48,
      frameWidth: 32,
    })*/

    this.load.image('pipeTop', '../../assets/Tiles/pipe-green-top.png');
    this.load.image('pipeBot', '../../assets/Tiles/pipe-green-bot.png');


    this.load.spritesheet('bird', `../../assets/Player/StyleBird${DefaultSettings.bird_style}/Bird${DefaultSettings.bird_style}-${DefaultSettings.bird_colour}.png`, {
      frameHeight: 16,
      frameWidth: 16,
    });
  }

  create() {
    FlappyBird.pipe = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    FlappyBird.player = this.physics.add.sprite(200, DefaultSettings.height / 2, 'bird').setScale(3);
    FlappyBird.player.setBounce(0.2);
    FlappyBird.player.setCollideWorldBounds(true);

    FlappyBird.player.body.allowGravity = false;

    const startText = this.add.text(DefaultSettings.width / 2, DefaultSettings.height / 2, 'Naciśnij spację aby rozpocząć', { fontSize: '32px', color: '#fff' });
    startText.setOrigin(0.5);

    this.scoreText = this.add.text(10, 10, `Score ${this.score}`, { fontSize: '32px', color: '#fff' });

    this.input.keyboard?.on('keydown-SPACE', () => {
      if (!this.gameStarted) {
        this.gameStarted = true;
        this.gameOver = false;
        this.score = 0; // Zresetuj wynik
        this.scoreText.setText(`Score: ${this.score}`);

        FlappyBird.player.body.allowGravity = true;

        startText.destroy();
        this.pipeInterval = setInterval(this.GeneratePipes, 1000);
      } else if (this.gameOver) {
        // Zresetuj grę po zakończeniu
        this.cleanup();
        this.scene.restart();
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
        this.gameStarted = false;
        this.gameOver = true;
        this.cleanup();

        localStorage.setItem('Wynik', this.score);

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
    if (!this.gameStarted || this.gameOver) { // Zatrzymaj akcje, gdy gra się nie zaczęła lub skończyła
      return;
    }

    FlappyBird.pipes.forEach((pipe) => {
      if (pipe.texture.key == 'pipeTop' && !pipe.getData('scored')) {
        if (pipe.x + pipe.width < FlappyBird.player.x) {
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
        pipe.x -= 1.5;
      }
    }
  }

  GeneratePipes = () => {
    if (this.gameOver) return; // Zatrzymaj generowanie rur po zakończeniu gry

    const pipeBotTexture = this.textures.get('pipeBot');
    const pipeTopTexture = this.textures.get('pipeTop');

    const pipeBotHeight = pipeBotTexture.getSourceImage().height;

    let randomY = FlappyBird.pipeY - (pipeBotHeight / 4) - Math.random() * (pipeBotHeight / 2);
    let emptySpace = DefaultSettings.height / 2;

    let pipeTop = FlappyBird.pipe.create(FlappyBird.pipeX, randomY, 'pipeTop') as Phaser.Physics.Arcade.Sprite;
    let pipeBot = FlappyBird.pipe.create(FlappyBird.pipeX, randomY + emptySpace + pipeBotHeight, 'pipeBot') as Phaser.Physics.Arcade.Sprite;

    pipeTop.setData('scored', false);

    FlappyBird.pipes.push(pipeTop);
    FlappyBird.pipes.push(pipeBot);
  }

}

export const GamePage = () => {
  const [userScore, setScoreSettings] = useState<number>()


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
    </>
  )
}
