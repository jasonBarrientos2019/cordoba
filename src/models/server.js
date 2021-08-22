const express = require('express');
const compression = require("compression");
//Configuracio de variables de entorno
require('dotenv').config()

const postPrint=require('../controllers/print');

class Server{

    constructor(){
        this.app= express();
        this.port= process.env.PORT;
        this.appPath='/print';

        //middlerware
        this.middlewares();
        //Rutas
        this.routes();
    }
    middlewares(){

        //parse to Json
        this.app.use(express.json());
        this.app.use(compression());

    }
    listen(){
        this.app.listen(this.port,()=> {
        console.log(`Servidor corriendo en el puerto ${this.port}`);
    })}
    routes(){
                
      this.app.post(this.appPath,postPrint);

    }
 
}
module.exports=Server;