
const {response,request}=require('express');
const Setup=require('./setup');
const setup=new Setup();
const registerImages=require("./registerImages");

const postPrint = (req=request, res=response, next) => {

  
    //  if (  req.body.document.format=="excel") {
    //    res.setHeader('Content-disposition', 'attachment; filename=file.xlsx');
    //    res.setHeader('Content-type', 'application/vnd.ms-excel');
    //  }
  
    setup.pagePool.acquire().then((page) => {
            print(page, req.body).then((file) => {
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

    async function print(page, body) {
      var build = await setup.templateProcessor.build(
        body.document.template,
        body.content
      );

      html=await registerImages(build);

      await page.setContent(html);
    
      return page.pdf({
        printBackground: true,
      });
    }


module.exports=postPrint;