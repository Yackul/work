// Load the MySQL pool connection
const pool = require('../data/config');
var cors = require('cors')

// Route the app
const router = app => {
    // ROOT GET - SHOULDNT EVER BE USED ON SITE AFAIK
    //app.get('/', (request, response) => {
    //    response.send({
    //      message: 'Welcome to the Node.js Express REST API!'
    //    });
    //});

    app.use(cors());
    //USER FUNCTIONS
    // Display all USERS - also shouldn't be used except in admin tools
    app.get('/USERS', (request, response) => {
        pool.query('SELECT * FROM USERS', (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });

    // Display a single user by UName
    app.get('/USERS/:UName', (request, response) => {
        const UName = request.params.UName;

        pool.query('SELECT * FROM USERS WHERE UName = ?', UName, (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });

    //Add a new user
    app.post('/USERS', (request, response) => {
        pool.query('INSERT INTO USERS SET ?', request.body, (error, result) => {
            if (error) {
                console.log("something went wrong")
            }
            response.send(result)
        });
    });


    // Update an existing user
    app.put('/USERS/:UName', (request, response) => {
        const UName = request.params.UName;

        pool.query('UPDATE USERS SET ? WHERE UName = ?', [request.body, UName], (error, result) => {
            if (error) throw error;

            response.send('User updated successfully.');
        });
    });

    // Delete a user
    app.delete('/USERS/:UName', (request, response) => {
        const UName = request.params.UName;

        pool.query('DELETE FROM USERS WHERE UName = ?', UName, (error, result) => {
            if (error) throw error;
            response.send('User deleted.');
        });
    });
    //END USER FUNCTIONS

    //REVIEW FUNCTIONS
    app.get('/REVIEW', (request, response) => {
        //console.log('here')
        pool.query('SELECT REVID FROM REVIEW ORDER BY REVID DESC LIMIT 1;', (error, result) => {
            if (error) throw error;
            //console.log("here", result[0].REVID)
            response.send(result[0].REVID.toString());
        });
    });

    // Display a single REVIEW FOR UNAMEW(REFERENCES UNAME)
    app.get('/REVIEW/:REVID', (request, response) => {
        const REVID = request.params.REVID;
        pool.query('SELECT * FROM REVIEW WHERE REVID = ?', REVID, (error, result) => {
            if (error) throw error;
            //var tmp2 = result[0].CurrRev
            const buf = new Buffer.from(result[0].CurrRev, "binary")
            //console.log(buf)
            response.send(result[0].REVNAME + "$#" + buf);
        });
    });

    //Add a new REVIEW
    app.post('/REVIEW', (request, response) => {
        pool.query('INSERT INTO REVIEW SET ?', request.body, (error, result) => {
            if (error) throw error;
            //console.log(result)
            response.send(result)
        });
    });

    // Update an existing REVIEW
    app.put('/REVIEW/:REVID', (request, response) => {
        const REVID = request.params.REVID;
        pool.query('UPDATE REVIEW SET ? WHERE REVID = ?', [request.body, REVID], (error, result) => {
            if (error) throw error;

            response.send('REVIEW updated successfully.');
        });
    });

    // Delete a user
    app.delete('/REVIEW/:REVID', (request, response) => {
        const REVID = request.params.REVID;

        pool.query('DELETE FROM REVIEW WHERE REVID = ?', REVID, (error, result) => {
            if (error) throw error;
            response.send('REVIEW deleted.');
        });
    });

    app.post('/WORKS_ON_REVIEWS', (request, response) => {
        pool.query('INSERT INTO WORKS_ON_REVIEWS SET ?', request.body, (error, result) => {
            if (error) throw error;
            response.send(result)
        });
    });

    app.get('/WORKS_ON_REVIEWS/:UNameW', (request, response) => {
        const UNameW = request.params.UNameW;
        pool.query('SELECT * FROM WORKS_ON_REVIEWS WHERE UNameW = ?', UNameW, (error, result) => {
            if (error) console.log(err);
            //console.log(result)
            //var tmp2 = result[0].REVIDREF
            response.send(result);
        });
    });
}
// Export the router
module.exports = router;