const path = require('path');

const getExtension = (fileName) => path.extname(fileName);
const getBaseName = (fileName) => {
  return path.basename(fileName, getExtension(fileName));
}

exports.getExtension = getExtension;
exports.getBaseName = getBaseName;

