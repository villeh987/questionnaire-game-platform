'use strict';

module.exports = {
    showExercise(request, response) {
        console.log('helloa');
        response.render('game');
    },

    gradeExercise(request, response) {
        //TODO
    }
};
