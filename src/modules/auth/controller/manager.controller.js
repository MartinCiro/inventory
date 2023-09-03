const config = require('../../../config.js');
const { insertClientRelationship } = require('../../clientes/utils/clientes.utils.js');
const { insertNewUser, updateUsuario } = require('../utils/manager.utils.js');
const Usuario = require('../model/usuario.js');

const managerUtils = require("../utils/manager.utils.js");


/**
 * Método para crear un nuevo usuario
 * @param {{
 *          username: string,
 *          nombre: string,
 *          apellidos: string,
 *          numero_documento: string,
 *          id_sede: string,
 *          id_rol: string,
 *          correo: string,
 *          numero_contacto: string,
 *          habilitado: string,
 *          pass: string,
 *        }} nuevoUsuario
 * @param {number[] || string[]} clientes 
 */
async function createUser(nuevoUsuario, clientes) {
    const usuario = Usuario(
        nuevoUsuario.username,
        nuevoUsuario.pass,
        nuevoUsuario.nombre,
        nuevoUsuario.id_rol
    );

    const userInfo = {
        apellidos,
        numero_contacto,
        numero_documento,
        id_sede,
        correo,
        numero_contacto,
        habilitado
    } = nuevoUsuario;

    const id_usuario = await insertNewUser({ ...usuario, ...userInfo })
        .then(data => {
            return data;
        })
        .catch(error => {
            if (error.status_cod) throw error;
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'Ocurrió un error inesperado y el usuario no ha sido creado',
            }
        });

    let error_message;
    if (clientes && clientes.length > 0) {
        await insertClientRelationship(id_usuario, clientes)
            .catch(error => {
                console.log(error);
                error_message = 'El usuario fue creado, sin embargo ocurrió un error asignando clientes al usuario'
            });
    }

    return {
        ok: true,
        status_cod: 200,
        data: {
            id_usuario,
            message: error_message || 'El usuario fue creado con éxito',
        }
    }
}

/**
 * @param { number } id_sede
 */
async function listarUsuarios(id_sede) {
    let usuarios = await managerUtils.fetchUsuarios(id_sede)
        .catch(error => {
            if (error.status_cod) throw error;
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'Ocurrió un error inesperado consultando usuarios'
            }
        });

    return usuarios;
}

/**
 * @param {{
 *      correo:string, 
 *      id_sede:number, 
 *      id_rol: number, 
 *      numero_contacto: string, 
 *      habilitado: number, 
 *      id_cargo:number,
 *      clientes: any[]
 *  }} options 
 */
async function modificarUsuario(options) {
    const { id, correo, id_sede, id_rol, numero_contacto, habilitado, clientes, id_cargo } = options;

    if (!id) throw {
        ok: false,
        status_cod: 400,
        data: 'No se ha proporcionado el id en las opciones'
    }

    if (!correo && !numero_contacto && !habilitado && !id_rol && !id_sede && !clientes && !id_cargo) {
        throw {
            ok: false,
            status_cod: 400,
            data: 'No se ha proporcionado campos para actualizar'
        }
    }

    await updateUsuario(options)
        .then(() => { actualizado = true; })
        .catch(error => {
            if (error.status_cod) throw error;
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'Ocurrió un error inesperado y el usuario no ha sido actualizado',
            }
        });

    if (clientes && clientes.length > 0) {

    }

    return {
        message: 'El usuario fue actualizado con éxito'
    }
}
async function listarPermisos() {
    let permisos = await managerUtils.fetchPermisos()
        .catch(error => {
            if (error.status_cod) throw error;
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'Ocurrió un error inesperado consultando permisos'
            }
        });

    return permisos;
}

async function listarRoles() {
    let permisos = await managerUtils.fetchroles()
        .catch(error => {
            if (error.status_cod) throw error;
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'Ocurrió un error inesperado consultando roles'
            }
        });

    return permisos;
}

async function listarPermisoXUsuario(id_rol, id_usuario) {

    if (!id_rol) throw {
        ok: false,
        status_cod: 400,
        data: 'No se ha proporcionado el id_rol en las opciones'
    }
    if (!id_usuario) throw {
        ok: false,
        status_cod: 400,
        data: 'No se ha proporcionado el id del usuario en las opciones'
    }

    let permisosXusuario = await managerUtils.usuarioXpermisos(id_rol, id_usuario)
        .catch(error => {
            if (error.status_cod) throw error;
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'Ocurrió un error inesperado consultando permisos'
            }
        });
    return permisosXusuario;
}

module.exports = {
    createUser,
    listarUsuarios,
    modificarUsuario,
    listarPermisos,
    listarPermisoXUsuario,
    listarRoles
}