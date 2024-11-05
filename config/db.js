const mysql = require('mysql2')

const db = mysql.createConnection({
    user:process.env.USER,
    password: process.env.PASSWORD,
    host:process.env.HOST,
    database:process.env.DATABASE,
    port:process.env.DB_PORT
})

module.exports = db