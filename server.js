const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');

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
    host: 'localhost', //database host
    user: 'root', //database user
    password: 'JaliBrown18!', //database password
    database: 'flashback_db' //database name
}); 

//database connection
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

// Dummy database for demonstration purposes
const users = {};

// Signup route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
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

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
