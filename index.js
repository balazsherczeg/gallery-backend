require('dotenv').config();
const http = require('http');
const zlib = require('zlib');
const path = require('path');
const fs = require('fs');

const importImages = require('./importImages').default;
const processData = require('./processData').default;
const getRequestContentType = require('./getRequestContentType').default;

const {PUBLIC, INCOMING} = process.env;

const prepareData = async () => {
  const importData = await importImages();
  processData(importData);
};

prepareData();

// http.createServer((request, response) => {
//   const filePath = request.url;

//   if (filePath == '/') {
//     response.writeHead(200, {'Content-Type': 'text/html'});
//     response.end();
//   }

//   fs.readFile(PUBLIC + filePath, function(error, content) {
//     if (error) {
//       if(error.code == 'ENOENT') {
//         fs.readFile('./404.html', function(error, content) {
//           response.writeHead(404, { 'Content-Type': 'text/html' });
//           response.end(content, 'utf-8');
//         });
//       } else {
//         response.writeHead(500);
//         response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
//       }
//     } else {
//       const {contentType, gzippable} = getRequestContentType(filePath);

//       response.setHeader('Access-Control-Allow-Origin', '*');
//       response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
//       response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
//       response.setHeader('Access-Control-Allow-Credentials', true); // If needed

//       if (gzippable) {
//         response.writeHead(200, {'Content-Type': contentType, 'Content-Encoding': 'gzip'});
//         const buffer = new Buffer(content, 'utf-8');
//         zlib.gzip(buffer, function (_, result) {
//           response.end(result, 'utf-8');
//         });
//       } else {
//         response.writeHead(200, {'Content-Type': contentType});
//         response.end(content, 'utf-8');
//       }
//     }
//   });
// }).listen(8080);
