// academiAI Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            mobileMenuToggle.textContent = navLinks.classList.contains('show') ? '✕' : '☰';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.main-nav') && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                mobileMenuToggle.textContent = '☰';
            }
        });
    }
    
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = `© ${new Date().getFullYear()} academiAI`;
    }
    
    // Highlight active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.nav-links a');
    
    navLinksAll.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (currentPage === linkPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.textContent = '☰';
                    }
                }
            }
        });
    });
    
    // Initialize tooltips
    initializeTooltips();
    
    // Check for API configuration
    checkAPIConfiguration();
});

function initializeTooltips() {
    // Add tooltips to elements with data-tooltip attribute
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltipText = e.target.getAttribute('data-tooltip');
            if (!tooltipText) return;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--primary-color);
                color: white;
                padding: 0.5rem 0.75rem;
                border-radius: 4px;
                font-size: 0.85rem;
                z-index: 1000;
                white-space: nowrap;
                pointer-events: none;
                transform: translateY(-100%) translateX(-50%);
                left: 50%;
                top: -5px;
            `;
            
            document.body.appendChild(tooltip);
            e.target.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', (e) => {
            if (e.target.tooltipElement) {
                e.target.tooltipElement.remove();
                e.target.tooltipElement = null;
            }
        });
    });
}

function checkAPIConfiguration() {
    // This function is called from config.js
    // Display API status in console
    if (typeof academiAIConfig !== 'undefined') {
        const apiKey = academiAIConfig.deepseek.apiKey;
        const isConfigured = apiKey && apiKey !== 'your-api-key-here' && apiKey.length > 20;
        
        console.log(`%cacademiAI ${isConfigured ? '✅' : '⚠️'}`, 
            `color: ${isConfigured ? 'green' : 'orange'}; font-weight: bold; font-size: 14px;`);
        console.log(`API Status: ${isConfigured ? 'Configured' : 'Not Configured'}`);
        console.log(`Running in ${isConfigured ? 'Full' : 'Demo'} Mode`);
        
        if (!isConfigured) {
            console.log('%c⚠️ Add your DeepSeek API key to config.js', 'color: orange;');
            console.log('%cGet a free key from: https://platform.deepseek.com/', 'color: #3498db;');
        }
    }
}

// Utility function for notifications
function showNotification(message, type = 'info') {
    const colors = {
        info: '#3498db',
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c'
    };
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.academiAIUtils = {
        showNotification,
        checkAPIConfiguration
    };
}