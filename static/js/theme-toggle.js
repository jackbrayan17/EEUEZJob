/**
 * Theme Toggle Script for EEUEZJob
 * Handles switching between light and dark themes
 */

class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'light';
        this.themeToggle = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupThemeToggle());
        } else {
            this.setupThemeToggle();
        }
    }

    setupThemeToggle() {
        this.themeToggle = document.getElementById('themeToggle');
        
        if (!this.themeToggle) {
            console.warn('Theme toggle button not found');
            return;
        }

        // Set initial state
        this.updateToggleState();
        
        // Add event listener
        this.themeToggle.addEventListener('change', (e) => {
            this.toggleTheme();
        });

        // Apply initial theme
        this.applyTheme(this.currentTheme);
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('eeuezjob-theme');
        } catch (e) {
            console.warn('localStorage not available:', e);
            return null;
        }
    }

    storeTheme(theme) {
        try {
            localStorage.setItem('eeuezjob-theme', theme);
        } catch (e) {
            console.warn('Could not store theme preference:', e);
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.storeTheme(this.currentTheme);
        this.applyTheme(this.currentTheme);
        this.updateToggleState();
    }

    updateToggleState() {
        if (this.themeToggle) {
            this.themeToggle.checked = this.currentTheme === 'dark';
        }
    }

    applyTheme(theme) {
        // Show loading indicator
        this.showLoadingIndicator();

        // Determine the correct URL path based on current location
        const currentPath = window.location.pathname;
        let newPath;

        if (theme === 'dark') {
            // Switch to dark theme
            if (currentPath.startsWith('/dark/')) {
                // Already on dark theme, no need to redirect
                this.hideLoadingIndicator();
                return;
            }
            newPath = '/dark' + currentPath;
        } else {
            // Switch to light theme
            if (currentPath.startsWith('/dark/')) {
                // Remove /dark prefix
                newPath = currentPath.replace('/dark', '') || '/';
            } else {
                // Already on light theme, no need to redirect
                this.hideLoadingIndicator();
                return;
            }
        }

        // Add smooth transition before redirect
        document.body.style.transition = 'opacity 0.3s ease-in-out';
        document.body.style.opacity = '0.7';

        // Redirect after a short delay for smooth transition
        setTimeout(() => {
            window.location.href = newPath;
        }, 150);
    }

    showLoadingIndicator() {
        // Create or show loading overlay
        let overlay = document.getElementById('theme-loading-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'theme-loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Changement de thème...</p>
                </div>
            `;
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                backdrop-filter: blur(2px);
            `;
            
            const spinner = overlay.querySelector('.loading-spinner');
            spinner.style.cssText = `
                background: white;
                padding: 2rem;
                border-radius: 8px;
                text-align: center;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            `;
            
            const spinnerElement = overlay.querySelector('.spinner');
            spinnerElement.style.cssText = `
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #FF8C42;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            `;
            
            // Add CSS animation
            if (!document.getElementById('theme-spinner-styles')) {
                const style = document.createElement('style');
                style.id = 'theme-spinner-styles';
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(overlay);
        } else {
            overlay.style.display = 'flex';
        }
    }

    hideLoadingIndicator() {
        const overlay = document.getElementById('theme-loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // Method to get current theme (useful for other scripts)
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Method to set theme programmatically
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            this.storeTheme(theme);
            this.applyTheme(theme);
            this.updateToggleState();
        }
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Make it globally available
window.ThemeManager = themeManager;

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
    // Update theme state based on current URL
    const currentPath = window.location.pathname;
    const newTheme = currentPath.startsWith('/dark/') ? 'dark' : 'light';
    
    if (newTheme !== themeManager.currentTheme) {
        themeManager.currentTheme = newTheme;
        themeManager.storeTheme(newTheme);
        themeManager.updateToggleState();
    }
});

// Handle page visibility change (when user comes back to tab)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page is visible again, ensure theme state is correct
        const currentPath = window.location.pathname;
        const urlTheme = currentPath.startsWith('/dark/') ? 'dark' : 'light';
        const storedTheme = themeManager.getStoredTheme() || 'light';
        
        // If URL theme doesn't match stored preference, redirect
        if (urlTheme !== storedTheme) {
            themeManager.applyTheme(storedTheme);
        }
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
