require('dotenv').config();

const importImages = require('./importImages').default;
const processData = require('./processData').default;

const prepareData = async () => {
  const importData = await importImages();
  processData(importData);
};

prepareData();

