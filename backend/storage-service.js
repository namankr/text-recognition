const db = require('./helpers/db');
const Image = db.image;

async function addToDb(ImageParam) {
    console.log(ImageParam , "loggin to debug");
    const texthistory = new Image(ImageParam);
    await texthistory.save();
}

module.exports = { addToDb };
