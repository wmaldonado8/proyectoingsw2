'use strict';
const rethinkdb = require('rethinkdb-mock')
var r = require("rethinkdb");
var cliente = require("../modelos/facturaCompra");

const mock = require('mock-require')

const chai = require('chai');
const request = require("supertest");
const expect = chai.expect;
chai.use(require('sinon-chai'));
mock('rethinkdbdash', rethinkdb)

describe('Inicializar Base de Datos', () => {
    const db = rethinkdb({
        name: 'kardex' // The default value
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
        }]
    })
});

describe('User', function() {
    describe('#save()', function() {

        it('Insert Cliente', function() {
            const db = rethinkdb({
                name: 'kardex',
            });
            db.init({
                Cliente: []
            })
            const Cliente = db.table('Cliente')
            const query = Cliente.insert(
                {   apellidos: "Minga",
                    cedula: "1111111111",
                    direccion: "Loja",
                    external_id: "8600ea68-0bd7-4dc7-9993-dc82e73bea26",
                    id: "c9225d9b-1f47-478c-91a7-7ae46f2bdc26",
                    nombres: "Yukas",
                    telefono: "255461" }
            ).do(res =>
                res('inserted')
                    .eq(1)
                    .and(res('errors').eq(0))
            )
            expect(query._run()).to.be.ok;
        });

        it('Guardar Cliente', function(done) {
            var cliente1 = new cliente(
                {
                    apellidos: "Minga",
                    cedula: "2222222222",
                    direccion: "Loja",
                    external_id: "8600ea68-0bd7-4dc7-9993-dc82e73bea23",
                    id: "c9225d9b-1f47-478c-91a7-7ae46f2bdc23",
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
});

describe('Genrar Kardex', () => {


    it('test para el método buscar Cliente ', function() {
        const db = rethinkdb({
            name: 'kardex',
        });
        db.init({
            Cliente: [
                {
                    apellidos: "Minga",
                    cedula: "2222222222",
                    direccion: "Loja",
                    external_id: "8600ea68-0bd7-4dc7-9993-dc82e73bea23",
                    id: "c9225d9b-1f47-478c-91a7-7ae46f2bdc23",
                    nombres: "Yukas",
                    telefono: "255461"
                }
            ]
        })
        const Cliente = db.table('Cliente')
        const query = Cliente.filter({cedula: "2222222222"})
        expect(query._run()).lengthOf(1,"Error: solo hay un solo registro");
    });
});

describe("Cliente", function () {
    describe("GET /Clientes", function () {
        it("should return 200 OK with several cliente",  async function () {
            const response = await request(app).get("/Clientes").expect(200).expect("Content-Type", /json/);
            const client = response.body;
            expect(client).to.be.an("array");
            expect(client).length.to.be.greaterThan(0);
        });

    });
});
