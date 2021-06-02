
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

    //DIFFS_ON_FILES
    //extra comment cause I keep getting lost
    app.get('/DIFFS_ON_FILES', (request, response) => {
        pool.query('SELECT * FROM DIFFS_ON_FILES', (error, result) => {
            if (error) {console.log("something went wrong GET/DIFFS_ON_FILES")};
            //console.log(result);
            response.send(result);
        });
    });

    // Display commits by FIDREF
    app.get('/DIFFS_ON_FILES/:FIDREF', (request, response) => {
        const FIDREF = request.params.FIDREF;
    
        const history_var = request.headers.history_var
        if(history_var) {
            pool.query('SELECT * FROM DIFFS_ON_FILES WHERE FIDREF = ? ORDER BY DID DESC', FIDREF, (error, result) => {
                response.send(result);
            })
        }
        else {
            pool.query('SELECT * FROM DIFFS_ON_FILES WHERE FIDREF = ? AND APPROVED = 0', FIDREF, (error, result) => {
                if (result[0] != null) {
                    response.send(result[0]);
                } 
                else {
                    response.send(result);
                }
            });
        }
    });

    app.put('/DIFFS_ON_FILES/:FIDREF', (request, response) => {
        const FIDREF = request.params.FIDREF;
        pool.query('UPDATE DIFFS_ON_FILES SET ? WHERE FIDREF = ?', [request.body, FIDREF], (error, result) => {
            if (error) throw error;
            response.send(result)
        });
    });
    
    //Post a diff
    app.post('/DIFFS_ON_FILES', (request, response) => {
        pool.query('INSERT INTO DIFFS_ON_FILES SET ?', request.body, (error, result) => {
            if (error) {
                console.log(error)
            }
            //console.log(result);
            response.send(result);
        });
    });
    
     // Delete a diff
    app.delete('/DIFFS_ON_FILES/:CommID', (request, response) => {
        const CommID = request.params.CommID;

        pool.query('DELETE FROM DIFFS_ON_FILES WHERE FIDREF = ?', CommID, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    //PROJECT FUNCTIONS
    app.get('/PROJECT', (request, response) => {
        //console.log('here')
        pool.query('SELECT PID FROM PROJECT ORDER BY PID DESC LIMIT 1;', (error, result) => {
            if (error) throw error;
            //console.log("here", result[0].PID)
            response.send(result[0].PID.toString());
        });
    });

    // Display a single PROJECT FOR UNAMEW(REFERENCES UNAME)
    app.get('/PROJECT/:PID', (request, response) => {
        const PID = request.params.PID;
        pool.query('SELECT * FROM PROJECT WHERE PID = ?', PID, (error, result) => {
            if (error) throw error;
            //var tmp2 = result[0].CurrRev
            //const buf = new Buffer.from(result[0].CurrRev, "binary")
            //console.log(buf)
            //response.send(result[0].PROJNAME + "$#BREAKBREAK" + result[0].FName + "$#BREAKBREAK" + buf);
            response.send(result)
        });
    });

    //Add a new PROJECT
    app.post('/PROJECT', (request, response) => {
        pool.query('INSERT INTO PROJECT SET ?', request.body, (error, result) => {
            if (error) throw error;
            //console.log(result)
            response.send(result)
        });
    });

    // Update an existing PROJECT
    app.put('/PROJECT/:PID', (request, response) => {
        const PID = request.params.PID;
        pool.query('UPDATE PROJECT SET ? WHERE PID = ?', [request.body, PID], (error, result) => {
            if (error) throw error;

            response.send('PROJECT updated successfully.');
        });
    });

    // Delete a user
    app.delete('/PROJECT/:PID', (request, response) => {
        const PID = request.params.PID;

        pool.query('DELETE FROM PROJECT WHERE PID = ?', PID, (error, result) => {
            if (error) throw error;
            response.send('PROJECT deleted.');
        });
    });

    app.delete('/WORKS_ON_PROJECTS/:PIDREF', (request, response) => {
        const PIDREF = request.params.PID;

        pool.query('DELETE FROM WORKS_ON_PROJECTS WHERE PIDREF = ?', PIDREF, (error, result) => {
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
        pool.query('SELECT * FROM WORKS_ON_PROJECTS WHERE PIDREF = ?', test, (error, result) => {
            if (error) console.log(error);
            console.log(result)
            //var tmp2 = result[0].PIDREF
            response.send(result);
        });
    });

    app.get('/WORKS_ON_PROJECTS/:UNameW', (request, response) => {
        const UNameW = request.params.UNameW;
        pool.query('SELECT * FROM WORKS_ON_PROJECTS WHERE UNameW = ?', UNameW, (error, result) => {
            if (error) console.log(error);
            //console.log(result)
            //var tmp2 = result[0].PIDREF
            response.send(result);
        });
    });

    app.put('/WORKS_ON_PROJECTS/:PIDREF', (request, response) => {
        const PIDREF = request.params.PIDREF;
        pool.query('UPDATE WORKS_ON_PROJECTS SET ? WHERE PIDREF = ?', [request.body, PIDREF], (error, result) => {
            if (error) throw error;
            response.send('COMMENTS_ON_REVIEWS/PIDREF updated successfully.');
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
    app.get('/COMMENTS_ON_REVIEWS/:FIDREF', (request, response) => {
        const FIDREF = request.params.FIDREF;
        pool.query('SELECT * FROM COMMENTS_ON_REVIEWS WHERE FIDREF = ?', FIDREF, (error, result) => {
            if (error) console.log(error)
            response.send(result);
            // console.log("comments here")
        });
    });

    // Update an existing COMMENTS_ON_REVIEWS
    app.put('/COMMENTS_ON_REVIEWS/:PIDREF', (request, response) => {
        const PIDREF = request.params.PIDREF;
        pool.query('UPDATE COMMENTS_ON_REVIEWS SET ? WHERE PIDREF = ?', [request.body, PIDREF], (error, result) => {
            if (error) throw error;
            response.send('COMMENTS_ON_REVIEWS/PIDREF updated successfully.');
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
        const RIREVID = request.headers.fidref;
        console.log("here")
        console.log(RIREVID)
        if(RIREVID === undefined){
            pool.query('SELECT * FROM INVITE_TO_REV WHERE RIUNAME = ?', RIUNAME, (error, result) => {
                if (error) console.log(error);
                response.send(result);
            });
        }
        else{
            pool.query('SELECT * FROM INVITE_TO_REV WHERE RIUNAME = ? AND FIDREF = ?', [RIUNAME, RIREVID], (error, result) => {
                if (error) console.log(error);
                response.send(result);
            });
        }
    });

    app.put('/INVITE_TO_REV/:FIDREF', (request, response) => {
        const FIDREF = request.params.FIDREF;
        const RIUNAME = request.headers.riuname;
        pool.query('UPDATE INVITE_TO_REV SET ? WHERE FIDREF = ? AND RIUNAME = ?', [request.body, FIDREF, RIUNAME], (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });

    //Files_In_Proj routes -- ignore all comments except this in this section.
    //i just copy pasted from projects. descriptions are correctish, names are wrong.
    app.get('/FILES_IN_PROJ', (request, response) => {
        //console.log('here')
        pool.query('SELECT FID FROM FILES_IN_PROJ ORDER BY FID DESC LIMIT 1;', (error, result) => {
            if (error) throw error;
            //console.log("here", result[0].PID)
            response.send(result[0].FID.toString());
        });
    });

    // Display a single PROJECT FOR UNAMEW(REFERENCES UNAME)
    app.get('/FILES_IN_PROJ/:FNAME', (request, response) => {
        const FNAME = request.params.FNAME;
        const test = request.headers.test;
        const pidref = request.headers.pidref;
        if(test == -1) {
            pool.query('SELECT * FROM FILES_IN_PROJ WHERE PIDREF = ?', FNAME, (error, result) => {
                
                if (error) throw error;
                //var tmp2 = result[0].CurrRev
                //const buf = new Buffer.from(result[0].FCONTENT, "binary")
            
                response.send(result);
            });
        }
        else if (test == 0 && pidref != null) {
            pool.query('SELECT * FROM FILES_IN_PROJ WHERE FNAME = ? AND PIDREF = ?', [FNAME, pidref], (error, result) => {
                if (error) throw error;
                response.send(result)
            });
        }
        else if (test == 1){
            pool.query('SELECT * FROM FILES_IN_PROJ WHERE FID = ?', FNAME, (error, result) =>{
                if(error){
                    console.log(error)
                }
                response.send(result)
            })
        }
        else if (test == null && pidref == null){
            pool.query('SELECT * FROM FILES_IN_PROJ WHERE FNAME = ?', FNAME, (error, result) => {
                if (error) throw error;
                const buf = new Buffer.from(result[0].FCONTENT, "binary")
                response.send(buf);
            });
        }
        else if (test == 2){
            
            pool.query('SELECT * FROM FILES_IN_PROJ WHERE FID = ?', FNAME, (error, result) => {
                if (error) throw error;
                const buf = new Buffer.from(result[0].FCONTENT, "binary")
                response.send(buf);
            });
        }
    });

    //Add a new PROJECT
    app.post('/FILES_IN_PROJ', (request, response) => {
        pool.query('INSERT INTO FILES_IN_PROJ SET ?', request.body, (error, result) => {
            if (error) throw error;
            //console.log(result)
            response.send(result)
        });
    });

    // Update an existing PROJECT
    app.put('/FILES_IN_PROJ/:FID', (request, response) => {
        const FID = request.params.FID;
        pool.query('UPDATE FILES_IN_PROJ SET ? WHERE FID = ?', [request.body, FID], (error, result) => {
            if (error) throw error;
            response.send(result)
        });
    });

    // Delete a user
    app.delete('/FILES_IN_PROJ/:FID', (request, response) => {
        const FID = request.params.FID;
        pool.query('DELETE FROM FILES_IN_PROJ WHERE FID = ?', FID, (error, result) => {
            if (error) throw error;
            response.send(result)
        });
    });
}
// Export the router
module.exports = router;