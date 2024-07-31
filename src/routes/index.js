const newsRouter = require('./news')
const siteRouter = require('./site')
const movieRouter = require('./movies')
const meRouter = require('./me')
const userRouter = require('./user')
function route(app) {

    app.use('/user', userRouter)

    app.use('/news', newsRouter)
    
    app.use('/movies', movieRouter)

    app.use('/me', meRouter)

    app.use('/', siteRouter)
    
     
}

module.exports = route