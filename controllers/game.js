'use strict';

const Questionnaire = require('../models/questionnaire');
const Grader         = require('../models/grader');

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
        //Get the values from the form body, and turn into numbers for grading
        let maxPoints = parseInt(request.sanitize(request.body.maxPoints));
        let rights = parseInt(request.sanitize(request.body.points));
        let errors = parseInt(request.sanitize(request.body.errors));

        if (maxPoints == undefined || rights == undefined || errors == undefined) {
            response.render('game_graded_rejected', {
                  status: 'rejected',
                  description: 'Submission rejected',
                  title: 'Rejected'
            });
        } else {
          let score = Grader.grade(rights, errors, maxPoints);

          response.render('game_graded', {
                points: score,
                maxPoints: maxPoints,
                status: 'accepted',
                description: 'Simple grader',
                title: 'Accepted submission',
                errors,
                rights
          });
        }
    },

};
