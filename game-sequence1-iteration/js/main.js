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
        debug:true,
        default: 'arcade',
        
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};




var game = new Phaser.Game(config);

var car1;
var car2;
var map;
var bound;
var cursors;
var cursors2;
var velocity = 0;
var velocity1 = 0;

function preload() {
    this.load.image('map', 'assets/map.jpg');
    this.load.image('bound', 'assets/bound2.png');
    this.load.image('bound2', 'assets/bound3.png');
    this.load.image('car1', 'assets/car1.png');
    this.load.image('car2', 'assets/car2.png');
}

function create() {

   
    map = this.add.image(0, 0, 'map').setOrigin(0, 0);
    map.setScale(0.7);
    bound = this.physics.add.staticGroup();
    bound.create(340,290, 'bound').refreshBody();
    bound.create(625,200, 'bound2').refreshBody();

    car1 = this.physics.add.image(475, 100, 'car1');
    car1.setScale(0.05);
    car2 = this.physics.add.image(475, 50, 'car2');
    car2.setScale(0.05);

   

    car1.body.drag.set(100);
    car1.body.maxVelocity.set(100);
    car1.body.maxAngular = 500;
    car1.body.angularDrag = 500;
    car1.body.collideWorldBounds = true;
    car1.body.setFriction(5, 5);
    car1.angle = 90;
    car1.body.setBounce(1, 1);
    car1.setPushable(true);


    car2.body.drag.set(100);
    car2.body.maxVelocity.set(100);
    car2.body.maxAngular = 500;
    car2.body.angularDrag = 500;
    car2.body.collideWorldBounds = true;
    car2.body.setFriction(5, 5);
    car2.angle = 90;
    car2.body.setBounce(1, 1);
    car2.setPushable(true);

    this.physics.add.collider(car1, car2); //function (car1, car2) {
     //   car1.setVelocity(-velocity*5);
      //  car2.setVelocity(-velocity1*5);
   // });

    this.physics.add.collider(car1, bound, function (car1) {
      // car1.setVelocity(-velocity*5);
    });
    this.physics.add.collider(bound, car2);

    cursors = this.input.keyboard.createCursorKeys();
    cursors2 = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S, 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D});

    //text = this.add.text(10, 10, 'BummperCar', { font: '16px Courier', fill: '#00ff00' });

   
    



   
    
}

function update(time, delta) {



    if (cursors.up.isDown) {
    velocity += 4;
    }
    else {
        if (velocity) { velocity -= 4; }
    }
    if (cursors.down.isDown) {
        if (velocity) { velocity = 0; }
    }


    if (cursors.left.isDown) {
        car1.body.angularVelocity = -5 * (velocity);
    }
    else if (cursors.right.isDown) {
        car1.body.angularVelocity = 5 * (velocity);
    }
    else {
        car1.body.angularVelocity = 0;
    }
    //car1.body.velocity.x = velocity * Math.cos((car1.angle - 90) * 0.01745);
    //car1.body.velocity.y = velocity * Math.sin((car1.angle - 90) * 0.01745);
    this.physics.velocityFromRotation(car1.rotation-90, velocity, car1.body.acceleration);

    if (cursors2.up.isDown) {
        velocity1 += 4;
    }
    else {
        if (velocity1) { velocity1 -= 4; }
    }
    if (cursors2.down.isDown) {
        if (velocity1) { velocity1 -= 4; }
    }

    if (cursors2.left.isDown) {
        car2.body.angularVelocity = -5 * (velocity1);
    }
    else if (cursors2.right.isDown) {
        car2.body.angularVelocity = 5 * (velocity1);
    }
    else {
        car2.body.angularVelocity = 0;
    }
    //car1.body.velocity.x = velocity * Math.cos((car1.angle - 90) * 0.01745);
    //car1.body.velocity.y = velocity * Math.sin((car1.angle - 90) * 0.01745);
    this.physics.velocityFromRotation(car2.rotation-90, velocity1, car2.body.acceleration);

    /**if (lives === -1) {
        sprite.setVisible(false);
        sprite.setActive(false);
        this.scene.pause();
    }*/

}



  
