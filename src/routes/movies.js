const express = require('express')
const router = express.Router()

const movieController = require('../app/controllers/MoiveController')

router.get('/create', movieController.create)
router.get('/posts', movieController.posts)
router.post('/store', movieController.store)
router.get('/:id/edit', movieController.edit)
router.get('/:id', movieController.getMovie)
router.put('/:id', movieController.update)
router.get('/delete/:id', movieController.destroy)
router.use('/:slug', movieController.show)

module.exports = router