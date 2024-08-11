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
    async posts(req, res, next) {
        try {
            // Lấy giá trị page, size và search từ query parameters
            const page = parseInt(req.query.page) || 1;
            const size = parseInt(req.query.size) || 16;
            const search = req.query.search; // Không có mặc định, chỉ lấy khi được truyền vào
    
            // Tính toán skip để bỏ qua các kết quả không cần thiết
            const skip = (page - 1) * size;
    
            // Tạo đối tượng filter, chỉ thêm điều kiện tìm kiếm nếu search không rỗng hoặc undefined
            const filter = search
                ? { name: { $regex: search, $options: 'i' } } // Tìm kiếm theo tên không phân biệt hoa/thường
                : {};
    
            // Lấy tổng số lượng bài viết khớp với filter
            const totalPosts = await Movie.countDocuments(filter);
    
            // Lấy các bài viết với skip và limit, và áp dụng filter
            const posts = await Movie.find(filter)
                .skip(skip)
                .limit(size);
    
            // Trả về kết quả với thông tin phân trang
            res.json({
                success: true,
                posts,
                pagination: {
                    totalPosts,
                    currentPage: page,
                    totalPages: Math.ceil(totalPosts / size),
                    pageSize: size,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
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