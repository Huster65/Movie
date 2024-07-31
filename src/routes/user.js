const express = require('express')
const router = express.Router()

const userController = require('../app/controllers/UserController')

router.get('/create', userController.create)
router.post('/create', userController.createUser)
router.get('/login', userController.loginUserGet)
router.post('/login', userController.loginUserPost)
router.get('/list', userController.listUser)
router.get('/delete/:id', userController.deleteUser)
router.get('/:id/edit', userController.editUser)

module.exports = router