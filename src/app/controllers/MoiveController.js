const Movie = require('../models/movie')
const {mongooseToObject} = require('../../util/mongoose')

class MovieController {

    show(req, res, next){
        Movie.findOne({ slug: req.params.slug})
            .then((movie) => {
                res.render('movies/show', {
                    movie: mongooseToObject(movie)
                })
            })
            .catch(next)
    }

    // movies/:id     get movie
    async getMovie(req, res, next){
        Movie.findOne({_id : req.params.id})
            .then((movie) => {
                res.json(movie)
            })
            .catch(next)
    }

    //movies/post
    async posts(req, res, next){
        try {
            const posts = await Movie.find({})
            res.json({success: true, posts})
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error'})
        }
    }


    // GET
    create(req, res, next){
        res.render('movies/create')
    }
    // POST /movies/store
    store(req, res, next){
        const movie = new Movie(req.body)
        movie.save()
            .then(() => res.redirect('/'))
            .catch(error => {
                
            })
    }
    // GET /movies/:id/edit
    edit(req, res, next){
        Movie.findById(req.params.id)
            .then(movie => res.render('movies/edit',{
                movie: mongooseToObject(movie)
            }))
            .catch(next)
    }
    // PUT /movies/:id
    update(req, res, next){
        Movie.updateOne({_id: req.params.id}, req.body)
            .then(() => res.redirect('/me/stored/movies'))
            .catch(next)
    }

    // Delete /movies/delete/:id
    destroy(req, res, next){
        Movie.deleteOne({ _id: req.params.id })
            .then(() => {res.redirect('back')})
            .catch(next)
    }

}

module.exports = new MovieController