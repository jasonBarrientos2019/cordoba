const imageToBase64 = require('image-to-base64');


async function registerImagesPDF(template) {
    const regex = /\<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>/g;

    var m;

    do {
      m = regex.exec(template);
      if (m) {
        var url = m[1];

        try {
          var pathFile=`${__dirname}\\..\\${url}`;
          var b64Template=await imageToBase64(pathFile);
          
        } catch (error) {
          console.log(`\n\n Error en la carga de la imagen ${url} \n`); 
        }
        template = template.replace(url,`data:image/png;base64,${b64Template}`);
      }
    } while (m);

    return template;
}
async  function registerImagesXLSX(xlsxContent){
  // <img id="imgLogo" src="../assets/images/gobierno.png" alt="" >

  const regex = /\${img:(.*)}/g;
var m;
var retorno;
  do {
      m = regex.exec(xlsxContent);
      if (m) {
        var url = m[1];

        console.log("if".red);
        try {
          var pathFile=`${__dirname}\\..\\${url}`;
          var b64Template=await imageToBase64(pathFile);
          
        } catch (error) {
          console.log(`\n\n Error en la carga de la imagen ${url} \n`); 
        }
         retorno = xlsxContent.replace( m[0],`${b64Template}`);
      }
    } while (m);

    return retorno;


}

module.exports={registerImagesPDF,registerImagesXLSX};