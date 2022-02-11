const fs = require('fs');

const colors = require('colors');
class Cell {
  constructor(cellValue, contRow, contCol, sheet) {
    this.columns = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    this.sheet = sheet
    this.contRow = contRow;
    this.contCol = contCol;
    this.cellValue = cellValue;
    this.calcCell();
  }

  calcCell() {
    this.cell = `${this.columns[this.contCol]}${this.contRow}`;
    this.nextCol = parseInt(this.contCol) + 1;
  }

  //settings
  setColSpan(colspanValue) {
    this.colspan = true;
    let initCell = `${this.columns[this.contCol]}${this.contRow}`;
    let calcSpan = this.contCol + (parseInt(colspanValue) - 1);
    let lastCell = `${this.columns[calcSpan]}${this.contRow}`;

    this.cell = `${initCell}:${lastCell}`;
    this.nextCol += (parseInt(colspanValue) - 1);
  }

  setBg(bg,) {
    this.sheet.getCell(this.cell).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bg },
    };
  }

  setColor(color) {

    this.sheet.getCell(this.cell).font = {
      color: { argb: color }
    };

  }
  setAlign(textAlign) {
    this.sheet.getCell(this.cell).alignment = { horizontal: textAlign }
  }

  setBorder(borderColor) {

    this.sheet.getCell(this.cell).border = {
      top: { style: 'thin', color: { argb: borderColor } },
      left: { style: 'thin', color: { argb: borderColor } },
      bottom: { style: 'thin', color: { argb: borderColor } },
      right: { style: 'thin', color: { argb: borderColor } }
    };

  }
  setBorderTop(borderColor) {

    this.sheet.getCell(this.cell).border = {
      top: { style: 'thin', color: { argb: borderColor } }
    };

  }
  setBorderLeft(borderColor) {

    this.sheet.getCell(this.cell).border = {
      left: { style: 'thin', color: { argb: borderColor } }
    };

  }
  setBorderBottom(borderColor) {

    this.sheet.getCell(this.cell).border = {
      bottom: { style: 'thin', color: { argb: borderColor } }
    };

  }

  setBorderRight(borderColor) {

    this.sheet.getCell(this.cell).border = {
      right: { style: 'thin', color: { argb: borderColor } }
    };

  }

  setImg(src, wb) {


    this.img = true;

    try {
      this.imgSrc = wb.addImage({
        filename: `${__dirname}/../${src}`,
        extension: "png",
      });



    } catch (error) {
      throw `Error en carga de imagen \n${error}`
    }

  }

  //gettings
  getCell() {
    return this.cell;
  }

  getNextCol() {
    return this.nextCol;
  }

  insertCell() {
    let cell = this.cell;

    //img colspan
    if (this.img && this.colspan) {

      this.sheet.mergeCells(cell);
      this.sheet.addImage(this.imgSrc, cell);

    }
    if (!this.img && this.colspan) {
      this.sheet.mergeCells(cell);
      this.sheet.getCell(cell).value = this.cellValue;

    }
    if (!this.colspan && !this.img) {
      this.sheet.getCell(cell).value = this.cellValue;

    }
    if (!this.colspan && this.img) {
      this.sheet.mergeCells(`${cell}:${cell}`);
      this.sheet.addImage(this.imgSrc, `${cell}:${cell}`);
    }


  }
}

module.exports = Cell;
