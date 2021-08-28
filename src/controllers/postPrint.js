
const {response,request}=require('express');
const Setup=require('./setup');
const setup=new Setup();

const postPrint = (req=request, res=response, next) => {

  
    //  if (  req.body.document.format=="excel") {
    //    res.setHeader('Content-disposition', 'attachment; filename=file.xlsx');
    //    res.setHeader('Content-type', 'application/vnd.ms-excel');
    //  }
    

    setup.pagePool.acquire().then((page) => {
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
            
          });
    }

    async function printPDF(page, body) {

      //Se obtiene del request el nombre y variables a usar
      let templateName=body.document.template
      let templaetData=body.content
      
      var build = await setup.templateProcessor.buildPDF(templateName,templaetData);
      
      await page.setContent(build);
    
      return page.pdf({
        PDFBackground: true,
      });
      
    }


module.exports=postPrint;