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

    async showExercise(request, response) {
        const questionnaire = await Questionnaire.findById(request.params.id).exec();

        if (!questionnaire) {
            request.flash(
                'errorMessage',
                `Questionnaire not found (id: ${request.params.id})`
            );
            return response.redirect('/games');
        }

        response.render('game', {questionnaire});
    },

    gradeExercise(request, response) {
        //TODO
    },

};
