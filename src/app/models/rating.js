const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Rating = new Schema({
    name: {type: String},
    movieId: {type: String},
    content: {type: String},
    star: {type: Number},
    createAt: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Rating', Rating)