const { Router } = require('express');
const { isAuthenticatedMW, checkPermissions } = require('../../auth/api/auth.api');

// api handlers
const { validarUserApi, crearUserApi, delUserApi, updateUserApi, obtenerProductosApi} = require('../api/clientes.api');

const router = Router();

/**
 *  {
 *     body: {
 *          user: string, 
 *          pass: string,
 *      },
 *      
 *  }
 */
router.post('/createUser', crearUserApi);
router.post('/validate', validarUserApi);
router.delete('/deleteUser', delUserApi);
router.post('/updateUser', updateUserApi);
router.get('/productos', obtenerProductosApi);
//router.get('/clientes/leerRut', isAuthenticatedMW, checkPermissions([1, 2]), extractRutAPI); //ejm: uso
module.exports = router;


