// Effet particules pour la section hero
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 50;
    const particles = [];

    // Créer les particules
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Position aléatoire
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Taille aléatoire
        const size = Math.random() * 4 + 1;
        
        // Animation aléatoire
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        // Appliquer les styles
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: var(--primary-color);
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            opacity: ${Math.random() * 0.5 + 0.1};
            animation: float ${duration}s ease-in-out ${delay}s infinite;
            z-index: 1;
        `;
        
        particlesContainer.appendChild(particle);
        particles.push({
            element: particle,
            x, y,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        });
    }

    // Animation des particules
    function animateParticles() {
        particles.forEach(particle => {
            // Mettre à jour la position
            particle.x += particle.speedX * 0.1;
            particle.y += particle.speedY * 0.1;
            
            // Rebond sur les bords
            if (particle.x > 100 || particle.x < 0) particle.speedX *= -1;
            if (particle.y > 100 || particle.y < 0) particle.speedY *= -1;
            
            // Garder dans les limites
            particle.x = Math.max(0, Math.min(100, particle.x));
            particle.y = Math.max(0, Math.min(100, particle.y));
            
            // Mettre à jour la position
            particle.element.style.left = `${particle.x}%`;
            particle.element.style.top = `${particle.y}%`;
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    // Démarrer l'animation
    animateParticles();
}

// Initialiser les particules quand la page est chargée
document.addEventListener('DOMContentLoaded', initParticles);