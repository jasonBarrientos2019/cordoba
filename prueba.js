var XLSX = require('XLSX');

var wb = XLSX.utils.book_new();
wb.Props = {
    Title: "SheetJS Tutorial",
    Subject: "Test",
    Author: "Red Stapler",
    CreatedDate: new Date(2017,12,19)
};
wb.SheetNames.push("Test Sheet");
var ws_data = [['hello' , 'world']];  //a row with 2 columns

var ws = XLSX.utils.aoa_to_sheet(ws_data);
wb.Sheets["Test Sheet"] = ws;



var result = XLSX.utils.sheet_to_txt(ws, { type: "string" });



console.log(result);
