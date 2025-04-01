document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const topNav = document.querySelector('.topnav');
    
    if (menuToggle && topNav) {
        menuToggle.addEventListener('click', function() {
            if (topNav.className === "topnav") {
                topNav.className += " responsive";
            } else {
                topNav.className = "topnav";
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (topNav && topNav.classList.contains('responsive') && 
            !event.target.closest('.topnav') && 
            !event.target.closest('.menu-toggle')) {
            topNav.className = "topnav";
        }
    });
    
    // Handle dropdown clicks on mobile
    const dropbtns = document.querySelectorAll('.dropbtn');
    if (window.innerWidth <= 992) {
        dropbtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (topNav.classList.contains('responsive')) {
                    e.preventDefault();
                    const dropdownContent = this.nextElementSibling;
                    if (dropdownContent.style.display === "block") {
                        dropdownContent.style.display = "none";
                    } else {
                        // Close all other dropdowns
                        document.querySelectorAll('.dropdown-content').forEach(content => {
                            content.style.display = "none";
                        });
                        dropdownContent.style.display = "block";
                    }
                }
            });
        });
    }
    
    // Search overlay toggle
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');

    if (searchToggle && searchOverlay && searchClose) {
        searchToggle.addEventListener('click', function() {
            searchOverlay.classList.add('active');
            setTimeout(() => {
                if (searchInput) {
                    searchInput.focus();
                }
            }, 100);
        });
        
        searchClose.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
        });
        
        // Close search when pressing Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Check for saved theme preference or use device preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeToggle.checked = savedTheme === 'dark';
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeToggle.checked = true;
            }
        }
        
        // Theme switch event
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Active link highlighting
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.topnav a:not(.dropbtn)');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath && (
            currentPath.endsWith(linkPath) || 
            (linkPath !== 'index.html' && currentPath.includes(linkPath))
        )) {
            link.classList.add('active');
            
            // If in dropdown, also highlight parent
            const dropdownParent = link.closest('.dropdown');
            if (dropdownParent) {
                const dropdownToggle = dropdownParent.querySelector('.dropbtn');
                if (dropdownToggle) {
                    dropdownToggle.classList.add('active');
                }
            }
        }
    });
});
