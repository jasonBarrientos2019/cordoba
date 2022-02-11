const os = require("os");
const PagePool = require("./pagePool");
const DigitalSign = require("./digitalSign");
const TemplateProcessor = require("../templateProcessor");

class Setup{
    constructor(){
        this.pagePool = new PagePool(os.cpus().length, 2);
        this.digitalSign = new DigitalSign();
        this.templateProcessor = new TemplateProcessor();
    }
}

module.exports=Setup;


