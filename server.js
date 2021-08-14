const os = require("os");
var express = require("express");
var path = require("path");

var fs = require("fs");

var bodyParser = require("body-parser");
var compression = require("compression");
const PagePool = require("./pagePool");
const DigitalSign = require("./digitalSign");
const TemplateProcessor = require("./templateProcessor");
const port = 3000;
const workbook = require("./converToExcel");

var pagePool;
var digitalSign;
var templateProcessor;

async function setup() {
  pagePool = new PagePool(os.cpus().length, 2);
  digitalSign = new DigitalSign();
  templateProcessor = new TemplateProcessor();
}

async function startService() {
  var app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(compression());

  return app;
}

async function print(page, body) {
  var html = await templateProcessor.build(
    body.document.template,
    body.content
  );

  await page.setContent(html);

  return page.pdf({
    printBackground: true,
  });
}

startService().then((app) => {
  app.post("/print", async (req, res, next) => {


    
      
  if (  req.body.document.format=="excel") {
    res.setHeader('Content-disposition', 'attachment; filename=file.xlsx');
    res.setHeader('Content-type', 'application/vnd.ms-excel');
  
    data=workbook(req.body.content);
   
     data.write('Response.xlsx', res);

  }
  else if (req.body.document.format=="pdf"){
  pagePool.acquire().then((page) => {
        print(page, req.body).then((file) => {
          pagePool.release(page);
          res.setHeader("Content-Type", "application/pdf");
          if (req.body.document.sign === true) {
            digitalSign.sign(file).then((signedPdf) => {
              res.send(signedPdf);
            });
          } else {
            res.send(file);
          }
        });
        
      });
  }
    



  });

  app.listen(port, () => {
    console.log("Server running on " + `http://localhost:${port}`);
  });
});

setup();
