import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("background", "/assets/background.png");
    this.load.image("player", "/assets/player.png");
    this.load.image("npc", "/assets/npc.png");
    this.load.image("item1", "/assets/item1.png");
    this.load.image("item2", "/assets/item2.png");
    this.load.image("item3", "/assets/item3.png");
    this.load.audio("bgMusic", "/assets/music.mp3");
  }

  create() {
    const WORLD_WIDTH = 1400;
    const WORLD_HEIGHT = this.scale.gameSize.height;
    const GROUND_Y = this.scale.height - 120;

    // Crear la instancia de música
    this.music = this.sound.add("bgMusic", {
      volume: 0.5,
      loop: true,
    });

    // Intentar reproducir (si el navegador lo permite)
    // En móviles, usualmente se activará al primer "pointerdown" que ya tienes
    this.input.once("pointerdown", () => {
      if (!this.music.isPlaying) {
        this.music.play();
      }
    });

    this.collected = 0;
    this.finished = false;

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.background = this.add
      .image(0, 0, "background")
      .setOrigin(0, 0)
      .setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT);

    this.player = this.add.sprite(60, GROUND_Y, "player");
    this.player.setScale(0.5);

    this.items = [
      this.add.sprite(350, GROUND_Y, "item1"),
      this.add.sprite(650, GROUND_Y, "item2"),
      this.add.sprite(950, GROUND_Y, "item3"),
    ];

    this.items.forEach((item) => item.setScale(0.4));

    this.npc = this.add.sprite(1250, GROUND_Y, "npc");
    this.npc.setScale(0.6);

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    this.messageText = this.add
      .text(this.scale.width / 2, 80, "", {
        fontSize: "18px",
        fill: "#ffffff",
        backgroundColor: "#000000cc",
        padding: { x: 10, y: 8 },
        align: "center",
        wordWrap: { width: 300 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setVisible(false);

    this.input.on("pointerdown", () => {
      this.moving = true;
    });

    this.input.on("pointerup", () => {
      this.moving = false;
    });

    this.fullLetterText = `14 de febrero 2026
Stefania Montecino <3

Hoy saludo a la hermosa mujer de ojitos preciosos que cambió mi vida con su presencia (¿quién podría ser? Ah :3), como nunca nadie lo había hecho antes.

Y es que no es solo tu forma de ser tan divertida, que tantas veces me ha subido el ánimo y ha vuelto mis días mucho más lindos, sino también lo admirable que eres, con todas tus virtudes. No es solo cada risa juntos, sino también cada momento de reflexión, cada cosa increíble que creas con tus propias manos (de verdad admiro tanto las cosas que haces), cada momento compartido que llena mis días como nadie más podría.

Admiro muchísimo también tu forma de ser tan genuina, tus opiniones que siempre me parecen acertadas y me hacen pensar, las reflexiones de las cuales podemos hablar largos ratos, tus consejos, tu gusto por hacer las cosas perfectas. Algo que ya he nombrado anteriormente es tu encantadora capacidad de hacerme sacar una sonrisa, ya sea un pequeño gesto o un comentario gracioso, admiro profundamente ese rasgo tuyo, porque es algo que trae una alegría inmensa y que ha cambiado mi vida como no te imaginas.

Eres una persona increíble, jamás pienses lo contrario.

He pensado mucho al respecto y siento que es tan difícil encontrar a alguien como tú, con quién pueda hablar de cualquier cosa, con tu humor, lo que piensas, tu forma de ser, tu belleza, todo lo que eres, me hace pensar cómo siquiera puedo tener la oportunidad de conocer a alguien tan maravillosa como tú.

Mientras más lo pienso, más fuerte es el deseo de no querer soltarte nunca.

No se me pasa por la cabeza dejarte por nada del mundo, porque eres demasiado especial para mí. En el fondo no puedo ignorar esta sensación de querer estar junto a ti por el resto de mi vida, quiero darte todo mi apoyo y acompañarte en cada momento.

Lo que siento por ti es un cariño que solo ha ido creciendo. Agradezco muchísimo la paciencia que me has tenido, pero sé que este sentimiento solo crece cada vez más, más allá que cualquier otra cosa y no se va a detener.

Sin duda eres la persona más importante en mi vida y agradezco de corazón tenerte en ella. Aún quedan muchos bellos momentos por compartir, este año será importante y confiaré en hacer lo mejor para nosotros. Porque más allá de solo convicción, hay un gran sentimiento que me mueve y sin duda quiero que se mantenga por siempre (me volveré loco si no, digo) :3 <3 

Feliz 14 de febrero, te quiero mucho, mucho de verdad, contigo quiero vivir muchísimos más días bonitos, y todos los que vengan después <3
`;
  }

  update() {
    if (this.finished) return;

    if (this.moving) {
      this.player.x += 2;
    }

    this.items.forEach((item, index) => {
      if (
        item.active !== false &&
        Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          item.x,
          item.y
        ) < 40
      ) {
        item.setVisible(false);
        item.active = false;
        this.collected++;
        this.showMessage(index);
      }
    });

    if (
      this.collected === 3 &&
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.npc.x,
        this.npc.y
      ) < 50
    ) {
      this.finalScene();
    }
  }

  showMessage(index) {
    const messages = [
      "Mira quién apareció primero :3 🍪",
      "Lunita! que haces aquí? También vino a saludarte jeje 🐰",
      "Contigo quiero vivir muchos más días bonitos ❤️",
    ];

    this.messageText.setText(messages[index]);
    this.messageText.setVisible(true); // <--- Lo mostramos cuando hay texto

    this.time.delayedCall(2000, () => {
      this.messageText.setText("");
      this.messageText.setVisible(false); // <--- Lo ocultamos cuando se borra
    });
  }

  showLetterOverlay() {
    const cam = this.cameras.main;
    cam.stopFollow();
    this.moving = false;

    const width = cam.width;
    const height = cam.height;

    // Fondo oscuro que bloquea clics al juego de abajo
    const darkBg = this.add
      .rectangle(0, 0, width, height, 0x000000, 0.8)
      .setOrigin(0)
      .setScrollFactor(0)
      .setInteractive()
      .setDepth(9998);

    const panelWidth = width * 0.85;
    const panelHeight = height * 0.6;
    const panelX = width / 2;
    const panelY = height / 2;

    // Panel blanco
    const panel = this.add
      .rectangle(panelX, panelY, panelWidth, panelHeight, 0xffffff)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(9999)
      .setInteractive();

    // El texto (Lo ponemos inicialmente al tope del panel)
    const padding = 25;
    const textX = panelX - panelWidth / 2 + padding;
    const textYStart = panelY - panelHeight / 2 + padding;

    const letterText = this.add
      .text(textX, textYStart, this.fullLetterText, {
        fontSize: "17px",
        color: "#1a1a1a",
        wordWrap: { width: panelWidth - padding * 2 },
        lineSpacing: 8,
        fontFamily: "Arial",
      })
      .setScrollFactor(0)
      .setDepth(10000);

    // Máscara (Para que el texto no se salga del cuadro blanco)
    const maskGraphics = this.add.graphics().setScrollFactor(0);
    maskGraphics.fillStyle(0xffffff);
    maskGraphics.fillRect(
      panelX - panelWidth / 2,
      panelY - panelHeight / 2,
      panelWidth,
      panelHeight
    );
    letterText.setMask(maskGraphics.createGeometryMask());

    // --- LÓGICA DE SCROLL ROBUSTA ---
    const maxScrollY = textYStart;
    const minScrollY =
      textYStart - Math.max(0, letterText.height - (panelHeight - padding * 2));

    let startPointerY = 0;
    let startTextY = 0;

    panel.on("pointerdown", (pointer) => {
      startPointerY = pointer.y;
      startTextY = letterText.y;
    });

    panel.on("pointermove", (pointer) => {
      if (!pointer.isDown) return;

      const deltaY = pointer.y - startPointerY;
      let newY = startTextY + deltaY;

      // Aplicar límites
      if (newY > maxScrollY) newY = maxScrollY;
      if (newY < minScrollY) newY = minScrollY;

      letterText.y = newY;
    });

    // Botón cerrar
    const closeButton = this.add
      .text(panelX, panelY + panelHeight / 2 + 50, "Cerrar ❤️", {
        fontSize: "20px",
        backgroundColor: "#ff4d4d",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(10001)
      .setInteractive();

    closeButton.on("pointerdown", () => {
      darkBg.destroy();
      panel.destroy();
      letterText.destroy();
      maskGraphics.destroy();
      closeButton.destroy();
      // Opcional: cam.startFollow(this.player);
    });
  }

  finalScene() {
    this.finished = true;

    this.player.x = this.npc.x - 30;

    this.messageText.setText("Te abraza fuerte ❤️");

    this.time.delayedCall(1500, () => {
      this.showLetterOverlay();
    });
  }
}
