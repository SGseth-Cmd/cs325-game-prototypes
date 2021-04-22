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
            gravity: { y: 300 },
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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('block', 'assets/block.png');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio('theme', 'assets/Theme.mp3');
    this.load.audio('jump', 'assets/jump_10.wav');
    this.load.audio('build', 'assets/Item2A.wav');
}

function create ()
{
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();


    movingPlatform = new movingplatforms(this);


    player = this.physics.add.sprite(100, 450, 'dude');

    stars = this.physics.add.sprite(Phaser.Math.Between(20, 750), 20, 'star');
    stars.setImmovable(true);
    stars.body.setAllowGravity(false);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();


    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, movingPlatform);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    var music = this.sound.add('theme');
    jump = this.sound.add('jump');
    build = this.sound.add('build');
    

    //music.play();

    //timerEvent = this.time.delayedCall(200, movingPlatform.remove, [], this);

  
}

function update (time, delta)
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }
    
    const isJumpJustDown = Phaser.Input.Keyboard.JustDown(cursors.up); 
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(cursors.space);
    const touchingground = player.body.touching.down;

    if (isJumpJustDown && touchingground)
    {
        player.setVelocityY(-300);
        jump.play();
        ++this.jumpcount;

    }
    if (isSpaceJustDown && !touchingground) {
        movingPlatform.set(player.x,player.y+50, time);
        build.play();    
    } 
    if(touchingground){
        this.jumpcount = 0;
    }
    
    //if(cursors.up.isdown && (!touchingground)){
     //   var b = rocks.create(Phaser.Math.Between(player.x,player.y - 20), 2, 'platform');
     //       b.setScale(0.25);
     //       b.setImmovable(true);
     //       this.physics.add.existing(b);
            
   // } 

    
   
}
function collectStar(player, star) {
    star.disableBody(true, true);
    this.scene.restart();
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
