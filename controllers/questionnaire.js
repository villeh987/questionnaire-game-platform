/* eslint-disable sonarjs/no-duplicate-string */
'use strict';

const Questionnaire = require('../models/questionnaire');
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: false });

module.exports = {


    /**
     * Returns list of questionnaires
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async list(request, response) {
        const questionnaires = await Questionnaire.find()
            .sort('title')
            .select('title submissions questions')
            .exec();
        response.render('questionnaire/questionnaires', { questionnaires });
    },

    /**
     * Returns a questionnaire with specific id
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
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

    /**
     * Returns a form to create new questionnaire
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async create(request, response) {
        response.render('questionnaire/create_new_questionnaire');
    },

    /**
     * Cancels current new operation
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async cancel(request, response) {
    	return response.redirect('/questionnaires');
    },

    /**
     * Creates new questionnaire
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async processCreate(request, response) {
        //console.log(request.body);
        //console.log(JSON.stringify(request.body, null, 4));
        //console.log("tulee");
        //console.log(request.body.questions[0].title);
        //request.body.questions[0].option.forEach(e => console.log(e));
        //console.log(request.body.questions[0].options);
        //console.log(request.body.questions[1].options);

        let parsed_questionnaire = request.body;

        // Remove hint, if not given. Also parse correctness checkbox value to be true/false.
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

        //console.log(JSON.stringify(request.body, null, 4));

        // Check whether questionnaire with given title exists
        let questionnaire_title = request.sanitize(request.body.title);
        let existing_questionnaire = await Questionnaire.findOne({title : questionnaire_title}).exec();

        if (existing_questionnaire) {
            request.flash('errorMessage', "A Questionnaire with that title already exists.");
            return response.redirect('/questionnaires/new');
        }

        // Check whether questions and options are unique
        let unique_questions = [];
        let unique_error;
        request.body.questions.forEach( (question, index) => {

            if (unique_questions.includes(question.title)) {
                unique_error = "Question title \"" + question.title + "\" must be unique!"

            } else {
                unique_questions.push(question.title);
            }

            let unique_options = [];
            question.options.forEach( (option, index) => {
            if (unique_options.includes(option.option)) {
                unique_error = "Option title \"" + option.option + "\" must be unique!"

            } else {
                unique_options.push(option.option);
            }

            });

        }); 

        //console.log(unique_error);
        if (unique_error) {
            request.flash('errorMessage', unique_error);
            return response.redirect('/questionnaires/new');
        }

        // Validate Questionnaire
    	const {error} = Questionnaire.validateQuestionnaire(request.body);
    	if (error) {

    		let error_message = "";
    		for (let i in error) {
    			//console.log("i:", i);
    			error_message = error_message + '\n' + error[i];
    		}

    		request.flash('errorMessage', error_message);
    		response.redirect('/questionnaires/new');

    	} else {

	    	await Questionnaire.create(parsed_questionnaire);
	    	request.flash('successMessage', 'Questionnaire added successfully.');
	        response.redirect('/questionnaires');
    	}

    },

    /**
     * Returns a form to remove a questionnaire
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async delete(request, response) {
    	const questionnaire = await Questionnaire.findById(request.params.id).exec();

    	response.render('questionnaire/delete', {questionnaire, csrfToken: request.csrfToken()} );
    },

    /**
     * Removes a questionnaire with specific id
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async processDelete(request, response) {

    	await Questionnaire.findByIdAndDelete(request.params.id).exec();
    	request.flash('successMessage', 'Questionnaire removed successfully.');
        response.redirect('/questionnaires');
    },

    /**
     * Returns a form to update questionnaire info
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async update(request, response) {
    	let questionnaire = await Questionnaire.findById(request.params.id).exec();

    	response.render('questionnaire/update', {questionnaire} );
    },

     /**
     * Updates questionnaire
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
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
    	//console.log(JSON.stringify(request.body, null, 4));

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
