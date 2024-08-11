const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Movie = new Schema({
    name: {type: String},
    description: {type: String},
    image: {type: String},
    slug: {type: String},
    category: {type: String},
    price: {type: Number},
    videoId: {type: String},
    type: {type: String}
})

module.exports = mongoose.model('Movie', Movie)