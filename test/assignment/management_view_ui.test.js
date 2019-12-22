/* eslint-disable no-console */
'use strict';

require('dotenv').config();
//const assert = require('assert');
const config = require('config');
const http = require('http');
const Browser = require('zombie');

const fs = require('fs');
const path = require('path');

const app = require('../../app.js');
const admin = config.get('admin');
const User = require('../../models/user');
const Questionnaire = require('../../models/questionnaire');
const port = 3333;

async function auth(browser) {
    // Load login page
    await browser.visit('/users/login');

    // Fill in login information and login
    browser.fill('email', admin.email);
    browser.fill('password', admin.password);
    await browser.pressButton('#btnLogin');
}

describe('Management view UI test suite', function() {
    let server;
    let browser;

    let data;
    let testQuestionnaire;

    beforeEach(async function() {


        // Create admin user, if doesn't exist
        const userData = {...admin, role: 'admin'};
        const user = new User(userData);
        try {
            await user.save();
        } catch(error) {
            // Admin exists already in db.
        }


        // Empty database
        await Questionnaire.deleteMany({});


        // Create test data
        let rawData = fs.readFileSync( path.resolve(__dirname, './ui_test_data.json') );
        data =  JSON.parse(rawData);
        await Questionnaire.create(data);

        // Get test questionnaire
        testQuestionnaire = await Questionnaire.findOne({title : 'Test questionnaire'}).exec();


        server = http.createServer(app).listen(port);
        Browser.localhost('bwa', port);
        browser = new Browser();

        await auth(browser);
    });

    afterEach(function() {
        server.close();
    });

    describe('/questionnaires', function() {

        beforeEach(async function() {
            await browser.visit('/questionnaires');
        });

        it('must be able to view questionnaires', function() {

            browser.assert.element('#questionnaireSearch');
            browser.fill('#questionnaireSearch', 'filter');
            browser.fire('#questionnaireSearch', 'keyup');

            browser.assert.style(`[id='${testQuestionnaire.id}']`, 'display', 'none');
        });

        it('must be able to view single questionnaire', async function() {
            await browser.visit(`/questionnaires/${testQuestionnaire.id}`);
            browser.assert.element(`[id='${testQuestionnaire.id}']`);
        });


    });

    describe('/questionnaires/new', function() {
        beforeEach(async function() {
            await browser.visit('/questionnaires/new');
        });

        it('must be able to add new questionnaire', async function() {

            browser.fill('#questionnairetitle', 'Automatically created questionnaire');
            browser.fill('input[name="questions[1][title]"]', 'Automatic question 1');
            browser.fill('input[name="questions[1][maxPoints]"]', '10');
            browser.fill('input[name="questions[1][options][1][option]"]', 'Automatic option 1');
            browser.fill('input[name="questions[1][options][2][option]"]', 'Automatic option 2');
            await browser.check('input[name="questions[1][options][1][correctness]"]');

            await browser.pressButton('#newQuestionnaireButton');

            browser.assert.success();
            browser.assert.text('.alert.alert-success', 'Questionnaire added successfully.');

        });

    });

    describe('/questionnaires/edit', function() {
        beforeEach(async function() {
            await browser.visit(`/questionnaires/edit/${testQuestionnaire.id}`);
        });

        it('must be able to edit questionnaire', async function() {

            browser.fill('#questionnairetitle', 'Automatically edited questionnaire');
            browser.fill('input[name="questions[1][title]"]', 'Automatic edited question 1');
            browser.fill('input[name="questions[1][maxPoints]"]', '10');
            browser.fill('input[name="questions[1][options][1][option]"]', 'Automatic edited option 1');
            browser.fill('input[name="questions[1][options][2][option]"]', 'Automatic edited option 2');
            await browser.check('input[name="questions[1][options][2][correctness]"]');

            await browser.pressButton('#updateQuestionnaireButton');

            browser.assert.success();
            browser.assert.text('.alert.alert-success', 'Questionnaire updated successfully.');

        });

    });

    describe('/questionnaires/delete', function() {
        beforeEach(async function() {
            await browser.visit(`/questionnaires/delete/${testQuestionnaire.id}`);
        });

        it('must be able to delete questionnaire', async function() {
            await browser.pressButton('#deleteQuestionnaire');
            browser.assert.success();
            browser.assert.text('.alert.alert-success', 'Questionnaire removed successfully.');
        });
    });

});
