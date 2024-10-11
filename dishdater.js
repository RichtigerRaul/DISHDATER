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
    ausgewaehlteMahlzeit = localStorage.getItem('selectedMeal');
    if (!ausgewaehlteMahlzeit) {
        window.location.href = 'meal-selection.html';
        return;
    }
    
    loadData();

    document.getElementById('likeButton').addEventListener('click', () => bewerten(true));
    document.getElementById('dislikeButton').addEventListener('click', () => bewerten(false));
    document.getElementById('backToMealSelection').addEventListener('click', backToMealSelection);
    document.getElementById('restartGame').addEventListener('click', resetGame);
});

// ... [Rest der Funktionen wie zuvor, aber ohne Event Listener am Ende]

function backToMealSelection() {
    window.location.href = 'meal-selection.html';
}

function showRezeptDetail(id) {
    localStorage.setItem('selectedRecipeId', id);
    window.location.href = 'recipe-detail.html';
}
