var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Applesauce90927!"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});