const express = require('express');
const cors = require('cors');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const images = require('./images');
const storageService = require('./storage-service');
const app = express();
const jwt = require('jsonwebtoken');
const config = require('./config');



MongoClient = require('mongodb').MongoClient;

app.use(express.static('public'))
app.use(cors());

app.post('/upload', images.multer.single('image'), images.sendUploadToGCS, (req, res, next) => {
  if (req.file) {
    async function textResponse() {
      let text = await detectText(req.file.cloudStoragePublicUrl);

      let schemaParam = { result: text, image: req.file.cloudStoragePublicUrl };
      storageService.addToDb(schemaParam);
      res.json({
        imageUrl: req.file.cloudStoragePublicUrl,
        text: text
      });
    }
    textResponse();

  }

  else
    res.status("409").json("No Files to Upload.");
});

async function detectText(req) {
  let fileName = req;
  const [result] = await client.documentTextDetection(fileName);
  const fullTextAnnotation = result.fullTextAnnotation;
  console.log(`Full text: ${fullTextAnnotation.text}`);

  return fullTextAnnotation.text;
}

const PORT = 5000;
app.listen(PORT);
console.log('api runnging on port: ' + PORT);