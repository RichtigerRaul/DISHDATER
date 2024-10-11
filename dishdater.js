// URLs für die JSON-Dateien
// Korrekte URLs für die JSON-Dateien
const ZUTATEN_URL = "https://github.com/RichtigerRaul/DISHDATER/blob/main/z.json";
const REZEPTE_URL = "https://github.com/RichtigerRaul/DISHDATER/blob/main/r.json";

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

        if (!zutatenResponse.ok || !rezepteResponse.ok) {
            throw new Error(`HTTP error! status: ${zutatenResponse.status} ${rezepteResponse.status}`);
        }

        const zutatenData = await zutatenResponse.json();
        zutaten = zutatenData.z;
        console.log('Zutaten geladen:', zutaten);

        const rezepteData = await rezepteResponse.json();
        rezepte = rezepteData.rezepte;
        console.log('Rezepte geladen:', rezepte);

        if (!zutaten || !rezepte) {
            throw new Error('Zutaten oder Rezepte konnten nicht geladen werden.');
        }

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
    console.log('Aktualisiere Listen...');
    document.getElementById('liked-list').textContent = likedZutaten.map(id => getZutatById(id).name).join(', ');
    document.getElementById('disliked-list').textContent = dislikedZutaten.map(id => getZutatById(id).name).join(', ');
}

function berechneRezeptScore(rezeptZutaten) {
    const likes = rezeptZutaten.filter(z => likedZutaten.includes(z)).length;
    const dislikes = rezeptZutaten.filter(z => dislikedZutaten.includes(z)).length;
    const total = rezeptZutaten.length;
    return total > 0 ? Math.max(((likes - dislikes) / total) * 100, 0) : 0;
}

function showPassendeRezepte() {
    console.log('Zeige passende Rezepte...');
    const rezepteMitScore = rezepte.map(rezept => ({
        ...rezept,
        score: berechneRezeptScore(rezept.zutaten)
    }));
    rezepteMitScore.sort((a, b) => b.score - a.score);

    const top5Rezepte = rezepteMitScore.slice(0, 5);
    const rezepteHTML = top5Rezepte.map(r => `
        <li onclick="showRezeptDetail(${r.id})">
            <h3>${r.name} (${r.score.toFixed(2)}% passend)</h3>
            <p>${r.beschreibung}</p>
            <p>Zubereitungsdauer: ${r.zubereitungsDauer} Minuten</p>
            <p>Herkunft: ${r.herkunft}</p>
        </li>
    `).join('');

    document.getElementById('rezepte').innerHTML = `<ul>${rezepteHTML}</ul>`;
}

function showBestMatchingRecipe() {
    const bestRecipe = rezepte.reduce((best, current) => {
        const currentScore = berechneRezeptScore(current.zutaten);
        return currentScore > best.score ? {id: current.id, score: currentScore} : best;
    }, {id: null, score: -1});

    showRezeptDetail(bestRecipe.id);
}

function showRezeptDetail(id) {
    localStorage.setItem('selectedRecipeId', id);
    window.location.href = 'recipe-detail.html';
}

function backToMealSelection() {
    console.log('Zurück zur Mahlzeitenauswahl');
    window.location.href = 'meal-selection.html';
}

function resetGame() {
    likedZutaten = [];
    dislikedZutaten = [];
    bewertetZutaten = [];
    bewertungsCount = 0;
    updateLists();
    showNextZutat();
}

// Globale Funktion für den Zugriff aus dem HTML
window.showRezeptDetail = showRezeptDetail;
