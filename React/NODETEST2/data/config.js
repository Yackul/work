const mysql = require('mysql');
const config = {
    host: 'workplz.c2lggblr8bno.us-west-2.rds.amazonaws.com',
    user: 'admin',
    password: 'admin123',
    database: 'new_schema3',
};
const pool = mysql.createPool(config);
module.exports = pool;