const { getConnection } = require('../../../interface/DBConn.js');

/**
 * 
 * @param {{}} obligacion 
 * @returns 
 */
async function insertarObligacion(obligacion) {
    const params = [];
    const pool = await getConnection();

    params.push(obligacion.nombre);
    params.push(obligacion.tipo);
    params.push(obligacion.departamento);
    params.push(obligacion.municipio);
    params.push(obligacion.periodo_vencimiento);

    return pool.query(`
        INSERT INTO obligacion (nombre, tipo, departamento, municipio, periodo_vencimiento)
        VALUES ( $1, $2, $3, $4, $5)
        RETURNING id;
    `, params
    ).then(data => {
        console.log(params)
        return data.rows[0];
    })
        .catch(error => {
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'Ocurrió un error insertando una nueva obligación',
            }
        }).finally(() => pool.end);
}

/**
 * @param {number} id_cliente 
 * @param {number[]} obligaciones 
 */
async function asignarObligaciones(id_cliente, obligaciones) {
    const pool = await getConnection();

    let query = {
        text: 'INSERT INTO obligacionxcliente(id_cliente, id_obligacion) VALUES($1, $2)',
        value: [id_cliente, {}],
    }

    for (const id_obligacion of obligaciones) {
        query.value[1] = id_obligacion;

        await pool.query(query.text, query.value)
            .catch(error => {
                throw error;
            }).finally(() => pool.end());
    }
}

/**
 * @param {number} id_cliente 
 * @returns {Promise<{
 *          id_obligacion: number,
 *          nombre: string,
 *          tipo: string,
 *          departamento: string,
 *          municipio: string,
 *          periodo_vencimiento: string
 *          }[]>}
 */
async function fetchObligacionxcliente(id_cliente) {
    const pool = await getConnection();

    if (!id_cliente) {
        throw {
            ok: false,
            status_cod: 400,
            data: 'No se ha proporcionado un id_cliente'
        }
    }

    return pool.query(`
        SELECT oxc.id_obligacion, o.nombre, o.tipo, o.departamento, o.municipio, o.periodicidad
        FROM obligacionxcliente oxc
        INNER JOIN obligacion o ON o.id = oxc.id_obligacion
        WHERE oxc.id_cliente = $1
    `, [id_cliente])
        .then(data => data.rows)
        .catch(error => {
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'Ocurrió un error de base de datos consultando obligaciones',
            }
        }).finally(() => pool.end());
}

/**
 * @param {number} id_cliente 
 * @param {number[]} obligaciones 
 */
async function desasignarObligaciones(id_cliente, obligaciones) {
    const pool = await getConnection();

    let ids = obligaciones.join(',');

    await pool.query(`
        DELETE
        FROM obligacionxcliente
        WHERE id_cliente = $1 AND id_obligacion IN (${ids});
        `, [id_cliente])
        .catch(error => {
            throw error;
        }).finally(() => pool.end());
}

/**
 * @param {{
*      id_obligacion: number,
*      id_cliente: number,
*      periodos: {periodo: string, fecha:string}[]
* }} options 
*/
async function insertarCalendario(options) {
    const pool = await getConnection();

    let params = [
        options.id_obligacion,
        options.id_cliente
    ];

    await pool.query(`
            DELETE FROM calendario_obligacion 
            WHERE id_obligacion = $1 AND id_cliente = $2;
        `, params)
        .then(data => data.rowCount > 0)
        .catch(error => {
            console.log(error);
        });

    params.push('');
    params.push('');

    for (const periodo of options.periodos) {
        params[2] = periodo.periodo;
        params[3] = periodo.fecha;

        await pool.query(`
            INSERT INTO calendario_obligacion 
                (id_obligacion, id_cliente, periodo, fecha)
            VALUES ($1, $2, $3, $4);
        `, params)
            .then(data => data.rowCount > 0)
            .catch(error => {
                console.log(error);
            });
    }

    pool.end();

    return;
}

/**
 * @param {number} id_cliente 
 */
async function fetchCalendarioxCliente(id_cliente) {
    const pool = await getConnection();

    return pool.query(`
            SELECT 
                o.nombre, o.tipo, o.departamento, o.municipio, id_obligacion,
                co.periodo, TO_CHAR(co.fecha::date, 'yyyy-mm-dd') fecha_vencimiento
            FROM calendario_obligacion co 
            INNER JOIN obligacion o ON o.id = co.id_obligacion 
            WHERE co.id_cliente = $1
        `, [id_cliente])
        .then(data => data.rows)
        .catch(error => {
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'Ocurrió un error de base de datos consultando vencimientos',
            }
        }).finally(() => pool.end());
}


module.exports = {
    insertarObligacion,
    asignarObligaciones,
    fetchObligacionxcliente,
    desasignarObligaciones,
    insertarCalendario,
    fetchCalendarioxCliente,
}