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

// EXPORT

// const INCOMING = './incoming/';
// const files = fs.readdirSync(INCOMING);
// console.log(files);


// const d = require('./export-data').data;
// const e = [...d];
// e.sort((a, b) => {
//   if (a.date < b.date) {
//     return -1;
//   }
//   if (a.date > b.date) {
//     return 1;
//   }
//   return 0;});

// e.forEach(({src, caption}, index) => {
//   if (!fs.existsSync(INCOMING + path.basename(src))) {
//     console.log(index + 1, ' ', caption, src)
//   }
// });

// const getBaseName = require('./utils').getBaseName;
// const f = [];
// e.forEach(({
//   caption,
//   date,
//   location,
//   src,
// }) => {
//   f.push({
//     id: getBaseName(src),
//     src,
//     caption,
//     date,
//     location,
//   });
// });
// const yaml = require('js-yaml')
// console.log(yaml.dump(f));

// const yaml = require('js-yaml')
// const fileContents = fs.readFileSync(INCOMING + 'info/images/india.yml', 'utf8');
// const e = yaml.load(fileContents);
// e.forEach(({id, caption, src}, index) => {
//   if (!fs.existsSync(INCOMING + id + '.jpg')) {
//     console.log(index + 1, ' ', caption, path.basename(src))
//   } else {
//     fs.rename(INCOMING + id + '.jpg', INCOMING + 'done/' + id + '.jpg', function (err) {
//       if (err) throw err
//       console.log('Successfully renamed - AKA moved!')
//     })
//   }
// });





http.createServer((request, response) => {
  const filePath = request.url;

  if (filePath == '/') {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end();
  }

  fs.readFile(PUBLIC + filePath, function(error, content) {
    if (error) {
      if(error.code == 'ENOENT') {
        fs.readFile('./404.html', function(error, content) {
          response.writeHead(404, { 'Content-Type': 'text/html' });
          response.end(content, 'utf-8');
        });
      } else {
        response.writeHead(500);
        response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
      }
    } else {
      const {contentType, gzippable} = getRequestContentType(filePath);

      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
      response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
      response.setHeader('Access-Control-Allow-Credentials', true); // If needed

      if (gzippable) {
        response.writeHead(200, {'Content-Type': contentType, 'Content-Encoding': 'gzip'});
        const buffer = new Buffer(content, 'utf-8');
        zlib.gzip(buffer, function (_, result) {
          response.end(result, 'utf-8');
        });
      } else {
        response.writeHead(200, {'Content-Type': contentType});
        response.end(content, 'utf-8');
      }
    }
  });
}).listen(8080);
