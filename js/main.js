document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const ctaButtons = document.querySelector('.cta-buttons');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Create mobile menu if it doesn't exist
            if (!document.querySelector('.mobile-menu')) {
                const mobileMenu = document.createElement('div');
                mobileMenu.classList.add('mobile-menu');
                
                // Clone navigation links
                const navClone = navLinks.cloneNode(true);
                mobileMenu.appendChild(navClone);
                
                // Clone CTA buttons
                const ctaClone = ctaButtons.cloneNode(true);
                mobileMenu.appendChild(ctaClone);
                
                // Add to DOM
                document.body.appendChild(mobileMenu);
                
                // Add styles
                mobileMenu.style.position = 'fixed';
                mobileMenu.style.top = '80px';
                mobileMenu.style.left = '0';
                mobileMenu.style.width = '100%';
                mobileMenu.style.backgroundColor = 'white';
                mobileMenu.style.padding = '2rem';
                mobileMenu.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
                mobileMenu.style.zIndex = '999';
                mobileMenu.style.display = 'none';
                mobileMenu.style.flexDirection = 'column';
                mobileMenu.style.gap = '2rem';
                
                // Style nav links
                navClone.style.flexDirection = 'column';
                navClone.style.gap = '1rem';
                
                // Style CTA buttons
                ctaClone.style.flexDirection = 'column';
                ctaClone.style.gap = '1rem';
            }
            
            // Toggle mobile menu
            const mobileMenu = document.querySelector('.mobile-menu');
            if (this.classList.contains('active')) {
                mobileMenu.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenu.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (testimonialSlider && prevBtn && nextBtn) {
        let slideIndex = 0;
        const testimonials = document.querySelectorAll('.testimonial-card');
        const slideWidth = testimonials[0].offsetWidth + 32; // Card width + gap
        
        // Initialize slider
        updateSlider();
        
        // Previous button
        prevBtn.addEventListener('click', function() {
            slideIndex = Math.max(0, slideIndex - 1);
            updateSlider();
        });
        
        // Next button
        nextBtn.addEventListener('click', function() {
            slideIndex = Math.min(testimonials.length - getVisibleSlides(), slideIndex + 1);
            updateSlider();
        });
        
        // Update slider position
        function updateSlider() {
            testimonialSlider.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
            
            // Update button states
            prevBtn.disabled = slideIndex === 0;
            nextBtn.disabled = slideIndex >= testimonials.length - getVisibleSlides();
            
            // Visual feedback for disabled buttons
            prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
            nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
        }
        
        // Calculate visible slides based on viewport
        function getVisibleSlides() {
            const viewportWidth = window.innerWidth;
            if (viewportWidth < 768) return 1;
            if (viewportWidth < 1024) return 2;
            return 3;
        }
        
        // Update on window resize
        window.addEventListener('resize', function() {
            // Recalculate slide width
            const newSlideWidth = testimonials[0].offsetWidth + 32;
            
            // Update slider with new dimensions
            slideIndex = Math.min(testimonials.length - getVisibleSlides(), slideIndex);
            testimonialSlider.style.transform = `translateX(-${slideIndex * newSlideWidth}px)`;
            
            // Update button states
            prevBtn.disabled = slideIndex === 0;
            nextBtn.disabled = slideIndex >= testimonials.length - getVisibleSlides();
            prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
            nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.style.display === 'flex') {
                    mobileMenu.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    document.querySelector('.hamburger').classList.remove('active');
                }
            }
        });
    });
    
    // Form submissions
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.textContent = 'Thank you! Your submission has been received.';
            successMessage.style.backgroundColor = '#d4edda';
            successMessage.style.color = '#155724';
            successMessage.style.padding = '1rem';
            successMessage.style.borderRadius = 'var(--border-radius)';
            successMessage.style.marginTop = '1rem';
            
            // Add success message to form
            this.appendChild(successMessage);
            
            // Reset form
            this.reset();
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    });
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .tool-card, .pricing-card, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // If element is in viewport
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    const elementsToAnimate = document.querySelectorAll('.feature-card, .tool-card, .pricing-card, .testimonial-card');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation on page load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Tool search functionality (for future implementation)
    const searchInput = document.querySelector('.search-form input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // This is a placeholder for future search functionality
            console.log('Searching for:', this.value);
        });
    }
    
    // Add active class to current navigation item based on URL
    const currentLocation = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        const itemPath = item.getAttribute('href');
        if (currentLocation.includes(itemPath) && itemPath !== '#') {
            item.classList.add('active');
        }
    });
});
