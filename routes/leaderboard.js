'use strict'

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const LeaderboardController = require('../controllers/leaderboard');

router.use(auth.ensureAuthenticated);

//Show leaderboards for the specific game
router.get('/:id', LeaderboardController.showLeaderboard);

module.exports = router;
