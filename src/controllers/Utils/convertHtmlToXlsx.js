const cheerio = require('cheerio');
const ExcelJS = require('exceljs');
const Cell = require('../class/Cell');

function convertHtmlToXlsx(html) {

  const workbook = new ExcelJS.Workbook();

  workbook.creator = 'Ayi Group';
  workbook.created = new Date();


  const sheet = workbook.addWorksheet('My Sheet');

  sheet.properties.defaultRowHeight = 30;
  sheet.properties.defaultColWidth = 30;
  let contRow = 1;
  const $ = cheerio.load(html);
  let tables = $('table')


  tables.each((idx, table) => {

    // var tableName = $(table).attr('name')
    var rows = $(table).find("tr")

    rows.each((idx, row) => {
      var col = $(row).find("td")
      let contColm = 0

      let bgRow = $(row).attr('background')
      let colorRow = $(row).attr('color')
      let textAlignRow = $(row).attr('text-align')

      let rowBorder = $(row).attr('border')
      let rowBorderLeft = $(row).attr('border-l')
      let rowBorderBottom = $(row).attr('border-b')
      let rowBorderRight = $(row).attr('border-r')
      let rowBorderTop = $(row).attr('border-t')


      // for para las columnas
      col.each((idx, value) => {

        let cellValue = $(value).text()
        let colspan = $(value).attr('colspan')
        let id = $(value).attr('id')
        let bgCell = $(value).attr('background')
        let colorCell = $(value).attr('color')
        let textAlignCell = $(value).attr('text-align')

        let border = $(value).attr('border')
        let borderLeft = $(value).attr('border-l')
        let borderBottom = $(value).attr('border-b')
        let borderRight = $(value).attr('border-r')
        let borderTop = $(value).attr('border-t')

        let cell = new Cell(cellValue, contRow, contColm, sheet);

        if (colspan) {
          cell.setColSpan(colspan);
        }

        if (id == "img") {
          var src = $(value).find("img").attr('src')
          cell.setImg(src, workbook);
        }
        //settings Row
        if (bgRow) {
          cell.setBg(bgRow);
        }

        if (colorRow) {
          cell.setColor(colorRow);

        }
        if (textAlignRow) {
          cell.setAlign(textAlignRow)
        }
        //row BORDER
        if (rowBorder) {
          cell.setBorder(rowBorder);
        }
        if (rowBorderLeft) {
          cell.setBorderLeft(rowBorderLeft);
        }
        if (rowBorderBottom) {
          cell.setBorderBottom(rowBorderBottom);
        }
        if (rowBorderRight) {
          cell.setBorderRight(rowBorderRight);
        }
        if (rowBorderTop) {
          cell.setBorderTop(rowBorderTop);
        }



        //cell settings
        if (bgCell) {
          cell.setBg(bgCell);
        }
        if (colorCell) {
          cell.setColor(colorCell);

        }
      if (textAlignCell) {
          cell.setAlign(textAlignCell)
        }


        //cell broder
        if (border) {
          cell.setBorder(border);
        }
        if (borderLeft) {
          cell.setBorderLeft(borderLeft);
        }
        if (borderBottom) {
          cell.setBorderBottom(borderBottom);
        }
        if (borderRight) {
          cell.setBorderRight(borderRight);
        }
        if (borderTop) {
          cell.setBorderTop(borderTop);
        }



        contColm = cell.getNextCol();
        cell.insertCell();

      })
      contRow++

    })

  })

  // workbook.xlsx.writeFile("out.xlsx");
  const buffer = workbook.xlsx.writeBuffer();

  return buffer



}


module.exports = convertHtmlToXlsx;