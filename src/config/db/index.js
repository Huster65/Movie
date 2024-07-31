const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://hoangminhnhat2k2:Minhnhatbk65@movies.xyhggd0.mongodb.net/?retryWrites=true&w=majority&appName=movies');
        console.log('Connect database successfully');
    } catch (error) {
        console.error('Connect failure', error);
    }
}

module.exports = { connect };
