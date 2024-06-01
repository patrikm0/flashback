document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameKey = urlParams.get('game');
    const gameData = window.game[gameKey];
    displayGameDetails(gameData);
});

// Function to display game details
function displayGameDetails(game) {
    const gameDetailContent = document.getElementById('game-detail-content');

    // Create game title
    const gameTitle = document.createElement('h1');
    gameTitle.textContent = game.Title;
    gameDetailContent.appendChild(gameTitle);

    // Add game iframe
    const gameIframe = document.createElement('iframe');
    gameIframe.src = game.Iframe;
    gameIframe.width = "100%";
    gameIframe.height = "600";
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
