var express = require('express');
var router = express.Router();
var persona = require('../modelos/persona');

//enviar email
var mail = require('../controlador/MailController');
var email = new mail();
router.post('/enviar', email.enviar);


var controladorPersona = require('../controlador/controladorPersona');
var persona2 = new controladorPersona();

// controlador Empresa

var controladorEmpresa = require('../controlador/EmpresaController');
var Empresa = new controladorEmpresa();

//para iniciar session

var cuentaC = require('../controlador/CuentaController');
var cuenta = new cuentaC();
/*uthAdmin
 * Para quemar datos de persona y administrador en la Base de datos
 */
/* Pagina Principal */

router.get('/', function (req, res, next) {
    Empresa.guardar_Empresa();
    persona2.guardar_Usuario();
    persona2.guardar_Administrador();
    //agregando el req.flash y req.info
    if (req.session !== undefined && req.session.datos !== undefined) {
        if (req.session.datos.rol == "Usuario") {
            res.redirect('/usuario');
        } else if (req.session.datos.rol == "Administrador") {
            res.redirect('/Admin');
        }

    } else {
        console.log("ROL " + req.session.datos);
        res.render('index', {
            title: 'KARDEX',
            fragmento: 'principal',
            msg: {
                error: req.flash('error'),
                info: req.flash('info')
            }
        });

    }

});


//validar sesiones y roles 

function validarSesion(req) {
    return (req.session !== undefined && req.session.datos !== undefined);
}
var authUsuario = function (req, res, next) {
    if (validarSesion(req)) {


        next();
    } else {
        req.flash('error', 'Debe iniciar session primero!');
        res.redirect('/');
    }
};

var authAdmin = function (req, res, next) {
    if (validarSesion(req)) {
        if (req.session.datos.rol == "Administrador") {
            next();
        } else {
            req.flash('error', 'No esta autorizado a acceder a esta direccion!');
            res.redirect('/usuario');
        }
    } else {
        req.flash('error', 'Debe iniciar sesion primero!');
        res.redirect('/');
    }
};

//Adminsitrar un producto

var productoC = require('../controlador/ProductoController');
var producto = new productoC();

//pantalla de admin


//NOTIFICACIONES 


router.get('/Admin', authAdmin, function (req, res, next) {


    res.render('index', {
        title: 'Administracion de Productos',
        fragmento: 'Administrador',
        msg: {
            error: req.flash('error'),
            info: req.flash('info')
        }
    });
});



//pantalla de usuario
router.get('/usuario', authUsuario, function (req, res, next) {
    res.render('index', {
        title: 'Usuario',
        fragmento: 'principalUsuario',
        msg: {
            error: req.flash('error'),
            info: req.flash('info')
        }
    });
});


//visualizar producto
router.get('/administracion/productos', authAdmin, producto.visualizar);

//guardar producto
router.post('/administracion/producto/guardar', producto.guardar);

//modificar producto
router.post('/administracion/producto/modificar', producto.modificar);


//factura compra
var facturaCompraController = require('../controlador/FacturaCompraController');
var compra = new facturaCompraController();

//Añadidos
router.get('/administracion/registrarCompra', authAdmin, compra.registrarCompra);
router.post('/administracion/guardarCompra', compra.guardarCompraBeta);

//factura venta
var facturaVentaController = require('../controlador/FacturaVentaController');
var venta = new facturaVentaController();

//Añadidos
router.get('/administracion/registrarVenta', authUsuario, venta.registrarVenta);
router.post('/administracion/guardarventa', venta.guardarVentaBeta);

//Kardex
var kardexController = require('../controlador/KardexController');
var kardex = new kardexController();

//Cliente
var clienteController = require('../controlador/ClienteController');
var cliente = new clienteController();

//Añadidos
router.get('/administracion/generarKardex', authUsuario, kardex.generarKardex);
router.post('/administracion/getItemsKardexByIdProductoOrderByFecha', kardex.getItemsKardexByIdProductoOrderByFecha);


router.post('/inicio_sesion', cuenta.iniciar_sesion);
router.get('/cerrar_sesion', cuenta.cerrar_sesion);

//NOTIFICARRRRRRRR
router.get('/notificar', producto.Notifiacion);

//Vista que dirige al libro diario
router.get('/generarLB', kardex.LibroDiario);



router.get('/libro', authUsuario, function (req, res, next) {
    var b = false;
    if (req.session.datos.rol == "Administrador") {
        b = true;
    } else {
        b = false;
    }
    res.render('index', {
        title: 'Usuario',
        fragmento: 'LibroDiario',
        tipo: b,
        msg: {
            error: req.flash('error'),
            info: req.flash('info')
        }
    });
});

//Visualizar Cliente
router.get('/Clientes', cliente.visualizar);

//Guardar Cliente
router.post('/guardarCliente', cliente.guardar);

//Modificar Cliente
router.post('/modificarCliente', cliente.modificar);

//Buscar Cliente
router.get('/buscarCliente', cliente.buscarCliente);


//Buscar Producto Servicio
router.get('/buscarProducto', producto.buscar);

//Numero de Factura Venta
router.get('/numerofacturaV', venta.buscarV);
//Numero de Factura Compra
router.get('/numerofacturaC', compra.buscarC);
module.exports = router;