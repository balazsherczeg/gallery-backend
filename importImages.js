const fs = require('fs');
const isImage = require('is-image');

const ExifImage = require('exif').ExifImage;

const getImageFocalLength = (image) => {
  return new Promise((resolve, reject) => {
    new ExifImage({image}, (error, {exif}) => {
      if (error) reject(error);
      return resolve(exif.FocalLengthIn35mmFormat);
    });
  });
};

const getDominantColor = require('./getDominantColor').default;
const getImageDate = require('./getImageDate').default;
const resizeImage = require('./resizeImage').default;
const getBaseName = require('./utils').getBaseName;
const readImageDataFile = require('./utils').readImageDataFile;

const INCOMING = './incoming/';
const PUBLIC = './public/';
const imageDataFile = process.env.PUBLIC + 'imageData.json'

const getImageData = () => {
  if (fs.existsSync(imageDataFile)) {
    const rawImageData = fs.readFileSync(imageDataFile);
    return JSON.parse(rawImageData);
  }
  return {};
}

const getFiles = () => fs.readdirSync(INCOMING).filter((file) => isImage(INCOMING + file));

const getImportables = (imageData, files) => {
  const importedImages = {}
  Object.keys(imageData).forEach((id) => {
    importedImages[id] = true;
  });
  return files.filter((file) => !importedImages[getBaseName(file)]);
};

const getDeletables = (imageData, files) => {
  const existingFiles = {};
  files.forEach((file) => {
    existingFiles[getBaseName(file)] = true;
  });
  return Object.keys(imageData).filter((id) => !existingFiles[id]);
};

const importImages = async () => {
  const imageData = getImageData();
  const files = getFiles();

  files.forEach(async (file) => {
    const f = await getImageFocalLength(INCOMING + file);
    fs.appendFile('message.txt', `${f}\n`, () => {})
  });

  const importables = getImportables(imageData, files);
  const deletables = getDeletables(imageData, files);

  // Remove image data for images that no longer exist
  deletables.forEach((id) => delete imageData[id]);

  // Add image data for new images
  for (let i = 0; i < importables.length; i++) {
    const file = importables[i];
    const id = getBaseName(file);

    imageData[id] = {};

    const date = await getImageDate(INCOMING + file);
    imageData[id].date = date;

    const sources = await resizeImage(file);
    imageData[id].sources = sources;

    const aResizedImage = PUBLIC + imageData[id].sources[Object.keys(imageData[id].sources)[0]].src;
    const color = getDominantColor(aResizedImage);
    imageData[id].color = color;
  }

  fs.writeFile(imageDataFile, JSON.stringify(imageData), (error) => {
    if (error) throw error;
  });

  return imageData;
}

exports.default = importImages;