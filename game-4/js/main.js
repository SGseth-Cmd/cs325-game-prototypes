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
    parent: 'game',
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
var reset;
var over;
var timer;
var timetext;
var timeover = 0;
var laser;
var engine;
//var thrust;
var crash;
var isplay = false;


var game = new Phaser.Game(config);

function preload() {
    this.load.image('bullet', 'assets/bullets.png');
    this.load.image('ship', 'assets/ship.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('explode', 'assets/explosion.png');
    this.load.image('rock', 'assets/asteroid1.png')
    this.load.audio('laser', 'assets/laser1.wav');
    this.load.audio('rocket', 'assets/rocket_launch.wav');
    this.load.audio('bomb', 'assets/bomb.wav');
}

function create() {

    this.cameras.main.setBackgroundColor('#87CEEB');
    sprite = this.physics.add.image(400, 300, 'ship');
    sprite.setAngle(-90);

    ground = this.physics.add.staticImage(400, 750, 'ground').setScale(2).refreshBody();

   
    bullets = new Bullets(this);

    rocks = this.physics.add.group({
        classType: Phaser.GameObjects.Sprite,
        key: 'rock',
    })

    this.physics.world.gravity.y = 60;

    laser = this.sound.add('laser');
    engine = this.sound.add('rocket');
    engine.setRate(2.0);
    engine.setLoop(true);

    sprite.setDamping(true);
    sprite.setDrag(0.75);
    sprite.setMaxVelocity(150);

    this.physics.add.collider(sprite, ground, function (sprite, ground) {
        sprite.setX(400);
        sprite.setY(300);
        rocks.clear();
        crash.play();
        lives = lives - 1;
    });

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, 'Lives', { font: '16px Courier', fill: '#ffffff' });
    over =this.add.text(400, 300, 'Game Over', {font: '36px Courier', fill: '#ffffff' });
    reset = this.add.text(400,400, 'press up to replay', {font: '24px Courier', fill: '#ffffff' });
    timetext = this.add.text(10, 20, 'Time', { font: '16px Courier', fill: '#ffffff' });
    over.setVisible(false);
    reset.setVisible(false);    


    sprite.setCollideWorldBounds(true);
    crash = this.sound.add('bomb');
    

    this.physics.add.collider(sprite, rocks, function (sprite, rock) {
        sprite.setX(400);
        sprite.setY(300);
        rock.setActive(false);
        rock.setVisible(false);
        rocks.remove(rock);
        crash.play();
        lives = lives - 1;
        text.setText([ 'Lives: '+ lives]);
    });
   
    this.physics.add.collider(rocks, bullets, function (rock, bullet) {
        rock.setActive(false);
        rock.setVisible(false);
        bullet.setActive(false);
        bullet.setVisible(false);
        crash.play();
        rocks.remove(rock);
    });

    this.physics.add.collider(ground, rocks, function (ground, rock) {
        rock.setActive(false);
        rock.setVisible(false);
        rocks.remove(rock);
    });
    
    //var thrust;
    //var music;
    
}

function update(time, delta) {
    this.lives = 5;
    
    timetext.setText('Time: ' + parseInt(time/1000 - timeover));

    var scale = 1;
    var i;
    for (i = 0; i < 3; i++) {
        if (time > lastLaunched) {
            var b = rocks.create(Phaser.Math.Between(5, 650), 2, 'rock');
            this.physics.add.existing(b);
            
            lastLaunched = time + 1000/scale;
            scale = scale + 4;
        }
    } 
    if (cursors.up.isDown) {
        sprite.setAccelerationY(-200);
        if (isplay === false) {
            engine.play();
            isplay = true;
        }
    }
    else {
        if (isplay === true) {
            engine.stop();
            isplay = false;
        }
        sprite.setAcceleration(0);
    }

    if (cursors.left.isDown) {
        //sprite.setAngularVelocity(-300);
        sprite.setAccelerationX(-150);
        if (isplay === false) {
            engine.play();
            isplay = true;
        }
    }
    else if (cursors.right.isDown) {
        //sprite.setAngularVelocity(300);
        sprite.setAccelerationX(150);
        if (isplay === false) {
            engine.play();
            isplay = true;
        }
    }
    else if (cursors.down.isDown) {

        sprite.setAccelerationY(100);
        if (isplay === false) {
            engine.play();
            isplay = true;
        }
    }
    

    if (cursors.space.isDown && time > lastFired) {
        bullets.fireBullet(sprite.x, sprite.y);
        laser.play();
        lastFired = time + 50;
    }


    text.setText([ 'Lives: '+ lives]);

    if (lives <= 0) {
        sprite.setVisible(false);
        sprite.setActive(false);
        over.setVisible(true);
        reset.setVisible(true);   
        if(cursors.up.isDown){
            sprite.setVisible(true);
            sprite.setActive(true);
            lives = 5;
            timeover = time/1000;
            text.setText([ 'Lives: '+ lives]);
            this.scene.restart();
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



  
