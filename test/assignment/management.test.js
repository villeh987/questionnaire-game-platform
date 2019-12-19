/* eslint-disable no-console */
'use strict';

require('dotenv').config();
const config = require('config');
const http = require('http');

const app = require('../../app.js');
const admin = config.get('admin');

describe('Game: A+ protocol', function() {
    it('C: create operation available');

    it('R: read operation available');

    it('U: update operation available');

    it('D: delete operation available');
});
