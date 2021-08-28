const handlebars = require("handlebars");
const colors=require('colors')
const fs=require('fs')
const path=require('path')
const XlsxTemplate =require("xlsx-template");
//registers
const {registerImagesPDF,registerImagesXLSX}=require("./controllers/registers/registerImages");
const registerHelpers=require("./controllers/registers/registerHelpers")

let partials=[];

class TemplateProcessor {
  constructor() {
    registerHelpers();
  }
  // ############################ PDF ############################ 

  async buildPDF(nameTemplate, dataTemplate) {

    const templateContent =this.getContentPDF(nameTemplate);

     await this.registerPartials(templateContent);


    var t=await registerImagesPDF(templateContent);

    var hb = handlebars.compile(t);

  
    return hb(dataTemplate);

  }  

   getContentPDF(nameTemplate){
    
    let pathFile=path.resolve(`${__dirname}\\templates_pdf\\${nameTemplate}.hbs`) 
    let fileContent=fs.readFileSync(pathFile,"utf-8");

    return fileContent;
  }

  // ############################ XLSX ############################ 

  async buildXLSX(xlsxName, xlsxData) {


    const xlsxContent =this.getContentXLSX(xlsxName);
    //registre imagenes

    let work = new XlsxTemplate(xlsxContent);

    let sheetNumber = 1;

    work.substitute(sheetNumber, xlsxData);


    let workBuild=work.generate();
        
      let file=Buffer.from(workBuild,'binary');


    return file;
    

  }


  getContentXLSX(xlsxName){
    let pathFile=path.resolve(`${__dirname}\\templates_xlsx\\${xlsxName}.xlsx`) 
    let fileContent=fs.readFileSync(pathFile);
    
    return fileContent;
  }

  // ############################ Partials ############################ 

  async registerPartials(template) {
    var matches = template.match(/{{>\s*[\w\.]+\s*}}/g);

    if (matches !== null) {

      template.match(/{{>\s*[\w\.]+\s*}}/g).map((x) => {
        var partialName = x.match(/[\w\.]+/)[0];

        let partialCheck=partials.includes(partialName);

        if(!partialCheck){
          let contentFile;

          try {
             contentFile= this.getContentPDF(partialName)

             handlebars.registerPartial(partialName,contentFile );
                partials.push(partialName)
          } catch (error) {

              throw new Error(`\n No se encontro el partial ${partialName}\n`.red); 
          }
          this.registerPartials(contentFile);

        }
        });
    }

  }

}


module.exports = TemplateProcessor;
