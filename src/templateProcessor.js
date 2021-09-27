const handlebars = require("handlebars");
const colors = require('colors')
const fs = require('fs')
const path = require('path')
const XlsxTemplate = require("xlsx-template");
const cheerio = require('cheerio');

//registers
const { registerImagesPDF } = require("./controllers/registers/registerImages");
const registerHelpers = require("./controllers/registers/registerHelpers")

let partials = [];

class TemplateProcessor {
  constructor() {
    registerHelpers();
  }
  // ############################ PDF ############################ 

  async buildPDF(nameTemplate, dataTemplate) {
    try {
      var templateContent = await this.getContentPDF(nameTemplate);

      //TODO: await this.preLoadUtils();

      await this.registerPartials(templateContent);


    } catch (error) {
      return error;

    }

    let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <link rel="stylesheet" href="css/base.css">

    </head>
    <body>
        ${templateContent}
    </body>
    </html>`

    try {      
      
      var hb = handlebars.compile(html);

      let hbResult = await hb(dataTemplate)


      let resultCss=await this.css(hbResult)

      var htmlBuild = await registerImagesPDF(resultCss);

      return htmlBuild;
    } catch (error) {
      return error;

    }

  }

  async getContentPDF(nameTemplate) {

    let pathFile = path.resolve(`${__dirname}\\templates_pdf\\${nameTemplate}.hbs`)
    let fileContent = fs.readFileSync(pathFile, "utf-8");

    return fileContent;
  }

  async getCss(nameCSSFile) {

    let pathFile = path.resolve(`${__dirname}\\${nameCSSFile}`)
    let fileContent = fs.readFileSync(pathFile, "utf-8");

    return fileContent;
  }

  // ############################ XLSX ############################ 

  async buildXLSX(xlsxName, xlsxData) {


    const xlsxContent = this.getContentXLSX(xlsxName);
    //registre imagenes

    let work = new XlsxTemplate(xlsxContent);

    let sheetNumber = 1;

    work.substitute(sheetNumber, xlsxData);


    let workBuild = work.generate();

    let file = Buffer.from(workBuild, 'binary');


    return file;


  }


  getContentXLSX(xlsxName) {
    let pathFile = path.resolve(`${__dirname}\\templates_xlsx\\${xlsxName}.xlsx`)
    let fileContent = fs.readFileSync(pathFile);

    return fileContent;
  }

  // ############################ Partials ############################ 

  async registerPartials(template) {
    var matches = template.match(/{{>\s*[\w\.]+\s*}}/g);

    if (matches !== null) {

      template.match(/{{>\s*[\w\.]+\s*}}/g).map((x) => {
        var partialName = x.match(/[\w\.]+/)[0];

        let partialCheck = partials.includes(partialName);

        if (!partialCheck) {
          let contentFile;

          try {
            contentFile = this.getContentPDF(partialName)

            handlebars.registerPartial(partialName, contentFile);
            partials.push(partialName)
          } catch (error) {

            throw new Error(`\n No se encontro el partial ${partialName}\n`.red);
          }
          this.registerPartials(contentFile);

        }
      });
    }

  }

  async css(input){
    var $ = cheerio.load(input);
    var links = $("html").find("link[rel=stylesheet]");

    for (let index = 0; index < links.length; index++) {
        const element = $(links[index]);

        var css = await this.getCss(element.attr("href"));
        if(css instanceof Error)
          throw css;

        $('<style type="text/css"/>').text(css).prependTo($("head"));
        element.remove();
    }
   return $.html() 
  }

}


module.exports = TemplateProcessor;
