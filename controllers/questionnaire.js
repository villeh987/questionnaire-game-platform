/* eslint-disable sonarjs/no-duplicate-string */
'use strict';

const Questionnaire = require('../models/questionnaire');

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

            } );

        });

        // Check whether questionnaire with given title exists
        const questionnaireTitle = request.sanitize(request.body.title);
        const existingQuestionnaire = await Questionnaire.findOne({title : questionnaireTitle}).exec();

        if (existingQuestionnaire) {
            request.flash('errorMessage', 'A Questionnaire with that title already exists.');
            return response.redirect('/questionnaires/new');
        }

        // Check whether questions and options are unique
        const uniqueQuestions = [];
        let uniqueError;
        request.body.questions.forEach( (question) => {

            if (uniqueQuestions.includes(question.title)) {
                uniqueError = `Question title "${question.title}" must be unique!`;

            } else {
                uniqueQuestions.push(question.title);
            }

            const uniqueOptions = [];
            question.options.forEach( (option) => {
                if (uniqueOptions.includes(option.option)) {
                    uniqueError = `Option title "${option.option}" must be unique!`;

                } else {
                    uniqueOptions.push(option.option);
                }

            });

        }); 

        if (uniqueError) {
            request.flash('errorMessage', uniqueError);
            return response.redirect('/questionnaires/new');
        }

        // Validate Questionnaire
        const {error} = Questionnaire.validateQuestionnaire(request.body);
        if (error) {

            let errorMessage = '';
            for (let i in error) {
                errorMessage = `${errorMessage} \n ${error[i]}`;   
            }

            request.flash('errorMessage', errorMessage);
            response.redirect('/questionnaires/new');

        } else {

            await Questionnaire.create(request.body);
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
        const questionnaire = await Questionnaire.findById(request.params.id).exec();

        response.render('questionnaire/update', {questionnaire} );
    },

    /**
     * Updates questionnaire
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async processUpdate(request, response) {

        request.body.questions.forEach( (quest) => {
            quest.options.forEach( (opt) => {
                if (opt.correctness === undefined) {
                    opt.correctness = false;

                } else if (opt.correctness === 'on') {
                    opt.correctness = true;
                }

                if (opt.hint === '') {
                    delete opt.hint;
                }

            } );

        });

        const {error} = Questionnaire.validateQuestionnaire(request.body);
        if (error) {

            let errorMessage = '';
            for (let i in error) {
                errorMessage = `${errorMessage} \n ${error[i]}`;
            }

            request.flash('errorMessage', errorMessage);
            response.redirect(`/questionnaires/edit/${request.params.id}`);

        } else {
            await Questionnaire.findByIdAndUpdate(request.params.id, request.body).exec();
            request.flash('successMessage', 'Questionnaire updated successfully.');
            response.redirect('/questionnaires');
        }
    }

};
