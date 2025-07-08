document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const form = document.getElementById('profileForm');
    const submitButton = document.getElementById('submitButton');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const sectorsContainer = document.getElementById('sectorsContainer');
    const sectorCountElement = document.getElementById('sectorCount');
    const selectedSectorsInput = document.getElementById('selectedSectorsInput');
    
    // Données
    let selectedSectors = JSON.parse(selectedSectorsInput.value || '[]');
    
    // Initialisation
    initializeSectors();
    setupFileUploads();
    setupFormValidation();
    updateProgressBar();
    
    // Événements
    form.addEventListener('submit', handleFormSubmit);
    
    // Fonctions d'initialisation
    function initializeSectors() {
        // Marquer les secteurs déjà sélectionnés
        document.querySelectorAll('.sector-tag').forEach(tag => {
            const sectorId = tag.getAttribute('data-sector');
            if (selectedSectors.includes(sectorId)) {
                tag.classList.add('selected');
                tag.setAttribute('aria-pressed', 'true');
            }
            
            // Gestion des clics
            tag.addEventListener('click', () => toggleSectorSelection(tag, sectorId));
            tag.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSectorSelection(tag, sectorId);
                }
            });
        });
        
        updateSectorCount();
    }
    
    function setupFileUploads() {
        document.querySelectorAll('.file-upload-zone').forEach(zone => {
            const input = zone.querySelector('input[type="file"]');
            const icon = zone.querySelector('.upload-icon');
            const text = zone.querySelector('.upload-text');
            const subtext = zone.querySelector('.upload-subtext');
            
            // Drag & drop
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
                if (e.dataTransfer.files.length) {
                    input.files = e.dataTransfer.files;
                    updateFileDisplay(zone, input.files[0]);
                    updateProgressBar();
                }
            });
            
            // Changement via parcourir
            input.addEventListener('change', () => {
                if (input.files.length) {
                    updateFileDisplay(zone, input.files[0]);
                    updateProgressBar();
                }
            });
        });
    }
    
    function setupFormValidation() {
        // Validation en temps réel
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', () => {
                validateField(input);
                updateProgressBar();
            });
            
            input.addEventListener('blur', () => validateField(input));
        });
    }
    
    // Fonctions de gestion
    function toggleSectorSelection(element, sectorId) {
        const index = selectedSectors.indexOf(sectorId);
        
        if (index === -1) {
            // Sélectionner
            selectedSectors.push(sectorId);
            element.classList.add('selected');
            element.setAttribute('aria-pressed', 'true');
        } else {
            // Désélectionner
            selectedSectors.splice(index, 1);
            element.classList.remove('selected');
            element.setAttribute('aria-pressed', 'false');
        }
        
        // Mettre à jour le champ caché
        selectedSectorsInput.value = JSON.stringify(selectedSectors);
        updateSectorCount();
        updateProgressBar();
        validateForm();
    }
    
    function updateFileDisplay(zone, file) {
        const icon = zone.querySelector('.upload-icon');
        const text = zone.querySelector('.upload-text');
        const subtext = zone.querySelector('.upload-subtext');
        
        icon.className = 'fas fa-check-circle upload-icon';
        icon.style.color = '#27AE60';
        text.textContent = `Fichier sélectionné: ${file.name}`;
        subtext.textContent = `Taille: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
        
        zone.style.borderColor = '#27AE60';
        zone.style.backgroundColor = '#E8F5E8';
    }
    
    function updateSectorCount() {
        const count = selectedSectors.length;
        sectorCountElement.textContent = `${count} secteur(s) sélectionné(s) - Minimum 3 requis`;
        sectorCountElement.parentElement.style.color = count >= 3 ? '#27AE60' : '#E74C3C';
    }
    
    function validateField(field) {
        const value = field.value.trim();
        const isValid = value !== '';
        
        // Supprimer les erreurs existantes
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) errorElement.remove();
        
        // Validation spécifique
        if (field.id === 'id_years_experience' && value) {
            const years = parseInt(value);
            if (isNaN(years) || years < 0 || years > 50) {
                showFieldError(field, 'L\'expérience doit être entre 0 et 50 ans');
                return;
            }
        }
        
        if (isValid) {
            field.classList.add('valid');
            field.classList.remove('invalid');
        } else if (field.required) {
            field.classList.add('invalid');
            field.classList.remove('valid');
            showFieldError(field, 'Ce champ est obligatoire');
        }
    }
    
    function validateForm() {
        let isValid = true;
        
        // Valider les champs requis
        document.querySelectorAll('.form-input[required]').forEach(field => {
            if (field.value.trim() === '') {
                isValid = false;
            }
        });
        
        // Valider les secteurs
        if (selectedSectors.length < 3) {
            isValid = false;
        }
        
        // Activer/désactiver le bouton
        submitButton.disabled = !isValid;
        return isValid;
    }
    
    function updateProgressBar() {
        let totalFields = 0;
        let completedFields = 0;
        
        // Champs texte
        document.querySelectorAll('.form-input').forEach(input => {
            totalFields++;
            if (input.value.trim() !== '') {
                completedFields++;
            }
        });
        
        // Fichiers
        document.querySelectorAll('input[type="file"]').forEach(input => {
            totalFields++;
            if (input.files.length > 0) {
                completedFields++;
            }
        });
        
        // Secteurs
        totalFields++;
        if (selectedSectors.length >= 3) {
            completedFields++;
        }
        
        const progress = Math.round((completedFields / totalFields) * 100);
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}% complété`;
        
        if (progress === 100) {
            progressText.style.color = '#27AE60';
            progressText.style.fontWeight = '600';
        } else {
            progressText.style.color = '#2C3E50';
            progressText.style.fontWeight = '500';
        }
    }
    
    function handleFormSubmit(e) {
        if (!validateForm()) {
            e.preventDefault();
            return;
        }
        
        // Feedback visuel pendant l'envoi
        submitButton.disabled = true;
        const originalContent = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
        
        // La soumission normale se poursuivra (pas de AJAX)
        // La réponse sera gérée par Django
    }
    
    function showFieldError(field, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = '#E74C3C';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
        field.classList.add('invalid');
    }
    
    // Sauvegarde automatique (optionnelle)
    function autoSave() {
        const formData = {};
        document.querySelectorAll('.form-input').forEach(input => {
            formData[input.name] = input.value;
        });
        formData.selectedSectors = selectedSectors;
        localStorage.setItem('formAutoSave', JSON.stringify(formData));
    }
    
    // Restaurer les données sauvegardées (optionnelle)
    function restoreSavedData() {
        const savedData = localStorage.getItem('formAutoSave');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                // Restaurer les champs
                document.querySelectorAll('.form-input').forEach(input => {
                    if (data[input.name]) {
                        input.value = data[input.name];
                        validateField(input);
                    }
                });
                
                // Restaurer les secteurs
                if (data.selectedSectors) {
                    selectedSectors = data.selectedSectors;
                    selectedSectorsInput.value = JSON.stringify(selectedSectors);
                    updateSectorSelection();
                    updateSectorCount();
                }
                
                updateProgressBar();
            } catch (e) {
                console.error('Erreur de restauration:', e);
            }
        }
    }
    
    // Activer la sauvegarde automatique (toutes les 30 secondes)
    setInterval(autoSave, 30000);
    
    // Restaurer au chargement (avec un léger délai)
    setTimeout(restoreSavedData, 100);
});