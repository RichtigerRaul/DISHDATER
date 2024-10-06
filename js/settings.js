// settings.js

// Lade die gespeicherten Einstellungen
function loadSettings() {
    const animalPref = localStorage.getItem('animal') === 'true';
    const milkPref = localStorage.getItem('milk') === 'true';

    document.getElementById('animal-checkbox').checked = animalPref;
    document.getElementById('milk-checkbox').checked = milkPref;
}

// Speichere die Einstellungen
function saveSettings() {
    localStorage.setItem('animal', document.getElementById('animal-checkbox').checked);
    localStorage.setItem('milk', document.getElementById('milk-checkbox').checked);
}
