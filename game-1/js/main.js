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
var bullets;
var lastFired = 0;
var rocks;
var lastLaunched = 0;
var lives = 5;


var game = new Phaser.Game(config);

function preload() {
    this.load.image('bullet', 'assets/bullets.png');
    this.load.image('ship', 'assets/ship.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('explode', 'assets/explosion.png');
    this.load.image('rock', 'assets/asteroid1.png')
}

function create() {

    this.cameras.main.setBackgroundColor('#87CEEB');
    sprite = this.physics.add.image(400, 300, 'ship');

    ground = this.physics.add.staticImage(400, 750, 'ground').setScale(2).refreshBody();

   
    bullets = new Bullets(this);

    rocks = this.physics.add.group({
        classType: Phaser.GameObjects.Sprite,
        key: 'rock',
    })

    this.physics.world.gravity.y = 60;


    sprite.setDamping(true);
    sprite.setDrag(0.75);
    sprite.setMaxVelocity(150);

    this.physics.add.collider(sprite, ground, function (sprite, ground) {
        sprite.setX(400);
        sprite.setY(300);
        rocks.clear();
        lives = lives - 1;
    });

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, 'MetorShower', { font: '16px Courier', fill: '#00ff00' });

    sprite.setCollideWorldBounds(true);



    this.physics.add.collider(sprite, rocks, function (sprite, rock) {
        sprite.setX(400);
        sprite.setY(300);
        rock.setActive(false);
        rock.setVisible(false);
        rocks.remove(rock);
        lives = lives - 1;
    });
   
    this.physics.add.collider(rocks, bullets, function (rock, bullet) {
        rock.setActive(false);
        rock.setVisible(false);
        bullet.setActive(false);
        bullet.setVisible(false);
        rocks.remove(rock);
    });

    this.physics.add.collider(ground, rocks, function (ground, rock) {
        rock.setActive(false);
        rock.setVisible(false);
        rocks.remove(rock);
    });

    
}

function update(time, delta) {
    var i;
    for (i = 0; i < 2; i++) {
        if (time > lastLaunched) {
            var b = rocks.create(Phaser.Math.Between(5, 650), 2, 'rock');
            this.physics.add.existing(b);
            
            lastLaunched = time + 500;
        }
    }
    
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

    if (cursors.space.isDown && time > lastFired) {
        bullets.fireBullet(sprite.x, sprite.y);

        lastFired = time + 50;
    }

    if (lives === -1) {
        sprite.setVisible(false);
        sprite.setActive(false);
        this.scene.pause();
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

        this.setVelocityY(-300);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.y <= -32) {
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



  
