'use strict';

var r = require('rethinkdb');

var facturaVenta = require('../modelos/facturaVenta');
var detalleVenta = require('../modelos/detalleVenta');
var empresa = require('../modelos/empresa');
var producto = require('../modelos/producto');
var kardex = require('../modelos/kardex');

/** 
 * @class FacturaVentaController
 */
class FacturaVentaController {
    /**
     * @description Metodo para consultar numero de registros en la tabla FacturaVenta
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en Front end
     * @returns {Number} Retorna el numero de registros totales
     */
    buscarV(req, res) {
        var data = {};
        facturaVenta.then(function (lista) {
            var nro = lista.length + 1;

            data[0] = {
                nro: nro
            };

            res.json(data);
        });
    }

    /**
     * @description Metodo para visualizar el fragmento registrarVenta.hbs, mandando los clientes y productos registrados 
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en Front end
     * 
     */
    registrarVenta(req, res) {
        var b = false;
        if (req.session.datos.rol == "Administrador") {
            b = true;
        } else {
            b = false;
        }

        var rol = (req.session.datos.rol);
        var tipo = "";
        if (rol == "Usuario") {
            tipo = "/usuario";
        } else if (rol == "Administrador") {
            tipo = "/Admin";
        }
        let d = {
            title: 'Registrar Venta',
            fragmento: 'registrarVenta',
            empresas: null,
            productos: null,
            clientes: null,
            tipo: b,
            rol: tipo,
            error: {
                status: false,
                message: ''
            }
        };
        var cliente = require('../modelos/cliente');
        empresa.then(function (empresas) {
            producto.then(function (productos) {
                cliente.then(function (clientes) {
                    d.clientes = clientes;
                    d.empresas = empresas;
                    d.productos = productos;
                    res.render('index', d);
                });

            }).catch(function (error) {
                d.error.status = true;
                d.error.message = 'Ocurri?? un error al obtener la informaci??n de los productos disponibles';
                res.render('index', d);
            });
        }).catch(function (error) {
            d.error.status = true;
            d.error.message = 'Ocurri?? un error al obtener la informaci??n de las empresas';
            res.render('index', d);
        });
    }

    /**
     * @description Metodo para guardar una factura de venta en la base de datos, relacionando al cliente al se le vendio
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en Front end
     */
    guardarVentaBeta(req, res) {
        let factura = JSON.parse(req.body.factura);
        let factura_venta = new facturaVenta({
            nro_factura: factura.nro_factura,
            subtotal: factura.subtotal,
            iva: factura.iva,
            total: factura.total,
            id_facturaCli: factura.id_facturaCli
        });

        let lista_detalleVenta = [];

        factura.items_detalle_venta.forEach(function (item) {
            let detalle_venta = new detalleVenta({
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                valor_unitario: item.valor_unitario,
                valor_total: item.valor_total
            });
            let asiento = require('../modelos/asientoContable');
            var datos = {
                id_producto: item.id_producto,
                descripcion: "Venta",
                referencia: factura.nro_factura,
                cantidad: item.cantidad,
                valor_unitario: item.valor_unitario,
                monto: item.valor_total
            };
            var asient = new asiento(datos);

            asient.save().then(function (result) {
                console.log("LO QUE SE GUARDO DE L ASIENTO --------------------------------++++" + result);
            }).error(function (error) {
                console.log("-------------ERORR ASIENTO");
            });

            detalle_venta.facturaVenta = factura_venta;
            lista_detalleVenta.push(detalle_venta);
        });
        factura_venta.detalleventa = lista_detalleVenta;

        factura_venta.saveAll({detalleventa: true}).then(function (result) {
            console.log(result);
            saveKardexItemsRecursivo(result, 0, function (code, data) {
                res.json({data: 'Factura guarda con ??xito', method: {code: code, data: data}});
            });

        }).catch(function (error) {
            console.log(error);
            res.json({data: 'Error al guardar la factura'});
        });
    }

}

module.exports = FacturaVentaController;
/**
 * 
 * @param {Number} num Requerido para operar con el mismo
 * @returns {Number} Retorna el redondeo de un numero 
 */
function redondear2Decimales(num) {
    return Math.round(num * 100) / 100;
}

/**
 * @description Metodo recursivo para guarda cada item de la factura
 * @param {Object} Array Lista de productos agregados a la tabla de la Factura Venta
 * @param {Number} pos El valor por defecto es cero, utilizado para metodo recursivo
 * @param {String} callback Mensajes de respuesta por si ocurre uun error
 */
function saveKardexItemsRecursivo(factura, pos, callback) {
    let size = factura.detalleventa.length;
    console.log('size ' + size);
    console.log('pos ' + pos);
    if (pos < size) {
        let item = factura.detalleventa[pos];
        producto.get(item.id_producto).then(function (p) {

            producto.get(p.id).update({stock: p.stock - item.cantidad}).then(function (producto_updated) {
                kardex.filter({id_producto: item.id_producto}).orderBy('createdAt').then(function (lista_kardex) {
                    let ultimo_kardex;
                    let new_kardex = {
                        id_factura: item.id_facturaV,
                        id_producto: item.id_producto,
                        tipo: 1,
                        descripcion: 'Factura de venta Nro ' + factura.nro_factura,
                        es_cantidad: item.cantidad,
                        es_valor_unitario: 0,
                        es_valor_total: 0,
                        e_cantidad: 0,
                        e_valor_unitario: 0,
                        e_valor_total: 0
                    };
                    if (lista_kardex.length > 0) {

                        ultimo_kardex = lista_kardex[lista_kardex.length - 1];
                        new_kardex.es_valor_unitario = ultimo_kardex.e_valor_unitario;
                        new_kardex.es_valor_total = redondear2Decimales(new_kardex.es_valor_unitario * new_kardex.es_cantidad);
                        new_kardex.e_cantidad = ultimo_kardex.e_cantidad - item.cantidad;
                        new_kardex.e_valor_total = redondear2Decimales(ultimo_kardex.e_valor_total - new_kardex.es_valor_total);
                        new_kardex.e_valor_unitario = redondear2Decimales(new_kardex.e_valor_total / new_kardex.e_cantidad);
                    } else {
                        new_kardex.e_cantidad = item.cantidad;
                        new_kardex.e_valor_unitario = producto_updated.precio;
                        new_kardex.e_valor_total = redondear2Decimales(new_kardex.e_valor_unitario / new_kardex.e_cantidad);
                    }
                    let krd = new kardex(new_kardex);

                    krd.producto = producto_updated;
                    krd.saveAll().then(function (result) {

                        pos = pos + 1;
                        saveKardexItemsRecursivo(factura, pos, callback);
                    }).catch(function (error) {
                        console.log(error);
                        callback(-1, 'Error al guardar el kardex');
                    });
                }).catch(function (error) {
                    console.log(error);
                    callback(-1, 'Error al filtrar el kardex por fecha');
                });
            }).catch(function () {

                callback(-1, 'Error al actualizar el stock del producto');
            });
        }).catch(function (error) {
            console.log(error);
            callback(-1, 'Error al obtener la informaci??n del producto');
        });
    } else {
        callback(0, 'Kardex actualizado');
    }
}

