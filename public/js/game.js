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
        { frameWidth: 32, frameHeight: 32 }
    );

    //TODO: Load questionnaire from database

    /* TEST STUFF:
    /  generate list of random string questionnaires
    */

    const NUM_TESTQUESTIONS = 3;

    const MIN_TITLELENGTH = 1;
    const MAX_TITLELENGTH = 100;
    const MIN_OPTIONS = 2;
    const MAX_OPTIONS = 7;
    const MIN_POINTS = 1;

    const MIN_OPTIONLENGTH = 1;
    const MAX_OPTIONLENGTH = 50;

    //Generate random number between min and max
    function randomIntBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    //Generates random string from set of characters
    function generateRandomString(min, max) {
        let string = "";
        const SELECTION = "ABCDEFGHIJKLMNOPQRSTUVWXYZOÄÖabcdefghijklmnopqrstuvwxyzoäö01234567890";

        let numChars = randomIntBetween(min, max);

        for(let i = 0; i < numChars; ++i) {
            string += SELECTION.charAt(Math.floor(Math.random() * SELECTION.length));
        }

        return string;
    }

    //Generates list of random test options
    function generateOptions(min, max) {
        let options = [];

        let numOptions = randomIntBetween(min, max);

        for(let i = 0; i < numOptions; ++i) {
            options.push(
                {
                    title: generateRandomString(MIN_OPTIONLENGTH, MAX_OPTIONLENGTH),
                    correctness: false
                }
            );
        }

        //set one option as the correct one
        options[randomIntBetween(0, options.length -1)]['correctness'] = true;

        return options;
    }

    let questionnaire = [];
    for(let i = 0; i < NUM_TESTQUESTIONS; ++i) {
        questionnaire.push(
            {
                title: generateRandomString(MIN_TITLELENGTH, MAX_TITLELENGTH),
                options: generateOptions(MIN_OPTIONS, MAX_OPTIONS)
            }
        );
    }
    //END of test stuff
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
