'use strict'

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const GameController = require('../controllers/game');

router.use(auth.ensureAuthenticated);
//Lists all the questionnaires
router.get('/', GameController.listExercises);

//Starts the game with selected questionnaire
router.get('/:id', GameController.showExercise);

//Start the grading of questionnaire that was played
router.post('/:id', GameController.gradeExercise);


module.exports = router;
