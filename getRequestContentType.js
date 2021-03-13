const path = require('path');

const getRequestContentType = (filePath) => {
  const extname = String(path.extname(filePath)).toLowerCase();

  const mimeTypes = {
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };

  const contentType = mimeTypes[extname];
  const gzippable = contentType === 'application/json';

  return {
    contentType,
    gzippable,
  }
}

exports.default = getRequestContentType;
