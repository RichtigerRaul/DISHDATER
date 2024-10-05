// app.js

document.addEventListener("DOMContentLoaded", function() {
    // Start-Button-Logik für index.html
    const startButton = document.getElementById('start-button');
    
    if (startButton) {
        startButton.addEventListener('click', function() {
            // Navigation zur Menüseite
            navigateTo('menu.html'); // Hier wird auf menu.html weitergeleitet
        });
    }

    // Einstellungen laden, falls auf settings.html
    if (document.getElementById('animal-checkbox') && document.getElementById('milk-checkbox')) {
        loadSettings();
    }

    // Eventlistener für "Zurück" Button in den Einstellungen
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            saveSettings(); // Einstellungen speichern
            goBack(); // Zur vorherigen Seite zurückkehren
        });
    }
});
