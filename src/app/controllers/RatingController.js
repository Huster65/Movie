const Rating = require('../models/rating')
const {mongooseToObject} = require('../../util/mongoose')

class RatingController {
    // POST /rating/create
    async store (req, res,next){
        try {
            const { userId, movieId, content, star } = req.body;
    // Kiểm tra nếu các trường bắt buộc bị thiếu
        if (!userId || !movieId || !content || star === undefined) {
            return res.status(400).json({ message: 'Please provide all required fields: userId, movieId, content, and star.' });
        }

            console.log("eq.body", eq.body)
            const newRating = new Rating(req.body);
            await newRating.save();
            res.status(201).json(newRating);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
// GET /movies/:id/edit
async edit(req, res){
    try {
        const updatedRating = await Rating.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRating) {
            return res.status(404).json({ message: 'Rating not found' });
        }
        res.status(200).json(updatedRating);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
async delete(req, res){
    try {
        const deletedRating = await Rating.findByIdAndDelete(req.params.id);
        if (!deletedRating) {
            return res.status(404).json({ message: 'Rating not found' });
        }
        res.status(200).json({ message: 'Rating deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

     async getAll (req, res){
        try {
            const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
            const limit = parseInt(req.query.size) || 10; // Số lượng bình luận trên mỗi trang, mặc định là 10

            const ratings = await Rating.find()
                .skip((page - 1) * limit)  // Bỏ qua các bình luận của các trang trước
                .limit(limit);  // Giới hạn số lượng bình luận trên mỗi trang

            const totalRatings = await Rating.countDocuments(); // Tổng số bình luận

            res.status(200).json({
                ratings,
                currentPage: page,
                totalPages: Math.ceil(totalRatings / limit),
                totalRatings
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    // API ratings/movie/:movieId
    async getAllByMovieId (req, res){
        try {
            const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
            const limit = parseInt(req.query.limit) || 10; // Số lượng bình luận trên mỗi trang, mặc định là 10
    
            const ratings = await Rating.find({ movieId: req.params.movieId })
                .skip((page - 1) * limit)  // Bỏ qua các bình luận của các trang trước
                .limit(limit);  // Giới hạn số lượng bình luận trên mỗi trang
    
            const totalRatings = await Rating.countDocuments({ movieId: req.params.movieId }); // Tổng số bình luận cho phim này
    
            if (!ratings.length) {
                return res.status(404).json({ message: 'No ratings found for this movie' });
            }
    
            res.status(200).json({
                ratings,
                currentPage: page,
                totalPages: Math.ceil(totalRatings / limit),
                totalRatings
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new RatingController