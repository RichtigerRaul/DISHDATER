// URLs für die JSON-Dateien
const ZUTATEN_URL = "https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/z.json";
const REZEPTE_URL = "https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/r.json";

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
    document.getElementById('backToMealSelection').addEventListener('click', backToMealSelection);
    document.getElementById('restartGame').addEventListener('click', resetGame);
});

async function loadData() {
    try {
        console.log('Starte Datenladen...');
        const zutatenResponse = await fetch(ZUTATEN_URL);
        const rezepteResponse = await fetch(REZEPTE_URL);

        if (!zutatenResponse.ok) {
            throw new Error(`HTTP error beim Laden der Zutaten! status: ${zutatenResponse.status}`);
        }
        if (!rezepteResponse.ok) {
            throw new Error(`HTTP error beim Laden der Rezepte! status: ${rezepteResponse.status}`);
        }

        const zutatenData = await zutatenResponse.json();
        zutaten = zutatenData.z;
        console.log('Zutaten geladen:', zutaten);

        const rezepteData = await rezepteResponse.json();
        rezepte = rezepteData.rezepte;
        console.log('Rezepte geladen:', rezepte);

        if (!zutaten || !zutaten.Kategorien || !zutaten.Mahlzeiten) {
            throw new Error('Zutaten-Daten sind nicht in der erwarteten Struktur.');
        }
        if (!rezepte || !Array.isArray(rezepte)) {
            throw new Error('Rezepte-Daten sind nicht in der erwarteten Struktur.');
        }

        showNextZutat();
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        document.getElementById('zutat').textContent = `Fehler beim Laden der Daten: ${error.message}`;
    }
}

function getRandomZutat() {
    console.log('Getting random Zutat for:', ausgewaehlteMahlzeit);
    const mahlzeitZutaten = zutaten.Mahlzeiten[ausgewaehlteMahlzeit];
    console.log('Mahlzeit Zutaten:', mahlzeitZutaten);
    if (!mahlzeitZutaten) {
        console.error('Keine Zutaten für die ausgewählte Mahlzeit gefunden');
        return null;
    }
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

function bewerten(like) {
    const zutatElement = document.getElementById('zutat');
    const zutatId = parseInt(zutatElement.dataset.id);
    const zutatName = zutatElement.textContent;
    console.log('Bewerte Zutat:', zutatName, 'ID:', zutatId, 'Like:', like);

    if (like) {
        likedZutaten.push(zutatId);
    } else {
        dislikedZutaten.push(zutatId);
    }
    bewertetZutaten.push(zutatId);
    bewertungsCount++;

    updateLists();
    if (bewertungsCount >= 15) {
        showBestMatchingRecipe();
    } else {
        showPassendeRezepte();
        showNextZutat();
    }
}

function updateLists() {
    document.getElementById('liked-list').textContent = likedZutaten.join(', ');
    document.getElementById('disliked-list').textContent = dislikedZutaten.join(', ');
}

function showPassendeRezepte() {
    const rezepteContainer = document.getElementById('rezepte');
    rezepteContainer.innerHTML = '';
    const passendeRezepte = rezepte.filter(rezept => 
        rezept.zutaten.every(z => likedZutaten.includes(z))
    );

    if (passendeRezepte.length === 0) {
        rezepteContainer.textContent = 'Keine passenden Rezepte gefunden.';
        return;
    }

    passendeRezepte.forEach(rezept => {
        const rezeptElement = document.createElement('div');
        rezeptElement.textContent = rezept.name;
        rezepteContainer.appendChild(rezeptElement);
    });
}

function showBestMatchingRecipe() {
    alert('Danke für deine Bewertungen! Hier sind die besten Rezepte für dich:');
    const rezepteContainer = document.getElementById('rezepte');
    rezepteContainer.innerHTML = 'Hier sind deine besten Rezepte:';
    // Du kannst hier auch eine Logik implementieren, um die besten Rezepte zu ermitteln.
}

function backToMealSelection() {
    localStorage.removeItem('selectedMeal');
    window.location.href = 'meal-selection.html';
}

function resetGame() {
    likedZutaten = [];
    dislikedZutaten = [];
    bewertetZutaten = [];
    bewertungsCount = 0;
    showNextZutat();
    updateLists();
    document.getElementById('rezepte').innerHTML = '';
}
