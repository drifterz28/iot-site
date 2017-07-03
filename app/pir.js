const http = require('http');
const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');
const easyimg = require('easyimage');
const moment = require('moment');

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

const imageTimeCheck = () => {
  fs.stat(imageSave, (err, data) => {
    if (err) throw err;
    const then = moment(data.mtime, `YYYY-MM-DD'T'HH:mm:ss:SSSZ`);
    const now = moment();

    const diff = Math.abs(moment.duration(then.diff(now)));
    const diffInMin = moment.utc(diff).format('mm');
    if(diffInMin > 5) {
      download(image, imageSave);
    }
  });
};

const download = (url, dest, usedBackup = false) => {
  const file = fs.createWriteStream(dest);
  const request = http.get(url, (response) => {
    if(response.statusCode !== 200) {
      if(usedBackup) {
        download(imageSaveBackup, imageSave, crop, true);
      }
      download(backupImage, imageSave, true);
      return;
    }
    response.pipe(file);
    file.on('finish', () => {
      file.close();
    });
  }).on('error', (err) => {
    console.log(err);
  });
};

module.exports = (res) => {

  const crop = () => {
    easyimg.rescrop({
      src: imageSave,
      dst: imageCrop,
      width:500,
      height:500,
      cropwidth:300,
      cropheight:150,
      x:0,
      y:50
    })
    .then(
      (image) => {
        Tesseract.recognize(image.path).then(result => {
          res.setHeader('Content-Type', 'application/json');
          const db = +result.text.replace(/[^\d.-]/g,'');
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
    )
    .then(imageTimeCheck);
  };

  crop();
};
