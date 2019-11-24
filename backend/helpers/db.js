const config = require('../config');
const mongoose = require('mongoose');
mongoose.connect(config.connectionString, { useCreateIndex: true, useNewUrlParser: true });

mongoose.Promise = global.Promise;

module.exports = {
    image: require('../model')
};