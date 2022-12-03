const sharp = require('sharp');
const path = require('path');
const getExtension = require('./utils').getExtension;
const getBaseName = require('./utils').getBaseName;
const sizeOf = require('image-size');

const {INCOMING, PUBLIC} = process.env;

const sizes = [200, 400, 1200, 2000];

const resizeToSize = (img, size) => {
  const fileName = `${getBaseName(img)}-${size}${getExtension(img)}`;
  const toUrl = `${PUBLIC}${fileName}`;

  return new Promise((resolve, reject) => {
    sharp(INCOMING + img)
      .rotate()
      .resize(size)
      .jpeg({
        progressive: true,
      })
      .toFile(
        toUrl,
        (error, {width, height}) => {
          if (error) reject(error);
          return resolve({width, height, src: fileName});
        }
      );
  });
};

const copyOriginal = (img, size) => {
  const fileName = `${getBaseName(img)}-${size}${getExtension(img)}`;
  const toUrl = `${PUBLIC}${fileName}`;

  return new Promise((resolve, reject) => {
    sharp(INCOMING + img)
      .rotate()
      .jpeg({
        progressive: true,
      })
      .toFile(
        toUrl,
        (error, {width, height}) => {
          if (error) reject(error);
          return resolve({width, height, src: fileName});
        }
      );
  });
}

const resizeImage = async (img) => {
  const data = {};
  const {width: originalWidth} = sizeOf(INCOMING + img);

  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    if (originalWidth >= size) {
      data[size] = await resizeToSize(img, size);
    }
  }

  if (sizes.indexOf(originalWidth) == -1) {
    data[originalWidth] = await copyOriginal(img, originalWidth);
  }

  return data;
};

exports.default = resizeImage;
