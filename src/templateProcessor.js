const handlebars = require("handlebars");
const colors = require('colors')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio');
const { DateTime } = require("luxon");

var promisedHandlebars = require("promised-handlebars");
var Q = require("q");
var Handlebars = promisedHandlebars(handlebars, { Promise: Q.Promise });
const convertHtmlToXlsx = require('./convertHtmlToXlsx')

//registers
const { registerImagesPDF } = require("./controllers/registers/registerImages");
const { getContentPDF ,getContentXLSX,getCss} = require("./controllers/Utils/getContents");




let partials = [];

class TemplateProcessor {
  constructor() {
    this.registerHelpers();
  }
  // ############################ PDF ############################ 

  async buildPDF(nameTemplate, dataTemplate) {
    try {
      var templateContent = await getContentPDF(nameTemplate);

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
      
      var hb = Handlebars.compile(html);

      let hbResult = await hb(dataTemplate)


      let resultCss=await this.css(hbResult)

      var htmlBuild = await registerImagesPDF(resultCss);

      return htmlBuild;
    } catch (error) {
      return error;

    }

  }


  // ############################ XLSX ############################ 

  async buildXLSX(xlsxName, xlsxData) {

    try {

      var templateContent = await getContentXLSX(xlsxName);

      //TODO: await this.preLoadUtils();

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
      
      var hb = Handlebars.compile(html);

      let hbResult = await hb(xlsxData)


      var resultCss=await this.css(hbResult)

      // var htmlBuild = await registerImagesPDF(resultCss);

    } catch (error) {
      return error;

    }


    const xlsxResult=convertHtmlToXlsx(resultCss)

    // let work = new XlsxTemplate(xlsxContent);

    // let sheetNumber = 1;

    // work.substitute(sheetNumber, xlsxData);


    // let workBuild = work.generate();



    return xlsxResult;


  }


  // ############################ Partials ############################ 

  async registerPartials(template) {
    var matches = template.match(/{{>\s*[\w\.]+\s*}}/g);

    if (matches !== null) {

      for(var x in matches){

        var partialName = matches[x].match(/[\w\.]+/)[0];

        
      let findPartial = partials.includes(partialName);

        if (!findPartial) {


          var b64Template;

          try {
            if(partialName.indexOf("utils") != -1 ){
               b64Template = await getContentPDF("../utils/"+partialName);  
            }
            else{
              b64Template = await getContentPDF(partialName)
            }

          } catch (error) {

            throw new Error(`\n No se encontro el partial ${partialName}\n`.red);
          }

            partials.push(partialName)

            var nextMatch = b64Template.match(/{{>\s*[\w\.]+\s*}}/g);

            if(!nextMatch )
            {
              this.registerPartials(b64Template);
            }
            
            Handlebars.registerPartial(partialName, b64Template);
            

        }

      };
      
    }

  }

  async css(input){
    var $ = cheerio.load(input);
    var links = $("html").find("link[rel=stylesheet]");

    for (let index = 0; index < links.length; index++) {
        const element = $(links[index]);

        var css = await getCss(element.attr("href"));
        if(css instanceof Error)
          throw css;

        $('<style type="text/css"/>').text(css).prependTo($("head"));
        element.remove();
    }
   return $.html() 
  }
  
  async registerHelpers(){

    Handlebars.registerHelper("if_eq", (a, b, opts) => {
      if (a == b) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    });
    Handlebars.registerHelper("eval", (expr, options) => {
      var reg = new RegExp("\\${(\\S+)}", "g");
      var compiled = expr.replace(reg, function (match, pull) {
        return '"' + options.hash[pull] + '"';
      });
      var evaluated = eval(compiled);
      return evaluated;
    });

    Handlebars.registerHelper("date", (date, format, options) => {

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      let initialDate = '';
        if (date == "now") {
          initialDate = DateTime.fromJSDate(new Date()).setLocale('es');
          initialDate = initialDate.toFormat(format);
          if (format == 'MMMM') 
          {
            initialDate = capitalizeFirstLetter(initialDate)
          }

          return initialDate;
        } else {
          initialDate = DateTime.fromISO(date).setLocale('es');
          initialDate = initialDate.toFormat(format);
          if (format == 'MMMM') 
          {
            initialDate = capitalizeFirstLetter(initialDate)
          }

          return initialDate;
        }
      }
    );
  }


}


module.exports = TemplateProcessor;
