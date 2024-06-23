document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameKey = urlParams.get('game');
    const gameData = window.game[gameKey];
    displayGameDetails(gameData);
});

// Function to display game details
function displayGameDetails(game) {
    const gameDetailContent = document.getElementById('game-detail-content');
    
    // Clear any previous content
    gameDetailContent.innerHTML = '';

    // Create game title
    const gameTitle = document.createElement('h1');
    gameTitle.textContent = game.Title;
    gameDetailContent.appendChild(gameTitle);

    // Add game iframe with fixed size
    const gameIframe = document.createElement('iframe');
    gameIframe.src = game.Iframe;
    gameIframe.style.width = '100%';
    gameIframe.style.height = '700px'; // Set the same height as in CSS
    gameIframe.frameBorder = "0";
    gameDetailContent.appendChild(gameIframe);

    // Add game plot below the iframe
    const gamePlot = document.createElement("p");
    gamePlot.textContent = game.Plot;  
    gameDetailContent.appendChild(gamePlot); 

    // Add "Back to Home" button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Home';
    backButton.classList.add('button');
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    gameDetailContent.appendChild(backButton);
}


