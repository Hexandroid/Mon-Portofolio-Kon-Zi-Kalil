// Gestion du thème sombre/clair
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Vérifier le thème initial
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Basculer en mode clair');
        }
    } else {
        document.body.classList.remove('dark-mode');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Basculer en mode sombre');
        }
    }
}

// Basculer le thème
function toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Basculer en mode sombre');
        }
    } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Basculer en mode clair');
        }
    }
}

// Écouter le changement de préférence système
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
});

// Initialiser
document.addEventListener('DOMContentLoaded', initTheme);

// Ajouter l'écouteur d'événement
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}