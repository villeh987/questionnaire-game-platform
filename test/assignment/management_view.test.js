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
const Questionnaire = require('../../models/questionnaire');

var DomParser = require('dom-parser');
var parser = new DomParser();


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
};


describe('Management view', function() {

    let request;

    let test_questionnaire;

    let data;

    let csrfToken;

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
        data =  JSON.parse(raw_data);
        await Questionnaire.create(data);

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

    it('Should be able to GET new view', async function() {
        const response = await request
            .get(newURL)

        expect(response.statusCode).to.equal(200);
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

    it('Should be able to cancel create', async function() {
        const response = await request
            .get(cancelURL)

        expect(response.statusCode).to.equal(200);
    });

    it('Should not be able to add new questionnaire with invalid title', async function() {
        let invalid_form = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        invalid_form = JSON.parse(invalid_form);
        invalid_form.title = '';

        const response = await request
            .post(newURL)
            .type('form')
            .send(invalid_form);

        expect(response).to.redirectTo(/\/questionnaires\/new$/);
    });

    it('Should not be able to add new questionnaire with duplicate title', async function() {
        let duplicate_form = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        duplicate_form = JSON.parse(duplicate_form);

        const response = await request
            .post(newURL)
            .type('form')
            .send(duplicate_form);

        expect(response).to.redirectTo(/\/questionnaires\/new$/);
    });

    it('Should not be able to add new questionnaire with non-unique questions', async function() {
        let nonuniqure_form = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        nonuniqure_form = JSON.parse(nonuniqure_form);
        nonuniqure_form.questions[0].title = nonuniqure_form.questions[1].title

        const response = await request
            .post(newURL)
            .type('form')
            .send(nonuniqure_form);

        expect(response).to.redirectTo(/\/questionnaires\/new$/);
    });

    it('Should not be able to add new questionnaire with non-unique options', async function() {
        let nonuniqure_form = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        nonuniqure_form = JSON.parse(nonuniqure_form);
        nonuniqure_form.questions[0].options[0] = nonuniqure_form.questions[0].options[0];

        const response = await request
            .post(newURL)
            .type('form')
            .send(nonuniqure_form);

        expect(response).to.redirectTo(/\/questionnaires\/new$/);
    });

    it('Should not be able to add new questionnaire with less than 2 options', async function() {
        let inadequate_form = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        inadequate_form = JSON.parse(inadequate_form);
        delete inadequate_form.questions[0].options[0];

        const response = await request
            .post(newURL)
            .type('form')
            .send(inadequate_form);

        expect(response).to.redirectTo(/\/questionnaires\/new$/);
    });

    it('Should not be able to add new questionnaire without correct option', async function() {
        let inadequate_form = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        inadequate_form = JSON.parse(inadequate_form);
        inadequate_form.questions[0].options[0].correctness = false;

        const response = await request
            .post(newURL)
            .type('form')
            .send(inadequate_form);

        expect(response).to.redirectTo(/\/questionnaires\/new$/);
    });

    it('Should be able to add new questionnaire without hint', async function() {
        let hintless_form = fs.readFileSync( path.resolve(__dirname, './test_form_object.json') );
        hintless_form = JSON.parse(hintless_form);
        hintless_form.title = 'This questionnaire has no hints';
        delete hintless_form.questions[1].options[0].hint

        const response = await request
            .post(newURL)
            .type('form')
            .send(hintless_form);

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

    it('Should be able to GET edit view', async function() {
        const response = await request
            .get(editURL + '/' + test_questionnaire.id)

        expect(response.statusCode).to.equal(200);
    });

    it('Should be able to update questionnaires', async function() {
        data.questions[0].title = 'This has been edited';

        const response = await request
            .post(editURL + '/' + test_questionnaire.id)
            .type('form')
            .send(data);

        expect(response).to.redirectTo(/\/questionnaires$/);

        //let questionnaires = await Questionnaire.find();
        //console.log(questionnaires);

    });

    it('Should be able to update questionnaire without changing anything', async function() {
        let url = editURL + '/' + test_questionnaire.id;

        const response = await request
            .post(url)
            .type('form')
            .send(data);

        expect(response).to.redirectTo(/\/questionnaires$/);
    });

    it('Should be able to update questionnaires without hint', async function() {
        let hintless_form = fs.readFileSync( path.resolve(__dirname, './test_form_object.json') );
        hintless_form = JSON.parse(hintless_form);
        hintless_form.title = 'This questionnaire is hintless';
        let url = editURL + '/' + test_questionnaire.id;
        delete hintless_form.questions[1].options[0].hint

        const response = await request
            .post(url)
            .type('form')
            .send(hintless_form);

        expect(response).to.redirectTo(/\/questionnaires$/);
    });

    it('Should not be able to update questionnaire with invalid title', async function() {
        let invalid_form = fs.readFileSync( path.resolve(__dirname, './test_form.json') );
        invalid_form = JSON.parse(invalid_form);
        invalid_form.title = '';
        let url = editURL + '/' + test_questionnaire.id;
        let pattern = new RegExp(url);

        const response = await request
            .post(url)
            .type('form')
            .send(invalid_form);

        expect(response).to.redirectTo(pattern);
    });


    it('Should be able to GET delete view', async function() {
        const response = await request
            .get(deleteURL + '/' + test_questionnaire.id)

        expect(response.statusCode).to.equal(200);
        csrfToken = parseCsrfToken(response);
    });

    it('Should be able to delete questionnaires', async function() {
        const response = await request
            .post(deleteURL + '/' + test_questionnaire.id)
            .type('form')
            .send({
                _csrf: csrfToken
            });

        expect(response).to.redirectTo(/\/questionnaires$/);
    });

    it('Should not be able to delete questionnaires without csrf token', async function() {
        const response = await request
            .post(deleteURL + '/' + test_questionnaire.id)
            .type('form')

        expect(response.statusCode).to.equal(403);
    });

});