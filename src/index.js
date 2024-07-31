const path = require('path')
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const handlebars = require('express-handlebars')
const { log } = require('console')
const cors = require('cors')
const app = express()
const port = 3000

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