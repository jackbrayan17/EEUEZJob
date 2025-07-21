/**
 * Tailwind Dark Mode Toggle Script for EEUEZJob
 * Uses Tailwind's built-in dark mode functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        console.warn('Theme toggle button not found');
        return;
    }

    // Get stored theme preference or default to light
    const storedTheme = localStorage.getItem('eeuezjob-theme') || 'light';
    
    // Apply initial theme
    applyTheme(storedTheme);
    
    // Set toggle state
    themeToggle.checked = storedTheme === 'dark';
    
    // Add event listener
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('eeuezjob-theme', newTheme);
    });
    
    function applyTheme(theme) {
        const html = document.documentElement;
        
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        
        // Add smooth transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        console.log(`Theme applied: ${theme}`);
    }
});
