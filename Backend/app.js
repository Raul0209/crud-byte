'use strict'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Rutas
const person_routes = require('./src/routes/person.routes')

//Configuramos el middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Le decimos al servidor las cabeceras y tipos de metodo que aceptara
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

//Configuramos el servidor para que pueda resolver las rutas
app.use('/api', person_routes);

module.exports = app