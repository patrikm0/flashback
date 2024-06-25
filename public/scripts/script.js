document.addEventListener('DOMContentLoaded', () => {
    console.log('Website ist geladen');
    console.log('Game data:', window.game); // This should log the game data
    createGenreButtons();
    displayGames();
    checkSession();
    fetchRandomJoke();

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

    
    // Check if elements exist before adding event listeners
    const genreDropdown = document.getElementById('Genres');
    if (genreDropdown) {
        genreDropdown.addEventListener('change', (e) => {
            const selectedGenre = e.target.value;
            displayGames(selectedGenre);
        });
    } else {
        console.error('Genres dropdown not found');
    }
    
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const recaptchaToken = grecaptcha.getResponse();

            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, email, password, recaptchaToken})
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
    } else {
        console.error('Signup form not found');
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

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
    } else {
        console.error('Login form not found');
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
        themeToggle.textContent = 'Light Mode';
    } else {
        themeToggle.textContent = 'Dark Mode';
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
            themeToggle.textContent = 'Dark Mode';
        } else {
            enableDarkMode();
            themeToggle.textContent = 'Light Mode';
        }
    });

    // Get current position and fetch weather data
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchWeatherData(latitude, longitude);
        }, error => {
            console.error('Error getting location:', error);
            // Fallback coordinates (Vienna) in case of error
            fetchWeatherData(48.2085, 16.3721);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        // Fallback coordinates (Vienna)
        fetchWeatherData(48.2085, 16.3721);
    }
});

function fetchWeatherData(latitude, longitude) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,rain`)
        .then(response => response.json())
        .then(data => {
            const temperature = data.current.temperature_2m;
            const rain = data.current.rain;
            const temperatureDisplay = document.getElementById('temperature-display');
            temperatureDisplay.textContent = `Current Temperature: ${temperature} °C`;

            const message = document.getElementById('temperature-message');

            if (rain > 0) {
                message.textContent = 'Its rainy. Maybe you shoud stay inside and play your favorite games :)';
            } else if (temperature >= 14) {
                message.textContent = 'Its pretty warm outside. Dont you wanna go outside instead?';
            } else {
                message.textContent = 'The perfect weather to stay inside and play your favorite games :)';
            }
        })
        .catch(error => console.error('Error fetching temperature:', error));
}

// Dark Mode Funktionen
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

// Dark Mode anwenden auf neu erstellte Karten
function applyDarkModeToNewElements() {
    if (document.body.classList.contains('dark-mode')) {
        const elements = document.querySelectorAll('.game-card');
        elements.forEach(element => {
            element.classList.add('dark-mode');
        });
    }
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
        welcomeMessage.style.cursor = 'pointer'; // Make it clickable
        welcomeMessage.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
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
                gamePoster.className = "poster";
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

    // Apply dark mode to newly created game cards
    applyDarkModeToNewElements();
}


function fetchRandomJoke() {
    fetch('https://official-joke-api.appspot.com/random_joke')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Random Joke:', data);
            displayJoke(data);
        })
        .catch(error => {
            console.error('Error fetching joke:', error);
            const jokeContainer = document.getElementById('joke-container');
            jokeContainer.textContent = 'Failed to load joke. Please try again later.';
        });
}

function displayJoke(joke) {
    const jokeContainer = document.getElementById('joke-container');
    jokeContainer.textContent = `${joke.setup} - ${joke.punchline}`;
    jokeContainer.classList.add('joke-style'); // Add a class for styling
}