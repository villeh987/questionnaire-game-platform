'use strict';

// load routers
const UsersRouter = require('./routes/users');
const HelloRouter = require('./routes/hello');
const QuestionnairesRouter = require ('./routes/questionnaire');
const GameRouter = require('./routes/game');
const LeaderboardRouter = require('./routes/leaderboard');

// Setup Routes
module.exports = function(app) {
    app.use('/users', UsersRouter);
    app.use('/', HelloRouter);
    app.use('/questionnaires', QuestionnairesRouter);
    app.use('/games', GameRouter);
    app.use('/leaderboard', LeaderboardRouter);
};
