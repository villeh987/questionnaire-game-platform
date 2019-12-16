'use strict';

module.exports = {

    grade(points, errors, maxPoints) {
        let total = points + errors;
        let finalScore = 0;

        if(total == 0) {
            finalScore = 0;
        }
        else {
            finalScore = Math.round( points / total * maxPoints);
        }
        return finalScore;
    }

};
