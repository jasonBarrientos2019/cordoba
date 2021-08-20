const imageToBase64 = require('image-to-base64');


async function registerImages(template) {
    const regex = /\<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>/g;

    var m;

    do {
      m = regex.exec(template);
      if (m) {
        var url = m[1];

        var b64Template = await imageToBase64(__dirname+'/../templates/'+url);

        console.log(__dirname);
        template = template.replace(
          url,
          `data:image/png;base64,${b64Template}`
        );
      }
    } while (m);

    return template;
}

module.exports=registerImages;