const Movie = require('../models/movie')
const {multipleMongooseToObject} = require('../../util/mongoose')

class MeController {

    storedMovies(req, res, next){
        Movie.find({})
            .then(movies => res.render('me/stored-movies',{
                movies: multipleMongooseToObject(movies)
            }))
            .catch(next)
    }

}

module.exports = new MeController()