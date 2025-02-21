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

  preload() {

    this.load.image('background', `../../assets/Background/Background${DefaultSettings.background_colour}.png`);
    this.load.spritesheet('pipe', `../../assets/Tiles/Style ${DefaultSettings.pipe_style}/PipeStyle${DefaultSettings.pipe_style}.png`, {
      frameHeight: 48,
      frameWidth: 32,
    })

    this.load.spritesheet('bird', `../../assets/Player/StyleBird${DefaultSettings.bird_style}/Bird${DefaultSettings.bird_style}-${DefaultSettings.bird_colour}.png`, {
      frameHeight: 16,
      frameWidth: 16,
    });
  }

  create() {

    //skalowanie obrazu i dodawanie go jako sklejany background do canvy
    const tileSize = DefaultSettings.bgImg_Width; // zakładamy, że szerokość = wysokość = 256
    const numTiles = Math.ceil(DefaultSettings.width / tileSize);

    for (let i = 0; i < numTiles; i++) {
      // Ustawiamy origin na (0, 0), aby lewy górny róg obrazka odpowiadał pozycji (x, y)
      this.add.image(i * tileSize, 0, 'background').setOrigin(0, 0).setScale(3);
    }

    //this.add.image(DefaultSettings.width / 2, DefaultSettings.heigh / 2, 'background')
    //.setScale(2);
    //FlappyBird.pipe.setVelocityX(-160);

    FlappyBird.player = this.physics.add.sprite(100, 500, 'bird').setScale(3);
    FlappyBird.player.setBounce(0.2)
    FlappyBird.player.setCollideWorldBounds(true)

    this.add.text(1024, 550, "Góra", { color: '#FF0000' });

    this.add.text(1024, 950, "Gół", { color: '#FF0000' })

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 3 }),
      frameRate: 50,
      repeat: -1
    });
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

    if (FlappyBird.pipes.length === 0) {
      this.GeneratePipes();
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
    const pipeSpacing = 200;
    const pipeX = window.innerWidth;

    const minX = window.innerWidth;
    const maxY = 0;

    const holeY = Phaser.Math.Between(minX, maxY);
    console.log(`Dziura: ${holeY}
    MinX: ${minX}
    MaxY: ${maxY}`)

    const topPipe = this.physics.add.sprite(pipeX, holeY - pipeSpacing, 'pipe')
      .setScale(4)
      .setOrigin(0.5, 1)
      .setRotation(Math.PI)
      .setImmovable(true);

    const bottomPipe = this.physics.add.sprite(pipeX, holeY + pipeSpacing, 'pipe')
      .setScale(4)
      .setOrigin(0.5, 0)
      .setImmovable(true);

    topPipe.body.allowGravity = false;
    bottomPipe.body.allowGravity = false;

    FlappyBird.pipes.push(topPipe, bottomPipe);

    this.physics.add.collider(FlappyBird.player, topPipe);
    this.physics.add.collider(FlappyBird.player, bottomPipe);
  }

}

export const GamePage = () => {
  const [userScore, setScoreSettings] = useState<number>()


  const config = {
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width: DefaultSettings.width,
    height: DefaultSettings.heigh,
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
