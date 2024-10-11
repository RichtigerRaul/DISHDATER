document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const meal = button.id;
            localStorage.setItem('selectedMeal', meal);
            window.location.href = 'dishdater.html';
        });
    });
});
