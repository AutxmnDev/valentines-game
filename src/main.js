import Phaser from "phaser";
import GameScene from "./game";

const config = {
  type: Phaser.AUTO,
  width: 360,      // ancho móvil
  height: 640,     // alto móvil (vertical)
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
