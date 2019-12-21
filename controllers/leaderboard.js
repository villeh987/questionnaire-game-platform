'use strict';

const Ranking = require('../models/ranking');

module.exports = {

  async showLeaderboard(request, response) {
      let ranking = await Ranking.find().exec();
      let scoreBoard = [];
      for(let i = 0; i < ranking.length; ++i) {
          if (ranking[i].game == request.params.id) {
              scoreBoard = ranking[i].gameScore;
          }
      }
      response.render('leaderboard', {scoreBoard});
  },

};
