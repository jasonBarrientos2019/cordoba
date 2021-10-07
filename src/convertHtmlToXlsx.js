const cheerio = require('cheerio');
const ExcelJS = require('exceljs');
const Cell=require('./Cell');

function convertHtmlToXlsx(html) {
    
const workbook = new ExcelJS.Workbook();

workbook.creator = 'Ayi Group';
workbook.created = new Date();
const sheet = workbook.addWorksheet('My Sheet');


let contRow = 1;
const $ = cheerio.load(html);
let tables = $('table')


tables.each((idx, table) => {

  // var tableName = $(table).attr('name')
  var rows = $(table).find("tr")

  rows.each((idx, row) => {
    var col = $(row).find("td")
    let contColm = 0
    
    let bg = $(row).attr('background')
    let color = $(row).attr('color')
    let textAlign = $(row).attr('text-align')

    // for para las columnas
    col.each((idx, value) => {

      let cellValue = $(value).text()
      let colspan = $(value).attr('colspan')
      let id = $(value).attr('id')

      let cell= new Cell(cellValue,contRow,contColm,sheet);

      if (colspan) {
        cell.setColSpan(colspan);
      }

      if(id=="img"){
        var src = $(value).find("img").attr('src')
        cell.setImg(src,workbook);
      }
       if(bg){
         cell.setBg(bg);
       }
       if(color){
        cell.setColor(color);

       }
       if(textAlign){
         cell.setAlign(textAlign)
       }

      contColm=cell.getNextCol();
      cell.insertCell();

    })
    contRow++

  })

})

workbook.xlsx.writeFile("out.xlsx");
const buffer =  workbook.xlsx.writeBuffer();

return buffer



}


module.exports=convertHtmlToXlsx;