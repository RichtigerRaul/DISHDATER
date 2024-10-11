// URLs für die JSON-Dateien
const ZUTATEN_URL = "https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/json/z.json";
const REZEPTE_URL = "https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/json/r.json";

let zutaten = {};
let rezepte = [];
let likedZutaten = [];
let dislikedZutaten = [];
let bewertetZutaten = [];

async function loadData() {
    try {
        console.log('Starte Datenladen...');
        const zutatenResponse = await fetch(ZUTATEN_URL);
        const rezepteResponse = await fetch(REZEPTE_URL);

        if (!zutatenResponse.ok || !rezepteResponse.ok) {
            throw new Error(`HTTP error! status: ${zutatenResponse.status} ${rezepteResponse.status}`);
        }

        const zutatenData = await zutatenResponse.json();
        zutaten = zutatenData.z.Kategorien;
        console.log('Zutaten geladen:', zutaten);

        const rezepteData = await rezepteResponse.json();
        rezepte = rezepteData.rezepte;
        console.log('Rezepte geladen:', rezepte);

        document.getElementById('gameArea').classList.remove('hidden');
        document.getElementById('startButton').classList.add('hidden');
        showNextZutat();
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        document.getElementById('zutat').textContent = 'Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.';
    }
}

function getRandomZutat() {
    const alleZutaten = Object.values(zutaten).flat();
    console.log('Alle Zutaten:', alleZutaten);
    const unbewerteteZutaten = alleZutaten.filter(z => !bewertetZutaten.includes(z.id));
    console.log('Unbewertete Zutaten:', unbewerteteZutaten);
    return unbewerteteZutaten[Math.floor(Math.random() * unbewerteteZutaten.length)];
}

function showNextZutat() {
    console.log('Zeige nächste Zutat...');
    const zutat = getRandomZutat();
    if (!zutat) {
        document.getElementById('zutat').textContent = 'Alle Zutaten bewertet!';
        return;
    }
    console.log('Ausgewählte Zutat:', zutat);
    document.getElementById('zutat').textContent = zutat.name;
    document.getElementById('zutat').dataset.id = zutat.id;
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

    updateLists();
    showPassendeRezepte();
    showNextZutat();
}

function updateLists() {
    console.log('Aktualisiere Listen...');
    document.getElementById('liked-list').textContent = likedZutaten.map(id => getZutatNameById(id)).join(', ');
    document.getElementById('disliked-list').textContent = dislikedZutaten.map(id => getZutatNameById(id)).join(', ');
}

function getZutatNameById(id) {
    for (const kategorie of Object.values(zutaten)) {
        const zutat = kategorie.find(z => z.id === id);
        if (zutat) return zutat.name;
    }
    return 'Unbekannt';
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
        <li>
            <h3>${r.name} (${r.score.toFixed(2)}% passend)</h3>
            <p>${r.beschreibung}</p>
            <p>Zubereitungsdauer: ${r.zubereitungsDauer} Minuten</p>
            <p>Herkunft: ${r.herkunft}</p>
        </li>
    `).join('');

    document.getElementById('rezepte').innerHTML = `<ul>${rezepteHTML}</ul>`;
}

document.getElementById('startButton').addEventListener('click', loadData);
document.getElementById('likeButton').addEventListener('click', () => bewerten(true));
document.getElementById('dislikeButton').addEventListener('click', () => bewerten(false));

console.log('Script geladen. Warte auf Start-Button-Klick...');
