/**
 * EEUEZJob - Theme Toggle System
 * Système de basculement entre thème clair et sombre
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.toggleButton = null;
        this.themeLabel = null;
        this.storageKey = 'eeuezjob-theme';
        
        this.init();
    }

    /**
     * Initialise le gestionnaire de thème
     */
    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Configuration initiale du système de thème
     */
    setup() {
        this.toggleButton = document.getElementById('themeToggle');
        this.themeLabel = document.querySelector('.theme-label');
        
        // Charger le thème sauvegardé ou détecter la préférence système
        this.loadSavedTheme();
        
        // Configurer les événements
        this.setupEventListeners();
        
        // Appliquer le thème initial
        this.applyTheme(this.currentTheme);
        
        console.log('Theme Manager initialized with theme:', this.currentTheme);
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.toggleTheme());
        }

        // Écouter les changements de préférence système
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem(this.storageKey)) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }

        // Écouter les changements de stockage (pour la synchronisation entre onglets)
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.setTheme(e.newValue || 'light');
            }
        });
    }

    /**
     * Charge le thème sauvegardé ou détecte la préférence système
     */
    loadSavedTheme() {
        const savedTheme = localStorage.getItem(this.storageKey);
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            // Détecter la préférence système
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.currentTheme = 'dark';
            } else {
                this.currentTheme = 'light';
            }
        }
    }

    /**
     * Bascule entre les thèmes
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Animation du bouton
        this.animateToggleButton();
    }

    /**
     * Définit le thème actuel
     * @param {string} theme - 'light' ou 'dark'
     */
    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            console.warn('Invalid theme:', theme);
            return;
        }

        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveTheme(theme);
        this.updateUI();
        
        // Déclencher un événement personnalisé
        this.dispatchThemeChangeEvent(theme);
    }

    /**
     * Applique le thème au document
     * @param {string} theme - 'light' ou 'dark'
     */
    applyTheme(theme) {
        const html = document.documentElement;
        
        if (theme === 'dark') {
            html.classList.add('dark');
            html.classList.remove('light');
        } else {
            html.classList.add('light');
            html.classList.remove('dark');
        }

        // Mettre à jour les méta-tags pour les navigateurs mobiles
        this.updateMetaThemeColor(theme);
        
        // Animation de transition fluide
        this.addTransitionClass();
    }

    /**
     * Sauvegarde le thème dans le localStorage
     * @param {string} theme - 'light' ou 'dark'
     */
    saveTheme(theme) {
        try {
            localStorage.setItem(this.storageKey, theme);
        } catch (error) {
            console.warn('Could not save theme to localStorage:', error);
        }
    }

    /**
     * Met à jour l'interface utilisateur du bouton de basculement
     */
    updateUI() {
        if (this.themeLabel) {
            this.themeLabel.textContent = this.currentTheme === 'dark' ? 'Sombre' : 'Clair';
        }

        // Mettre à jour l'attribut aria-label pour l'accessibilité
        if (this.toggleButton) {
            const label = this.currentTheme === 'dark' 
                ? 'Basculer vers le thème clair' 
                : 'Basculer vers le thème sombre';
            this.toggleButton.setAttribute('aria-label', label);
        }
    }

    /**
     * Anime le bouton de basculement
     */
    animateToggleButton() {
        if (!this.toggleButton) return;

        this.toggleButton.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.toggleButton.style.transform = 'scale(1)';
        }, 150);
    }

    /**
     * Ajoute une classe de transition temporaire pour des animations fluides
     */
    addTransitionClass() {
        document.body.classList.add('theme-transitioning');
        
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    /**
     * Met à jour la couleur du thème dans les méta-tags
     * @param {string} theme - 'light' ou 'dark'
     */
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        const color = theme === 'dark' ? '#0F0F0F' : '#2C3E50';
        metaThemeColor.content = color;
    }

    /**
     * Déclenche un événement personnalisé lors du changement de thème
     * @param {string} theme - 'light' ou 'dark'
     */
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { theme, previousTheme: this.currentTheme === 'dark' ? 'light' : 'dark' }
        });
        document.dispatchEvent(event);
    }

    /**
     * Obtient le thème actuel
     * @returns {string} - 'light' ou 'dark'
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Vérifie si le thème sombre est actif
     * @returns {boolean}
     */
    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    /**
     * Force un thème spécifique (utile pour les tests)
     * @param {string} theme - 'light' ou 'dark'
     */
    forceTheme(theme) {
        this.setTheme(theme);
    }
}

/**
 * Utilitaires pour les composants qui ont besoin de réagir aux changements de thème
 */
class ThemeUtils {
    /**
     * Obtient la couleur CSS appropriée pour le thème actuel
     * @param {string} lightColor - Couleur pour le thème clair
     * @param {string} darkColor - Couleur pour le thème sombre
     * @returns {string}
     */
    static getThemeColor(lightColor, darkColor) {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? darkColor : lightColor;
    }

    /**
     * Applique des styles conditionnels basés sur le thème
     * @param {HTMLElement} element - Élément à styliser
     * @param {Object} lightStyles - Styles pour le thème clair
     * @param {Object} darkStyles - Styles pour le thème sombre
     */
    static applyThemeStyles(element, lightStyles, darkStyles) {
        if (!element) return;

        const isDark = document.documentElement.classList.contains('dark');
        const styles = isDark ? darkStyles : lightStyles;

        Object.assign(element.style, styles);
    }

    /**
     * Écoute les changements de thème et exécute un callback
     * @param {Function} callback - Fonction à exécuter lors du changement
     */
    static onThemeChange(callback) {
        document.addEventListener('themeChanged', callback);
    }

    /**
     * Supprime un écouteur de changement de thème
     * @param {Function} callback - Fonction à supprimer
     */
    static offThemeChange(callback) {
        document.removeEventListener('themeChanged', callback);
    }
}

/**
 * Plugin pour intégrer le système de thème avec d'autres composants
 */
class ThemeIntegration {
    /**
     * Intègre le système de thème avec les graphiques Chart.js
     * @param {Object} chartConfig - Configuration du graphique
     * @returns {Object} - Configuration mise à jour
     */
    static integrateWithChartJS(chartConfig) {
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            chartConfig.options = chartConfig.options || {};
            chartConfig.options.plugins = chartConfig.options.plugins || {};
            chartConfig.options.plugins.legend = chartConfig.options.plugins.legend || {};
            chartConfig.options.plugins.legend.labels = {
                color: '#E8E9EA'
            };
            
            chartConfig.options.scales = chartConfig.options.scales || {};
            Object.keys(chartConfig.options.scales).forEach(scaleKey => {
                chartConfig.options.scales[scaleKey].ticks = {
                    color: '#B0B3B8'
                };
                chartConfig.options.scales[scaleKey].grid = {
                    color: '#333333'
                };
            });
        }

        return chartConfig;
    }

    /**
     * Intègre le système de thème avec les modales
     * @param {HTMLElement} modal - Élément modal
     */
    static integrateWithModal(modal) {
        if (!modal) return;

        const updateModalTheme = () => {
            const isDark = document.documentElement.classList.contains('dark');
            
            if (isDark) {
                modal.classList.add('dark-modal');
                modal.classList.remove('light-modal');
            } else {
                modal.classList.add('light-modal');
                modal.classList.remove('dark-modal');
            }
        };

        // Appliquer le thème initial
        updateModalTheme();

        // Écouter les changements de thème
        ThemeUtils.onThemeChange(updateModalTheme);
    }
}

// Initialiser le gestionnaire de thème
let themeManager;

// Attendre que le DOM soit prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        themeManager = new ThemeManager();
    });
} else {
    themeManager = new ThemeManager();
}

// Exposer les utilitaires globalement
window.ThemeManager = ThemeManager;
window.ThemeUtils = ThemeUtils;
window.ThemeIntegration = ThemeIntegration;

// Exposer l'instance du gestionnaire de thème
window.getThemeManager = () => themeManager;

// CSS pour les transitions fluides
const transitionStyles = `
    .theme-transitioning * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }
    
    .dark-modal {
        background-color: var(--card-bg) !important;
        color: var(--text-primary) !important;
        border-color: var(--border-color) !important;
    }
    
    .light-modal {
        background-color: #FFFFFF !important;
        color: #2C3E50 !important;
        border-color: #DEE2E6 !important;
    }
`;

// Injecter les styles de transition
const styleSheet = document.createElement('style');
styleSheet.textContent = transitionStyles;
document.head.appendChild(styleSheet);

console.log('Theme Toggle System loaded successfully');

