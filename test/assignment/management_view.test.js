/* eslint-disable no-invalid-this */
'use strict';

require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = require('../../app');


const expect = chai.expect;
chai.use(chaiHttp);

const admin = config.get('admin');
const loginUrl = '/users/login';
const listURL = '/questionnaires';
const newURL = '/questionnaires/new';

const Questionnaire = require('../../models/questionnaire');


describe('Management view', function() {

    let request;

    let test_questionnaire;

    after(function(done) {
        //mongoose.disconnect(done);
        done();
    });

    this.beforeAll( async function() {
        request = chai.request.agent(app);


        // Login as admin
        /*const response = await request
            .post(loginUrl)
            .type('form')
            .send(admin);
        expect(response).to.have.cookie('bwa');
        expect(response).to.redirectTo(/\/users\/me$/);*/

        // Empty database
        await Questionnaire.deleteMany({});


        // Create test data
        let raw_data = fs.readFileSync( path.resolve(__dirname, './test_data.json') );
        await Questionnaire.create(JSON.parse(raw_data));

        // Get test questionnaire
        test_questionnaire = await Questionnaire.findOne({title : "Test for management view API"}).exec();


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
        expect(response).to.redirectTo(/\/users\/me$/);
    });

    it('Should be able to add new questionnaire', async function() {
        let new_questionnaire = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        new_questionnaire = JSON.parse(new_questionnaire);

        const response = await request
            .post(newURL)
            .type('form')
            .send(new_questionnaire);

        //let questionnaires = await Questionnaire.find().exec();
        //console.log(questionnaires);

        //console.log(response);
        expect(response).to.redirectTo(/\/questionnaires$/);
    });

    it('Should be able to list all questionnaires', async function() {
        const response = await request
            .get(listURL)

        expect(response.statusCode).to.equal(200);
    });

    it('Should be able to view a single questionnaire', async function() {
        const response = await request
            .get(`/questionnaires/${test_questionnaire.id}`)

        expect(response.statusCode).to.equal(200);
    });


});