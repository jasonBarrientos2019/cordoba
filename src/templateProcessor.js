const handlebars = require("handlebars");
const colors=require('colors')
const fs=require('fs')
const path=require('path')

//registers
const registerImages=require("./controllers/registers/registerImages");
const registerHelpers=require("./controllers/registers/registerHelpers")

class TemplateProcessor {
  constructor() {
    registerHelpers();
  }

  async build(nameTemplate, dataTemplate) {

    const templateContent =this.getTemplateContent(nameTemplate);

     await this.registerPartials(templateContent);


    var t=await registerImages(templateContent);

    var hb = handlebars.compile(t);

    return hb(dataTemplate);
  }
  
  // ############################ Partials ############################ 

  async registerPartials(template) {
    var matches = template.match(/{{>\s*[\w\.]+\s*}}/g);

    if (matches !== null) {
      template.match(/{{>\s*[\w\.]+\s*}}/g).map((x) => {
        var partialName = x.match(/[\w\.]+/)[0];
        handlebars.registerPartial(
          partialName,
          this.getTemplateContent(partialName)
        );
        this.registerPartials(this.getTemplateContent(partialName))
        });
    }

  }
  // ############################ getTemplateContent ############################ 
  
  getTemplateContent(nameTemplate){

    return fs.readFileSync(
      path.resolve(__dirname, "./templates/" + nameTemplate),
      "utf-8"
    );
  }

    
}

module.exports = TemplateProcessor;
