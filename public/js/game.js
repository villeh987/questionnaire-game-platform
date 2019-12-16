'use strict';

const NUM_QUESTIONS = document.getElementById("amountOfQuestions").value;
const MAX_POINTS = function getMaxPoints() {
    let maxPoints = 0;
    for(let i = 0; i < NUM_QUESTIONS; ++i) {
        let element = document.getElementById("question" + i + "_maxPoints");
        maxPoints += element.value;
    }
    return maxPoints;
}

const submitButton = document.getElementById('grade');
submitButton.classList.add('hidden');

//Generate random number between min and max
function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


//Generates a list of options from the HTML document
function getOptions(question, optionAmount) {
    let options = [];

    for(let i = 0; i < optionAmount; ++i) {
        let option = question + "_option" + i;
        let optionCorrectness = option + "_correctness";
        let correctness = document.getElementById(optionCorrectness).value;
        console.log(correctness);
        if (correctness == "true") {
          correctness = true;
        } else {
          correctness = false;
        }
        console.log(option);
        options.push(
            {
                title: document.getElementById(option).value,
                correctness: correctness,
            }
        );
    }

    return options;
}

//Object that handless keeping track of questions and progress of the game
let questionnaire = {
    questions: [],
    questionNumber: 0,
    optionNumber: 0,

    // Fills it with tests stuff TODO: put real questions there
    initialize: function() {
        for(let i = 0; i < NUM_QUESTIONS; ++i) {
            let question = "question" + i;
            let questionTitle = "question" + i + "_title";
            let optionAmount = "question" + i + "_options";
            this.questions.push(
                {
                    title: document.getElementById(questionTitle).value,
                    options: getOptions(question, document.getElementById(optionAmount).value),
                    optionAmount: document.getElementById(optionAmount).value,
                }
            );
        }
    },

    getQuestion: function() {
        return this.questions[this.questionNumber];
    },

    getOption: function() {
        return this.questions[this.questionNumber].options[this.optionNumber];
    },

    isLastOption: function() {
        return (this.optionNumber == this.questions[this.questionNumber].options.length - 1);
    },

    isLastQuestion: function() {
        return (this.questionNumber == this.questions.length -1);
    },

    /* indexing will point to the next option. If it's the last one of the
    /  current question it will return false and point to 0 again
    /
    */
    nextOption: function() {
        this.optionNumber += 1;
        if(this.optionNumber == this.questions[this.questionNumber].options.length) {
            this.optionNumber = 0;
            return false;
        } else {
            return true;
        }
    },

    /* Indexing will point to the next question If it's the last one of the
    /  questionnaire it will return false.
    */
    nextQuestion: function() {
        this.questionNumber += 1;
        if(this.questionNumber == this.questions.length) {
            this.questionNumber == this.questions.length - 1;
            return false;
        } else {
            return true;
        }
    }
};
questionnaire.initialize();
//options on the field physically
let liveOptions = {
    num: 0,
    opts: [],

    push: function(option) {
        this.opts.push(option);
        this.num += 1;
    },

    kill: function() {
        console.log("killed one ");
        this.num -= 1;
    }
};

//score
let score = {points: 0, errors: 0};

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 1000,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0},
            debug: false
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
            magicTopMarginNumber: 48,
        }
    }
};

let game = new Phaser.Game(config);

//Bullet that is fired by player
let Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Bullet(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'cross');
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

//Representation of an option of a question in the game world
let Option = new Phaser.Class({

    Extends: Phaser.GameObjects.Text,

    initialize:

    function Option(scene) {
        Phaser.GameObjects.Text.call(
            this,
            scene,
            0,
            0,
            questionnaire.getOption().title,
            {
                font: 'bold 18px Arial',
                fill: 'white',
                wordWrap: { width: 100, useAdvancedWrap: true }
            });
            this.scene.physics.world.enable(this);
            this.setActive(true);

            //cannot place option right next to player
            let searchingPos = true;
            let randPosX = 0;
            let randPosY = 0;

            while(searchingPos) {
                randPosX = randomIntBetween(0, config.width);
                randPosY = randomIntBetween(0, config.height - scene.topMargin);
                if(Phaser.Math.Distance.Between(randPosX, randPosY, scene.player.x, scene.player.y) > 200) {
                    searchingPos = false;
                }
            }

            this.setPosition(randPosX, randPosY);

            this.correctness = questionnaire.getOption().correctness;

            //Set to accelerate in random direction
            this.xAcc = randomIntBetween(-10,10)/1000;
            this.yAcc = randomIntBetween(-10,10)/1000;
    },

    update: function(time, delta) {
        if(this.body.velocity.x == 0 && this.body.velocity.y == 0) {
            this.body.setVelocity(randomIntBetween(-30, 30), randomIntBetween(-30, 30));
        }
        if (this.body.velocity.x < 300 && this.body.velocity.y < 300) {
            this.body.velocity.x += this.xAcc;
            this.body.velocity.y += this.yAcc;
        }
    },

    destroy: function() {
        this.setActive(false);
        this.setVisible(false);
        this.body.setEnable(false);
    }
});


//Phaser function. Preloads some resources.
function preload () {
    this.load.spritesheet('ship', '../img/pixel_ship.png',
        { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet('cross', '../img/cross.png',
        { frameWidth: 16, frameHeight: 16 }
    );
}

//Phaser function. Creates the game objects.
function create () {
    //Create groups. For resource pooling.
    let crosses = this.physics.add.group({
        classType: Bullet,
        defaultKey: 'cross',
        maxSize: 10,
        runChildUpdate: true
    });
    this.crosses = crosses;

    let options = this.physics.add.group({
        classType: Option,
        defaultKey: 'option',
        maxSize: questionnaire.getOption.optionAmount,
        runChildUpdate: true
    });
    this.options = options;

    //initialize play area
    this.physics.world.setBounds(0, this.topMargin + this.magicTopMarginNumber,
                                 config['width'], config['height'] - this.topMargin);


    let border = this.add.line(0, 0, 0, this.topMargin, 3200, this.topMargin, 0xffffff);
    this.cameras.main.zoom = 1;

    this.player = this.physics.add.sprite(500, 500, 'ship');
    this.player.setOrigin(0.5, 0.5).setDisplaySize(32, 32).setCollideWorldBounds(false).setDrag(0.99);

    //Current question
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
    this.question = question;

    let posScore = this.make.text({
        x: 10,
        y: 10,
        text: '0',
        origin: { x: 0, y: 0},
        style: {
            font: 'bold 24px Arial',
            fill: 'green'
        }
    });

    let negScore = this.make.text({
        x: 10,
        y: 34,
        text: '0',
        origin: { x: 0, y: 0},
        style: {
            font: 'bold 24px Arial',
            fill: 'red'
        }
    });




    //Put all options in the field.
    spawnOptions(options);


    //collision detection between groups with callback
    this.physics.add.collider(
        options,
        this.player,
        function (player, option) {
            if(option.correctness) {
                score.points += 1;
                posScore.text = String(parseInt(posScore.text) + 1);
            } else {
                score.errors += 1;
                negScore.text = String(parseInt(negScore.text) + 1);
            }
            option.destroy();
            optionDestroyed(options);
        }
    );

    this.physics.add.collider(
        options,
        crosses,
        function (option, cross) {
            if(option.correctness) {
                score.errors += 1;
                negScore.text = String(parseInt(negScore.text) + 1);
            } else {
                score.points += 1;
                posScore.text = String(parseInt(posScore.text) + 1);
            }
            option.destroy();
            cross.lifespan = 0;
            optionDestroyed(options);
        }
    )

    //Input config
    this.cursors = this.input.keyboard.createCursorKeys();

    let playeri = this.player;

    //Shoot wrong options with this
    this.input.keyboard.on('keydown_SPACE', function (event) {
        let cross = crosses.get();
        if(cross) {
            cross.fire(playeri);
        }
    });

}

//Phaser function. called every physics frame.
function update (time, delta) {

    //wrap objects that go around the edge to the other side
    this.physics.world.wrap(this.player, 32);
    this.physics.world.wrap(this.crosses);
    this.physics.world.wrap(this.options, 50);
    if(liveOptions.num > 1) {
        this.question.text = questionnaire.getQuestion().title;
    }

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

//spawns all the options from current question of questionnaire on the field
function spawnOptions(group) {
    while(liveOptions.num < questionnaire.getQuestion().options.length) {
        liveOptions.push(group.get());
        if(!questionnaire.nextOption()) {
            console.log("Spawning finished");
            break;
        }
    }
}

//should be called when option is destroyed
function optionDestroyed(group) {
    console.log("options left: ", liveOptions.num);
    liveOptions.kill();
    if(liveOptions.num < 1) {
        //options are all killed
        console.log("next question");
        if(questionnaire.nextQuestion()) {
            group.clear();
            spawnOptions(group);
        } else {
            gameOver();
        }
    }
}

function gameOver() {
    //TODO: send post message with the Scoreboard
    console.log("game over");
    document.getElementById('points').value = score.points;

    submitButton.click();
}
