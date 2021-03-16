
// Load the MySQL pool connection
const pool = require('../data/config');
var cors = require('cors')

const express = require('express');
const authenticatedRoute = express.Router();
const CognitoExpress = require('cognito-express');
const cognitoExpress = new CognitoExpress({
    region: "us-west-2",
    cognitoUserPoolId: "us-west-2_C1RUJC7Iu",
    tokenUse: "access", //Possible Values: access | id
    tokenExpiration: 36000000000 //Up to default expiration of 1 hour (3600000 ms)
});
authenticatedRoute.use(cors())
authenticatedRoute.use(function(req, res, next) {
    //I'm passing in the access token in header under key accessToken
    let accessTokenFromClient = req.headers.accesstoken;
    //Fail if token not present in header. 
    if (!accessTokenFromClient) return res.status(401).send("Access Token missing from header");
 
    cognitoExpress.validate(accessTokenFromClient, function(err, response) {
        //If API is not authenticated, Return 401 with error message. 
        if (err) return res.status(401).send(err);
        
        //Else API has been authenticated. Proceed.
        //res.locals.user = response;
        next();
    });
});
// Route the app
const router = app => {
    app.use(cors());
    // ROOT GET - SHOULDNT EVER BE USED ON SITE AFAIK
    //app.get('/', (request, response) => {
    //    response.send({
    //      message: 'Welcome to the Node.js Express REST API!'
    //    });
    //});
    app.post('/USERS', (request, response) => {
        pool.query('INSERT INTO USERS SET ?', request.body, (error, result) => {
            if (error) {
                console.log("something went wrong POST/USERS")
            }
            response.send(result)
        });
    });
    
    app.use(authenticatedRoute)
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
            response.send(result[0].REVNAME + "$#BREAKBREAK" + result[0].FName + "$#BREAKBREAK" + buf);
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

    app.delete('/WORKS_ON_PROJECTS/:REVID', (request, response) => {
        const REVIDREF = request.params.REVID;

        pool.query('DELETE FROM WORKS_ON_PROJECTS WHERE REVIDREF = ?', REVIDREF, (error, result) => {
            if (error) throw error;
            response.send('REVIEW deleted.');
        });
    });

    app.post('/WORKS_ON_PROJECTS', (request, response) => {
        pool.query('INSERT INTO WORKS_ON_PROJECTS SET ?', request.body, (error, result) => {
            if (error) throw error;
            response.send(result)
        });
    });

    app.get('/WORKS_ON_PROJECTS/', (request, response) => {
        const test = request.headers.test;
        pool.query('SELECT * FROM WORKS_ON_PROJECTS WHERE REVIDREF = ?', test, (error, result) => {
            if (error) console.log(error);
            console.log(result)
            //var tmp2 = result[0].REVIDREF
            response.send(result);
        });
    });

    app.get('/WORKS_ON_PROJECTS/:UNameW', (request, response) => {
        const UNameW = request.params.UNameW;
        pool.query('SELECT * FROM WORKS_ON_PROJECTS WHERE UNameW = ?', UNameW, (error, result) => {
            if (error) console.log(error);
            //console.log(result)
            //var tmp2 = result[0].REVIDREF
            response.send(result);
        });
    });

    //Post comments on review
    app.post('/COMMENTS_ON_REVIEWS/', (request, response) => {
        pool.query('INSERT INTO COMMENTS_ON_REVIEWS SET ?', request.body, (error, result) => {
            if (error) throw error;
            response.send(result)
            console.log("POST comment")
        });
    });

    //Display COMMENTS_ON_REVIEW by uName
    app.get('/COMMENTS_ON_REVIEWS/:UNameC', (request, response) => {
        const UNameC = request.params.UNameC;
        pool.query('SELECT * FROM COMMENTS_ON_REVIEWS WHERE UNameC = ?', UNameC, (error, result) => {
            if (error) console.log(error)
            response.send(result);
            // console.log("comments here")
        });
    });

    // Update an existing COMMENTS_ON_REVIEWS
    app.put('/COMMENTS_ON_REVIEWS/:REVIDREF', (request, response) => {
        const REVIDREF = request.params.REVIDREF;
        pool.query('UPDATE COMMENTS_ON_REVIEWS SET ? WHERE REVIDREF = ?', [request.body, REVIDREF], (error, result) => {
            if (error) throw error;
            response.send('COMMENTS_ON_REVIEWS/REVIDREF updated successfully.');
        });
    });

    //invites
    app.post('/INVITES', (request, response) => {
        pool.query('INSERT INTO INVITES SET ?', request.body, (error, result) => {
            if (error) throw error;
            response.send(result)
        });
    });

    app.delete('/INVITES/:IREVID', (request, response) => {
        const IREVID = request.params.IREVID;

        pool.query('DELETE FROM INVITES WHERE IREVID = ?', IREVID, (error, result) => {
            if (error) throw error;
            response.send('REVIEW deleted.');
        });
    });
    app.get('/INVITES/:IUNAME', (request, response) => {
        const IUNAME = request.params.IUNAME;
        const IREVID = request.headers.rid;
        if(IREVID === undefined){
            pool.query('SELECT * FROM INVITES WHERE IUNAME = ?', IUNAME, (error, result) => {
                if (error) console.log(error);
                response.send(result);
            });
        }
        else{
            pool.query('SELECT * FROM INVITES WHERE IUNAME = ? AND IREVID = ?', [IUNAME, IREVID], (error, result) => {
                if (error) console.log(error);
                response.send(result);
            });
        }
    });

    app.put('/INVITES/:IREVID', (request, response) => {
        const IREVID = request.params.IREVID;
        const IUNAME = request.headers.iuname;
        pool.query('UPDATE INVITES SET ? WHERE IREVID = ? AND IUNAME = ?', [request.body, IREVID, IUNAME], (error, result) => {
            if (error) throw error;

            response.send('REVIEW updated successfully.');
        });
    });

    //review invites
    app.post('/INVITE_TO_REV', (request, response) => {
        pool.query('INSERT INTO INVITE_TO_REV SET ?', request.body, (error, result) => {
            if (error) throw error;
            response.send(result)
        });
    });

    app.delete('/INVITE_TO_REV/:IREVID', (request, response) => {
        const RIREVID = request.params.RIREVID;

        pool.query('DELETE FROM INVITE_TO_REV WHERE RIREVID = ?', RIREVID, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });
    app.get('/INVITE_TO_REV/:RIUNAME', (request, response) => {
        const RIUNAME = request.params.RIUNAME;
        const RIREVID = request.headers.rid;
        if(RIREVID === undefined){
            pool.query('SELECT * FROM INVITE_TO_REV WHERE RIUNAME = ?', RIUNAME, (error, result) => {
                if (error) console.log(error);
                response.send(result);
            });
        }
        else{
            pool.query('SELECT * FROM INVITE_TO_REV WHERE RIUNAME = ? AND RIREVID = ?', [RIUNAME, RIREVID], (error, result) => {
                if (error) console.log(error);
                response.send(result);
            });
        }
    });

    app.put('/INVITE_TO_REV/:RIREVID', (request, response) => {
        const RIREVID = request.params.RIREVID;
        const RIUNAME = request.headers.riuname;
        pool.query('UPDATE INVITE_TO_REV SET ? WHERE RIREVID = ? AND RIUNAME = ?', [request.body, RIREVID, RIUNAME], (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });
}
// Export the router
module.exports = router;