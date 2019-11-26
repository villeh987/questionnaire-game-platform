'use strict';

// load routers
const UsersRouter = require('./routes/users');
const HelloRouter = require('./routes/hello');

// Setup Routes
module.exports = function(app) {
    app.use('/users', UsersRouter);
    app.use('/', HelloRouter);
};
