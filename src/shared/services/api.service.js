const axios = require('axios');
const config = require('../../config');

/**
 * @param {{
 *      method: string,
 *      body: {},
 *      params: {},
 *      headers: {}
 * }} axiosConfig 
 * @returns {Promise<{}>}
 */
async function requestETLAPI(axiosConfig) {
    const url = config.ETL_HOST;

    const {
        body,
        params,
        headers,
        method
    } = axiosConfig;

    return axios({
        method,
        url,
        data: body,
        params,
        headers,
    })
        .then(res => {
            const { data } = res;
            let lista = { renglones: [], actividades: [] };

            for (const renglon in data) {
                if (renglon != 'actividades_gravadas' && renglon != 'municipio_distrito') {
                    let info = {
                        codigo: data[renglon][0],
                        concepto: data[renglon][1],
                        valor: data[renglon][2].replaceAll(',', ''),
                    }

                    lista.renglones.push(info);
                } else if (renglon == 'actividades_gravadas') {
                    const actividades_gravadas = data[renglon];
                    let gravadas = [];
                    for (const actividad_gravada in actividades_gravadas) {
                        let actividad = actividades_gravadas[actividad_gravada];
                        
                        if (actividad[0] == '') continue;

                        let info = {
                            actividad: actividad_gravada,
                            codigo: actividad[0],
                            ingreso_gravado: Number(actividad[1].replaceAll(',', '')),
                            tarifa: Number(actividad[2]),
                            valor: Number(actividad[3].replaceAll(',', '')),
                        }

                        gravadas.push(info);
                    }

                    lista.actividades = gravadas;
                } else {
                    lista[renglon] = data[renglon];
                }
            }

            return lista;
        })
        .catch(err => { throw err });
}

module.exports = {
    requestETLAPI
}