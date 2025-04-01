document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard charts
    initDashboardCharts();
    
    // Handle notifications
    const notificationsIcon = document.querySelector('.notifications');
    if (notificationsIcon) {
        notificationsIcon.addEventListener('click', function() {
            // Toggle notifications panel
            showNotifications();
        });
    }
    
    // Handle sidebar navigation
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.classList.contains('logout')) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Load content based on the clicked link
                const target = this.getAttribute('data-target');
                if (target) {
                    loadDashboardContent(target);
                }
            }
        });
    });
});
