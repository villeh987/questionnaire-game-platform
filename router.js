'use strict';

// load routers
const UsersRouter = require('./routes/users');
const HelloRouter = require('./routes/hello');
const QuestionnairesRouter = require ('./routes/questionnaire');

// Setup Routes
module.exports = function(app) {
    app.use('/users', UsersRouter);
    app.use('/', HelloRouter);
    app.use('/questionnaires', QuestionnairesRouter);
};
