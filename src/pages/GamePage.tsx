import Phaser from "phaser";
import { GameComponent } from "../components/GameComponent";
import { DefaultSettings } from "../settings/DefaultSettings";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";

import Settings from "../settings/DefaultUserSettings.json";
import { useState } from "react";

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
  static pipeSpacing = 200; //odstęp między rurami
  static pipeX = 0;
  static pipeY = 0;


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
    FlappyBird.player = this.physics.add.sprite(100, 500, 'bird').setScale(3);
    FlappyBird.player.setBounce(0.2)
    FlappyBird.player.setCollideWorldBounds(true)

    //this.add.text(1024, 550, "Góra", { color: '#FF0000' });
    //this.add.text(1024, 950, "Dół", { color: '#FF0000' })

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 3 }),
      frameRate: 50,
      repeat: -1
    });


    setInterval(this.GeneratePipes, 1000);
  }

  update() {
    const cursor = this.input.keyboard?.createCursorKeys();

    if (cursor?.space.isDown) {
      FlappyBird.player.setVelocityY(-200);
      FlappyBird.player.anims.play('up', true)

    } else if (cursor?.space.isUp) {

      FlappyBird.player.anims.play('up', false)
    }
    if (FlappyBird.player.body.touching.down) {
      //console.log("He's touching grass")
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
    FlappyBird.pipe = this.physics.add.staticGroup();

    let randomY =

      let pipeBot = FlappyBird.pipe.create(360, 640, 'pipeBot').setScale(1);
    FlappyBird.pipes.push(pipeBot);

    let pipeTop = FlappyBird.pipe.create(360, 0, 'pipeTop').setScale(1);
    FlappyBird.pipes.push(pipeTop);
    //console.log(FlappyBird.pipes.length)

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
        gravity: { y: 500 },
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
