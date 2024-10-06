let currentMeal = localStorage.getItem('currentMeal') || 'Mahlzeit';
let dietSettings = JSON.parse(localStorage.getItem('dietSettings')) || {};
let isAnimating = false;

const settingEmojis = {
    'milk': '🥛',
    'vegan': '🌱',
    'vegetarian': '🥗',
    'vitamins': '🍊',
    'protein': '🥩',
    'nofat': '💪',
    'healthy': '🥦'
};

function updateCard() {
    document.getElementById('mealType').textContent = getMealTypeText(currentMeal);
    const settingsIcons = document.getElementById('settingsIcons');
    settingsIcons.innerHTML = '';
    for (const [key, emoji] of Object.entries(settingEmojis)) {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.className = `setting-icon ${dietSettings[key] ? 'active' : ''}`;
        span.title = getSettingText(key);
        settingsIcons.appendChild(span);
    }
}

function getMealTypeText(meal) {
    const mealTypes = {
        'breakfast': 'Frühstück',
        'lunch': 'Mittagessen',
        'dinner': 'Abendessen',
        'snacks': 'Snacks'
    };
    return mealTypes[meal] || 'Mahlzeit';
}

function getSettingText(setting) {
    const settingTexts = {
        'milk': 'Milchprodukte',
        'vegan': 'Vegan',
        'vegetarian': 'Vegetarisch',
        'vitamins': 'Vitaminreich',
        'protein': 'Proteinreich',
        'nofat': 'Fettarm',
        'healthy': 'Gesund'
    };
    return settingTexts[setting] || setting;
}

function goBack() {
    window.location.href = 'menu.html';
}

function handleLike() {
    if (!isAnimating) {
        swipeCard(1);
        showFloatingEmoji('👍');
    }
}

function handleDislike() {
    if (!isAnimating) {
        swipeCard(-1);
        showFloatingEmoji('👎');
    }
}

function showFloatingEmoji(emoji) {
    const floatingEmoji = document.getElementById('floatingEmoji');
    floatingEmoji.textContent = emoji;
    floatingEmoji.style.opacity = '1';
    floatingEmoji.style.transform = 'translate(-50%, -150%)';
    
    setTimeout(() => {
        floatingEmoji.style.opacity = '0';
        floatingEmoji.style.transform = 'translate(-50%, -250%)';
    }, 500);

    setTimeout(() => {
        floatingEmoji.style.transform = 'translate(-50%, -50%)';
    }, 1000);
}

function swipeCard(direction) {
    isAnimating = true;
    const card = document.getElementById('swipeCard');
    card.style.transform = `translateX(${direction * 100}%)`;
    
    setTimeout(() => {
        card.style.transition = 'none';
        card.style.transform = 'translateX(0)';
        setTimeout(() => {
            card.style.transition = 'transform 0.3s ease-out';
            isAnimating = false;
            // Hier könnten Sie die nächste Karte laden oder andere Aktionen ausführen
        }, 50);
    }, 300);
}

// Verbesserte Swipe-Funktionalität
const swipeContainer = document.getElementById('swipeContainer');
const hammer = new Hammer(swipeContainer);
const card = document.getElementById('swipeCard');

hammer.on('pan', function(event) {
    if (!isAnimating) {
        let percentage = event.deltaX / swipeContainer.offsetWidth;
        percentage = Math.min(Math.max(percentage, -1), 1);
        card.style.transform = `translateX(${percentage * 100}%)`;
    }
});

hammer.on('panend', function(event) {
    if (!isAnimating) {
        const threshold = 0.3;
        if (Math.abs(event.deltaX) > swipeContainer.offsetWidth * threshold) {
            // Swipe completed
            const direction = event.deltaX > 0 ? 1 : -1;
            swipeCard(direction);
            showFloatingEmoji(direction > 0 ? '👍' : '👎');
        } else {
            // Swipe not completed, return to center
            card.style.transform = 'translateX(0)';
        }
    }
});

// Event Listeners
document.getElementById('backButton').addEventListener('click', goBack);
document.getElementById('likeButton').addEventListener('click', handleLike);
document.getElementById('dislikeButton').addEventListener('click', handleDislike);

// Initialisierung
window.onload = function() {
    updateCard();
}
