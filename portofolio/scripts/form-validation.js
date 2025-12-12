// Validation du formulaire de contact
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');
    
    const successMessage = document.getElementById('successMessage');
    const submitText = document.getElementById('submitText');
    
    // Fonctions de validation
    function validateName() {
        const name = nameInput.value.trim();
        if (name === '') {
            nameError.textContent = 'Le nom est obligatoire';
            return false;
        } else if (name.length < 2) {
            nameError.textContent = 'Le nom doit contenir au moins 2 caractères';
            return false;
        }
        nameError.textContent = '';
        return true;
    }
    
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            emailError.textContent = 'L\'email est obligatoire';
            return false;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = 'Veuillez entrer une adresse email valide';
            return false;
        }
        emailError.textContent = '';
        return true;
    }
    
    function validateSubject() {
        const subject = subjectInput.value.trim();
        if (subject === '') {
            subjectError.textContent = 'Le sujet est obligatoire';
            return false;
        }
        subjectError.textContent = '';
        return true;
    }
    
    function validateMessage() {
        const message = messageInput.value.trim();
        if (message === '') {
            messageError.textContent = 'Le message est obligatoire';
            return false;
        } else if (message.length < 10) {
            messageError.textContent = 'Le message doit contenir au moins 10 caractères';
            return false;
        }
        messageError.textContent = '';
        return true;
    }
    
    // Validation en temps réel
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    subjectInput.addEventListener('blur', validateSubject);
    messageInput.addEventListener('blur', validateMessage);
    
    // Validation à la soumission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();
        
        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // Simulation d'envoi
            submitText.textContent = 'Envoi en cours...';
            
            // Simulation d'attente
            setTimeout(() => {
                // Réinitialiser le formulaire
                contactForm.reset();
                
                // Afficher le message de succès
                successMessage.style.display = 'block';
                submitText.textContent = 'Envoyer le message';
                
                // Masquer le message après 5 secondes
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }, 1500);
        }
    });
}