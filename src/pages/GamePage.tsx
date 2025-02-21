import Phaser, { Scale } from "phaser";
import { GameComponent } from "../components/GameComponent";
import { DefaultSettings } from "../classes/DefaultSettings";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
import { lazy } from "react";


class FlappyBird extends Phaser.Scene {

  static player;
  static pipe;

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

    if (!FlappyBird.pipe) {
      this.GeneratePipes();
    }

    this.PipeMove();
  }


  PipeMove = () => {
    //console.log(FlappyBird.pipe.x)
    if (!FlappyBird.pipe) return;

    //sprawdzenie czy rura zetknęła 
    //sie z lewą krawedzia kanwy 
    if (FlappyBird.pipe.x < 0) {
      FlappyBird.pipe.destroy();
      FlappyBird.pipe = null;

      //wywołanie funkcji generacji kolejnej rury
      //this.GeneratePipe();

      return;
    } else {
      FlappyBird.pipe.x -= 1.5;
    }

    //console.log(`${FlappyBird.pipe.x} + ${FlappyBird.pipe.width} = ${FlappyBird.pipe.x + FlappyBird.pipe.width}`)

    //console.log(`${FlappyBird.pipe.displayOriginX}`)
  }

  GeneratePipes = () => {
    for (let i = 0; i <= 1; i++) {
      if (i % 2 == 0) {
        FlappyBird.pipe = this.physics.add.sprite(
          window.innerWidth,
          0,
          'pipe',
        ).setScale(4).setOrigin(0, 0).setRotation(3.14)
      } else {
        FlappyBird.pipe = this.physics.add.sprite(
          window.innerWidth,
          window.innerHeight,
          'pipe',
        ).setScale(4).setOrigin(0, 0);
      }

      FlappyBird.pipe.setCollideWorldBounds(true)

      this.physics.add.collider(FlappyBird.player, FlappyBird.pipe)
    }
  }

}

export const GamePage = () => {
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
