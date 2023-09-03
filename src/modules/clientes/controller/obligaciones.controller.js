const { insertarObligacion, asignarObligaciones, insertarCalendario } = require("../utils/obligaciones.utils");


/**
 * 
 * @param {{
 *          nombre: string,
 *          tipo: string,
 *          id_municipo: number,
 *          periodo_vencimiento: number
 *      }} obligacion 
 * @returns 
 */
async function crearObligacion(obligacion) {
    if (!obligacion.nombre) {
        return res.json({
            ok: false,
            status_cod: 400,
            data: 'No se ha proporcionado nombre de la obligación'
        })
    }

    if (!obligacion.tipo) {
        return res.json({
            ok: false,
            status_cod: 400,
            data: 'No se ha proporcionado el tipo de la obligación'
        });
    }

    if (!obligacion.departamento) {
        return res.json({
            ok: false,
            status_cod: 400,
            data: 'No se ha proporcionado el departamento'
        });
    }

    if (!obligacion.municipio) {
        return res.json({
            ok: false,
            status_cod: 400,
            data: 'No se ha proporcionado el municipio'
        });
    }

    if (!obligacion.periodo_vencimiento) {
        return res.json({
            ok: false,
            status_cod: 400,
            data: 'No se ha proporcionado el periodo de vencimiento'
        });
    }
    return insertarObligacion(obligacion)
        .then(data => {
            return data;
        })
        .catch(error => {
            if (error.status_cod) throw error;
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'Ocurrió un error inesperado y el usuario no ha sido creado'
            }
        });
}

/**
 * @param {number} id_obligacion 
 * @param {number} id_cliente 
 */
async function asignarObligacion(id_cliente, id_obligacion) {
    await asignarObligaciones(id_cliente, [id_obligacion])
        .catch(error => {
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'Ocurrió un error asignando obligación tributaria'
            }
        });

    return;
}

/**
 * @param {{
 *      id_obligacion: number,
 *      id_cliente: number,
 *      periodo: number,
 *      fecha_vencimiento: Date,
 *      observacion: string | undefined
 * }} options 
 */
async function crearVencimiento(options) {
    const { id_obligacion, periodos, id_cliente } = options;

    if (!id_obligacion) throw {
        ok: false,
        status_cod: 400,
        data: 'No se ha proporcionado el identificador de la obligación'
    };

    if (!periodos) throw {
        ok: false,
        status_cod: 400,
        data: 'No se has proporcionado los periodos'
    };

    if (!id_cliente) throw {
        ok: false,
        status_cod: 400,
        data: 'No se ha proporcionado el identificador del cliente'
    };

    try {
        return await insertarCalendario(options);
    } catch (error) {
        if (error.status_cod) throw error;
        console.log(error);
        throw {
            ok: false,
            status_cod: 500,
            message: 'Ocurrió un error insertando el vencimiento'
        }
    }
}

module.exports = {
    crearObligacion,
    asignarObligacion,
    crearVencimiento
}