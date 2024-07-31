require('dotenv').config 
const User = require('../models/user')
const {mongooseToObject, multipleMongooseToObject} = require('../../util/mongoose')
const bcrypt = require('bcrypt')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')


class UserController {

    // GET user/create
    create(req, res){
        res.render('user/create')
    }

    // POST user/create
    async createUser(req, res, next){
        const {username, password, passwordConfirm} = req.body
        if(!username || !password)
            return res.status(400).json({success: false, message: "Thiếu username hoặc password"})
        try {
            const user = await User.findOne({username})
            if(user)
                return res.status(400).json({success: false, message: 'Username đã tồn tại'})
            
            const newUser = new User({
                username: username,
                password: password
            })
            newUser.save()
            //Return token
            const accessToken = jwt.sign({userId: newUser._id}, 'hoangminhnhat')
            res.json({success: true, message: 'User created successfully', accessToken})
        

        } catch (error) {
            console.log(error);
            res.status(500).json({success: false})
        }
        
    }

    // GET user/login
    loginUserGet(req, res, next){
        res.render('user/login')
    }

    //POST user/login
    async loginUserPost(req, res, next){
        const {username, password} = req.body

        if(!username || !password)
            return res.status(400).json({ success: false, message: 'Thiếu username hoặc password'})
        try {
            const user = await User.findOne({username})
            if(!user)
                return res.status(400).json({success: false, message: 'Sai password'})
            if(password != user.password)
                return res.status(400).json({success: false, message: 'Sai password'})
            const accessToken = jwt.sign(
                {
                    userId: user._id,
                    username: user.username,
                    price: user.price,
                    isAdmin: user.isAdmin
                },
                'hoangminhnhat'
            )
            res.json({
                success: true,
                message: 'Login thành công',
                accessToken
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({success: false})
        }
    }

    // GET user/list
    listUser(req, res, next){
        User.find({})
            .then(users => res.render('user/list',{
                users: multipleMongooseToObject(users)
            }))
            .catch(next)
    }

    // GET user/delete/:id
    deleteUser(req, res, next){
        User.deleteOne({_id: req.params.id})
            .then(() => {res.redirect('back')})
            .catch(next)
    }

    //GET user/:id/edit
    editUser(req, res, next){
        res.render('user/edit')
    }
}

module.exports = new UserController