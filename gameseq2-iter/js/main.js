import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};



var player;
var stars;
var platforms;
var cursors;
var movingPlatform;
var jumpcount = 0;
var timerEvent;
var jump;
var build;
var lastfire = 0;
var lives = 5;
var bullets;
var boxplaced = 0;
var lastplaced;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('block', 'assets/block.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio('theme', 'assets/Theme.mp3');
    this.load.audio('jump', 'assets/jump_10.wav');
    this.load.audio('build', 'assets/Item2A.wav');
    this.load.image('bullet', 'assets/bullets.png');
}

function create() {
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();


    movingPlatform = new movingplatforms(this);


    player = this.physics.add.sprite(100, 450, 'dude');


    //player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    

    bullets = new Bullets(this);
    bullets.allowGravity = false;

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    lives = 5;

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, movingPlatform);
    this.physics.add.collider(player, bullets, function (player, bullet) {
        lives = lives - 1;
        bullet.setActive(false);
        bullet.setVisible(false);
        bullets.remove(bullet);
    }, null, this);

    var music = this.sound.add('theme');
    jump = this.sound.add('jump');
    build = this.sound.add('build');


    //music.play();

    //timerEvent = this.time.delayedCall(200, movingPlatform.remove, [], this);


}

function update(time, delta) {


    if (lastfire < time) {
        bullets.fireBullet(810, Phaser.Math.Between(5, 500));
        bullets.fireBullet(810, Phaser.Math.Between(5, 500));
        bullets.fireBullet(810, Phaser.Math.Between(5, 500));
        bullets.fireBullet(810, Phaser.Math.Between(5, 500));
        bullets.fireBullet(810, Phaser.Math.Between(5, 500));
        bullets.fireBullet(810, Phaser.Math.Between(5, 500));
        lastfire = time + 1000;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    const isJumpJustDown = Phaser.Input.Keyboard.JustDown(cursors.up);
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(cursors.space);
    const touchingground = player.body.touching.down;

    if (isJumpJustDown && touchingground) {
        player.setVelocityY(-300);
        jump.play();
        ++this.jumpcount;

    }
    if (isSpaceJustDown && !touchingground && boxplaced <= 3) {
        movingPlatform.set(player.x, player.y + 50, time);
        player.setVelocityY(0);
        build.play();
        boxplaced++;
        lastplaced = time;
    }
    if (touchingground) {
        this.jumpcount = 0;
    }

    if (lives <= 0) {
        this.scene.restart();
    }

    if (boxplaced > 0 && time == (lastplaced + 10000)) {
        boxplaced--;
    }

    //if(cursors.up.isdown && (!touchingground)){
    //   var b = rocks.create(Phaser.Math.Between(player.x,player.y - 20), 2, 'platform');
    //       b.setScale(0.25);
    //       b.setImmovable(true);
    //       this.physics.add.existing(b);

    // } 



}

function Reducelife() {
    lives = lives - 1;
    bullet.setActive(false);
    bullet.setVisible(false);
}


class movingplatform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'block');

    }


    setPlatform(x, y, time) {
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.setScale(0.35);
        this.body.reset(x, y);
        this.property = time;
        this.setActive(true);
        this.setVisible(true);

    }


    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (time > this.property + 2500) {
            this.setActive(false);
            this.setVisible(false);
            this.body.reset(0, 0);
            boxplaced--;
        }
    }
}

class movingplatforms extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 20,
            key: 'block',
            active: false,
            visible: false,
            immovable: true,
            classType: movingplatform
        });
    }

    set(x, y, time) {
        let platform = this.getFirstDead(false);

        if (platform) {
            platform.setPlatform(x, y, time);
        }
    }

}

class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
    }

    fire(x, y) {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);
        this.body.setAllowGravity(false);
        this.setScale(2.0);
        //this.angle(-90);
        this.setVelocityX(-300);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.x <= -32) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

class Bullets extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 20,
            key: 'bullet',
            active: false,
            visible: false,
            setScale: 5.0,
            classType: Bullet
        });
    }

    fireBullet(x, y) {
        let bullet = this.getFirstDead(false);

        if (bullet) {
            bullet.fire(x, y);
        }
    }
}