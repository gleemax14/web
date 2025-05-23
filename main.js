// Donut Haven Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Add header background on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Simple animation on scroll for elements
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.category, .testimonial, .location');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Add initial styles for animation
    const animatedElements = document.querySelectorAll('.category, .testimonial, .location');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation check on scroll
    window.addEventListener('scroll', animateOnScroll);
    // Initial check for elements that may be in view on page load
    setTimeout(animateOnScroll, 100);
    
    // Testimonial slider (if needed)
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    
    if (window.innerWidth < 768 && testimonials.length > 1) {
        // Hide all except first testimonial on mobile
        for (let i = 1; i < testimonials.length; i++) {
            testimonials[i].style.display = 'none';
        }
        
        // Add navigation buttons
        const testimonialContainer = document.querySelector('.testimonial-container');
        const navButtons = document.createElement('div');
        navButtons.className = 'testimonial-nav';
        
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '&larr;';
        prevBtn.className = 'prev-btn';
        
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '&rarr;';
        nextBtn.className = 'next-btn';
        
        navButtons.appendChild(prevBtn);
        navButtons.appendChild(nextBtn);
        
        if (testimonialContainer) {
            testimonialContainer.parentNode.insertBefore(navButtons, testimonialContainer.nextSibling);
        
            // Add click events
            prevBtn.addEventListener('click', function() {
                testimonials[currentTestimonial].style.display = 'none';
                currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
                testimonials[currentTestimonial].style.display = 'block';
            });
            
            nextBtn.addEventListener('click', function() {
                testimonials[currentTestimonial].style.display = 'none';
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                testimonials[currentTestimonial].style.display = 'block';
            });
        }
    }
}); 