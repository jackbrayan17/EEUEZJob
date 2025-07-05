// Liste des secteurs d'activité
const sectors = [
    'Agriculture', 'Électronique', 'Informatique', 'Droit', 'Marketing',
    'Santé', 'Éducation', 'Construction', 'Finance', 'Ressources humaines',
    'Vente', 'Logistique', 'Télécommunications', 'Énergie', 'Tourisme',
    'Mode', 'Artisanat', 'Médias', 'Recherche', 'Immobilier',
    'Transport', 'Alimentation', 'Biotechnologie', 'Sécurité', 'Design',
    'Jeux vidéo', 'Automobile', 'Aéronautique', 'Environnement', 'Commerce',
    'Assurance', 'Publicité', 'Événementiel', 'Pharmaceutique', 'Sport'
];

// Variables globales
let selectedSectors = [];
let formData = {};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeSectors();
    setupFormValidation();
    setupFileUpload();
    setupProgressTracking();
    updateProgressBar();
});

// Génération dynamique des secteurs
function initializeSectors() {
    const sectorsContainer = document.getElementById('sectorsContainer');
    
    sectors.forEach(sector => {
        const sectorTag = document.createElement('div');
        sectorTag.className = 'sector-tag';
        sectorTag.textContent = sector;
        sectorTag.setAttribute('data-sector', sector);
        sectorTag.setAttribute('tabindex', '0');
        sectorTag.setAttribute('role', 'button');
        sectorTag.setAttribute('aria-pressed', 'false');
        
        // Événements de clic et clavier
        sectorTag.addEventListener('click', () => toggleSector(sectorTag, sector));
        sectorTag.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSector(sectorTag, sector);
            }
        });
        
        sectorsContainer.appendChild(sectorTag);
    });
}

// Gestion de la sélection des secteurs
function toggleSector(element, sector) {
    const isSelected = element.classList.contains('selected');
    
    if (isSelected) {
        // Désélectionner
        element.classList.remove('selected');
        element.setAttribute('aria-pressed', 'false');
        selectedSectors = selectedSectors.filter(s => s !== sector);
    } else {
        // Sélectionner
        element.classList.add('selected');
        element.setAttribute('aria-pressed', 'true');
        selectedSectors.push(sector);
    }
    
    updateSectorCount();
    updateProgressBar();
    validateForm();
}

// Mise à jour du compteur de secteurs
function updateSectorCount() {
    const countElement = document.getElementById('sectorCount');
    const infoElement = countElement.parentElement;
    
    countElement.textContent = selectedSectors.length;
    
    if (selectedSectors.length >= 3) {
        infoElement.style.color = '#27AE60';
    } else {
        infoElement.style.color = '#E74C3C';
    }
}

// Configuration de la validation du formulaire
function setupFormValidation() {
    const requiredFields = document.querySelectorAll('.form-input[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('input', () => validateField(field));
        field.addEventListener('blur', () => validateField(field));
    });
    
    // Validation du formulaire lors de la soumission
    document.getElementById('profileForm').addEventListener('submit', handleFormSubmit);
}

// Validation d'un champ individuel
function validateField(field) {
    const value = field.value.trim();
    const isValid = value !== '';
    
    if (isValid) {
        field.classList.add('valid');
        field.classList.remove('invalid');
    } else {
        field.classList.add('invalid');
        field.classList.remove('valid');
    }
    
    updateProgressBar();
    validateForm();
}

// Validation globale du formulaire
function validateForm() {
    const requiredFields = document.querySelectorAll('.form-input[required]');
    const submitButton = document.getElementById('submitButton');
    
    let allValid = true;
    
    // Vérifier les champs requis
    requiredFields.forEach(field => {
        if (field.value.trim() === '') {
            allValid = false;
        }
    });
    
    // Vérifier le minimum de secteurs
    if (selectedSectors.length < 3) {
        allValid = false;
    }
    
    submitButton.disabled = !allValid;
}

// Configuration du drag & drop pour les fichiers
function setupFileUpload() {
    const uploadZones = document.querySelectorAll('.file-upload-zone');
    
    uploadZones.forEach(zone => {
        const fileInput = zone.querySelector('input[type="file"]');
        
        // Événements de drag & drop
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                updateFileDisplay(zone, files[0]);
                updateProgressBar();
            }
        });
        
        // Événement de changement de fichier
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                updateFileDisplay(zone, e.target.files[0]);
                updateProgressBar();
            }
        });
    });
}

// Mise à jour de l'affichage après sélection de fichier
function updateFileDisplay(zone, file) {
    const uploadText = zone.querySelector('.upload-text');
    const uploadSubtext = zone.querySelector('.upload-subtext');
    const uploadIcon = zone.querySelector('.upload-icon');
    
    // Changer l'icône et le texte
    uploadIcon.className = 'fas fa-check-circle upload-icon';
    uploadIcon.style.color = '#27AE60';
    uploadText.textContent = `Fichier sélectionné: ${file.name}`;
    uploadSubtext.textContent = `Taille: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
    
    // Changer le style de la zone
    zone.style.borderColor = '#27AE60';
    zone.style.backgroundColor = '#E8F5E8';
}

// Configuration du suivi de progression
function setupProgressTracking() {
    // Observer les changements dans tous les champs
    const allInputs = document.querySelectorAll('.form-input');
    
    allInputs.forEach(input => {
        input.addEventListener('input', updateProgressBar);
    });
}

// Mise à jour de la barre de progression
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    let totalFields = 0;
    let completedFields = 0;
    
    // Compter les champs texte complétés
    const textInputs = document.querySelectorAll('.form-input');
    textInputs.forEach(input => {
        totalFields++;
        if (input.value.trim() !== '') {
            completedFields++;
        }
    });
    
    // Compter les fichiers uploadés
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        totalFields++;
        if (input.files.length > 0) {
            completedFields++;
        }
    });
    
    // Compter les secteurs sélectionnés (minimum 3)
    totalFields++;
    if (selectedSectors.length >= 3) {
        completedFields++;
    }
    
    const progress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
    
    progressBar.style.width = progress + '%';
    progressText.textContent = Math.round(progress) + '% complété';
    
    // Changer la couleur selon le progrès
    if (progress === 100) {
        progressText.style.color = '#27AE60';
        progressText.style.fontWeight = '600';
    } else {
        progressText.style.color = '#2C3E50';
        progressText.style.fontWeight = '500';
    }
}

// Gestion de la soumission du formulaire
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Collecter toutes les données du formulaire
    const formData = new FormData();
    
    // Champs texte
    const textFields = ['fullName', 'skills', 'experience', 'education', 'socialLinks'];
    textFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            formData.append(fieldId, field.value);
        }
    });
    
    // Fichiers
    const profilePicture = document.getElementById('profilePicture').files[0];
    const cvFile = document.getElementById('cvFile').files[0];
    
    if (profilePicture) {
        formData.append('profilePicture', profilePicture);
    }
    
    if (cvFile) {
        formData.append('cvFile', cvFile);
    }
    
    // Secteurs sélectionnés
    formData.append('selectedSectors', JSON.stringify(selectedSectors));
    
    // Simulation de l'envoi (remplacer par un vrai appel API)
    simulateFormSubmission(formData);
}

// Simulation de l'envoi du formulaire
function simulateFormSubmission(formData) {
    const submitButton = document.getElementById('submitButton');
    const originalText = submitButton.innerHTML;
    
    // Afficher l'état de chargement
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
    submitButton.disabled = true;
    
    // Simuler un délai d'envoi
    setTimeout(() => {
        // Succès simulé
        submitButton.innerHTML = '<i class="fas fa-check"></i> Profil enregistré !';
        submitButton.style.background = 'linear-gradient(135deg, #E8F5E8 0%, #27AE60 100%)';
        
        // Afficher un message de succès
        showSuccessMessage();
        
        // Réinitialiser après 3 secondes
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
        }, 3000);
        
    }, 2000);
}

// Affichage du message de succès
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #E8F5E8 0%, #27AE60 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            margin: 1rem 0;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
            animation: slideInDown 0.5s ease-out;
        ">
            <i class="fas fa-check-circle"></i>
            Votre profil a été enregistré avec succès !
        </div>
    `;
    
    const form = document.getElementById('profileForm');
    form.insertBefore(successDiv, form.firstChild);
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Animation d'entrée pour le message de succès
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Fonctions utilitaires pour l'accessibilité
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Gestion des erreurs de validation
function showFieldError(field, message) {
    // Supprimer l'erreur existante
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Créer le message d'erreur
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#E74C3C';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Validation avancée des champs
function validateFieldAdvanced(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldId = field.id;
    
    // Supprimer les erreurs existantes
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Validation spécifique par type de champ
    switch (fieldId) {
        case 'fullName':
            if (value.length < 2) {
                showFieldError(field, 'Le nom doit contenir au moins 2 caractères');
                return false;
            }
            break;
            
        case 'experience':
            const exp = parseInt(value);
            if (isNaN(exp) || exp < 0 || exp > 50) {
                showFieldError(field, 'L\'expérience doit être entre 0 et 50 ans');
                return false;
            }
            break;
            
        case 'socialLinks':
            if (value && !isValidUrl(value)) {
                showFieldError(field, 'Veuillez entrer une URL valide');
                return false;
            }
            break;
    }
    
    return true;
}

// Validation d'URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Sauvegarde automatique en local storage
function autoSave() {
    const formData = {};
    
    // Sauvegarder les champs texte
    const textFields = ['fullName', 'skills', 'experience', 'education', 'socialLinks'];
    textFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            formData[fieldId] = field.value;
        }
    });
    
    // Sauvegarder les secteurs sélectionnés
    formData.selectedSectors = selectedSectors;
    
    localStorage.setItem('cvFormData', JSON.stringify(formData));
}

// Restauration des données sauvegardées
function restoreFormData() {
    const savedData = localStorage.getItem('cvFormData');
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            
            // Restaurer les champs texte
            Object.keys(formData).forEach(fieldId => {
                if (fieldId !== 'selectedSectors') {
                    const field = document.getElementById(fieldId);
                    if (field) {
                        field.value = formData[fieldId];
                        validateField(field);
                    }
                }
            });
            
            // Restaurer les secteurs sélectionnés
            if (formData.selectedSectors) {
                formData.selectedSectors.forEach(sector => {
                    const sectorElement = document.querySelector(`[data-sector="${sector}"]`);
                    if (sectorElement) {
                        toggleSector(sectorElement, sector);
                    }
                });
            }
            
            updateProgressBar();
        } catch (e) {
            console.error('Erreur lors de la restauration des données:', e);
        }
    }
}

// Sauvegarde automatique toutes les 30 secondes
setInterval(autoSave, 30000);

// Restaurer les données au chargement
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(restoreFormData, 100);
});

