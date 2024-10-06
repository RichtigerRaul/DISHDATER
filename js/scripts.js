// Beispielbilder von Zutaten
const ingredients = [
    {name: 'Pfannkuchen', img: 'assets/pfannkuchen.jpeg'},
    {name: 'Speck', img: 'assets/speck.jpeg'},
    {name: 'Toast', img: 'assets/toast.jpeg'},
    {name: 'Eier', img: 'assets/eier.jpeg'},
    {name: 'Avocado', img: 'assets/avocado.jpeg'}
];

// Index des aktuellen Bildes
let currentIndex = 0;

// Funktion zum Laden des aktuellen Bildes
function loadIngredient() {
    const ingredientImg = document.getElementById('ingredient-img');
    ingredientImg.src = ingredients[currentIndex].img;
    ingredientImg.alt = ingredients[currentIndex].name;
}

// Funktion zum Anzeigen des Emojis (Like oder Dislike)
function showEmoji(emoji) {
    const emojiOverlay = document.getElementById('emoji-overlay');
    emojiOverlay.textContent = emoji;
    emojiOverlay.classList.add('show');
    
    // Emoji nach 500ms ausblenden und das nächste Bild anzeigen
    setTimeout(() => {
        emojiOverlay.classList.remove('show');
        nextIngredient();
    }, 500); // Warte 500ms
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
    showEmoji('👍'); // Like-Emoji anzeigen
});

document.getElementById('dislike-btn').addEventListener('click', () => {
    console.log('Dislike:', ingredients[currentIndex].name);
    showEmoji('👎'); // Dislike-Emoji anzeigen
});

// Eventlistener für den Back-Button (Zurück zum Menü)
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'menu.html'; // Link zur Menüseite anpassen
});

// Swipe-Handling
let touchstartX = 0;
let touchendX = 0;

const swipeZone = document.getElementById('swipe-container');

// Funktion zur Behandlung von Gesten
function handleGesture() {
    if (touchendX < touchstartX - 50) {
        // Swipe nach links (like)
        console.log('Swipe left - Like:', ingredients[currentIndex].name);
        showEmoji('👍');
    }
    if (touchendX > touchstartX + 50) {
        // Swipe nach rechts (dislike)
        console.log('Swipe right - Dislike:', ingredients[currentIndex].name);
        showEmoji('👎');
    }
}

// Funktion zum Starten des Swipes
function startSwipe(x) {
    touchstartX = x;
}

// Funktion zum Beenden des Swipes
function endSwipe(x) {
    touchendX = x;
    handleGesture();
}

// Prüfe, ob Pointer-Events unterstützt werden
if (window.PointerEvent) {
    swipeZone.addEventListener('pointerdown', (event) => startSwipe(event.clientX), false);
    swipeZone.addEventListener('pointerup', (event) => endSwipe(event.clientX), false);
} else {
    // Fallback für Touch-Events
    swipeZone.addEventListener('touchstart', (event) => {
        startSwipe(event.changedTouches[0].screenX);
    }, false);
    swipeZone.addEventListener('touchend', (event) => {
        endSwipe(event.changedTouches[0].screenX);
    }, false);
}

// Initiales Laden des ersten Bildes
loadIngredient();
