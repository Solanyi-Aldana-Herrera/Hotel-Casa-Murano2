const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const conexion = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_hotel',
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const USUARIO = process.argv[2] || 'admin2';
const CONTRASENA = process.argv[3] || 'Johany18';
const CORREO = process.argv[4] || 'aldanaherrerasol@gmail.com';
const SALT_ROUNDS = 10;

const hash = bcrypt.hashSync(CONTRASENA, SALT_ROUNDS);

const sqlVerificar = 'SELECT id FROM administrador WHERE usuario = ?';
conexion.query(sqlVerificar, [USUARIO], (error, resultados) => {
    if (error) {
        console.error('Error al consultar:', error);
        process.exit(1);
    }

    if (resultados.length > 0) {
        const sqlActualizar = 'UPDATE administrador SET contrasena = ?, correo = ? WHERE usuario = ?';
        conexion.query(sqlActualizar, [hash, CORREO, USUARIO], (error) => {
            if (error) {
                console.error('Error al actualizar:', error);
                process.exit(1);
            }
            console.log(`✓ Administrador "${USUARIO}" actualizado con nueva contraseña hasheada`);
            conexion.end();
        });
    } else {
        const sqlInsertar = 'INSERT INTO administrador (usuario, correo, contrasena) VALUES (?, ?, ?)';
        conexion.query(sqlInsertar, [USUARIO, CORREO, hash], (error) => {
            if (error) {
                console.error('Error al insertar:', error);
                process.exit(1);
            }
            console.log(`✓ Administrador "${USUARIO}" creado con contraseña hasheada`);
            conexion.end();
        });
    }
});
