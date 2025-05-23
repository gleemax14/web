// Menu Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and categories
            tabButtons.forEach(btn => btn.classList.remove('active'));
            menuCategories.forEach(category => category.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding category
            const targetTab = this.getAttribute('data-tab');
            const targetCategory = document.getElementById(targetTab);
            
            if (targetCategory) {
                targetCategory.classList.add('active');
                
                // Smooth scroll to category
                setTimeout(() => {
                    const menuItemsSection = document.querySelector('.menu-items');
                    if (menuItemsSection) {
                        const offset = 120; // Header + tabs height
                        const elementPosition = menuItemsSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        });
    });
    
    // Menu item hover effects
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
            
            const img = this.querySelector('.menu-item-img img');
            if (img) {
                img.style.transform = 'scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            
            const img = this.querySelector('.menu-item-img img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });
    
    // Handle direct links to specific tabs
    const handleHashChange = function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetButton = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
            if (targetButton) {
                targetButton.click();
            }
        }
    };
    
    // Run on page load
    handleHashChange();
    // Run when hash changes
    window.addEventListener('hashchange', handleHashChange);
}); 