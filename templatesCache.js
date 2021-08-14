const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const NodeCache = require("node-cache");
const templateCache = new NodeCache({ stdTTL: 60 * 5, checkperiod: 120 });

class TemplatesCache {
  constructor() {
   this.loadTemplates(".hbs");
  }

  loadTemplates(search) {
    //var EXTENSION = ".html";
    var targetFiles = fs.readdirSync("./templates/").filter(function(file) {
      return path
        .basename(file)
        .toLowerCase()
        .includes(search.toLowerCase()); //  === EXTENSION
    });
    
    for (let index = 0; index < targetFiles.length; index++) {
      const element = targetFiles[index];

      const template = fs.readFileSync(
        path.resolve(__dirname, "./templates/" + element),
        "utf-8"
      );

      this.set(element, template);
    }
  }

  get(template) {
    if (!templateCache.has(template)) {
      this.loadTemplates(template);
    }
    
    return templateCache.get(template);
  }

  async set(key, template) {
    templateCache.set(key, template);
  }
}
module.exports = TemplatesCache;
