// Beispielbilder von Zutaten
const ingredients = [
    {name: 'Eier', img: 'https://example.com/eier.jpg'},
    {name: 'Speck', img: 'https://example.com/speck.jpg'},
    {name: 'Toast', img: 'https://example.com/toast.jpg'},
    {name: 'Avocado', img: 'https://example.com/avocado.jpg'},
    {name: 'Pfannkuchen', img: 'https://example.com/pfannkuchen.jpg'}
];

// Index des aktuellen Bildes
let currentIndex = 0;

// Funktion zum Laden des aktuellen Bildes
function loadIngredient() {
    const ingredientImg = document.getElementById('ingredient-img');
    ingredientImg.src = ingredients[currentIndex].img;
    ingredientImg.alt = ingredients[currentIndex].name;
}

// Funktion, um zum nächsten Bild zu wechseln
function nextIngredient() {
    currentIndex = (currentIndex + 1) % ingredients.length;
    loadIngredient();
}

// Eventlistener für die Buttons
document.getElementById('like-btn').addEventListener('click', () => {
    console.log('Like:', ingredients[currentIndex].name);
    nextIngredient();
});

document.getElementById('dislike-btn').addEventListener('click', () => {
    console.log('Dislike:', ingredients[currentIndex].name);
    nextIngredient();
});

// Eventlistener für den Back-Button (Zurück zum Menü)
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'menu.html'; // Link zur Menüseite
});

// Initiales Laden des ersten Bildes
loadIngredient();
