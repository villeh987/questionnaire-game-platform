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

describe('Game view UI test suite', function() {
    let server;
    let browser;

    let data;
    let testQuestionnaires;

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
        const rawData = fs.readFileSync( path.resolve(__dirname, './ui_test_data.json') );
        data =  JSON.parse(rawData);
        await Questionnaire.create(data);

        // Get test questionnaire
        testQuestionnaires = await Questionnaire.find().exec();


        server = http.createServer(app).listen(port);
        Browser.localhost('bwa', port);
        browser = new Browser();

        await auth(browser);
    });

    afterEach(function() {
        server.close();
    });

    describe('/games', function() {

        beforeEach(async function() {
            await browser.visit('/games');
        });

        it('should be successful', function() {
            browser.assert.success();
        });

        it('must be able to view all questionnaires as games', function() {

            for(let questionnaire in testQuestionnaires) {
                browser.assert.text('title', questionnaire.title);
            }
        });

        it('should have play-button', function() {
            browser.assert.element(`#button_${testQuestionnaires[0].id}`);
        });

        it('play-button should route to games/:id', function() {
            browser.assert.attribute(`#button_${testQuestionnaires[0].id}`, 'href',
                `/games/${testQuestionnaires[0].id}`);
        });

    });

});
