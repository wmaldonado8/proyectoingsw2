const rethinkdb = require('rethinkdb-mock')
var r = require("rethinkdb");

var producto = require("../modelos/producto");
var kardex = require("../modelos/kardex");
// Replace `rethinkdbdash` with `rethinkdb-mock`
const mock = require('mock-require')
mock('rethinkdb-mock', rethinkdb)

// You must use the same database name as the code you're testing.
const db = rethinkdb({
    name: 'kardex' // The default value
})

guardarUser('Some test suite', () => {

    // Reset the database between suites.
    beforeAll(() => {
        db.init({
            users: [],
            friends: [],
        })

        // Optionally, load JSON into the database.
        db.load(__dirname, './data.json')
    })

    // Now create your tests...
})
generarKardex('Genrar Kardex', () => {


    beforeAll(() => {
        db.save().then(function (result) {
            console.log("Producto Guardado");
        }).catch(function (error) {
            console.log("Error al guardar producto "+error);
        })
    })


})