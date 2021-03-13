const fs = require('fs');
const ExifImage = require('exif').ExifImage;

const getImageDate = (image) => {
  return new Promise((resolve, reject) => {
    new ExifImage({image}, (error, {exif}) => {
      if (error) reject(error);
      const date = (exif.DateTimeOriginal)
        ? exif.DateTimeOriginal.split(' ')[0].split(':').join('-')
        : null;
      return resolve(date);
    });
  });
};

exports.default = getImageDate;