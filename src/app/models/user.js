const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    username: {type: String},
    password: {type: String},
    price: {type: Number},
    isAdmin: {type: Boolean}
})

module.exports = mongoose.model('User', User)