// Beispielbilder von Zutaten
const ingredients = [
    {name: 'Pfannkuchen', img: 'https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/pfannkuchen.jpeg'},
    {name: 'Speck', img: 'https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/speck.jpeg'},
    {name: 'Toast', img: 'https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/toast.jpeg'},
    {name: 'Eier', img: 'https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/eier.jpeg'},
    {name: 'Avocado', img: 'https://raw.githubusercontent.com/RichtigerRaul/DISHDATER/main/avocado.jpeg'}
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
    window.location.href = 'menu.html'; // Link zur Menüseite anpassen
});

// Initiales Laden des ersten Bildes
loadIngredient();
