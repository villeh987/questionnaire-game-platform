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

const DomParser = require('dom-parser');
const parser = new DomParser();


const expect = chai.expect;
chai.use(chaiHttp);

const admin = config.get('admin');
const loginUrl = '/users/login';
const listURL = '/questionnaires';
const newURL = '/questionnaires/new';
const cancelURL = '/questionnaires/cancel';
const editURL = '/questionnaires/edit';
const deleteURL = '/questionnaires/delete';


function parseCsrfToken(res) {
    let htmlDoc = parser.parseFromString(res.text, 'text/html');
    return htmlDoc.getElementsByName('csrf-token')[0].getAttribute('content');
}


describe('Management view', function() {

    let request;

    let testQuestionnaire;

    let data;

    let csrfToken;

    after(function(done) {
        //mongoose.disconnect(done);
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
        let rawData = fs.readFileSync( path.resolve(__dirname, './test_data.json') );
        data =  JSON.parse(rawData);
        await Questionnaire.create(data);

        // Get test questionnaire
        testQuestionnaire = await Questionnaire.findOne({title : 'Test for management view API'}).exec();


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

    it('Should be able to GET new view', async function() {
        const response = await request
            .get(newURL);

        expect(response.statusCode).to.equal(200);
    });

    it('Should be able to add new questionnaire', async function() {
        let newQuestionnaire = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        newQuestionnaire = JSON.parse(newQuestionnaire);

        const response = await request
            .post(newURL)
            .type('form')
            .send(newQuestionnaire);

        //let questionnaires = await Questionnaire.find().exec();
        //console.log(questionnaires);

        //console.log(response);
        expect(response).to.redirectTo(/\/questionnaires$/);
    });

    it('Should be able to cancel create', async function() {
        const response = await request
            .get(cancelURL);

        expect(response.statusCode).to.equal(200);
    });

    it('Should not be able to add new questionnaire with invalid title', async function() {
        let invalidForm = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        invalidForm = JSON.parse(invalidForm);
        invalidForm.title = '';

        const response = await request
            .post(newURL)
            .type('form')
            .send(invalidForm);

        expect(response).to.redirectTo(/\/questionnaires\/new$/);
    });

    it('Should not be able to add new questionnaire with duplicate title', async function() {
        let duplicateForm = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        duplicateForm = JSON.parse(duplicateForm);

        const response = await request
            .post(newURL)
            .type('form')
            .send(duplicateForm);

        expect(response).to.redirectTo(/\/questionnaires\/new$/);
    });

    it('Should not be able to add new questionnaire with non-unique questions', async function() {
        let nonUniqueForm = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        nonUniqueForm = JSON.parse(nonUniqueForm);
        nonUniqueForm.questions[0].title = nonUniqueForm.questions[1].title;

        const response = await request
            .post(newURL)
            .type('form')
            .send(nonUniqueForm);

        expect(response).to.redirectTo(/\/questionnaires\/new$/);
    });

    it('Should not be able to add new questionnaire with non-unique options', async function() {
        let nonUniqueForm = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        nonUniqueForm = JSON.parse(nonUniqueForm);
        nonUniqueForm.questions[0].options[0] = nonUniqueForm.questions[0].options[1];

        const response = await request
            .post(newURL)
            .type('form')
            .send(nonUniqueForm);

        expect(response).to.redirectTo(/\/questionnaires\/new$/);
    });

    it('Should not be able to add new questionnaire with less than 2 options', async function() {
        let inadequateForm = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        inadequateForm = JSON.parse(inadequateForm);
        delete inadequateForm.questions[0].options[0];

        const response = await request
            .post(newURL)
            .type('form')
            .send(inadequateForm);

        expect(response).to.redirectTo(/\/questionnaires\/new$/);
    });

    it('Should not be able to add new questionnaire without correct option', async function() {
        let inadequateForm = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        inadequateForm = JSON.parse(inadequateForm);
        inadequateForm.questions[0].options[0].correctness = false;

        const response = await request
            .post(newURL)
            .type('form')
            .send(inadequateForm);

        expect(response).to.redirectTo(/\/questionnaires\/new$/);
    });

    it('Should be able to add new questionnaire without hint', async function() {
        let hintlessForm = fs.readFileSync( path.resolve(__dirname, './test_form_object.json') );
        hintlessForm = JSON.parse(hintlessForm);
        hintlessForm.title = 'This questionnaire has no hints';
        delete hintlessForm.questions[1].options[0].hint;

        const response = await request
            .post(newURL)
            .type('form')
            .send(hintlessForm);

        expect(response).to.redirectTo(/\/questionnaires$/);
    });


    it('Should be able to list all questionnaires', async function() {
        const response = await request
            .get(listURL);

        expect(response.statusCode).to.equal(200);
    });

    it('Should be able to view a single questionnaire', async function() {
        const response = await request
            .get(`/questionnaires/${testQuestionnaire.id}`);

        expect(response.statusCode).to.equal(200);
    });

    it('Should be able to GET edit view', async function() {
        const response = await request
            .get(`${editURL}/${testQuestionnaire.id}`);

        expect(response.statusCode).to.equal(200);
    });

    it('Should be able to update questionnaires', async function() {
        data.questions[0].title = 'This has been edited';

        const response = await request
            .post(`${editURL}/${testQuestionnaire.id}`)
            .type('form')
            .send(data);

        expect(response).to.redirectTo(/\/questionnaires$/);

        //let questionnaires = await Questionnaire.find();
        //console.log(questionnaires);

    });

    it('Should be able to update questionnaire without changing anything', async function() {
        let url = `${editURL}/${testQuestionnaire.id}`;

        const response = await request
            .post(url)
            .type('form')
            .send(data);

        expect(response).to.redirectTo(/\/questionnaires$/);
    });

    it('Should be able to update questionnaires without hint', async function() {
        let hintlessForm = fs.readFileSync( path.resolve(__dirname, './test_form_object.json') );
        hintlessForm = JSON.parse(hintlessForm);
        hintlessForm.title = 'This questionnaire is hintless';
        let url = `${editURL}/${testQuestionnaire.id}`;
        delete hintlessForm.questions[1].options[0].hint;

        const response = await request
            .post(url)
            .type('form')
            .send(hintlessForm);

        expect(response).to.redirectTo(/\/questionnaires$/);
    });

    it('Should not be able to update questionnaire with invalid title', async function() {
        let invalidForm = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        invalidForm = JSON.parse(invalidForm);
        invalidForm.title = '';
        let url = `${editURL}/${testQuestionnaire.id}`;
        let pattern = new RegExp(url);

        const response = await request
            .post(url)
            .type('form')
            .send(invalidForm);

        expect(response).to.redirectTo(pattern);
    });


    it('Should be able to GET delete view', async function() {
        const response = await request
            .get(`${deleteURL}/${testQuestionnaire.id}`);

        expect(response.statusCode).to.equal(200);
        csrfToken = parseCsrfToken(response);
    });

    it('Should be able to delete questionnaires', async function() {
        const response = await request
            .post(`${deleteURL}/${testQuestionnaire.id}`)
            .type('form')
            .send({
                _csrf: csrfToken
            });

        expect(response).to.redirectTo(/\/questionnaires$/);
    });

    it('Should not be able to delete questionnaires without csrf token', async function() {
        const response = await request
            .post(`${deleteURL}/${testQuestionnaire.id}`)
            .type('form');

        expect(response.statusCode).to.equal(403);
    });

});
