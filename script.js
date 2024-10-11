let zutaten = [];
let rezepte = {};
let likedZutaten = [];
let dislikedZutaten = [];
let bewertetZutaten = [];

async function loadData() {
    const zutatenResponse = await fetch('https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/json/z.json');
    zutaten = await zutatenResponse.json();
    
    const rezepteResponse = await fetch('https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/json/r.json');
    rezepte = await rezepteResponse.json();
    
    showNextZutat();
}

function showNextZutat() {
    const unbewerteteZutaten = zutaten.filter(z => !bewertetZutaten.includes(z));
    if (unbewerteteZutaten.length === 0) {
        document.getElementById('zutat').textContent = 'Alle Zutaten bewertet!';
        return;
    }
    const randomZutat = unbewerteteZutaten[Math.floor(Math.random() * unbewerteteZutaten.length)];
    document.getElementById('zutat').textContent = randomZutat;
}

function bewerten(like) {
    const zutat = document.getElementById('zutat').textContent;
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

loadData();
