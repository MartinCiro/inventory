const Router = require('express');
const { crearObligacionAPI, asignarObligacionAPI, crearVencimientoAPI } = require('../api/obligaciones.api');
const { isAuthenticatedMW, checkPermissions } = require('../../auth/api/auth.api');

// Inicializar router
const router = Router();


/**
 * 
 * {
 *      headers: {
 *          Authorization | jwt: string,
 *      },
 *      body: {
 *          id_obligacion: number,
 *          id_cliente: number
 *      }
 * }
 */
router.post('/obligacion/asignarObligacion', isAuthenticatedMW, checkPermissions([1, 2]), asignarObligacionAPI);

/**
 * {
 *      headers: {
 *          Authorization | jwt: string,
 *      },
 *      body: { 
 *          id_obligacion: number,
 *          periodo: number, 
 *          observacion: string | undefined, 
 *          fecha_vencimiento: Date, 
 *          id_cliente: number 
 *      }
 * }
 */
router.post('/obligacion/crearVencimiento', isAuthenticatedMW, checkPermissions([1, 2]), crearVencimientoAPI);



module.exports = router;