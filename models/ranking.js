'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Questionnaire = require('./questionnaire');

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

                const uniqueGamescores = [];
                val.forEach((current) => {
                    if (!current.player) return;
                    const player = current.player.trim().toUpperCase();

                    if (uniqueGamescores.includes(player)) {
                        uniqueGamescores[player].rights = current.rights;
                        uniqueGamescores[player].wrongs = current.wrongs;
                        uniqueGamescores[player].grade = current.grade;
                        return;
                    };
                    uniqueGamescores.push(player);
                });

                return uniqueGamescores.length === val.length;
            },
            message: 'Questionnaire must have at least one question and question titles must be unique'
        }
    }
});



rankingSchema.set('toJSON', { versionKey: false });
const Ranking = mongoose.model('Ranking', rankingSchema);
module.exports = Ranking;
