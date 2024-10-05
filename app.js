// app.js

document.addEventListener("DOMContentLoaded", function() {
    // Start-Button-Logik für index.html
    const startButton = document.getElementById('start-button');
    
    if (startButton) {
        startButton.addEventListener('click', function() {
            navigateTo('menu.html');
        });
    }

    // Einstellungen, wenn auf settings.html
    if (document.getElementById('animal-checkbox') && document.getElementById('milk-checkbox')) {
        loadSettings();
    }

    // Eventlistener für "Zurück" Button in den Einstellungen
    if (document.getElementById('back-button')) {
        document.getElementById('back-button').addEventListener('click', function() {
            saveSettings();
            goBack();
        });
    }
});
