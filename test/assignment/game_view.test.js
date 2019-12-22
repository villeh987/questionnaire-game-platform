/* eslint-disable no-invalid-this */
'use strict';

require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
//const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = require('../../app');
const User = require('../../models/user');
const Questionnaire = require('../../models/questionnaire');
const Grader = require('../../models/grader');
const Ranking = require('../../models/ranking');

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const admin = config.get('admin');
const loginUrl = '/users/login';
const listURL = '/games';

describe('Game view', function() {

    let request;

    let testQuestionnaire;

    let data;

    after(function(done) {
        done();
    });

    this.beforeAll( async function() {
        request = chai.request.agent(app);


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
        const rawData = fs.readFileSync( path.resolve(__dirname, './test_data.json') );
        data =  JSON.parse(rawData);
        await Questionnaire.create(data);

        // Get test questionnaire
        testQuestionnaire = await Questionnaire.findOne({title : 'Test questionnaire'}).exec();


        //done();
    });

    this.afterAll(function(done) {
        request.close(done);
    });

    it('Login as Admin', async function() {
        const response = await request
            .post(loginUrl)
            .type('form')
            .send(admin);
        expect(response).to.have.cookie('bwa');
        expect(response).to.redirectTo(/\/$/);
    });

    it('Should list all questionnaires as games', async function() {
        const response = await request
            .get(listURL);

        expect(response.statusCode).to.equal(200);
    });


    it('Should load a game view', async function() {

        const response = await request
            .get(`${listURL}/${testQuestionnaire.id}`);

        expect(response.statusCode).to.equal(200);
    });

    it('Should grade the game', async function() {
        let gameForm = fs.readFileSync( path.resolve(__dirname, './game_test_form.json') );
        gameForm = JSON.parse(gameForm);

        const response = await request
            .post(`${listURL}/${testQuestionnaire.id}`).type('form').send(gameForm);

        expect(response.statusCode).to.equal(200);
        response.should.have.property('text');
        response.text.should.not.have.lengthOf(0);
    });

});

describe('Grader', function() {
    let testQuestionnaire;
    let data;
    const gameData = {
        points: 10,
        errors: 0,
        maxPoints: 100
    };

    after(function(done) {
        done();
    });

    this.beforeAll( async function() {

        // Empty ranking database
        await Ranking.deleteMany({});

        // Empty questionnaire database
        await Questionnaire.deleteMany({});

        // Create test data
        const rawData = fs.readFileSync( path.resolve(__dirname, './test_data.json') );
        data =  JSON.parse(rawData);
        await Questionnaire.create(data);

        testQuestionnaire = await Questionnaire.findOne({title : 'Test questionnaire'}).exec();

    });

    it('Should grade the game and return a score', async function() {
        const score = await Grader.grade(gameData.points, gameData.errors,
            gameData.maxPoints, testQuestionnaire.id, 'Test user');
        expect(score).to.equal(100);

    });

    it('Should save the game data to Ranking database', async function() {
        const score = await Grader.grade(gameData.points, gameData.errors,
            gameData.maxPoints, testQuestionnaire.id, 'Test user');
        const rankingList = await Ranking.find().exec();
        const leaderboard = rankingList[0].gameScore;

        expect(rankingList).to.have.lengthOf(1);
        expect(leaderboard[0].player).to.equal('Test user');
        expect(leaderboard[0].grade).to.equal(score);
    });

    it('should only save 10 entries for each game', async function() {
        for(let i = 11; i > 0; --i) {
            await Grader.grade(gameData.points, i, gameData.maxPoints,
                'testID', 'Test user' + i);
        }
        const rankingList = await Ranking.findOne({game: 'testID'}).exec();
        const leaderboard = rankingList.gameScore;
        expect(leaderboard).to.have.lengthOf(10);
        expect(leaderboard.slice(-1).pop().player).to.equal('Test user10');

    });
});
