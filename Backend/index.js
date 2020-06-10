'use strict'

const app = require('./app');
const mongoose = require('mongoose');

app.set('port', process.env.PORT || 3000);

mongoose.connect('mongodb://localhost:27017/CRUD', { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {

    if (err) {
        throw err
    } else {
        console.log('Conexion a la base de datos realizada correctamente');
        app.listen(app.get('port'), () => {
            console.log(`El servidor esta corriendo en el puerto: '${app.get('port')}'`);
        })
    }

})