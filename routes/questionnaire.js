'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: false });

const router = express.Router();
const QuestionnaireController = require('../controllers/questionnaire');

router.use(auth.ensureTeacher);

// View documents
router.get('/', csrfProtection, QuestionnaireController.list);

router.get('/:id([a-f0-9]{24})', QuestionnaireController.show);

// Create documents
router.get('/new', QuestionnaireController.create);
router.get('/cancel', QuestionnaireController.cancel);

router.post('/new', QuestionnaireController.processCreate);


// Update documents
router.get('/edit/:id([a-f0-9]{24})', QuestionnaireController.update);
router.post('/edit/:id([a-f0-9]{24})', QuestionnaireController.processUpdate);


// Delete documents
router
    .route('/delete/:id([a-f0-9]{24})')
    .all(
        csrfProtection
    )
    .get(QuestionnaireController.delete)
    .post(QuestionnaireController.processDelete);

module.exports = router;
