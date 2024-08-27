const express = require('express')
const router = express.Router()

const RatingController = require('../app/controllers/RatingController')
router.post('/store', RatingController.store)
router.put('/:id', RatingController.edit)
router.delete('/:id', RatingController.delete)
router.get('/gets', RatingController.getAll)
router.get('/get/:movieId', RatingController.getAllByMovieId)

module.exports = router