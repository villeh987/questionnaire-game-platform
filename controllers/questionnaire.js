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
    },


    async create(request, response) {
    	console.log("create");
 		response.render('questionnaire/create_new_questionnaire');
    },

    async cancel(request, response) {
 		return response.redirect('/questionnaires');
    }

    /*
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
