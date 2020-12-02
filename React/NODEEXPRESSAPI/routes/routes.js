// Load the MySQL pool connection
const pool = require('../data/config');

// Route the app
const router = app => {
    // Display welcome message on the root
    app.get('/', (request, response) => {
        response.send({
            message: 'Welcome to the Node.js Express REST API!'
        });
    });

    // Display all USERS
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
}

// Export the router
module.exports = router;