require('dotenv').config();
const fs = require('fs');
const yaml = require('js-yaml')
const getBaseName = require('./utils').getBaseName;

const {INCOMING, BASE_URL} = process.env;

const readYaml = (path) => {
  try {
    const fileContents = fs.readFileSync(INCOMING + 'info/' + path, 'utf8');
    return yaml.load(fileContents);
  }
  catch (error) {
    console.log(error)
  }
}

const categories = readYaml('categories.yml');
const tags = readYaml('tags.yml');

const getAllImageInfo = () => {
  const files = fs.readdirSync(INCOMING + 'info/images/');
  let allImageInfo = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const categoryId = categories.find(({slug}) => slug === getBaseName(file)).id;
    const imagesInCategory = readYaml(`images/${file}`);
    imagesInCategory.forEach((imageInfo) => {
      allImageInfo.push({
        ...imageInfo,
        category: categoryId,
      });
    });
  }

  return allImageInfo;
};

const processSources = (sources) => {
  const nextSources = {}
  Object.keys(sources).forEach((size) => {
    nextSources[size] = {
      ...sources[size],
      src: BASE_URL + sources[size].src,
    };
  });
  return nextSources;
};

const processData = (importData) => {
  const allImageInfo = getAllImageInfo();
  const ddd = [];

  allImageInfo.forEach(({
    caption,
    location,
    id,
    date: manualDate,
    category,
  }) => {
    if (importData[id]) {
      const {
        color,
        date,
        sources,
      } = importData[id];

      ddd.push({
        id,
        meta: {
          color,
          caption,
          date: manualDate || date,
          location,
        },
        sources: processSources(sources),
        category,
      });
    } else {
      console.log("Image file missing: ", id);
    }
  });

  const allData = {
    categories,
    tags,
    items: ddd,
  }

  fs.writeFile(process.env.PUBLIC + 'data.json', JSON.stringify(allData), (error) => {
    if (error) throw error;
  });
};

exports.default = processData;