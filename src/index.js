const path = require('path')
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const handlebars = require('express-handlebars')
const { log } = require('console')
const cors = require('cors')
const app = express()
const port = 3000
const Rating = require('./app/models/rating');
const route = require('./routes')
const db = require('../src/config/db')

// connect db
db.connect()

app.use(express.static(path.join(__dirname, 'public')))

//midderware xử lý data gửi lên server
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
app.use(cors())
app.use(methodOverride('_method'))
app.post('/ratings', async (req, res) => {
  try {
    const {name, movieId, content, star, createAt} = req.body
    console.log("abcdeffg", name, movieId, content, star, createAt)
      const newRating = new Rating(req.body);
      await newRating.save();
      res.status(201).json(newRating);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// API sửa đánh giá
app.put('/ratings/:id', async (req, res) => {
  try {
      const updatedRating = await Rating.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedRating) {
          return res.status(404).json({ message: 'Rating not found' });
      }
      res.status(200).json(updatedRating);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// API xóa đánh giá
app.delete('/ratings/:id', async (req, res) => {
  try {
      const deletedRating = await Rating.findByIdAndDelete(req.params.id);
      if (!deletedRating) {
          return res.status(404).json({ message: 'Rating not found' });
      }
      res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// API lấy danh sách tất cả bình luận
app.get('/ratings', async (req, res) => {
  try {
      const ratings = await Rating.find();  // Tìm tất cả bình luận
      res.status(200).json(ratings);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// API lấy tất cả bình luận theo movieId
app.get('/ratings/movie/:movieId', async (req, res) => {
  try {
      const ratings = await Rating.find({ movieId: req.params.movieId });  // Tìm bình luận theo movieId
      if (!ratings.length) {
          return res.status(404).json({ message: 'No ratings found for this movie' });
      }
      res.status(200).json(ratings);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});
// HTTP logger
app.use(morgan('combined'))

//template engine
app.engine('hbs', handlebars.engine({
  extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources/views'))

route(app)


app.listen(port, () => console.log(`App is listening at port ${port}`))