'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameScoreSchema = new Schema({
    player: {
        type: String,
        required: true
    },
    rights: {
        type: Number,
        required: true,
        validate: Number.isInteger
    },
    wrongs: {
        type: Number,
        required: true,
        validate: Number.isInteger
    },
    grade: {
        type: Number,
        required: true,
        validate: Number.isInteger
    }
});

const rankingSchema = new Schema({
    game: {
        type: String,
        required: true
    },
    gameScore: {
        type: [gameScoreSchema],
        required: true,
        validate: {
            validator: (val) => {
                if (!val || !Array.isArray(val)) return false;
                if (val.length === 0) return false;
            },
        }
    }
});

rankingSchema.set('toJSON', { versionKey: false });
const Ranking = mongoose.model('Ranking', rankingSchema);
module.exports = Ranking;
