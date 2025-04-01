document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize dark mode toggle
    initDarkMode();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize code highlighting
    initCodeHighlighting();
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize newsletter form
    initNewsletterForm();
});

function initMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            // Toggle menu visibility
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Toggle aria-expanded attribute for accessibility
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
            
            // Prevent scrolling when menu is open
            document.body.classList.toggle('nav-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            }
        });
        
        // Handle dropdown menus in mobile navigation
        const dropdownToggles = document.querySelectorAll('.nav-menu .has-dropdown > a');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                // Only handle dropdown on mobile
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    
                    const parent = this.parentElement;
                    const dropdown = parent.querySelector('.dropdown');
                    
                    // Close other dropdowns
                    dropdownToggles.forEach(otherToggle => {
                        const otherParent = otherToggle.parentElement;
                        if (otherParent !== parent && otherParent.classList.contains('active')) {
                            otherParent.classList.remove('active');
                            otherParent.querySelector('.dropdown').style.maxHeight = '0px';
                        }
                    });
                    
                    // Toggle current dropdown
                    parent.classList.toggle('active');
                    
                    if (parent.classList.contains('active')) {
                        dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
                    } else {
                        dropdown.style.maxHeight = '0px';
                    }
                }
            });
        });
        
        // Reset mobile nav styles on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
                
                // Reset dropdowns
                document.querySelectorAll('.nav-menu .has-dropdown').forEach(item => {
                    item.classList.remove('active');
                    const dropdown = item.querySelector('.dropdown');
                    if (dropdown) {
                        dropdown.style.maxHeight = '';
                    }
                });
            }
        });
    }
}

function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (darkModeToggle) {
        // Check for saved user preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkModeToggle.classList.add('active');
        }
        
        // Handle toggle click
        darkModeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = 'light';
            
            if (currentTheme !== 'dark') {
                newTheme = 'dark';
                darkModeToggle.classList.add('active');
            } else {
                darkModeToggle.classList.remove('active');
            }
            
            // Set theme
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Animate transition
            document.documentElement.classList.add('theme-transition');
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
            }, 500);
        });
    }
}

function initSmoothScroll() {
    // Get all links that have hash anchors
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset (accounting for fixed header)
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight - 20; // 20px extra padding
                
                // Smooth scroll to target
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
}

function initCodeHighlighting() {
    // Check if Prism.js is loaded
    if (typeof Prism !== 'undefined') {
        // Highlight all code blocks
        Prism.highlightAll();
    }
}

function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            
            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            // Add tooltip to the document
            document.body.appendChild(tooltip);
            
            // Position tooltip
            const rect = this.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            tooltip.style.top = rect.top - tooltipRect.height - 10 + window.scrollY + 'px';
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltipRect.width / 2) + 'px';
            
            // Show tooltip
            setTimeout(() => {
                tooltip.classList.add('show');
            }, 10);
            
            // Store tooltip reference
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.classList.remove('show');
                
                // Remove tooltip after animation
                setTimeout(() => {
                    if (this.tooltip.parentNode) {
                        document.body.removeChild(this.tooltip);
                    }
                    this.tooltip = null;
                }, 300);
            }
        });
    });
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length > 0) {
        // Check if elements are in viewport on page load
        checkAnimatedElements();
        
        // Check on scroll
        window.addEventListener('scroll', checkAnimatedElements);
    }
    
    function checkAnimatedElements() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                // Add animation class with delay based on data attribute
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('animated');
                }, delay);
            }
        });
    }
    
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Element is considered in viewport when it's top is in the bottom 80% of the screen
        return rect.top <= windowHeight * 0.8;
    }
}

function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // In a real application, this would submit the form data to the server
                console.log('Newsletter subscription:', email);
                
                // Show success message
                const formContent = this.innerHTML;
                this.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Thank you for subscribing!</h3>
                        <p>You'll receive our next newsletter in your inbox.</p>
                    </div>
                `;
                
                // Reset form after delay
                setTimeout(() => {
                    this.innerHTML = formContent;
                    emailInput.value = '';
                    initNewsletterForm(); // Reinitialize form
                }, 5000);
            }
        });
    }
}
