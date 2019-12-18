'use strict';

const Ranking = require('../models/ranking');

module.exports = {

    async grade(points, errors, maxPoints, id, userName) {

        let total = points + errors;
        let finalScore = 0;

        if(total == 0) {
            finalScore = 0;
        }
        else {
            finalScore = Math.round( points / total * maxPoints);
        }

        //Save rankingdata to the database
        console.log(userName);
        let rankings = await Ranking.find().exec();
        let ranking;
        let gameScoreObject = {
            player: userName,
            rights: points,
            wrongs: errors,
            grade: finalScore
        };

        let data = {
            game: id,
            gameScore: [{
                player: userName,
                rights: points,
                wrongs: errors,
                grade: finalScore
            }]
        }
        let found = false;
        for (let i = 0; i< rankings.length; ++i) {
            if (rankings[i].game == id) {
                Ranking.update(
                   {_id: rankings[i].id},
                   {$addToSet: {"gameScore": gameScoreObject } })
                found = true;
            }
        };
        if (!found) {
            Ranking.create(data);
        }

        return finalScore;
    }

};
