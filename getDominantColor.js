const ColorThief = require('color-thief');
const rgbHex = require('rgb-hex');

// https://stackoverflow.com/questions/4658468/choosing-the-most-colorful-color-in-javascript

const rgbtoHsv = ([r, g, b]) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let v= max;

  if (max != min) {
    const d = max - min;
    s = d / max;
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
  }

  return [Math.round(h * 60), Math.round(s * 100), Math.round(v)];
}

const sortByColorfulness = (a, b) => {
  const [, s1, v1] = rgbtoHsv(a);
  const [, s2, v2] = rgbtoHsv(b);
  return  (s2 + v2) - (s1 + v1);
}

const colorThief = new ColorThief();

const getDominantColor = (img) => {
  const palette = colorThief.getPalette(img);
  palette.sort(sortByColorfulness);
  return '#' + rgbHex(...palette[0]);
}

exports.default = getDominantColor;