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
            if (error) {console.log("something went wrong GET/USERS")};

            response.send(result);
        });
    });

    // Display a single user by UName
    app.get('/USERS/:UName', (request, response) => {
        const UName = request.params.UName;
        pool.query('SELECT * FROM USERS WHERE UName = ?', UName, (error, result) => {
            if (error) {console.log("something went wrong GET/USERS/:UName")};
            response.send(result);
        });
    });

    //Add a new user
    app.post('/USERS', (request, response) => {
        pool.query('INSERT INTO USERS SET ?', request.body, (error, result) => {
            if (error) {
                console.log("something went wrong POST/USERS")
            }
            response.send(result)
        });
    });


    // Update an existing user
    app.put('/USERS/:UName', (request, response) => {
        const UName = request.params.UName;

        pool.query('UPDATE USERS SET ? WHERE UName = ?', [request.body, UName], (error, result) => {
            if (error) {console.log("something went wrong PUT/USERS/:Uname")};

            response.send('1');
        });
    });

    // Delete a user
    app.delete('/USERS/:UName', (request, response) => {
        const UName = request.params.UName;

        pool.query('DELETE FROM USERS WHERE UName = ?', UName, (error, result) => {
            if (error) {console.log("something went wrong DELETE/USERS/:UNAME")};
            response.send('User deleted.');
        });
    });
    //END USER FUNCTIONS


    //COMMIT FUNCTIONS
    //Display 
    app.get('/COMMITS', (request, response) => {
            pool.query('SELECT * FROM COMMITS ORDER BY COMMID DESC LIMIT 1;', (error, result) => {
                if (error) {console.log("something went wrong GET/COMMITS which = 1")};
                //console.log(result);
                response.send(result[0].CommID.toString());
            });
    });

    // Display commits by UName
    app.get('/COMMITS/:UNameCom', (request, response) => {
        const UNameCom = request.params.UNameCom;
            pool.query('SELECT CommID FROM COMMITS WHERE UName = ?', UName, (error, result) => {
                if (error) {console.log("something went wrong get/COMMITS/:UNameCom which = 1")};
                //console.log(result);
                response.send(result);
            });
    });
    
    //Post a diff
    app.post('/COMMITS', (request, response) => {
        pool.query('INSERT INTO COMMITS SET ?', request.body, (error, result) => {
            if (error) {
                console.log("Something went wrong POST/COMMITS")
            }
            //console.log(result);
            response.send(result);
        });
    });
    
     // Delete a diff
    app.delete('/COMMITS/:CommID', (request, response) => {
        const CommID = request.params.CommID;

        pool.query('DELETE FROM COMMITS WHERE CommID = ?', CommID, (error, result) => {
            if (error) {console.log("something went wrong DELETE/COMMITS/:CommID")};
            response.send('Commit deleted.');
        });
    });

    //Commits_On_Reviews
    //extra comment cause I keep getting lost
    app.get('/COMMITS_ON_REVIEWS', (request, response) => {
        pool.query('SELECT * FROM COMMITS_ON_REVIEWS', (error, result) => {
            if (error) {console.log("something went wrong GET/COMMITS_ON_REVIEWS")};
            //console.log(result);
            response.send(result);
        });
    });

    // Display commits by UName
    app.get('/COMMITS_ON_REVIEWS/:CommID', (request, response) => {
        const CommID = request.params.CommID;

        pool.query('SELECT * FROM COMMITS_ON_REVIEWS WHERE CommID = ?', CommID, (error, result) => {
            if (error) {console.log("something went wrong GET/COMMITS_ON)REVIEWS/:CommID")};
            //console.log(result);
            response.send(result);
        });
    });
    
    //Post a diff
    app.post('/COMMITS_ON_REVIEWS', (request, response) => {
        pool.query('INSERT INTO COMMITS_ON_REVIEWS SET ?', request.body, (error, result) => {
            if (error) {
                console.log(error)
            }
            //console.log(result);
            response.send(result);
        });
    });
    
     // Delete a diff
    app.delete('/COMMITS_ON_REVIEWS/:CommID', (request, response) => {
        const CommID = request.params.CommID;

        pool.query('DELETE FROM COMMITS WHERE CommID = ?', CommID, (error, result) => {
            if (error) throw error;
            response.send('Commit deleted.');
        });
    });

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
            response.send(result[0].REVNAME + "$#BREAKBREAK" + buf);
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
        //console.log("request=", request.params)
        const UNameW = request.params.UNameW;
        pool.query('SELECT * FROM WORKS_ON_REVIEWS WHERE UNameW = ?', UNameW, (error, result) => {
            if (error) console.log(error);
            //console.log(result)
            //var tmp2 = result[0].REVIDREF
            response.send(result);
        });
    });

    //invites
    app.post('/INVITES', (request, response) => {
        pool.query('INSERT INTO INVITES SET ?', request.body, (error, result) => {
            if (error) throw error;
            response.send(result)
        });
    });
    app.get('/INVITES/:IUNAME', (request, response) => {
        //console.log("request=", request.params)
        const IUNAME = request.params.IUNAME;
        pool.query('SELECT * FROM INVITES WHERE IUNAME = ?', IUNAME, (error, result) => {
            if (error) console.log(error);
            //console.log(result)
            //var tmp2 = result[0].REVIDREF
            response.send(result);
        });
    });

    app.put('/INVITES/:IREVID', (request, response) => {
        const IREVID = request.params.IREVID;
        //const IUNAME = request.params.IUNAME;
        console.log("request params= ", request.params)
        console.log("request = ", request)
        pool.query('UPDATE INVITES SET ? WHERE IREVID = ?', [request.body, IREVID], (error, result) => {
            if (error) throw error;

            response.send('REVIEW updated successfully.');
        });
    });
}
// Export the router
module.exports = router;