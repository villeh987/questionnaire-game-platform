'use strict';

const Questionnaire = require('../models/questionnaire');
module.exports = {

    async listExercises(request, response) {
          const questionnaires = await Questionnaire.find()
              .sort('title')
              .select('title submissions questions')
              .exec();
          response.render('games', { questionnaires });
    },

    showExercise(request, response) {
        response.render('game');
    },

    gradeExercise(request, response) {
        //TODO
    }
};
