const { Router } = require('express');

// API middlewares
const { loginAPI, createUserAPI, isAuthenticatedMW, checkPermissions, listarUsuariosAPI, actualizarUsuarioAPI, listarPermisosAPI, listarPermisosXUsuarioAPI, listarRolesAPI } = require('../api/auth.api');
const { decodeYAWIPassword, encodeYAWIPassword } = require('../utils/decodePass.utils');
const { env } = require('../../../config');

// Inicializar router
const router = Router();

// Rutas login
router.post('/auth/login', loginAPI);


router.post('/auth/create/user', isAuthenticatedMW, checkPermissions([2]), createUserAPI);
router.patch('/auth/update/user', isAuthenticatedMW, checkPermissions([2]), actualizarUsuarioAPI);


router.get('/usuario/listarUsuario', isAuthenticatedMW, checkPermissions([2]), listarUsuariosAPI);
router.get ('/usuario/listarPermisos',isAuthenticatedMW,listarPermisosAPI );
router.post ('/usuario/listarPermisosXUsuario',isAuthenticatedMW,listarPermisosXUsuarioAPI );
router.get ('/usuario/ListarRoles', isAuthenticatedMW, listarRolesAPI);



if (env == 'Dev') router.post('/auth/testDecode', (req, res) => {
    const { pass } = req.body;
    let message;

    try {
        message = decodeYAWIPassword(pass);
    } catch (error) {
        console.log(error);
        message = error;
    }

    return res.json(message);
});


if (env == 'Dev') router.post('/auth/testEncode', (req, res) => {
    const { pass } = req.body;
    let message;

    try {
        message = encodeYAWIPassword(pass);
    } catch (error) {
        console.log(error);
        message = error;
    }

    return res.json(message);
});


module.exports = router;
