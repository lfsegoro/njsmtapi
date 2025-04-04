import express from 'express';
import bodyParser from 'body-parser';
import * as MikroNode from 'mikrotik';

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Route to render the form (GET request)
app.get('/', (req, res) => {
    res.render('index', { result: null, error: null });
});

// Route to handle form submission (POST request)
app.post('/send-command', (req, res) => {
    const { ip, username, password, command } = req.body;

    // Connect to MikroTik
    const connection = MikroNode.getConnection(ip, username, password, {
        // closeOnDone: true
    });

    connection.getConnectPromise()
        .then((conn) => {
            // Execute the API command
            conn.getCommandPromise(command).then((response) => {
                res.render('index', { result: JSON.stringify(response, null, 2), error: null });
            }).catch((err) => {
                res.render('index', { result: null, error: `Error executing command: ${err.message}` });
            });
        })
        .catch((err) => {
            res.render('index', { result: null, error: `Error connecting to MikroTik: ${err.message}` });
        });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
