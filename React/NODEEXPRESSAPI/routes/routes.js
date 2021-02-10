// Load the MySQL pool connection
const pool = require('../data/config');

// Route the app
const router = app => {
    // ROOT GET - SHOULDNT EVER BE USED ON SITE AFAIK
    //app.get('/', (request, response) => {
    //    response.send({
    //      message: 'Welcome to the Node.js Express REST API!'
    //    });
    //});

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
            if (error) throw error;
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
    // Display all REVIEWS - also shouldn't be used except in admin tools
    app.get('/REVIEW', (request, response) => {
        pool.query('SELECT * FROM REVIEW', (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });

    // Display a single REVIEW FOR UNAMEW(REFERENCES UNAME)
    app.get('/REVIEW/:REVID', (request, response) => {
        const REVID = request.params.REVID;
        pool.query('SELECT * FROM REVIEW WHERE REVID = ?', REVID, (error, result) => {
            //ar base64data = Buffer.from(result[0].)
            if (error) throw error;
            tmp = result[0].CurrRev.toString('utf-8')
            var tmp2 = result[0];
            response.send(tmp);
        });
    });

    app.get('/f1/:FID', (request, response) => {
        const FID = request.params.FID;
        pool.query('SELECT * FROM f1 WHERE FID = ?', FID, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    //Add a new REVIEW
    app.post('/REVIEW', (request, response) => {
        pool.query('INSERT INTO REVIEW SET ?', request.body, (error, result) => {
            if (error) throw error;
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
}

// Export the router
module.exports = router;