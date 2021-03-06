
const {response,request}=require('express');
const Setup=require('./settings/setup');
const setup=new Setup();

const postPrint = (req=request, res=response, next) => {

 let format= req.body.document.format

    

    setup.pagePool.acquire().then(async (page) => {
      if (format=="pdf") {

      printPDF(page, req.body).then((file) => {
              setup.pagePool.release(page);
            
              res.setHeader("Content-Type", "application/pdf");
              if (req.body.document.sign === true) {
                setup.digitalSign.sign(file).then((signedPdf) => {
                  res.send(signedPdf);
                });
              } else {
                res.send(file);
              }
            });
          }
      else if (format=="xlsx"){

        printXLSX(page, req.body).then((file) => {
          setup.pagePool.release(page);
          res.setHeader("Content-Disposition",`attachment; filename=${req.body.document.template}.xlsx`);     
     
        
            res.send(file);
       
        });

      }

          });
    }

    async function printPDF(page, body) {

      //Se obtiene del request el nombre y variables a usar
      let templateName=body.document.template
      let templaetData=body.content
      
      var build = await setup.templateProcessor.buildPDF(templateName,templaetData);

      await page.setContent(build);
    
      return page.pdf({
        preferCSSPageSize: true,
        printBackground: true
      });

    }

    async function printXLSX(page, body) {

      //Se obtiene del request el nombre y variables a usar
      let templateName=body.document.template
      let templaetData=body.content
      var build = await setup.templateProcessor.buildXLSX(templateName,templaetData);
      await page.setContent(build);
      return build;
    }



module.exports=postPrint;