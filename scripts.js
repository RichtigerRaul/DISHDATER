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

// Funktion, um zum vorherigen Bild zu wechseln
function previousIngredient() {
    currentIndex = (currentIndex - 1 + ingredients.length) % ingredients.length;
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

// Swipe-Handling (neu angepasst)
let touchstartX = 0;
let touchendX = 0;

const swipeZone = document.getElementById('swipe-container');

swipeZone.addEventListener('touchstart', (event) => {
    touchstartX = event.changedTouches[0].screenX;
}, false);

swipeZone.addEventListener('touchend', (event) => {
    touchendX = event.changedTouches[0].screenX;
    handleGesture();
}, false);

function handleGesture() {
    const ingredientImg = document.getElementById('ingredient-img');
    
    if (touchendX < touchstartX - 50) {
        // User swiped left (like)
        console.log('Swipe left - Like:', ingredients[currentIndex].name);
        ingredientImg.classList.add('swipe-left');
        setTimeout(() => {
            ingredientImg.classList.remove('swipe-left');
            nextIngredient();
        }, 300); // Warte 300ms für die Animation
    }
    if (touchendX > touchstartX + 50) {
        // User swiped right (dislike)
        console.log('Swipe right - Dislike:', ingredients[currentIndex].name);
        ingredientImg.classList.add('swipe-right');
        setTimeout(() => {
            ingredientImg.classList.remove('swipe-right');
            previousIngredient();
        }, 300); // Warte 300ms für die Animation
    }
}

// Initiales Laden des ersten Bildes
loadIngredient();
