const clienteUtils = require("../utils/clientes.utils");
const axios = require('axios');


const fs = require('fs');

function validar(valor, nombre){
    if(!valor) throw {
        ok: false,
        status_cod: 400,
        data: `No se ha proporcionado ${nombre}`
    }
}

async function crearUser(nombre, num_cedula, pais, departamento, ciudad, pass) {
    console.log("Entrando a utils");
    return clienteUtils.crearUsuarioU(nombre, num_cedula, pais, departamento, ciudad, pass)
        .catch(error => {
            if (error.status_cod) throw error;
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'No se puede crear el usuario'
            };
        });
}
async function validarUser(num_cedula, pass) {
    
    console.log("Entrando a utils");
    return clienteUtils.validarUserU(num_cedula, pass)
        .catch(error => {
            if (error.status_cod) throw error;
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'Usuario o contraseña incorrecta, intente de nuevo'
            };
        });
}

async function delUser(num_cedula) {
    console.log("Entrando a utils");
    return clienteUtils.delUserU(num_cedula)
        .catch(error => {
            if (error.status_cod) throw error;
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'No se puede eliminar el usuario'
            };
        });
}
async function updateUser(nombre, num_cedula, pais, departamento, ciudad) {
    console.log("Entrando a utils");
    return clienteUtils.updateUserU(nombre, num_cedula, pais, departamento, ciudad)
        .catch(error => {
            if (error.status_cod) throw error;
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'No se puede actualizar el usuario'
            };
        });
}

async function obtenerProductos(){
    console.log("Entrando a utils");
    return clienteUtils.obtenerProductos()
        .catch(error => {
            if (error.status_cod) throw error;
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'No se puede obtener los productos'
            };
        });
}
module.exports = {
    validar, 
    validarUser,
    crearUser,
    delUser,
    updateUser,
    obtenerProductos,
}
