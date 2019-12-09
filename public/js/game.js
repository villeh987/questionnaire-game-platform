'use strict';

//var Phaser = require('phaser');

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0},
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            player: null,
            moveKeys: null,
            bullets: null,
            time: 0,
        }
    }
};

let game = new Phaser.Game(config);

function preload () {
    //TODO: add better suited asset
    this.load.spritesheet('ship', '../img/pixel_ship.png',
        { frameWidth: 30, frameHeight: 15 }
    );
}

function create () {
    this.physics.world.setBounds(0, 0, 1600, 1200);

    this.player = this.physics.add.sprite(800, 600, 'ship');
    //TODO: fix the angle of acceleration and sprite or just use 4way movement

    //background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
    this.player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(0.99);

    this.cameras.main.zoom = 0.5;

    //movement with arrow keys and SPACE
    /*
    let moveKeys = this.input.keyboard.addKeys({
        'accelerate': Phaser.Input.Keyboard.KeyCodes.UP,
        'turnRight': Phaser.Input.Keyboard.KeyCodes.RIGHT,
        'turnLeft': Phaser.Input.Keyboard.KeyCodes.LEFT,
        'shoot': Phaser.Input.Keyboard.KeyCodes.SPACE
    });
    */

    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown_SPACE', function (event) {
        console.log('bang');
    })
}

function update (time, delta) {
    if(this.cursors.up.isDown) {
        this.physics.velocityFromRotation(this.player.rotation, 200, this.player.body.acceleration);
    } else {
        this.player.setAcceleration(0);
    }
    if(this.cursors.right.isDown) {
        this.player.setAngularVelocity(300);
    } else if(this.cursors.left.isDown) {
        this.player.setAngularVelocity(-300);
    } else {
        this.player.setAngularVelocity(0);
    }
}
