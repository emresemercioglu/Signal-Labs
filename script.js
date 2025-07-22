// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
});

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Form Handling - Real Formspree Integration
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Submit to Formspree
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Success - email sent to emre@usesignallabs.com
            showNotification('Thank you! Your consultation request has been sent. We\'ll get back to you within 24 hours.', 'success');
            form.reset();
            
            // Track successful form submission
            trackEvent('Contact', 'form_submit', 'consultation_request');
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        // Error handling
        console.error('Form submission error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again or email us directly at emre@usesignallabs.com', 'error');
    })
    .finally(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function handleWaitlistForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Adding...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Show success message
        showNotification('Welcome to the waitlist! We\'ll notify you when CIx launches.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // For demo purposes, log the data
        console.log('Waitlist data:', data);
    }, 1000);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#4F46E5'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(notificationStyles);

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.service-card, .content-card, .feature-item');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Copy to Clipboard Function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Copied to clipboard!', 'success');
    });
}

// Email Link Handler
function handleEmailClick(email) {
    const subject = encodeURIComponent('Signal Labs Consultation Request');
    const body = encodeURIComponent('Hi Emre,\n\nI\'m interested in learning more about Signal Labs\' competitive intelligence services.\n\nBest regards,');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

// Analytics Event Tracking (placeholder)
function trackEvent(category, action, label = '') {
    // Replace with your analytics implementation
    console.log('Event tracked:', { category, action, label });
    
    // Example for Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         event_category: category,
    //         event_label: label
    //     });
    // }
}

// Track CTA clicks
document.addEventListener('DOMContentLoaded', function() {
    // Track consultation button clicks
    const consultationButtons = document.querySelectorAll('a[href*="contact"], .nav-cta');
    consultationButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('CTA', 'consultation_click', btn.textContent);
        });
    });
    
    // Track waitlist button clicks
    const waitlistButtons = document.querySelectorAll('a[href*="saas"]');
    waitlistButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('CTA', 'waitlist_click', btn.textContent);
        });
    });
});

// Rotating Text Animation - Simplified Version
function initRotatingText() {
    const element = document.getElementById('rotating-teams');
    if (!element) {
        console.log('Element not found!');
        return;
    }
    
    const teams = [
        'Growth Teams',
        'Product Teams', 
        'Marketing Teams',
        'Engineering Teams',
        'Business Teams',
        'GTM Teams',
        'Sales Teams',
        'Leadership Teams'
    ];
    
    let index = 0;
    
    function changeText() {
        index = (index + 1) % teams.length;
        element.textContent = teams[index];
        console.log('Changed to:', teams[index]);
    }
    
    // Start immediately and change every 2 seconds
    console.log('Starting rotation...');
    setInterval(changeText, 2000);
}

// Test if JavaScript is working
console.log('Script loaded!');

// Performance Optimization
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Test if element exists
    const testElement = document.getElementById('rotating-teams');
    console.log('Element found:', testElement);
    if (testElement) {
        console.log('Current text:', testElement.textContent);
    }
    
    // Initialize rotating text - DISABLED (using inline version in services.html)
    // initRotatingText();
    
    // Preload critical images
    const criticalImages = [
        // Add any critical image URLs here
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Lazy load images (if any are added later)
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}); 