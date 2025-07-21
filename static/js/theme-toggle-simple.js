/**
 * Simple Theme Toggle Script for EEUEZJob
 * Changes CSS classes instead of redirecting to different URLs
 */

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    if (!themeToggle) {
        console.warn('Theme toggle button not found');
        return;
    }

    // Get stored theme preference
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
        if (theme === 'dark') {
            // Apply dark theme classes
            body.classList.remove('bg-gray-100', 'text-gray-800');
            body.classList.add('bg-gray-900', 'text-gray-100');
            
            // Update header
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('bg-[#2C3E50]');
                header.classList.add('bg-gray-800', 'border-b', 'border-gray-700');
            }
            
            // Update footer
            const footer = document.querySelector('.footer');
            if (footer) {
                footer.classList.remove('bg-[#2C3E50]');
                footer.classList.add('bg-gray-800', 'text-gray-300', 'border-t', 'border-gray-700');
            }
            
            // Update form containers
            const formContainers = document.querySelectorAll('.form-container');
            formContainers.forEach(container => {
                container.classList.remove('bg-white');
                container.classList.add('bg-gray-800', 'border', 'border-gray-700');
            });
            
            // Update cards
            const cards = document.querySelectorAll('.card, .bg-white');
            cards.forEach(card => {
                card.classList.remove('bg-white');
                card.classList.add('bg-gray-800', 'border', 'border-gray-700');
            });
            
            // Update inputs
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.classList.add('bg-gray-700', 'text-gray-100', 'border-gray-600');
            });
            
            // Update text colors
            const textElements = document.querySelectorAll('p, span, label, h1, h2, h3, h4, h5, h6');
            textElements.forEach(element => {
                if (!element.classList.contains('text-orange-500') && !element.classList.contains('text-white')) {
                    element.classList.remove('text-gray-700', 'text-gray-800');
                    element.classList.add('text-gray-300');
                }
            });
            
        } else {
            // Apply light theme classes
            body.classList.remove('bg-gray-900', 'text-gray-100');
            body.classList.add('bg-gray-100', 'text-gray-800');
            
            // Update header
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('bg-gray-800', 'border-b', 'border-gray-700');
                header.classList.add('bg-[#2C3E50]');
            }
            
            // Update footer
            const footer = document.querySelector('.footer');
            if (footer) {
                footer.classList.remove('bg-gray-800', 'text-gray-300', 'border-t', 'border-gray-700');
                footer.classList.add('bg-[#2C3E50]');
            }
            
            // Update form containers
            const formContainers = document.querySelectorAll('.form-container');
            formContainers.forEach(container => {
                container.classList.remove('bg-gray-800', 'border', 'border-gray-700');
                container.classList.add('bg-white');
            });
            
            // Update cards
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.classList.remove('bg-gray-800', 'border', 'border-gray-700');
                card.classList.add('bg-white');
            });
            
            // Update inputs
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.classList.remove('bg-gray-700', 'text-gray-100', 'border-gray-600');
            });
            
            // Update text colors
            const textElements = document.querySelectorAll('p, span, label, h1, h2, h3, h4, h5, h6');
            textElements.forEach(element => {
                if (!element.classList.contains('text-orange-500') && !element.classList.contains('text-white')) {
                    element.classList.remove('text-gray-300');
                    element.classList.add('text-gray-700');
                }
            });
        }
        
        // Add transition effect
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }
});