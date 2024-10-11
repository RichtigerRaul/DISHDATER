let zutaten = [];
let rezepte = {};
let likedZutaten = [];
let dislikedZutaten = [];
let bewertetZutaten = [];

async function loadData() {
    try {
        console.log('Starte Datenladen...');
        const zutatenResponse = await fetch('https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/json/z.json');
        if (!zutatenResponse.ok) {
            throw new Error(`HTTP error! status: ${zutatenResponse.status}`);
        }
        zutaten = await zutatenResponse.json();
        console.log('Zutaten geladen:', zutaten);

        const rezepteResponse = await fetch('https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/json/r.json');
        if (!rezepteResponse.ok) {
            throw new Error(`HTTP error! status: ${rezepteResponse.status}`);
        }
        rezepte = await rezepteResponse.json();
        console.log('Rezepte geladen:', rezepte);

        showNextZutat();
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        document.getElementById('zutat').textContent = 'Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.';
    }
}

function showNextZutat() {
    console.log('Zeige nächste Zutat...');
    const unbewerteteZutaten = zutaten.filter(z => !bewertetZutaten.includes(z));
    console.log('Unbewertete Zutaten:', unbewerteteZutaten);
    if (unbewerteteZutaten.length === 0) {
        document.getElementById('zutat').textContent = 'Alle Zutaten bewertet!';
        return;
    }
    const randomZutat = unbewerteteZutaten[Math.floor(Math.random() * unbewerteteZutaten.length)];
    console.log('Ausgewählte Zutat:', randomZutat);
    document.getElementById('zutat').textContent = randomZutat;
}

function bewerten(like) {
    const zutat = document.getElementById('zutat').textContent;
    console.log('Bewerte Zutat:', zutat, 'Like:', like);
    if (like) {
        likedZutaten.push(zutat);
    } else {
        dislikedZutaten.push(zutat);
    }
    bewertetZutaten.push(zutat);
    updateLists();
    showNextZutat();
}

function updateLists() {
    console.log('Aktualisiere Listen...');
    document.getElementById('liked-list').textContent = likedZutaten.join(', ');
    document.getElementById('disliked-list').textContent = dislikedZutaten.join(', ');
}

function berechneRezeptScore(rezeptZutaten) {
    const likes = rezeptZutaten.filter(z => likedZutaten.includes(z)).length;
    const dislikes = rezeptZutaten.filter(z => dislikedZutaten.includes(z)).length;
    const total = rezeptZutaten.length;
    return total > 0 ? Math.max(((likes - dislikes) / total) * 100, 0) : 0;
}

function showRezepte() {
    console.log('Zeige Rezepte...');
    const rezepteMitScore = Object.entries(rezepte).map(([name, zutaten]) => ({
        name,
        score: berechneRezeptScore(zutaten)
    }));
    rezepteMitScore.sort((a, b) => b.score - a.score);
    
    const rezepteHTML = rezepteMitScore.map(r => `<li>${r.name} (${r.score.toFixed(2)}% passend)</li>`).join('');
    document.getElementById('rezepte').innerHTML = `<ul>${rezepteHTML}</ul>`;
}

document.getElementById('likeButton').addEventListener('click', () => bewerten(true));
document.getElementById('dislikeButton').addEventListener('click', () => bewerten(false));
document.getElementById('showRecipesButton').addEventListener('click', showRezepte);

console.log('Script geladen. Starte Datenladen...');
loadData();
