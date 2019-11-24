const Multer = require('multer');
const cloudbucket = require('./config');
const {Storage} = require('@google-cloud/storage');

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

function sendUploadToGCS(req, res, next) {
    if (!req.file) {
        return next();
    }
    
    const storage = new Storage();

    console.log(cloudbucket.CLOUD_BUCKET);

    const bucket = storage.bucket(cloudbucket.CLOUD_BUCKET);


    const gcsname = Date.now() + req.file.originalname;
    const file = bucket.file(gcsname);

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        },
        resumable: false
    });

    stream.on('error', (err) => {
        req.file.cloudStorageError = err;
        next(err);
    });

    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsname;
        file.makePublic().then(() => {
            req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
            next();
        });
    });

    stream.end(req.file.buffer);
}


function getPublicUrl(filename) {
    return `https://storage.googleapis.com/${cloudbucket.CLOUD_BUCKET}/${filename}`;
}

module.exports={multer , sendUploadToGCS};
