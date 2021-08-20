
const {response,request}=require('express');
const Setup=require('./setup');
const setup=new Setup();


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
      var html = await setup.templateProcessor.build(
        body.document.template,
        body.content
      );
    
      await page.setContent(html);
    
      return page.pdf({
        printBackground: true,
      });
    }


  async function registerImages(template) {
      const regex = /\<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>/g;
  
      var m;
  
      do {
        m = regex.exec(template);
        if (m) {
          var url = m[1];
  
          var b64Template = await fileCacheService.get(url);
  
          template = template.replace(
            url,
            `data:image/png;base64,${b64Template}`
          );
        }
      } while (m);
  
      return template;
  }




module.exports=postPrint;