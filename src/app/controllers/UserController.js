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

    async getUser(req, res, next){
        User.findOne({username: req.params.username})
            .then((user) => {
                res.json(user)
            })
            .catch(next)
    }
    // GET user/list
    async listUser(req, res, next) {
        try {
            // Lấy giá trị page, size và search từ query parameters
            const page = parseInt(req.query.page) || 1;
            const size = parseInt(req.query.size) || 16;
            const search = req.query.search; // Không có mặc định, chỉ lấy khi được truyền vào
    
            // Tính toán skip để bỏ qua các kết quả không cần thiết
            const skip = (page - 1) * size;
    
            // Tạo đối tượng filter, chỉ thêm điều kiện tìm kiếm nếu search không rỗng hoặc undefined
            const filter = search
                ? { username: { $regex: search, $options: 'i' } } // Tìm kiếm theo tên không phân biệt hoa/thường
                : {};
    
            // Lấy tổng số lượng bài viết khớp với filter
            const totalUser = await User.countDocuments(filter);
    
            // Lấy các bài viết với skip và limit, và áp dụng filter
            const users = await User.find(filter)
                .skip(skip)
                .limit(size);
    
            // Trả về kết quả với thông tin phân trang
            res.json({
                success: true,
                users,
                pagination: {
                    totalUser,
                    currentPage: page,
                    totalPages: Math.ceil(totalUser / size),
                    pageSize: size,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
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

    async buyMovie(req, res, next){
        const userId = req.params.id;
        const priceBuy = req.body.price;
        console.log("asdas",userId, priceBuy)
        try {
            // Tìm người dùng theo ID và cập nhật địa chỉ
            const user = await User.findByIdAndUpdate(
                userId,
                { price: priceBuy },
                { new: true, runValidators: true } // Trả về bản ghi đã được cập nhật
            );
            console.log("jhagdas")
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            res.send({ message: 'Address updated successfully', user });
        } catch (err) {
            res.status(500).send({ message: 'Error updating address', error: err.message });
        }
    }

}

module.exports = new UserController