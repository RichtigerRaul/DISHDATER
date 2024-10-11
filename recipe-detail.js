document.addEventListener('DOMContentLoaded', () => {
    const recipeId = localStorage.getItem('selectedRecipeId');
    if (!recipeId) {
        window.location.href = 'dishdater.html';
        return;
    }

    loadRecipeData(recipeId);

    document.getElementById('backToGame').addEventListener('click', () => {
        window.location.href = 'dishdater.html';
    });

    document.getElementById('showMoreRecipes').addEventListener('click', () => {
        window.location.href = 'dishdater.html';
    });
});

async function loadRecipeData(id) {
    // Hier müssen Sie die Rezeptdaten laden und anzeigen
    // Sie können dies entweder durch erneutes Laden der JSON-Datei tun
    // oder indem Sie die Daten in localStorage speichern und von dort abrufen
}

// ... [Funktionen zum Anzeigen der Rezeptdetails]
