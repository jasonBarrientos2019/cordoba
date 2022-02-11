const path = require('path');
const fs = require('fs');

async function getContentPDF(nameTemplate) {

  let pathFile = path.resolve(`${__dirname}/../../templates_pdf/${nameTemplate}.hbs`)
  let fileContent = fs.readFileSync(pathFile, "utf-8");

  return fileContent;
}

async function getContentXLSX(xlsxName) {
  let pathFile = path.resolve(`${__dirname}/../../templates_xlsx/${xlsxName}.hbs`)
  let fileContent = fs.readFileSync(pathFile);

  return fileContent;
}


async function getCss(nameCSSFile) {

  let pathFile = path.resolve(`${__dirname}/../../${nameCSSFile}`)
  let fileContent = fs.readFileSync(pathFile, "utf-8");

  return fileContent;
}

async function getFont(fontName) {
  let pathFile = path.resolve(`${__dirname}/../${fontName}`)
  let fileContent = fs.readFileSync(pathFile, "base64");
  return fileContent;
}

module.exports = { getContentPDF, getContentXLSX, getCss ,getFont}