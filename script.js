document.addEventListener('DOMContentLoaded', () => {
    console.log('Website ist geladen');
});

// Event Listener for Sign Up Button
document.getElementById('signup-button').onclick = function() {
    document.getElementById('signup-modal').style.display = 'block';
}

// Event Listener for Login Button
document.getElementById('login-button').onclick = function() {
    document.getElementById('login-modal').style.display = 'block';
}

// Event Listener for closing the Sign Up Modal
document.getElementById('close-signup').onclick = function() {
    document.getElementById('signup-modal').style.display = 'none';
}

// Event Listener for closing the Login Modal
document.getElementById('close-login').onclick = function() {
    document.getElementById('login-modal').style.display = 'none';
}

// Event Listener for the Language Modal
document.getElementById('language-button').onclick = function() {
    document.getElementById('language-modal').style.display = 'block';
}

// Event Listener for closing the Language Modal
document.getElementById('close-language').onclick = function() {
    document.getElementById('language-modal').style.display = 'none';
}


// Submit event for Signup
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    if (data.success) {
        alert('Signup successful!');
        document.getElementById('signup-modal').style.display = 'none';
    } else {
        alert('Signup failed: ' + data.message);
    }
});

// Submit event for Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
        alert('Login successful!');
        document.getElementById('login-modal').style.display = 'none';
    } else {
        alert('Login failed: ' + data.message);
    }
});

