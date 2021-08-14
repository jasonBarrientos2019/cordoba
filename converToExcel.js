var excel = require('excel4node');
var workbook = new excel.Workbook();

var worksheet = workbook.addWorksheet('Sheet 1');

//estilos
var style = workbook.createStyle({
  font: {
    color: '#000000',
    size: 12
  },
  numberFormat: '$#,##0.00; ($#,##0.00); -'
});

var styleHead = workbook.createStyle({
    font: {
      color: '#ffffff',
      size: 12,
    },
    fill: {
        type: 'pattern', // the only one implemented so far.
        patternType: 'solid', // most common.
        bgColor: 'ffffff' // bgColor only applies on patternTypes other than solid.
    },
    alignment: {
        horizontal: 'center',
        vertical: 'center'
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -'
  });

  var styleTextCenter = workbook.createStyle({

    alignment: {
        horizontal: 'center',
        vertical: 'center'
    }
  });
 


//espacios vacios
worksheet.cell(1, 1, 4, 3, true).string(' ').style(style);
worksheet.cell(10,1,10,8,true).string('').style(style);


function createXslx (input) {

// cell(row,colum)

//titulo
worksheet.cell(2, 4, 2, 6, true).string('Listado de cuentas bancarias').style(styleTextCenter);

worksheet.cell(1,7, 1, 8, true).string('Página 1 de 1').style(styleTextCenter);
worksheet.cell(2,7, 2, 8, true).string(`Ejercicio: ${input.ejercicio}`).style(styleTextCenter);
//worksheet.cell(3,7, 3, 8, true).string('Fecha de Confección').style(styleTextCenter);

//info 
worksheet.cell(5,1,5,4,true).string(`Jurisdicción: ${input.jurisdiccion}`).style(style);
worksheet.cell(6,1,6,4,true).string(`U. Administrativa: ${input.unidadAdministrativa}`).style(style);
worksheet.cell(7,1,7,4,true).string(`N° Sucursal: ${input.sucursal}`).style(style);
worksheet.cell(8,1,8,4,true).string(`Cuenta: ${input.nroCuenta}`).style(style);
worksheet.cell(9,1,9,4,true).string(`Tipo de Cuenta: ${input.tipoCuenta}`).style(style);

//Cabecera de lista estatico
worksheet.cell(11,1,11,3,true).string('Unidad Administrativa').style(styleHead);
worksheet.cell(11,4).string('N° Sucursal ').style(styleHead);
worksheet.cell(11,5).string('N° Cuenta ').style(styleHead);
worksheet.cell(11,6).string('Estado ').style(styleHead);
worksheet.cell(11,7).string('Administración Central ').style(styleHead);
worksheet.cell(11,8).string('Nro. Apertura').style(styleHead);

let f=12;

let items=input.resumenCuentaCollection;

items.forEach(item => {
        worksheet.cell(f,1,f,3,true).string(item.unidadAdministrativaResumen).style(styleTextCenter);
        worksheet.cell(f,4).string(item.sucursalResumen).style(styleTextCenter);
        worksheet.cell(f,5).string(item.nroCuentaResumen).style(styleTextCenter);
        worksheet.cell(f,6).string(item.estadoResumen).style(styleTextCenter);
        worksheet.cell(f,7).string(item.adminCentralResumen).style(styleTextCenter);
        worksheet.cell(f,8).string(item.nroAperturaResumen).style(styleTextCenter);
        f++;
    });
   
   //imagen 
   
   worksheet.addImage({
       path: './templates/assets/images/gobierno.jpg',
       type: 'picture',
       position: {
         type: 'twoCellAnchor',
         from: {
           col: 1,
           colOff: 0,
           row: 1,
           rowOff: 0,
         },
         to: {
           col: 4,
           colOff: 0,
           row: 4,
           rowOff: 0,
         },
       },
     });

     
    return workbook
  }


module.exports=createXslx;
