const http = require('http');
const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');
const easyimg = require('easyimage');

const maxDb = 120;
const minDb = 45;
const image = 'http://67.42.239.10/display/guest?screenshot';
const backupImage = 'http://65.102.14.205/display/guest?screenshot';

const imageDir = '../static/';
const imageSave = path.resolve(__dirname, imageDir + 'full.png');
const imageCrop = path.resolve(__dirname, imageDir + 'crop.png');
const imageSaveBackup = path.resolve(__dirname, imageDir + 'full-backup.png');

const getGreenToRed = (percent) => {
  const g = percent < 50 ? 255 : Math.floor(255 - (percent * 2 - 100) * 255 / 100);
  const r = percent > 50 ? 255 : Math.floor((percent * 2) * 255 / 100);
  return {r, g, b: 0};
};

const diffToPrecentage = (db) => {
  const diff = maxDb - minDb;
  const scale = 75 / 100;
  const value = diff - db;
  return value / .75;
};

module.exports = (res) => {

  const download = (url, dest, cb, usedBackup = false) => {
    const file = fs.createWriteStream(dest);
    const request = http.get(url, (response) => {
      if(response.statusCode !== 200) {
        if(usedBackup) {
          console.log('backup used', usedBackup);
          crop(usedBackup);
          return;
        }
        download(backupImage, imageSave, crop, true);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(cb);  // close() is async, call cb after close completes.
      });
    }).on('error', (err) => { // Handle errors
      console.log(err);
      // fs.unlink(dest); // Delete the file async. (But don't check the result)
      // if (cb) cb(err.message);
    });
  };

  const crop = (usedBackup = false) => {
    const image = usedBackup ? imageSaveBackup : imageSave;
    easyimg.rescrop({
         src: image,
         dst: imageCrop,
         width:500,
         height:500,
         cropwidth:300,
         cropheight:150,
         x:0,
         y:50
      }).then(
      (image) => {
        Tesseract.recognize(image.path).then(result => {
          res.setHeader('Content-Type', 'application/json');
          const db = +result.text.replace(/[^\d.-]/g,'');
          console.log(db)
          let rgb = getGreenToRed(diffToPrecentage(db));
          if(db === 0) {
            rgb = {
              r: 0,
              g: 0,
              b: 100
            };
          }
          let data = Object.assign({}, {db}, rgb);

          res.send(JSON.stringify(data));
        });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  download(image, imageSave, crop);
};
