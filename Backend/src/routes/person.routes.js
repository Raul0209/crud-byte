'use strict'

//Importamos la libreria express
const express = require('express');

//Englobamos el enrutador en la variable
const api = express.Router();

const PersonController = require('../controllers/person.controller');

api.post('/person', PersonController.createPerson);
api.get('/person/:id', PersonController.getPerson);
api.get('/persons', PersonController.getPersons);
api.put('/person/:id', PersonController.updatePerson);
api.delete('/person/:id', PersonController.deletePerson);


module.exports = api;