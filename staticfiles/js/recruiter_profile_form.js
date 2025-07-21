// Données pour les différentes catégories
const sectors = [
    'Informatique', 'Finance', 'Marketing', 'Santé', 'Éducation',
    'Construction', 'Automobile', 'Aéronautique', 'Énergie', 'Télécommunications',
    'Commerce', 'Tourisme', 'Mode', 'Médias', 'Design',
    'Biotechnologie', 'Pharmaceutique', 'Assurance', 'Immobilier', 'Transport',
    'Agriculture', 'Alimentation', 'Environnement', 'Sécurité', 'Sport',
    'Artisanat', 'Recherche', 'Logistique', 'Ressources humaines', 'Droit'
];

const jobTypes = [
    'Développeur Frontend', 'Développeur Backend', 'Développeur Full Stack', 'DevOps',
    'Data Scientist', 'Data Analyst', 'Chef de projet', 'Product Manager',
    'Designer UX/UI', 'Graphiste', 'Marketing Digital', 'Community Manager',
    'Commercial', 'Responsable Ventes', 'Comptable', 'Contrôleur de gestion',
    'Ressources Humaines', 'Recruteur', 'Formateur', 'Consultant',
    'Ingénieur', 'Technicien', 'Architecte', 'Juriste',
    'Médecin', 'Infirmier', 'Pharmacien', 'Psychologue',
    'Enseignant', 'Chercheur', 'Journaliste', 'Traducteur'
];

const experienceLevels = [
    'Stage/Alternance',
    'Junior (0-2 ans)',
    'Confirmé (3-5 ans)',
    'Senior (6-10 ans)',
    'Expert (10+ ans)',
    'Manager/Lead',
    'Directeur/C-Level'
];

const contractTypes = [
    'CDI',
    'CDD',
    'Stage',
    'Alternance/Apprentissage',
    'Freelance/Consultant',
    'Temps partiel',
    'Télétravail',
    'Hybride'
];

// Variables globales
let selectedSectors = [];
let selectedJobTypes = [];
let selectedExperienceLevels = [];
let selectedContractTypes = [];

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeTags();
    setupFormValidation();
    setupFileUpload();
    setupProgressTracking();
    updateProgressBar();
    restoreFormData();
});

// Génération dynamique des tags
function initializeTags() {
    initializeSectors();
    initializeJobTypes();
    initializeExperienceLevels();
    initializeContractTypes();
}

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
        
        sectorTag.addEventListener('click', () => toggleTag(sectorTag, sector, 'sector'));
        sectorTag.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTag(sectorTag, sector, 'sector');
            }
        });
        
        sectorsContainer.appendChild(sectorTag);
    });
}

function initializeJobTypes() {
    const jobTypesContainer = document.getElementById('jobTypesContainer');
    
    jobTypes.forEach(jobType => {
        const jobTypeTag = document.createElement('div');
        jobTypeTag.className = 'job-type-tag';
        jobTypeTag.textContent = jobType;
        jobTypeTag.setAttribute('data-job-type', jobType);
        jobTypeTag.setAttribute('tabindex', '0');
        jobTypeTag.setAttribute('role', 'button');
        jobTypeTag.setAttribute('aria-pressed', 'false');
        
        jobTypeTag.addEventListener('click', () => toggleTag(jobTypeTag, jobType, 'jobType'));
        jobTypeTag.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTag(jobTypeTag, jobType, 'jobType');
            }
        });
        
        jobTypesContainer.appendChild(jobTypeTag);
    });
}

function initializeExperienceLevels() {
    const experienceLevelsContainer = document.getElementById('experienceLevelsContainer');
    
    experienceLevels.forEach(level => {
        const levelTag = document.createElement('div');
        levelTag.className = 'experience-level-tag';
        levelTag.textContent = level;
        levelTag.setAttribute('data-experience-level', level);
        levelTag.setAttribute('tabindex', '0');
        levelTag.setAttribute('role', 'button');
        levelTag.setAttribute('aria-pressed', 'false');
        
        levelTag.addEventListener('click', () => toggleTag(levelTag, level, 'experienceLevel'));
        levelTag.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTag(levelTag, level, 'experienceLevel');
            }
        });
        
        experienceLevelsContainer.appendChild(levelTag);
    });
}

function initializeContractTypes() {
    const contractTypesContainer = document.getElementById('contractTypesContainer');
    
    contractTypes.forEach(contractType => {
        const contractTag = document.createElement('div');
        contractTag.className = 'contract-type-tag';
        contractTag.textContent = contractType;
        contractTag.setAttribute('data-contract-type', contractType);
        contractTag.setAttribute('tabindex', '0');
        contractTag.setAttribute('role', 'button');
        contractTag.setAttribute('aria-pressed', 'false');
        
        contractTag.addEventListener('click', () => toggleTag(contractTag, contractType, 'contractType'));
        contractTag.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTag(contractTag, contractType, 'contractType');
            }
        });
        
        contractTypesContainer.appendChild(contractTag);
    });
}

// Gestion de la sélection des tags
function toggleTag(element, value, type) {
    const isSelected = element.classList.contains('selected');
    
    if (isSelected) {
        // Désélectionner
        element.classList.remove('selected');
        element.setAttribute('aria-pressed', 'false');
        
        switch(type) {
            case 'sector':
                selectedSectors = selectedSectors.filter(s => s !== value);
                break;
            case 'jobType':
                selectedJobTypes = selectedJobTypes.filter(j => j !== value);
                break;
            case 'experienceLevel':
                selectedExperienceLevels = selectedExperienceLevels.filter(e => e !== value);
                break;
            case 'contractType':
                selectedContractTypes = selectedContractTypes.filter(c => c !== value);
                break;
        }
    } else {
        // Sélectionner
        element.classList.add('selected');
        element.setAttribute('aria-pressed', 'true');
        
        switch(type) {
            case 'sector':
                selectedSectors.push(value);
                break;
            case 'jobType':
                selectedJobTypes.push(value);
                break;
            case 'experienceLevel':
                selectedExperienceLevels.push(value);
                break;
            case 'contractType':
                selectedContractTypes.push(value);
                break;
        }
    }
    
    updateCounts();
    updateProgressBar();
    validateForm();
}

// Mise à jour des compteurs
function updateCounts() {
    // Secteurs
    const sectorCountElement = document.getElementById('sectorCount');
    const sectorInfoElement = sectorCountElement.parentElement;
    
    sectorCountElement.textContent = selectedSectors.length;
    
    if (selectedSectors.length >= 1) {
        sectorInfoElement.style.color = '#27AE60';
    } else {
        sectorInfoElement.style.color = '#E74C3C';
    }
    
    // Types de postes
    const jobTypeCountElement = document.getElementById('jobTypeCount');
    jobTypeCountElement.textContent = selectedJobTypes.length;
}

// Configuration de la validation du formulaire
function setupFormValidation() {
    const requiredFields = document.querySelectorAll('.form-input[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('input', () => validateField(field));
        field.addEventListener('blur', () => validateField(field));
    });
    
    // Validation du formulaire lors de la soumission
    document.getElementById('recruiterForm').addEventListener('submit', handleFormSubmit);
}

// Validation d'un champ individuel
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldId = field.id;
    
    let isValid = true;
    
    // Validation de base
    if (field.hasAttribute('required') && value === '') {
        isValid = false;
    }
    
    // Validations spécifiques
    switch (fieldId) {
        case 'recruiterEmail':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                showFieldError(field, 'Veuillez entrer une adresse email valide');
            }
            break;
            
        case 'companyWebsite':
        case 'linkedinProfile':
            if (value && !isValidUrl(value)) {
                isValid = false;
                showFieldError(field, 'Veuillez entrer une URL valide');
            }
            break;
            
        case 'recruiterPhone':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (value && !phoneRegex.test(value)) {
                isValid = false;
                showFieldError(field, 'Veuillez entrer un numéro de téléphone valide');
            }
            break;
    }
    
    if (isValid) {
        field.classList.add('valid');
        field.classList.remove('invalid');
        // Supprimer le message d'erreur s'il existe
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
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
        if (field.value.trim() === '' || field.classList.contains('invalid')) {
            allValid = false;
        }
    });
    
    // Vérifier le minimum de secteurs
    if (selectedSectors.length < 1) {
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
        if (input.type !== 'file') {
            totalFields++;
            if (input.value.trim() !== '') {
                completedFields++;
            }
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
    
    // Compter les secteurs sélectionnés (minimum 1)
    totalFields++;
    if (selectedSectors.length >= 1) {
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
    const textFields = [
        'companyName', 'companyWebsite', 'companyAddress', 'recruiterName',
        'recruiterPosition', 'recruiterEmail', 'recruiterPhone', 'linkedinProfile',
        'companyDescription', 'companySize', 'recruitmentAreas', 'welcomeMessage'
    ];
    
    textFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            formData.append(fieldId, field.value);
        }
    });
    
    // Fichiers
    const companyLogo = document.getElementById('companyLogo').files[0];
    if (companyLogo) {
        formData.append('companyLogo', companyLogo);
    }
    
    // Sélections
    formData.append('selectedSectors', JSON.stringify(selectedSectors));
    formData.append('selectedJobTypes', JSON.stringify(selectedJobTypes));
    formData.append('selectedExperienceLevels', JSON.stringify(selectedExperienceLevels));
    formData.append('selectedContractTypes', JSON.stringify(selectedContractTypes));
    
    // Simulation de l'envoi
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
        submitButton.innerHTML = '<i class="fas fa-check"></i> Profil recruteur enregistré !';
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
            Votre profil recruteur a été enregistré avec succès !
        </div>
    `;
    
    const form = document.getElementById('recruiterForm');
    form.insertBefore(successDiv, form.firstChild);
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Fonctions utilitaires
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

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

// Sauvegarde automatique en local storage
function autoSave() {
    const formData = {};
    
    // Sauvegarder les champs texte
    const textFields = [
        'companyName', 'companyWebsite', 'companyAddress', 'recruiterName',
        'recruiterPosition', 'recruiterEmail', 'recruiterPhone', 'linkedinProfile',
        'companyDescription', 'companySize', 'recruitmentAreas', 'welcomeMessage'
    ];
    
    textFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            formData[fieldId] = field.value;
        }
    });
    
    // Sauvegarder les sélections
    formData.selectedSectors = selectedSectors;
    formData.selectedJobTypes = selectedJobTypes;
    formData.selectedExperienceLevels = selectedExperienceLevels;
    formData.selectedContractTypes = selectedContractTypes;
    
    localStorage.setItem('recruiterFormData', JSON.stringify(formData));
}

// Restauration des données sauvegardées
function restoreFormData() {
    const savedData = localStorage.getItem('recruiterFormData');
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            
            // Restaurer les champs texte
            Object.keys(formData).forEach(fieldId => {
                if (!fieldId.startsWith('selected')) {
                    const field = document.getElementById(fieldId);
                    if (field && formData[fieldId]) {
                        field.value = formData[fieldId];
                        validateField(field);
                    }
                }
            });
            
            // Restaurer les sélections
            if (formData.selectedSectors) {
                formData.selectedSectors.forEach(sector => {
                    const sectorElement = document.querySelector(`[data-sector="${sector}"]`);
                    if (sectorElement) {
                        toggleTag(sectorElement, sector, 'sector');
                    }
                });
            }
            
            if (formData.selectedJobTypes) {
                formData.selectedJobTypes.forEach(jobType => {
                    const jobTypeElement = document.querySelector(`[data-job-type="${jobType}"]`);
                    if (jobTypeElement) {
                        toggleTag(jobTypeElement, jobType, 'jobType');
                    }
                });
            }
            
            if (formData.selectedExperienceLevels) {
                formData.selectedExperienceLevels.forEach(level => {
                    const levelElement = document.querySelector(`[data-experience-level="${level}"]`);
                    if (levelElement) {
                        toggleTag(levelElement, level, 'experienceLevel');
                    }
                });
            }
            
            if (formData.selectedContractTypes) {
                formData.selectedContractTypes.forEach(contractType => {
                    const contractElement = document.querySelector(`[data-contract-type="${contractType}"]`);
                    if (contractElement) {
                        toggleTag(contractElement, contractType, 'contractType');
                    }
                });
            }
            
            updateProgressBar();
        } catch (e) {
            console.error('Erreur lors de la restauration des données:', e);
        }
    }
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

// Sauvegarde automatique toutes les 30 secondes
setInterval(autoSave, 30000);

// Sauvegarder avant de quitter la page
window.addEventListener('beforeunload', autoSave);

