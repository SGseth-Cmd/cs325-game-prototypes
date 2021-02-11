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
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var sprite;
var cursors;
var text;
var ground;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('bullet', 'assets/bullets.png');
    this.load.image('ship', 'assets/ship.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('explode', 'assets/explosion.png')
}

function create() {

    this.cameras.main.setBackgroundColor('#87CEEB');
    sprite = this.physics.add.image(400, 300, 'ship');

    ground = this.physics.add.staticImage(400, 750, 'ground').setScale(2).refreshBody();

    

    this.physics.world.gravity.y = 60;
    

    sprite.setDamping(true);
    sprite.setDrag(0.99);
    sprite.setMaxVelocity(150);

    this.physics.add.collider(sprite, ground, function (sprite, ground) {
        sprite.setX(400);
        sprite.setY(300);
    });

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

   
}

function update() {
    if (cursors.up.isDown) {
        this.physics.velocityFromRotation(sprite.rotation, 200, sprite.body.acceleration);
    }
    else {
        sprite.setAcceleration(0);
    }

    if (cursors.left.isDown) {
        sprite.setAngularVelocity(-300);
    }
    else if (cursors.right.isDown) {
        sprite.setAngularVelocity(300);
    }
    else {
        sprite.setAngularVelocity(0);
    }

    

    //if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    //{
      //   fireBullet();
   // }

    this.physics.world.wrap(sprite, 32);

   // bullets.forEachExists(screenWrap, this);
}
