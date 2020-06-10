'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var personSchema = Schema({
    dpi: Number,
    name: String,
    lastName: String,
    birthDate: Date,
    formatDate: String
})

module.exports = mongoose.model('Person', personSchema);