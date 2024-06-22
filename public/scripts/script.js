document.addEventListener('DOMContentLoaded', () => {
    console.log('Website ist geladen');
    console.log('Game data:', window.game); // This should log the game data
    createGenreButtons();
    displayGames();
    checkSession();

    // Event Listener for Sign Up Button
    const signupButton = document.getElementById('signup-button');
    if (signupButton) {
        signupButton.onclick = function() {
            document.getElementById('signup-modal').style.display = 'block';
        }
    } else {
        console.error('Signup button not found');
    }

    // Event Listener for Login Button
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.onclick = function() {
            document.getElementById('login-modal').style.display = 'block';
        }
    } else {
        console.error('Login button not found');
    }

    // Event Listener for the Language Modal
    const languageButton = document.getElementById('language-button');
    if (languageButton) {
        languageButton.onclick = function() {
            document.getElementById('language-modal').style.display = 'block';
        }
    } else {
        console.error('Language button not found');
    }

    // Event Listener for closing the Sign Up Modal
    const closeSignup = document.getElementById('close-signup');
    if (closeSignup) {
        closeSignup.onclick = function() {
            document.getElementById('signup-modal').style.display = 'none';
        }
    } else {
        console.error('Close signup button not found');
    }

    // Event Listener for closing the Login Modal
    const closeLogin = document.getElementById('close-login');
    if (closeLogin) {
        closeLogin.onclick = function() {
            document.getElementById('login-modal').style.display = 'none';
        }
    } else {
        console.error('Close login button not found');
    }

    // Event Listener for closing the Language Modal
    const closeLanguage = document.getElementById('close-language');
    if (closeLanguage) {
        closeLanguage.onclick = function() {
            document.getElementById('language-modal').style.display = 'none';
        }
    } else {
        console.error('Close language button not found');
    }

    // Event listener for search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchQuery = e.target.value.toLowerCase();
            displayGames('All', searchQuery);
        });
    } else {
        console.error('Search input not found');
    }

    // Event Listener for dark mode
    
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check local storage for dark mode setting
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        enableDarkMode();
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
    
});

//Dark Mode Funktion
function enableDarkMode() {
    const body = document.body;
    body.classList.add('dark-mode');
    const elements = document.querySelectorAll(
        'header, .container, #search-input, .button, #language-button, .modal-content, .sideBox, .content-box, .game-card, footer, .game-detail-content-box, .welcome-box'
    );
    elements.forEach(element => {
        element.classList.add('dark-mode');
    });
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    const body = document.body;
    body.classList.remove('dark-mode');
    const elements = document.querySelectorAll(
        'header, .container, #search-input, .button, #language-button, .modal-content, .sideBox, .content-box, .game-card, footer, .game-detail-content-box, .welcome-box'
    );
    elements.forEach(element => {
        element.classList.remove('dark-mode');
    });
    localStorage.setItem('darkMode', 'disabled');
}

function createGenreButtons() {
    const gameData = window.game;
    const genres = new Set();

    // Extract unique genres from the game data
    for (const key in gameData) {
        if (gameData.hasOwnProperty(key)) {
            const game = gameData[key];
            game.Genres.forEach(genre => genres.add(genre));
        }
    }

    const genreButtonsContainer = document.getElementById('genre-buttons-container');

    // Create and append an "All" button to show all games
    const allButton = document.createElement('button');
    allButton.textContent = 'All';
    allButton.classList.add('button');
    allButton.addEventListener('click', () => displayGames('All'));
    genreButtonsContainer.appendChild(allButton);

    // Create and append buttons for each genre
    genres.forEach(genre => {
        const button = document.createElement('button');
        button.textContent = genre;
        button.classList.add('button');
        button.addEventListener('click', () => displayGames(genre));
        genreButtonsContainer.appendChild(button);
    });
}

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

function displayGames(filterGenre = 'All', searchQuery = '') {
    const contentBox = document.querySelector('.content-box');
    contentBox.innerHTML = ''; // Clear existing games
    const gameData = window.game; // Access the game data from games.js
    searchQuery = searchQuery.toLowerCase().trim(); // Normalize search query

    for (const key in gameData) {
        if (gameData.hasOwnProperty(key)) {
            const game = gameData[key];

            // Check if the game matches the genre and search query
            const matchesGenre = filterGenre === 'All' || game.Genres.includes(filterGenre);
            const matchesSearch = !searchQuery ||
                game.Title.toLowerCase().includes(searchQuery) ||
                game.Plot.toLowerCase().includes(searchQuery);

            if (matchesGenre && matchesSearch) {
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
}


// Event listener for genre selection
document.getElementById('Genres').addEventListener('change', (e) => {
    const selectedGenre = e.target.value;
    displayGames(selectedGenre);
});

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
