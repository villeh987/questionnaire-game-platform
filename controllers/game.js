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
        let maxPoints = parseInt(request.body.maxPoints);
        let points = parseInt(request.body.points);
        let errors = parseInt(request.body.errors);

        let score = Grader.grade(points, errors, maxPoints);

        response.render('hello-graded', {
            points: score,
            maxPoints: maxPoints,
            status: 'accepted',
            description: 'minimal viable grader in the express framework',
            title: 'A+ greetings'
        });

    },

};
