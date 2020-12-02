const mysql = require('mysql');
const config = {
    host: 'freefittyfifthtime.c2lggblr8bno.us-west-2.rds.amazonaws.com',
    user: 'admin',
    password: 'Applesauce',
    database: 'DBTEST5',
};
const pool = mysql.createPool(config);
module.exports = pool;