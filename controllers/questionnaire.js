/* eslint-disable sonarjs/no-duplicate-string */
'use strict';

const Questionnaire = require('../models/questionnaire');
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: false });

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
    	//console.log(request.body);
    	//console.log("tulee");
    	//console.log(request.body.questions[0].title);
    	//request.body.questions[0].option.forEach(e => console.log(e));
    	//console.log(request.body.questions[0].options);
    	//console.log(request.body.questions[1].options);

    	let parsed_questionnaire = request.body;

    	request.body.questions.forEach( (question) => {
    		question.options.forEach( (option) => {
    			if (option.correctness === undefined) {
    				option.correctness = false;

    			} else if (option.correctness === 'on') {
    				option.correctness = true;
    			}

    			if (option.hint === '') {
    				delete option.hint;
    			}

    		} )

    	});

    	const {error} = Questionnaire.validateQuestionnaire(request.body);
    	if (error) {

    		let error_message = "";
    		for (let i in error) {
    			console.log("i:", i);
    			error_message = error_message + '\n' + error[i];
    		}

    		request.flash('errorMessage', error_message);
    		response.redirect('/questionnaires/new');
    	} else{

	    	await Questionnaire.create(parsed_questionnaire);
	    	request.flash('successMessage', 'Questionnaire added successfully.');
	        response.redirect('/questionnaires');
    	}

    },

    async delete(request, response) {
    	const questionnaire = await Questionnaire.findById(request.params.id).exec();

    	response.render('questionnaire/delete', {questionnaire} );
    },


    async processDelete(request, response) {

    	await Questionnaire.findByIdAndDelete(request.params.id).exec();
    	request.flash('successMessage', 'Questionnaire removed successfully.');
        response.redirect('/questionnaires');
    },

    async update(request, response) {
    	let questionnaire = await Questionnaire.findById(request.params.id).exec();

    	response.render('questionnaire/update', {questionnaire} );
    },


    async processUpdate(request, response) {
    	//console.log(request.body);

    	request.body.questions.forEach( (question) => {
    		question.options.forEach( (option) => {
    			if (option.correctness === undefined) {
    				option.correctness = false;

    			} else if (option.correctness === 'on') {
    				option.correctness = true;
    			}

    			if (option.hint === '') {
    				delete option.hint;
    			}

    		} )

    	});
    	console.log(JSON.stringify(request.body, null, 4));

    	const {error} = Questionnaire.validateQuestionnaire(request.body);
    	if (error) {

    		let error_message = "";
    		for (let i in error) {
    			console.log("i:", i);
    			error_message = error_message + '\n' + error[i];
    		}

    		request.flash('errorMessage', error_message);
    		response.redirect(`/questionnaires/edit/${request.params.id}`);
    	} else {
	    	await Questionnaire.findByIdAndUpdate(request.params.id, request.body).exec();
	    	request.flash('successMessage', 'Questionnaire updated successfully.');
	        response.redirect('/questionnaires');
    	}
    }


};