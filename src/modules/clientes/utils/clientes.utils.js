const { json } = require("express");
const { getConnection } = require("../../../interface/DBConn.js");
const config = require("../../../config.js");
const bcrypt = require("bcryptjs");

const Sequelize = require("sequelize");

// Configuración de Sequelize y conexión a la base de datos
// const sequelize = new Sequelize({
//   dialect: "mysql",
//   host: config.ServerDB,
//   port: config.PortDB,
//   username: config.UserDB,
//   password: config.PasswordBD,
//   database: config.Database,
// });

// // Definición de modelos
// const Huesped = sequelize.define(
//   "huesped",
//   {
//     nombre: Sequelize.STRING,
//     num_cedula: {
//       type: Sequelize.INTEGER,
//       unique: true,
//       primaryKey: true,
//     },
//     pais: Sequelize.STRING,
//     departamento: Sequelize.STRING,
//     ciudad: Sequelize.STRING,
//   },
//   {
//     tableName: "huesped", // Indicar el nombre correcto de la tabla
//     timestamps: false, // Deshabilitar los campos createdAt y updatedAt
//   }
// );

// const Validacion = sequelize.define(
//   "validacion",
//   {
//     num_cedula: {
//       type: Sequelize.INTEGER,
//       primaryKey: true,
//       autoIncrement: false,
//       unique: true,
//     },
//     pass: Sequelize.STRING,
//   },
//   {
//     tableName: "validacion", // Indicar el nombre correcto de la tabla
//     timestamps: false,
//     createdAt: false, // Deshabilitar campo createdAt
//     updatedAt: false,
//   }
// );

// // Relaciones entre modelos
// Huesped.hasOne(Validacion, {
//   foreignKey: "num_cedula",
//   sourceKey: "num_cedula",
// });

// // Función para crear un usuario
// async function crearUsuarioU(
//   nombre,
//   num_cedula,
//   pais,
//   departamento,
//   ciudad,
//   pass
// ) {
//   try {
//     const hash = await bcrypt.hash(pass, 10);

//     //Crear un registro en la tabla Huesped
//     const huesped = await Huesped.create({
//       nombre,
//       num_cedula,
//       pais,
//       departamento,
//       ciudad,
//     });

//     // Crear un registro en la tabla Validacion
//     const validacion = await Validacion.create({
//       num_cedula,
//       pass: hash,
//     });

//     return { success: true, message: "Usuario creado correctamente" };
//   } catch (error) {
//     if (error.name === "SequelizeUniqueConstraintError") {
//       return {
//         success: false,
//         message:
//           "Ha habido un error en la creacion del usuario, el usuario ya existe",
//       };
//     }
//   }
// }

async function crearUsuarioU(
  nombre,
  num_cedula,
  pais,
  departamento,
  ciudad,
  pass
) {
  const pool = await getConnection();
  try {
    const hash = await bcrypt.hash(pass, 10);

    const params = [nombre, num_cedula, pais, departamento, ciudad];
    const insertQuery = `
            INSERT INTO huesped (
                nombre, num_cedula, pais, departamento, ciudad)
            VALUES (?, ?, ?, ?, ?)`; //No se usa RETURNING en MySQL

     const result = await pool.query(insertQuery, params);
     const insertedId = result.insertId; // Obtenemos el ID de la fila recién insertada

     const insertValidationQuery = `
         INSERT INTO validacion (num_cedula, pass)
         VALUES (?, ?)`;

     const validationResult = await pool.query(insertValidationQuery, [
       num_cedula,
       hash,
     ]);

     return {
       id: insertedId,
       nombre,
       num_cedula,
       pais,
       departamento,
       ciudad,
     };
   } catch (error) {
     if (error.code === "ER_DUP_ENTRY") {
       throw new Error("El usuario ya se encuentra registrado");
     } else {
       console.error("Error al registrar usuario:", error);
       throw error;
     }
   }
 }

async function validarUserU(num_cedula, pass) {
  try {
    const pool = await getConnection();

    // Consulta para obtener el hash de la contraseña almacenada en la tabla "validacion"
    const getHashQuery = "SELECT * FROM validacion WHERE num_cedula = ?";
    const [hashResult] = await pool.query(getHashQuery, [num_cedula]);

    if (hashResult.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const storedHash = hashResult[0].pass;

    const isPasswordCorrect = await bcrypt.compare(pass, storedHash);

    if (!isPasswordCorrect) {
      throw new Error("Contraseña incorrecta");
    }

    // Obtener los datos del usuario desde la tabla "clientes"
    const getUserDataQuery = "SELECT * FROM huesped WHERE num_cedula = ?";
    const [userDataResult] = await pool.query(getUserDataQuery, [num_cedula]);

    if (userDataResult.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const userData = userDataResult[0];

    return { success: true, message: "Inicio correcto." };
  } catch (error) {
    return { success: false, message: "Usuario o contraseña incorrecto" };
  }
}

async function delUserU(num_cedula) {
  const pool = await getConnection();

  try {
    const tablesToDeleteFrom = [
      "facturacion",
      "validacion",
      "reserva",
      "servicios",
      "pedido",
      "ticket",
      "huesped",
    ];

    let recordsDeleted = false; // Bandera para rastrear si se eliminaron registros

    for (const tableName of tablesToDeleteFrom) {
      const deleteQuery = `DELETE FROM ${tableName} WHERE num_cedula = ?`;
      const result = await pool.query(deleteQuery, [num_cedula]);

      if (result.affectedRows > 0) {
        recordsDeleted = true;
      }
    }

    if (recordsDeleted) {
      return { success: true, message: "Registros eliminados correctamente." };
    } else {
      return {
        success: false,
        message: "No se encontraron registros para eliminar.",
      };
    }
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return { success: false, message: "No se pudo eliminar el registro." };
  } finally {
    // Cerrar la conexión aquí, ya sea en caso de éxito o de error
    pool.end();
  }
}
async function updateUserU(nombre, num_cedula, pais, departamento, ciudad) {
  const pool = await getConnection();

  try {
    const updateQuery = `
            UPDATE huesped SET
                nombre = ?,
                num_cedula = ?,
                pais = ?,
                departamento = ?,
                ciudad = ?
            WHERE num_cedula = ?`;

    await pool.query(updateQuery, [
      nombre,
      num_cedula,
      pais,
      departamento,
      ciudad,
      num_cedula,
    ]);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  } finally {
    console.log("Cerrando conexión");
    pool.end();
  }
}

async function logout(req, res) {
  if (req.session.loggedin) {
    req.session.destroy();
  }
  res.redirect("/");
}

async function obtenerProductos() {
  const pool = await getConnection();

  try {
    const selectQuery = `SELECT * FROM habitacion WHERE estado = 'disponible';`;

    const result = await pool.query(selectQuery);
    if (result.length > 0) {
      result.pop(); // Eliminar el último objeto del array
    }

    return result;
  } catch (error) {
    console.error("Error al obtener las habitaciones disponibles:", error);
    throw error;
  } finally {
    console.log("Cerrando conexión");
    pool.end();
  }
}
module.exports = {
  validarUserU,
  crearUsuarioU,
  delUserU,
  updateUserU,
  logout,
  obtenerProductos,
};
