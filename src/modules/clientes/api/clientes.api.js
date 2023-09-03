const { validar, validarUser, crearUser, delUser, updateUser, obtenerProductos} = require("../controller/clientes.controller");
const ResponseBody = require('../../../shared/model/ResponseBody.model');

const crearUserApi = async (req, res) => {
    const { nombre, num_cedula, pais, departamento, ciudad, pass } = req.body;
    console.log("Entrando a controller");
    try {
        const crearUserv = await crearUser(nombre, num_cedula, pais, departamento, ciudad, pass);
        message = new ResponseBody(true, 200, crearUserv);
    } catch (error) {
        if (error.data) {
            message = new ResponseBody(error.ok, error.status_cod, error.data);
        } else {
            message = new ResponseBody(false, 500, { message: 'Ha ocurrido un error inesperado. Por favor inténtelo nuevamente más tarde' });
        }
    }

    return res.status(message.status_cod).json(message);
}

const validarUserApi = async (req, res) => {
    const { num_cedula, pass } = req.body;
    try {
        const validarUserv = await validarUser(num_cedula, pass);
        message = new ResponseBody(true, 200, validarUserv);
    } catch (error) {
        if (error.data) {
            message = new ResponseBody(error.ok, error.status_cod, error.data);
        } else {
            message = new ResponseBody(false, 500, { message: 'Ha ocurrido un error inesperado. Por favor inténtelo nuevamente más tarde' });
        }
    }

    return res.status(message.status_cod).json(message);
    
}

const delUserApi = async (req, res) => {
    const { num_cedula } = req.body;
    console.log("Entrando a controller");
    try {
        const delUserv = await delUser(num_cedula);
        message = new ResponseBody(true, 200, delUserv);
    } catch (error) {
        if (error.data) {
            message = new ResponseBody(error.ok, error.status_cod, error.data);
        } else {
            message = new ResponseBody(false, 500, { message: 'Ha ocurrido un error inesperado. Por favor inténtelo nuevamente más tarde' });
        }
    }
    return res.status(message.status_cod).json(message);
}
const updateUserApi = async (req, res) => {
    const { nombre, num_cedula, pais, departamento, ciudad } = req.body;
    console.log("Entrando a controller");
    try {
        const updateUserV = await updateUser(nombre, num_cedula, pais, departamento, ciudad);
        message = new ResponseBody(true, 200, updateUserV);
    } catch (error) {
        if (error.data) {
            message = new ResponseBody(error.ok, error.status_cod, error.data);
        } else {
            message = new ResponseBody(false, 500, { message: 'Ha ocurrido un error inesperado. Por favor inténtelo nuevamente más tarde' });
        }
    }
    return res.status(message.status_cod).json(message);
}

const obtenerProductosApi = async (req, res) => {
    console.log("Entrando a controller");
    try {
        const obtenerProductosV = await obtenerProductos();
        message = new ResponseBody(true, 200, obtenerProductosV);
    } catch (error) {
        if (error.data) {
            message = new ResponseBody(error.ok, error.status_cod, error.data);
        } else {
            message = new ResponseBody(false, 500, { message: 'Ha ocurrido un error inesperado. Por favor inténtelo nuevamente más tarde' });
        }
    }
    return res.status(message.status_cod).json(message);  
}

module.exports = {
    validar,
    validarUserApi,
    crearUserApi,
    delUserApi,
    updateUserApi,
    obtenerProductosApi
}