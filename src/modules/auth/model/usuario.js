const bcryptjs = require('bcryptjs');
const config = require('../../../config');

/**
 * Módulo revelador para encapsular las funciones de validación de usuarios
 * @param {string} email
 * @param {string} password 
 * @param {string} nombre
 * @param {string} id_organizacion
 * @param {string} [foto_perfil] 
 * @param {string} [id_estado] 
 * @param {number} id_rol id del rol a asignar
 * @param {number[]} clientes arreglo de clientes asignados al usuario
 * @returns { {
 *              getEncryptedPassword: () => string, 
 *              comparePassword: (hash) => boolean,
 *              encodePassword: (newPass) => string,
 *              comparePasswords: (newPass, oldPass) => boolean,
 *              email: string, 
 *              pass: string, 
 *              id_organizacion: string, 
 *              foto_perfil?: string,
 *              id_estado?: string,
 *              id_rol: number,
 *              clientes: number[] } }
 */
const Usuario = (user, password, nombre, id_rol) => {
    const pass = password || '';
    const salt = bcryptjs.genSaltSync(parseInt(config.SALT));
    const encryptedPassword = bcryptjs.hashSync(pass, salt);

    return {
        getEncryptedPassword: () => (encryptedPassword),
        comparePassword: (hash) => bcryptjs.compareSync(pass, hash),
        encodePassword: (newPass) => bcryptjs.hashSync(newPass, salt),
        comparePasswords: (newPass, oldPass) => bcryptjs.compareSync(oldPass, newPass),
        user,
        id_rol,
        nombre
    }
}

module.exports = Usuario;