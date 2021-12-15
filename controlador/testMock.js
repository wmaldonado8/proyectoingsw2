'use strict';
const rethinkdb = require('rethinkdb-mock')
var r = require("rethinkdb");
var cliente = require("../modelos/cliente");
// Replace `rethinkdbdash` with `rethinkdb-mock`
const mock = require('mock-require')
var clienteController = require('../controlador/ClienteController');
var clienteController = new clienteController();
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));
mock('rethinkdb-mock', rethinkdb)

/*describe('Genrar Kardex', () => {
    db.init({
        Cliente: [{
            apellidos: "Vasquez",
            cedula: "1150214375",
            direccion: "Loja",
            external_id: "8600ea68-0bd7-4dc7-9993-dc82e73beacd",
            id: "c9225d9b-1f47-478c-91a7-7ae46f2bdccc",
            nombres: "Luis",
            telefono: "255461"
        }]
    })
});*/

/*describe('Ethereum blockchain grabber', () => {
    it('should insert event from web3 contract to rethinkdb correctly', async () => {
       // const db = rethinkdb({ name: 'ethereum' })
        const db = rethinkdb({
            name: 'kardexssashshjhjhjdshsdhjdshj' // The default value
        });
        db.init({
            Cliente: [{
                apellidos: "Vasquez",
                cedula: "1150214375",
                direccion: "Loja",
                external_id: "8600ea68-0bd7-4dc7-9993-dc82e73beacd",
                id: "c9225d9b-1f47-478c-91a7-7ae46f2bdccc",
                nombres: "Luis",
                telefono: "255461"
            },{
                apellidos: "Minga",
                cedula: "2222222222",
                direccion: "San lucas",
                external_id: "8600ea68-0bd7-4dc7-9993-dc82e73beacd",
                id: "c9225d9b-1f47-478c-91a7-7ae46f2bdccc",
                nombres: "Angel",
                telefono: "255461"
            },{
                apellidos: "Minga",
                cedula: "1104695190",
                direccion: "Loja",
                external_id: "8600ea68-0bd7-4dc7-9993-dc82e73beacd",
                id: "c9225d9b-1f47-478c-91a7-7ae46f2bdccc",
                nombres: "Yukas",
                telefono: "255461"
            }]
        })
        //expect(db._tables.Cliente.length).to("0","Error");
        expect(db._tables.Cliente).lengthOf(1,"Error al insertar");
        //expect(db._tables.Cliente).all;
    })
})*/

/*describe('Ethereum blockchain grabber', () => {

    it('should insert event from web3 contract to rethinkdb correctly', async () => {
        // const db = rethinkdb({ name: 'ethereum' })
        const db = rethinkdb({
            name: 'kardex' // The default value
        });
        clienteControll.guardarTest(null);
        expect(db._tables.Cliente).null("Null", "Error no puede ser null")
    })
    it.skip('should see the updated value in the object', function (done) {
        yaas.document.get(process.env.ALLUSERSPROFILE, testType, documentIds[1], {})
            .then(function (res) {
                res.body.should.be.an.Object();
                should.equal(res.body.testName, 'Dylan');
                should.equal(res.body.testID, 666);
                should.equal(res.body.id, documentIds[1]);
                done();
            })
            .catch(done);
    });
})*/

/*describe('User', function() {
    describe('#save()', function() {
        it('should save without error', function(done) {
            var cliente1 = new cliente(
                {
                    apellidos: "Minga",
                    cedula: "1104695190",
                    direccion: "Loja",
                    external_id: "8600ea68-0bd7-4dc7-9993-dc82e73beacd",
                    id: "c9225d9b-1f47-478c-91a7-7ae46f2bdccc",
                    nombres: "Yukas",
                    telefono: "255461"
                }
            );
            cliente1.save(function(err) {
                if (err) done(err);
                else done();
            });
        });
    });
});*/

describe('Genrar Kardex', () => {
    const db = rethinkdb({
        name: 'kardex' // The default value
    });
    it('should save without error', async ()=> {

            var result   = clienteController.addTest();
            assert.equal(result, "text tested");

        db.init({
            Cliente: [{
                apellidos: "Vasquez",
                cedula: "1150214375",
                direccion: "Loja",
                external_id: "8600ea68-0bd7-4dc7-9993-dc82e73beacd",
                id: "c9225d9b-1f47-478c-91a7-7ae46f2bdccc",
                nombres: "Luis",
                telefono: "255461"
            }]
        })
    });
  /*  it.skip('should save without error', function(done) {
        var cliente1 = new cliente(
            {
                apellidos: "Minga",
                cedula: "1104695190",
                direccion: "Loja",
                external_id: "8600ea68-0bd7-4dc7-9993-dc82e73beacd",
                id: "c9225d9b-1f47-478c-91a7-7ae46f2bdccc",
                nombres: "Yukas",
                telefono: "255461"
            }
        );
        //db.save()
        //db.save(cliente1);
        // cliente1.save(function(err) {
        //     if (err) done(err);
        //     else done();
        // });
    });*/
});