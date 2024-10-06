// app.js

document.addEventListener("DOMContentLoaded", function() {
    // Start-Button-Logik für index.html
    const startButton = document.getElementById('start-button');
    
    if (startButton) {
        startButton.addEventListener('click', function() {
            navigateToMenu();
        });
    }

    // Weitere Eventlistener können hier hinzugefügt werden, wenn benötigt
});

// Navigation zur Menü-Seite
function navigateToMenu() {
    window.location.href = 'menu.html'; // Leitet zur menu.html weiter
}
