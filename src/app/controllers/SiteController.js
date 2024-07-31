const Movie = require('../models/movie')
const {multipleMongooseToObject} = require('../../util/mongoose')
class SiteController {

    // GET 
    async index(req, res) {
        try {
            const movie = await Movie.find({});
            res.render('home',{
                movies: multipleMongooseToObject(movie)
            });
        } catch (err) {
            next(err)
        }
    }

    search(req, res){
        res.render('search')
    }

}

module.exports = new SiteController