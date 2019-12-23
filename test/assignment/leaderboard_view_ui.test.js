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
const Ranking = require('../../models/ranking');
const Grader = require('../../models/grader');
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


        // Empty databases
        await Questionnaire.deleteMany({});
        await Ranking.deleteMany({});


        // Create test data
        const rawData = fs.readFileSync( path.resolve(__dirname, './ui_test_data.json') );
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

    describe('/leaderboard/:id', function() {

        beforeEach(async function() {
            await browser.visit(`/leaderboard/${testQuestionnaire.id}`);
        });

        it('should be successful', function() {
            browser.assert.success();
        });

        it('should have empty leaderboard', function() {
            browser.assert.elements('#li',  0);
        });

        it('should show 10 entries in leaderboard', async function() {
            const points = 10;
            const errors = 0;
            const maxPoints = 100;
            const playerName = 'Test player';
            for(let i = 11; i > 0; --i) {
                await Grader.grade(points, errors, maxPoints, testQuestionnaire.id, playerName);
            }
            const rankingList = await Ranking.findOne({game: testQuestionnaire.id}).exec();
            const leaderboard = rankingList.gameScore;
            await browser.visit(`/leaderboard/${testQuestionnaire.id}`);

            //Every list element has id of "li" + index number
            for(let i = 0; i < 10; ++i) {
                browser.assert.elements(`#li${i}`, 1);
            }
        });

    });

});
