document.addEventListener('DOMContentLoaded', () => {
    const breakfastButton = document.getElementById('breakfastButton');
    const lunchButton = document.getElementById('lunchButton');
    const dinnerButton = document.getElementById('dinnerButton');

    breakfastButton.addEventListener('click', () => selectMeal('Frühstück'));
    lunchButton.addEventListener('click', () => selectMeal('Mittagessen'));
    dinnerButton.addEventListener('click', () => selectMeal('Abendessen'));
});

function selectMeal(meal) {
    localStorage.setItem('selectedMeal', meal);
    window.location.href = 'dishdater.html';
}
