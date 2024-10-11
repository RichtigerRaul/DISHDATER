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

        document.getElementById('startArea').classList.add('hidden');
        document.getElementById('mealSelection').classList.remove('hidden');
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        document.getElementById('zutat').textContent = 'Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.';
    }
}

function selectMeal(meal) {
    ausgewaehlteMahlzeit = meal;
    document.getElementById('mealSelection').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');
    showNextZutat();
}

function getRandomZutat() {
    const mahlzeitZutaten = zutaten.Mahlzeiten[ausgewaehlteMahlzeit];
    const unbewerteteZutaten = mahlzeitZutaten.filter(id => !bewertetZutaten.includes(id));
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
    const rezept = rezepte.find(r => r.id === id);
    if (!rezept) return;

    document.getElementById('gameArea').classList.add('hidden');
    document.getElementById('rezeptDetail').classList.remove('hidden');

    document.getElementById('rezeptName').textContent = rezept.name;
    document.getElementById('rezeptBild').src = `https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main${rezept.img}`;
    document.getElementById('rezeptBeschreibung').textContent = rezept.beschreibung;
    document.getElementById('rezeptZubereitungsDauer').textContent = `Zubereitungsdauer: ${rezept.zubereitungsDauer} Minuten`;
    document.getElementById('rezeptHerkunft').textContent = `Herkunft: ${rezept.herkunft}`;

    const zutatenListe = rezept.zutaten.map(id => getZutatById(id).name);
    document.getElementById('rezeptZutaten').innerHTML = zutatenListe.map(z => `<li>${z}</li>`).join('');

    document.getElementById('rezeptAnleitung').innerHTML = rezept.anleitung.map(step => `<li>${step}</li>`).join('');
}

function backToGame() {
    document.getElementById('rezeptDetail').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');
    if (bewertungsCount >= 15) {
        resetGame();
    }
}

function resetGame() {
    likedZutaten = [];
    dislikedZutaten = [];
    bewertetZutaten = [];
    bewertungsCount = 0;
    updateLists();
    showNextZutat();
}

document.getElementById('startButton').addEventListener('click', loadData);
document.getElementById('fruehstueck').addEventListener('click', () => selectMeal('Frühstück'));
document.getElementById('mittagessen').addEventListener('click', () => selectMeal('Mittagessen'));
document.getElementById('abendessen').addEventListener('click', () => selectMeal('Abendessen'));
document.getElementById('snacks').addEventListener('click', () => selectMeal('Snacks'));
document.getElementById('likeButton').addEventListener('click', () => bewerten(true));
document.getElementById('dislikeButton').addEventListener('click', () => bewerten(false));
document.getElementById('backToGame').addEventListener('click', backToGame);

console.log('Script geladen. Warte auf Start-Button-Klick...');
