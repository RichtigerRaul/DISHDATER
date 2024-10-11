// URLs für die JSON-Dateien
const ZUTATEN_URL = "https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/json/z.json";
const REZEPTE_URL = "https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/json/r.json";

let zutaten = {};
let rezepte = [];
let likedZutaten = [];
let dislikedZutaten = [];
let bewertetZutaten = [];
let ausgewaehlteMahlzeit = '';
let bewertungsCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    ausgewaehlteMahlzeit = localStorage.getItem('selectedMeal');
    console.log('Ausgewählte Mahlzeit:', ausgewaehlteMahlzeit);
    if (!ausgewaehlteMahlzeit) {
        console.log('Keine Mahlzeit ausgewählt, Weiterleitung zur Auswahl');
        window.location.href = 'meal-selection.html';
        return;
    }
    
    loadData();

    document.getElementById('likeButton').addEventListener('click', () => bewerten(true));
    document.getElementById('dislikeButton').addEventListener('click', () => bewerten(false));
    
    const backButton = document.getElementById('backToMealSelection');
    if (backButton) {
        backButton.addEventListener('click', backToMealSelection);
        console.log('Back to meal selection button listener added');
    } else {
        console.error('Back to meal selection button not found');
    }
    
    document.getElementById('restartGame').addEventListener('click', resetGame);
});

async function loadData() {
    try {
        console.log('Starte Datenladen...');
        const zutatenResponse = await fetch(ZUTATEN_URL);
        const rezepteResponse = await fetch(REZEPTE_URL);

        if (!zutatenResponse.ok || !rezepteResponse.ok) {
            throw new Error(`HTTP error! status: ${zutatenResponse.status} ${rezepteResponse.status}`);
        }

        const zutatenData = await zutatenResponse.json();
        zutaten = zutatenData.z;
        console.log('Zutaten geladen:', zutaten);

        const rezepteData = await rezepteResponse.json();
        rezepte = rezepteData.rezepte;
        console.log('Rezepte geladen:', rezepte);

        showNextZutat();
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        document.getElementById('zutat').textContent = 'Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.';
    }
}

function getRandomZutat() {
    console.log('Getting random Zutat for:', ausgewaehlteMahlzeit);
    const mahlzeitZutaten = zutaten.Mahlzeiten[ausgewaehlteMahlzeit];
    console.log('Mahlzeit Zutaten:', mahlzeitZutaten);
    const unbewerteteZutaten = mahlzeitZutaten.filter(id => !bewertetZutaten.includes(id));
    console.log('Unbewertete Zutaten:', unbewerteteZutaten);
    if (unbewerteteZutaten.length === 0) return null;
    const randomId = unbewerteteZutaten[Math.floor(Math.random() * unbewerteteZutaten.length)];
    return getZutatById(randomId);
}

function getZutatById(id) {
    for (const kategorie of Object.values(zutaten.Kategorien)) {
        const zutat = kategorie.find(z => z.id === id);
        if (zutat) return zutat;
    }
    return null;
}

function showNextZutat() {
    console.log('Zeige nächste Zutat...');
    const zutat = getRandomZutat();
    if (!zutat) {
        console.log('Keine Zutaten mehr verfügbar');
        document.getElementById('zutat').textContent = 'Alle Zutaten bewertet!';
        return;
    }
    console.log('Ausgewählte Zutat:', zutat);
    document.getElementById('zutat').textContent = zutat.name;
    document.getElementById('zutat').dataset.id = zutat.id;
    document.getElementById('zutatBild').src = `https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main${zutat.img}`;
}

// ... [Rest der Funktionen bleiben unverändert]

function backToMealSelection() {
    console.log('Zurück zur Mahlzeitenauswahl');
    window.location.href = 'meal-selection.html';
}

// ... [Rest des Codes bleibt unverändert]
