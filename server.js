const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

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

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Dummy database for demonstration purposes
const users = {};

// Signup route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (users[email]) {
        return res.json({ success: false, message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users[email] = { username, email, password: hashedPassword };
    res.json({ success: true });
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users[email];
    if (!user) {
        return res.json({ success: false, message: 'Invalid email or password' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.json({ success: false, message: 'Invalid email or password' });
    }
    req.session.user = { username: user.username, email: user.email };
    res.json({ success: true });
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
