//Login
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user and stores their information securely.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Email already registered or bad request parameters
 */

//Signup
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate a user
 *     description: Logs in a user by email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized, invalid email or password
 */

//Logout
/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logs out a user
 *     description: Destroys the user's session and logs them out.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Internal server error
 */

//Session check
/**
 * @swagger
 * /check-session:
 *   get:
 *     summary: Check user session
 *     description: Returns user session details if logged in.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User is currently logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedIn:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: User is not logged in
 */

//Post request to igbd
/**
 * @swagger
 * /games/search:
 *   post:
 *     summary: Search for game details
 *     description: Retrieves game details based on the game name. The response includes the first release date, name, rating, summary, and associated genres of the game.
 *     tags:
 *       - IGDB API
 *     operationId: searchGames
 *     parameters:
 *       - in: header
 *         name: Client-ID
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID to authenticate the API request
 *       - in: header
 *         name: API-Token
 *         required: true
 *         schema:
 *           type: string
 *         description: API-Token to authenticate the API request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *                 description: The name of the game to search for
 *               fields:
 *                 type: string
 *                 default: 'first_release_date, name, rating, summary, genres'
 *                 description: Fields to be included in the response
 *           example:
 *             search: "The Witcher 3"
 *             fields: "first_release_date, name, rating, summary, genres"
 *     responses:
 *       200:
 *         description: A list of games that match the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the game
 *                   first_release_date:
 *                     type: number
 *                     format: unix time stamp
 *                     description: The release date of the game
 *                   rating:
 *                     type: number
 *                     format: float
 *                     description: Rating of the game
 *                   summary:
 *                     type: string
 *                     description: Summary of the game
 *                   genres:
 *                     type: array
 *                     items:
 *                       type: number
 *                       description: List of genres associated with the game
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No games found
 */

// Update email
/**
 * @swagger
 * /update-email:
 *   put:
 *     summary: Update user email
 *     description: Allows a logged-in user to update their email address.
 *     tags:
 *       - User Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newEmail:
 *                 type: string
 *                 format: email
 *                 description: The new email address to be set
 *     responses:
 *       200:
 *         description: Email updated successfully
 *       400:
 *         description: Bad request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database update error
 */

// Delete account
/**
 * @swagger
 * /delete-account:
 *   delete:
 *     summary: Delete user account
 *     description: Allows a logged-in user to delete their account.
 *     tags:
 *       - User Management
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database delete error
 */



const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'LPpjWMsa', // Replace with a secret key of your choice
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

const db = mysql.createConnection({
    host: 'localhost', // database host
    user: 'root', // database user
    password: '', // database password
    database: 'flashback_db' // database name
});

// database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.use((req, res, next) => {
    req.db = db;
    next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Debug logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();

// Signup route
app.post('/signup', async (req, res) => {
    const { username, email, password, recaptchaToken } = req.body;
    const secretKey = '6Le7IAAqAAAAACl2g9o3pMcNeV1DCrBx-anKBYy1';

    // Verify reCAPTCHA token
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    const recaptchaResponse = await fetch(recaptchaUrl, { method: 'POST' });
    const recaptchaResult = await recaptchaResponse.json();

    if (!recaptchaResult.success) {
        return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
    }
    else{
        req.db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.json({ success: false, message: 'Database query error' });
        }
        if (results.length > 0) {
            return res.json({ success: false, message: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        req.db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword], (err, results) => {
                if (err) {
                    return res.json({ success: false, message: 'Database insert error' });
                }
                res.json({ success: true });
            });
    });
    }
    
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    req.db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.json({ success: false, message: 'Database query error' });
        }
        if (results.length === 0) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }
        req.session.user = { username: user.username, email: user.email };
        res.json({ success: true });
    });
});

// Delete account route
app.delete('/delete-account', (req, res) => {
    if (!req.session.user || !req.session.user.email) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userEmail = req.session.user.email;

    req.db.query('DELETE FROM users WHERE email = ?', [userEmail], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database delete error' });
        }

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to destroy session' });
            }
            res.clearCookie('connect.sid', { path: '/' });
            return res.json({ success: true });
        });
    });
});

// Update email route
app.put('/update-email', (req, res) => {
    const newEmail = req.body.newEmail;
    const userEmail = req.session.user.email;

    req.db.query('UPDATE users SET email = ? WHERE email = ?', [newEmail, userEmail], (err, results) => {
        if (err) {
            return res.json({ success: false, message: 'Database update error' });
        }
        req.session.user.email = newEmail; // Update the session email
        res.json({ success: true });
    });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.json({ success: false, message: 'Failed to destroy session' });
        }
        res.clearCookie('connect.sid', { path: '/' });
        res.json({ success: true });
    });
});

// Check session route
app.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});


// Serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Flashback Documentation',
            version: '1.0.0',
            description: 'A nostalgic game archive hosting only quality content',
        },
        servers: [
            {
                url: 'http://localhost:3000/',
            }
        ]
    },
    apis: ['./server.js'],
}

const spacs = swaggerjsdoc(options)
app.use(
    '/api-docs',
    swaggerui.serve,
    swaggerui.setup(spacs)
)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
