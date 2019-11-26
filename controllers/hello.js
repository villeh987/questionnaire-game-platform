'use strict';

const Hello = require('../models/hello');

module.exports = {

    /**
     * Prints exercise page
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    showExercise(request, response) {
        // TODO: search exercises from the database and render the page accordingly
        // currently we use only the default exercise here
        response.render('hello');
    },

    /**
     * gradeExercise returns a grade for answer
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */

    gradeExercise(request, response) {
        const maxPoints = 2;
        const points = Hello.grade(request.body.answer, maxPoints);
        response.render('hello-graded', {
            layout: 'grader_reply',
            points: points,
            maxPoints: maxPoints,
            status: 'graded',
            description: 'minimal viable grader in the express framework',
            title: 'A+ greetings'
        });
    }
};
