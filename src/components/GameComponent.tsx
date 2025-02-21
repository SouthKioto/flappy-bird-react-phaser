import { useEffect } from "react"
import Phaser from "phaser";
import { DefaultSettings } from "../settings/DefaultSettings";

export const GameComponent = ({ config }) => {

  useEffect(() => {
    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true)
    }
  })

  return (
    <div id="phaser-container"
      style={{ width: DefaultSettings.width, height: DefaultSettings.heigh }}>

    </div>
  )
}
