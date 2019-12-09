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
    },

    
    async processCreate(request, response) {
    	console.log(request.body);
    	console.log("tulee");
    	console.log(request.body.questions[0].title);
    	//request.body.questions[0].option.forEach(e => console.log(e));
    	console.log(request.body.questions[0].options);
    	console.log(request.body.questions[1].options);
    }

/*
    async changeRole(request, response) {} 





*/

};
