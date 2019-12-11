'use strict';

//var Phaser = require('phaser');

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1000,
    height: 800,
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
            oks: null,
            crosses: null,
            time: 0,
            topMargin: 100,
            magicTopMarginNumber: 48
        }
    }
};

let Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Bullet(scene, type) {
        if(type == 'ok') {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'ok');
        } else {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'cross');
        }
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(16, 16, true);
        this.lifespan = 100;
    },

    fire: function(shooter) {
        this.lifespan = 100;

        this.setActive(true);
        this.setVisible(true);
        this.setAngle(shooter.body.rotation);
        this.setPosition(shooter.x, shooter.y);
        this.body.reset(shooter.x, shooter.y);
        var angle = Phaser.Math.DegToRad(shooter.body.rotation);
        this.scene.physics.velocityFromRotation(angle, 300, this.body.velocity);
        this.body.velocity.x *= 2;
        this.body.velocity.y *= 2;
    },

    update: function(time, delta) {
        this.lifespan -= delta/10;

        if(this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }
});


let game = new Phaser.Game(config);

function preload () {
    this.load.spritesheet('ship', '../img/pixel_ship.png',
        { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet('ok', '../img/ok.png',
        { frameWidth: 16, frameHeight: 16 }
    );
    this.load.spritesheet('cross', '../img/cross.png',
        { frameWidth: 16, frameHeight: 16 }
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

//Spawns one option from questionnaire on the playfield
function spawnOption() {

}



function create () {
    //Create groups
    let oks = this.physics.add.group({
        classType: Bullet,
        defaultKey: 'ok',
        maxSize: 10,
        runChildUpdate: true
    });
    this.oks = oks;

    let crosses = this.physics.add.group({
        classType: Bullet,
        defaultKey: 'cross',
        maxSize: 10,
        runChildUpdate: true
    });
    this.crosses = crosses;

    let options = this.physics.add.group({
        defaultKey: 'option',
        maxSize: 3
    });
    this.options = options;

    //initialize play area
    this.physics.world.setBounds(0, this.topMargin + this.magicTopMarginNumber,
                                 config['width'], config['height'] - this.topMargin);


    let border = this.add.line(0, 0, 0, this.topMargin, 3200, this.topMargin, 0xff0000);
    this.cameras.main.zoom = 1;

    this.player = this.physics.add.sprite(500, 500, 'ship');
    this.player.setOrigin(0.5, 0.5).setDisplaySize(32, 32).setCollideWorldBounds(false).setDrag(0.99);

    //Test stuff
    let question = this.make.text({
        x: 50,
        y: 20,
        text: '',
        origin: { x: 0, y: 0 },
        style: {
            font: 'bold 18px Arial',
            fill: 'white',
            wordWrap: { width: config['width']-110, useAdvancedWrap: true }
        }
    });

    //test putting text box in there
    let testOption = this.make.text({
        x: 200,
        y: 300,
        text: 'answeransweransl aölskdjfa ölskdjf aölskdjf ö',
        origin: { x: 0, y: 0 },
        style: {
            font: 'bold 18px Arial',
            fill: 'white',
            wordWrap: { width: 100, useAdvancedWrap: true }
        }
    });

    this.physics.world.enable(testOption);
    testOption.body.setVelocity(29);
    question.text = "Question";

    //END test stuff


    //Input config
    this.cursors = this.input.keyboard.createCursorKeys();

    //Shoot wrong options with this
    this.input.keyboard.on('keydown_X', function (event) {
        console.log('shoot1');
        let cross = crosses.get();
        if(cross) {
            cross.fire(playeri);
        }
    })

    let playeri = this.player;
    //Shoot right options with this
    this.input.keyboard.on('keydown_Z', function (event) {
        console.log('shoot2');
        let ok = oks.get();
        if(ok) {
            ok.fire(playeri);
        }
    })

}

function update (time, delta) {
    //wrap objects that go around the edge to the other side
    this.physics.world.wrap(this.player, 32);
    this.physics.world.wrap(this.oks);
    this.physics.world.wrap(this.crosses);
    this.physics.world.wrap(this.options);

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
