/* eslint-disable sonarjs/no-duplicate-string */
'use strict';

const Questionnaire = require('../models/questionnaire');

module.exports = {


    async list(request, response) {
        const questionnaires = await Questionnaire.find()
            .sort('title')
            .select('title submissions questions')
            .exec();
        response.render('questionnaire/questionnaires', { questionnaires });
    },

    
    async show(request, response) {
        const questionnaire = await Questionnaire.findById(request.params.id).exec();

        if (!questionnaire) {
            request.flash(
                'errorMessage',
                `Questionnaire not found (id: ${request.params.id})`
            );
            return response.redirect('/questionnaires');
        }

        response.render('questionnaire/questionnaire', { questionnaire });
    }

/*
    async create(request, response) {
        const { error } = User.validateRegistration(request.body);
        // TODO: find out why ESLint thinks name is already defined
        //       This seems to be a bug in ESLint...
        // ESLint: 'name' is already declared in the upper scope
        // eslint-disable-next-line no-shadow
        const { name, email, password } = request.body;

        if (error) {
            if (request.is('json')) {
                return response.status(400).json({ error });
            }

            return response.render('user/register', {
                name,
                email,
                errors: error
            });
        }

        let user = await User.findOne({ email }).exec();

        if (user) {
            const errorMessage =
                'Email already registered for another user.';

            if (request.is('json')) {
                return response.status(409).json({
                    error: errorMessage
                });
            }

            return response.render('user/register', {
                name,
                email,
                errorMessage
            });
        }

        user = new User();
        user.name = name;
        user.email = email;
        user.password = password;

        await user.save();
        request.flash(
            'successMessage',
            'Registration ready, you can now log in.'
        );
        response.redirect('/users/login');
    },


    async processCreate(request, response) {
        if (request.params.id === request.user.id) {
            request.flash(
                'errorMessage',
                'You cannot change your own role.'
            );
            return response.redirect('/users');
        }

        const { error } = User.validateRole(request.body);

        if (error) {
            request.flash('errorMessage', 'Unknown role');
            return response.redirect('/users');
        }

        const user = await User.findById(request.params.id).exec();

        if (!user) {
            request.flash(
                'errorMessage',
                `User not found (id: ${request.params.id})`
            );
            return response.redirect('/users');
        }

        user.role = request.body.role;
        await user.save();

        request.flash('successMessage', 'Role successfully changed');
        response.redirect('/users');
    },


    async changeRole(request, response) {} 





*/

};
