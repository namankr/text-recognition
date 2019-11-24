const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    result: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    image: {type: String  }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('image', schema);