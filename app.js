// app.js

document.addEventListener("DOMContentLoaded", function() {
    // Lade die Einstellungen, falls auf der Einstellungen-Seite
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

