/**
 * EEUEZJob - Script Principal avec Support Thème Sombre
 * Script principal de l'application avec intégration du système de thème
 */

// Configuration globale
const EEUEZJob = {
    config: {
        animationDuration: 300,
        debounceDelay: 250,
        apiEndpoints: {
            chatbot: '/ai-chatbot/',
            search: '/api/search/',
            notifications: '/api/notifications/'
        }
    },
    
    // État global de l'application
    state: {
        isChatbotOpen: false,
        isLoading: false,
        currentUser: null,
        notifications: []
    }
};

/**
 * Gestionnaire principal de l'application
 */
class AppManager {
    constructor() {
        this.chatbot = null;
        this.notifications = null;
        this.search = null;
        
        this.init();
    }

    /**
     * Initialise l'application
     */
    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.setupThemeIntegration();
        
        console.log('EEUEZJob App initialized');
    }

    /**
     * Configure les écouteurs d'événements globaux
     */
    setupEventListeners() {
        // Gestion des erreurs globales
        window.addEventListener('error', this.handleGlobalError.bind(this));
        
        // Gestion du redimensionnement
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        
        // Gestion de la navigation
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    /**
     * Initialise les composants de l'application
     */
    initializeComponents() {
        this.chatbot = new ChatbotManager();
        this.notifications = new NotificationManager();
        this.search = new SearchManager();
        
        // Initialiser d'autres composants selon les besoins
        this.initializeForms();
        this.initializeAnimations();
    }

    /**
     * Configure l'intégration avec le système de thème
     */
    setupThemeIntegration() {
        // Écouter les changements de thème
        document.addEventListener('themeChanged', (event) => {
            this.handleThemeChange(event.detail.theme);
        });
    }

    /**
     * Gère les changements de thème
     * @param {string} theme - 'light' ou 'dark'
     */
    handleThemeChange(theme) {
        console.log('Theme changed to:', theme);
        
        // Mettre à jour les composants qui dépendent du thème
        if (this.chatbot) {
            this.chatbot.updateTheme(theme);
        }
        
        if (this.notifications) {
            this.notifications.updateTheme(theme);
        }
        
        // Mettre à jour les graphiques si présents
        this.updateChartsTheme(theme);
    }

    /**
     * Met à jour le thème des graphiques
     * @param {string} theme - 'light' ou 'dark'
     */
    updateChartsTheme(theme) {
        // Logique pour mettre à jour les graphiques Chart.js ou autres
        const charts = document.querySelectorAll('.chart-container');
        charts.forEach(chart => {
            // Mise à jour du thème des graphiques
            if (chart.chart) {
                const config = ThemeIntegration.integrateWithChartJS(chart.chart.config);
                chart.chart.update();
            }
        });
    }

    /**
     * Initialise les formulaires avec validation
     */
    initializeForms() {
        const forms = document.querySelectorAll('form[data-validate]');
        forms.forEach(form => {
            new FormValidator(form);
        });
    }

    /**
     * Initialise les animations
     */
    initializeAnimations() {
        // Observer d'intersection pour les animations au scroll
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in');
                    }
                });
            });

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
        }
    }

    /**
     * Gère les erreurs globales
     * @param {ErrorEvent} event - Événement d'erreur
     */
    handleGlobalError(event) {
        console.error('Global error:', event.error);
        
        // Afficher une notification d'erreur à l'utilisateur
        if (this.notifications) {
            this.notifications.show('Une erreur inattendue s\'est produite', 'error');
        }
    }

    /**
     * Gère le redimensionnement de la fenêtre
     */
    handleResize() {
        // Ajuster les composants selon la taille de l'écran
        if (this.chatbot) {
            this.chatbot.adjustForScreenSize();
        }
    }

    /**
     * Gère l'événement avant déchargement de la page
     * @param {BeforeUnloadEvent} event - Événement avant déchargement
     */
    handleBeforeUnload(event) {
        // Sauvegarder l'état si nécessaire
        if (EEUEZJob.state.isLoading) {
            event.preventDefault();
            event.returnValue = 'Des opérations sont en cours. Êtes-vous sûr de vouloir quitter ?';
        }
    }

    /**
     * Fonction utilitaire de debounce
     * @param {Function} func - Fonction à débouncer
     * @param {number} wait - Délai d'attente
     * @returns {Function}
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

/**
 * Gestionnaire du chatbot
 */
class ChatbotManager {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentTheme = 'light';
        
        this.init();
    }

    init() {
        this.toggleButton = document.getElementById('chatbotToggle');
        this.chatBox = document.getElementById('chatbotBox');
        this.messagesContainer = document.getElementById('chatMessages');
        this.inputField = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.toggle());
        }

        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }

        if (this.inputField) {
            this.inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    toggle() {
        this.isOpen = !this.isOpen;
        EEUEZJob.state.isChatbotOpen = this.isOpen;

        if (this.chatBox) {
            if (this.isOpen) {
                this.chatBox.classList.remove('hidden');
                this.chatBox.style.animation = 'fadeIn 0.3s ease-out';
                
                // Focus sur le champ de saisie
                setTimeout(() => {
                    if (this.inputField) {
                        this.inputField.focus();
                    }
                }, 100);
            } else {
                this.chatBox.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    this.chatBox.classList.add('hidden');
                }, 300);
            }
        }

        // Animer le bouton
        this.animateToggleButton();
    }

    animateToggleButton() {
        if (this.toggleButton) {
            this.toggleButton.style.transform = 'scale(0.9) rotate(180deg)';
            setTimeout(() => {
                this.toggleButton.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }
    }

    async sendMessage() {
        const message = this.inputField?.value.trim();
        if (!message) return;

        // Ajouter le message de l'utilisateur
        this.addMessage(message, 'user');
        this.inputField.value = '';

        // Afficher l'indicateur de frappe
        this.showTypingIndicator();

        try {
            const response = await this.sendToAPI(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('Désolé, une erreur s\'est produite. Veuillez réessayer.', 'bot', true);
            console.error('Chatbot error:', error);
        }
    }

    addMessage(content, sender, isError = false) {
        if (!this.messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message ${isError ? 'error' : ''}`;
        
        const timestamp = new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(content)}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;

        // Appliquer le thème approprié
        this.applyMessageTheme(messageDiv);

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        // Animation d'apparition
        messageDiv.style.animation = 'slideInUp 0.3s ease-out';
    }

    applyMessageTheme(messageElement) {
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            messageElement.classList.add('dark-theme');
        } else {
            messageElement.classList.remove('dark-theme');
        }
    }

    showTypingIndicator() {
        if (!this.messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    async sendToAPI(message) {
        const response = await fetch(EEUEZJob.config.apiEndpoints.chatbot, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCSRFToken()
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.response || 'Réponse non disponible';
    }

    scrollToBottom() {
        if (this.messagesContainer) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }

    updateTheme(theme) {
        this.currentTheme = theme;
        
        // Mettre à jour tous les messages existants
        const messages = this.messagesContainer?.querySelectorAll('.message');
        messages?.forEach(message => {
            this.applyMessageTheme(message);
        });
    }

    adjustForScreenSize() {
        if (window.innerWidth < 768 && this.chatBox) {
            this.chatBox.style.width = 'calc(100vw - 2rem)';
            this.chatBox.style.right = '1rem';
            this.chatBox.style.left = '1rem';
        } else if (this.chatBox) {
            this.chatBox.style.width = '350px';
            this.chatBox.style.right = '2rem';
            this.chatBox.style.left = 'auto';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    }
}

/**
 * Gestionnaire des notifications
 */
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.createContainer();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notificationContainer';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Suppression automatique
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || icons.info}</div>
            <div class="notification-message">${this.escapeHtml(message)}</div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        return notification;
    }

    remove(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }

    updateTheme(theme) {
        // Les notifications utilisent déjà les variables CSS qui s'adaptent au thème
        console.log('Notifications theme updated to:', theme);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

/**
 * Gestionnaire de recherche
 */
class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('[data-search]');
        this.searchResults = document.querySelector('[data-search-results]');
        this.debounceTimer = null;
        
        this.init();
    }

    init() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    handleSearch(query) {
        clearTimeout(this.debounceTimer);
        
        this.debounceTimer = setTimeout(() => {
            if (query.length >= 2) {
                this.performSearch(query);
            } else {
                this.clearResults();
            }
        }, EEUEZJob.config.debounceDelay);
    }

    async performSearch(query) {
        try {
            const response = await fetch(`${EEUEZJob.config.apiEndpoints.search}?q=${encodeURIComponent(query)}`);
            const results = await response.json();
            this.displayResults(results);
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    displayResults(results) {
        if (!this.searchResults) return;

        this.searchResults.innerHTML = results.map(result => `
            <div class="search-result-item">
                <h4>${this.escapeHtml(result.title)}</h4>
                <p>${this.escapeHtml(result.description)}</p>
            </div>
        `).join('');
    }

    clearResults() {
        if (this.searchResults) {
            this.searchResults.innerHTML = '';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

/**
 * Validateur de formulaires
 */
class FormValidator {
    constructor(form) {
        this.form = form;
        this.rules = {};
        this.init();
    }

    init() {
        this.setupValidation();
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    setupValidation() {
        const fields = this.form.querySelectorAll('[data-validate]');
        fields.forEach(field => {
            const rules = field.dataset.validate.split('|');
            this.rules[field.name] = rules;
            
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }

    validateField(field) {
        const rules = this.rules[field.name] || [];
        const value = field.value.trim();
        
        for (const rule of rules) {
            const [ruleName, ruleValue] = rule.split(':');
            
            if (!this.applyRule(ruleName, value, ruleValue)) {
                this.showFieldError(field, this.getErrorMessage(ruleName, ruleValue));
                return false;
            }
        }
        
        this.showFieldSuccess(field);
        return true;
    }

    applyRule(ruleName, value, ruleValue) {
        switch (ruleName) {
            case 'required':
                return value.length > 0;
            case 'min':
                return value.length >= parseInt(ruleValue);
            case 'max':
                return value.length <= parseInt(ruleValue);
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case 'phone':
                return /^[\d\s\-\+\(\)]+$/.test(value);
            default:
                return true;
        }
    }

    getErrorMessage(ruleName, ruleValue) {
        const messages = {
            required: 'Ce champ est obligatoire',
            min: `Minimum ${ruleValue} caractères requis`,
            max: `Maximum ${ruleValue} caractères autorisés`,
            email: 'Adresse email invalide',
            phone: 'Numéro de téléphone invalide'
        };
        
        return messages[ruleName] || 'Valeur invalide';
    }

    showFieldError(field, message) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    showFieldSuccess(field) {
        field.classList.add('valid');
        field.classList.remove('invalid');
        
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    clearFieldError(field) {
        field.classList.remove('invalid', 'valid');
        
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    handleSubmit(event) {
        let isValid = true;
        
        Object.keys(this.rules).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            event.preventDefault();
        }
    }
}

// Styles CSS pour les composants JavaScript
const componentStyles = `
    .notification-container {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        pointer-events: none;
    }
    
    .notification {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        margin-bottom: 0.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px var(--shadow-color);
        pointer-events: auto;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.hide {
        transform: translateX(100%);
    }
    
    .notification-success {
        border-left: 4px solid var(--success-color);
    }
    
    .notification-error {
        border-left: 4px solid var(--error-color);
    }
    
    .notification-warning {
        border-left: 4px solid var(--warning-color);
    }
    
    .notification-info {
        border-left: 4px solid var(--accent-primary);
    }
    
    .notification-icon {
        font-size: 1.25rem;
        font-weight: bold;
    }
    
    .notification-success .notification-icon {
        color: var(--success-color);
    }
    
    .notification-error .notification-icon {
        color: var(--error-color);
    }
    
    .notification-warning .notification-icon {
        color: var(--warning-color);
    }
    
    .notification-info .notification-icon {
        color: var(--accent-primary);
    }
    
    .notification-message {
        flex: 1;
        color: var(--text-primary);
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-muted);
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .notification-close:hover {
        background-color: var(--border-color);
        color: var(--text-primary);
    }
    
    .message {
        margin-bottom: 1rem;
        animation: slideInUp 0.3s ease-out;
    }
    
    .user-message {
        text-align: right;
    }
    
    .user-message .message-content {
        background-color: var(--accent-primary);
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 18px 18px 4px 18px;
        display: inline-block;
        max-width: 80%;
    }
    
    .bot-message .message-content {
        background-color: var(--card-bg);
        color: var(--text-primary);
        padding: 0.75rem 1rem;
        border-radius: 18px 18px 18px 4px;
        display: inline-block;
        max-width: 80%;
        border: 1px solid var(--border-color);
    }
    
    .message-time {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-top: 0.25rem;
    }
    
    .typing-indicator {
        display: flex;
        align-items: center;
        padding: 1rem;
        margin-bottom: 1rem;
    }
    
    .typing-dots {
        display: flex;
        gap: 0.25rem;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--text-muted);
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing {
        0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;

// Injecter les styles des composants
const componentStyleSheet = document.createElement('style');
componentStyleSheet.textContent = componentStyles;
document.head.appendChild(componentStyleSheet);

// Initialiser l'application
let appManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        appManager = new AppManager();
    });
} else {
    appManager = new AppManager();
}

// Exposer les gestionnaires globalement pour le débogage
window.EEUEZJob = EEUEZJob;
window.AppManager = AppManager;
window.getAppManager = () => appManager;

console.log('EEUEZJob Script loaded successfully');

