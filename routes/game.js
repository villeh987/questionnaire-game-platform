'use strict'

const express = require('express');
const router = express.Router();
const GameController = require('../controllers/game');

router.get('/game', GameController.showExercise);

//start the grading of questionnaire that was played
router.post('/:id', GameController.gradeExercise);

module.exports = router;
