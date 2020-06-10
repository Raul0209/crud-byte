'use strict'

const Person = require('../models/person.model');
const moment = require('moment');

//Funcion para crear una nueva persona
function createPerson(req, res) {
    var person = new Person();
    const parameters = req.body;

    Person.find({ dpi: parameters.dpi }).exec((err, response) => {

        if (err) return res.status(500).send({ error: 'error al contactar con la base de datos', descripcion: err });

        if (response.length == 0) {

            if (parameters.dpi && parameters.name && parameters.lastName && parameters.birthDate) {
                person.dpi = parameters.dpi;
                person.name = parameters.name;
                person.lastName = parameters.lastName;
                person.birthDate = parameters.birthDate;

                person.save((err, response) => {
                    if (err) return res.status(500).send({ error: 'Error al almacenar la persona en el servidor', descripcion: err });

                    return res.status(200).send({ almacenadoCorrectamente: 'El registro se ha almacenado correctamente' });
                })
            } else {
                return res.status(200).send({ noCampos: 'No has ingresado todos los campos' });
            }


        } else if (response.length > 0) {
            return res.status(200).send({ repetido: 'No puedes agregar dos veces un mismo numero de DPI' });
        }

    })
}

function getPerson(req, res) {
    const IDPERSON = req.params.id;

    Person.findById(IDPERSON).exec((err, response) => {
        if (err) return res.status(500).send({ error: "Error al contactar con la base de datos", descripcion: err });


        if (!response) {
            return res.status(200).send({ noPerson: 'No se ha encontrado la persona en la base de datos' });
        }

        return res.status(200).send({ person: response });
    })
}


function updatePerson(req, res) {
    const IDPERSON = req.params.id;
    const parameters = req.body;
    Person.findByIdAndUpdate(IDPERSON, parameters, { new: true }, (err, response) => {
        if (err) return res.status(500).send({
            error: 'Error al contactar con la base de datos',
            descripcion: err
        });

        if (!response) return res, status(200).send({ noPersona: 'No se ha encontrado la persona a actualizar' });

        return res.status(200).send({ actualizadoCorrectamente: 'El registro se actualizo satisfactoriamente' });
    })
}

function deletePerson(req, res) {
    const IDPERSON = req.params.id;

    Person.findByIdAndDelete(IDPERSON, (err, response) => {
        if (err) return res.status(500).send({ error: 'Error al contactar con l abase de datos', descripcion: err });

        if (!response) return res.status(200).send({ noPersona: 'No se ha encontrado la persona a actualizar' });

        return res.status(200).send({ eliminado: 'La persona fue eliminada correctamente' });
    })
}

function getPersons(req, res) {

    Person.find().lean().exec((err, response) => {
        if (err) return res.status(500).send({ error: 'Error al contactar con la base de datos', descripcion: err });

        if (response.length == 0) return res.status(200).send({ noPersons: 'No se han encontrado personas en la base de datos' });


        if (response.length > 0) {

            for (let x = 0; x < response.length; x++) {
                response[x].formatDate = moment(response[x].birthDate).utc().format('L');
            }


            return res.status(200).send({ persons: response });

        }

    })

}


module.exports = {
    createPerson,
    getPerson,
    getPersons,
    updatePerson,
    deletePerson
}