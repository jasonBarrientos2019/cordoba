const express = require('express');
const compression = require("compression");
//Configuracio de variables de entorno
require('dotenv').config()

const postPrint=require('../controllers/print');

class Server{

    constructor(){
        this.app= express();
        this.port= process.env.PORT;
        // this.usersPath='/api/user';

        //middlerware
        this.middlewares();
        //Rutas
        this.routes();
    }
    middlewares(){

        //parse to Json
        this.app.use(express.json());
        this.app.use(compression());

        //Directorio publico
        // this.app.use(express.static('public'));

    }
    listen(){
        this.app.listen(this.port,()=> {
        console.log(`Servidor corriendo en el puerto ${this.port}`);
    })}
    routes(){
        
      // this.app.use(this.usersPath,require('../routes/user.route'));
        
      this.app.post("/print",postPrint);

    }
 
}
module.exports=Server;