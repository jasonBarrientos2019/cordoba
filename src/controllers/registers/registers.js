const imageToBase64 = require('image-to-base64');
const {getFont}=require('../Utils/getContents');
const fs = require('fs');
async function registerImagesPDF(template) {
    const regex = /\<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>/g;

    var m;

    do {
      m = regex.exec(template);
      if (m) {
        var url = m[1];

        try {
          var pathFile=`${__dirname}/../${url}`;
          var b64Template=await imageToBase64(pathFile);
          
        } catch (error) {
          console.log(`\n\n Error en la carga de la imagen ${url} \n`); 
        }
        template = template.replace(url,`data:image/png;base64,${b64Template}`);
      }
    } while (m);

    return template;
}

async function registerFonts(template) {
  const regex = /url\((.*?)\)[\n\r\s]+format\((\'|\")(.*?)(\'|\")\)/g;

  var m;
  do {
    m = regex.exec(template);
    if (m) {
      var url = m[1];

      try {
        
        var b64Template=await getFont(url);
        
      } catch (error) {
        console.log(`\n\n Error en la carga de Fuente ${url} \n`); 
      }
      template = template.replace(url,`data:font/${m[3]};charset=utf-8;base64,${b64Template}`);
    }
  } while (m);

  return template;
}


module.exports={registerImagesPDF,registerFonts};