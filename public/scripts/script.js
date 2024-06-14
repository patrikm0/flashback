document.addEventListener('DOMContentLoaded', () => {
    console.log('Website ist geladen');
    console.log('Game data:', window.game); // This should log the game data
    displayGames();
    checkSession();
});

async function checkSession() {
    const response = await fetch('/check-session');
    const data = await response.json();
    if (data.loggedIn) {
        document.getElementById('login-button').style.display = 'none';
        document.getElementById('signup-button').style.display = 'none';
        
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Logout';
        logoutButton.classList.add('button');
        logoutButton.addEventListener('click', logout);
        document.getElementById('searchAndButtons').appendChild(logoutButton);

        const welcomeMessage = document.createElement('span');
        welcomeMessage.textContent = `Welcome, ${data.user.username}`;
        welcomeMessage.classList.add('welcome-box');
        document.getElementById('searchAndButtons').appendChild(welcomeMessage);
    }
}

async function logout() {
    const response = await fetch('/logout');
    const data = await response.json();
    if (data.success) {
        window.location.reload();
    }
}

// Function to display games (already provided)
function displayGames() {
    const contentBox = document.querySelector('.content-box');
    const gameData = window.game; // Access the game data from games.js

    for (const key in gameData) {
        if (gameData.hasOwnProperty(key)) {
            const game = gameData[key];

            // Create game card
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            gameCard.setAttribute('data-game', key); // Add a data attribute for navigation

            // Add game poster
            const gamePoster = document.createElement('img');
            gamePoster.src = game.Poster;
            gamePoster.alt = `${game.Title} Poster`;
            gameCard.appendChild(gamePoster);

            // Add game title (hidden initially)
            const gameTitle = document.createElement('h3');
            gameTitle.textContent = game.Title;
            gameTitle.classList.add('game-title');
            gameCard.appendChild(gameTitle);

            // Add hover event to show title
            gameCard.addEventListener('mouseover', () => {
                gameTitle.style.display = 'block';
            });

            gameCard.addEventListener('mouseout', () => {
                gameTitle.style.display = 'none';
            });

            // Add click event to navigate to game detail page
            gameCard.addEventListener('click', () => {
                window.location.href = `game_detail.html?game=${key}`;
            });

            // Append game card to content box
            contentBox.appendChild(gameCard);
        }
    }
}

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
        checkSession(); // Check session after signup
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
        checkSession(); // Check session after login
    } else {
        alert('Login failed: ' + data.message);
    }
});