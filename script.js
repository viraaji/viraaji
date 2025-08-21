// ===========================
// Global Variables
// ===========================
let isScrolling = false;
let scrollTimeout;
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

// ===========================
// Page Load & Initialization
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader after page loads
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000);
    }

    // Initialize all components
    initializeCustomCursor();
    initializeNavigation();
    initializeTypewriter();
    initializeParticles();
    initializeScrollEffects();
    initializeBackToTop();
    initializeAnimations();
    initializeSmoothScroll();
    initializeThemeToggle();
    initializePublicationFilter();
});

// ===========================
// Custom Cursor
// ===========================
function initializeCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const cursorText = document.querySelector('.cursor-text');

    // Check if elements exist and if it's a touch device
    if (!cursor || !follower || !cursorText || 'ontouchstart' in window) {
        if (cursor) cursor.style.display = 'none';
        if (follower) follower.style.display = 'none';
        if (cursorText) cursorText.style.display = 'none';
        return;
    }

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update cursor text position
        cursorText.style.left = mouseX + 'px';
        cursorText.style.top = mouseY + 'px';
    });

    // Animate cursor
    function animateCursor() {
        // Main cursor (faster)
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Follower (slower for trail effect)
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hide/show cursor when leaving/entering window
    document.addEventListener('mouseenter', () => {
        cursor.classList.remove('hidden');
        follower.classList.remove('hidden');
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.add('hidden');
        follower.classList.add('hidden');
        cursorText.classList.remove('visible');
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, .social-link, .nav-link, .skill-tag, .award-item, .publication-card, .experience-card, .filter-btn'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });

    // Add click animation
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');

        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.left = mouseX + 'px';
        ripple.style.top = mouseY + 'px';
        document.body.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });

    // Cursor text effect for headings
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach(heading => {
        heading.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(3)';
            cursor.style.backgroundColor = 'rgba(96, 165, 250, 0.1)';
        });

        heading.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
        });
    });

    // Create cursor trail effect in hero section
    let trailElements = [];
    const maxTrailElements = 10;
    let lastTrailTime = 0;
    const trailDelay = 50; // milliseconds between trail elements

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        const heroSection = document.querySelector('.hero');
        const rect = heroSection.getBoundingClientRect();

        // Check if cursor is in hero section and enough time has passed
        if (e.clientY >= rect.top && e.clientY <= rect.bottom &&
            now - lastTrailTime > trailDelay) {

            createTrailElement(e.clientX, e.clientY);
            lastTrailTime = now;
        }
    });

    function createTrailElement(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        trail.style.background = `hsl(${Math.random() * 60 + 200}, 90%, 65%)`; // Random blue-purple color
        document.body.appendChild(trail);

        trailElements.push(trail);

        // Remove trail element after animation
        setTimeout(() => {
            trail.remove();
            trailElements = trailElements.filter(el => el !== trail);
        }, 1000);

        // Limit number of trail elements
        if (trailElements.length > maxTrailElements) {
            const oldTrail = trailElements.shift();
            oldTrail.remove();
        }
    }

    // Add magnetic effect to buttons and links
    const magneticElements = document.querySelectorAll('.social-link, .contact-card');

    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            elem.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'translate(0, 0)';
        });
    });

    // Add cursor text for specific elements
    const cursorTextElements = [
        { selector: '.social-link[href*="linkedin"]', text: 'Connect' },
        { selector: '.social-link[href*="scholar"]', text: 'Research' },
        { selector: '.social-link[href*="mailto"]', text: 'Email Me' },
        { selector: '.social-link[href*="github"]', text: 'Code' },
        { selector: '.publication-card', text: 'Read More' },
        { selector: '.award-card', text: 'Achievement' },
        { selector: '.timeline-content', text: 'Experience' },
        { selector: '#back-to-top', text: 'Top' }
    ];

    cursorTextElements.forEach(({ selector, text }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorText.textContent = text;
                cursorText.classList.add('visible');
            });

            el.addEventListener('mouseleave', () => {
                cursorText.classList.remove('visible');
            });
        });
    });

    // Change cursor style based on scroll position
    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        if (scrollPercentage > 80) {
            cursor.classList.add('glow');
        } else {
            cursor.classList.remove('glow');
        }
    });
}

// ===========================
// Navigation
// ===========================
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link highlighting
    function updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        updateActiveLink();
    });
}

// ===========================
// Typewriter Effect
// ===========================
function initializeTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;

    const roles = [
        'Security Frameworks',
        'Risk Assessment',
        'Vulnerability Detection',
        'LLM Security',
        'Federated Learning'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (!isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else {
                typeSpeed = 100;
            }
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before typing next
            } else {
                typeSpeed = 50;
            }
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// ===========================
// Particle Animation
// ===========================
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// ===========================
// Scroll Effects
// ===========================
function initializeScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;

                if (hero) {
                    hero.style.transform = `translateY(${rate}px)`;
                }

                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                    heroContent.style.opacity = 1 - (scrolled * 0.001);
                }

                isScrolling = false;
            });

            isScrolling = true;
        }
    });
}

// ===========================
// Back to Top Button
// ===========================
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    if (!backToTopButton) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===========================
// Animation on Scroll
// ===========================
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    // Observer for sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('.section-animated');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Observer for individual elements
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                elementObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-up animation to elements
    const animatedElements = document.querySelectorAll(
        '.publication-card, .skill-category, .award-item, .experience-card'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        elementObserver.observe(el);
    });

}

// ===========================
// Counter Animation
// ===========================
function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// ===========================
// Smooth Scroll
// ===========================
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===========================
// Dynamic Theme Color (Optional Enhancement)
// ===========================
function updateThemeColor() {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    const hue = 200 + (scrollPercentage * 0.6); // Shifts from blue to purple as you scroll
    document.documentElement.style.setProperty('--primary-color', `hsl(${hue}, 90%, 65%)`);
}

// Uncomment to enable dynamic theme color
// window.addEventListener('scroll', updateThemeColor);

// ===========================
// Theme Toggle
// ===========================
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ===========================
// Publication Filter
// ===========================
function initializePublicationFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publications = document.querySelectorAll('.publication-card');
    
    if (!filterButtons.length || !publications.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Show/hide publications
            publications.forEach(pub => {
                if (filter === 'all') {
                    pub.style.display = 'block';
                    setTimeout(() => {
                        pub.style.opacity = '1';
                        pub.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    const year = pub.getAttribute('data-year');
                    if (year === filter) {
                        pub.style.display = 'block';
                        setTimeout(() => {
                            pub.style.opacity = '1';
                            pub.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        pub.style.opacity = '0';
                        pub.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            pub.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// ===========================
// Console Easter Egg
// ===========================
console.log('%c👋 Hi there!', 'font-size: 20px; font-weight: bold; color: #60a5fa;');
console.log('%cInterested in my work? Let\'s connect!', 'font-size: 14px; color: #a78bfa;');
console.log('%c📧 viraaji.m@gmail.com', 'font-size: 12px; color: #e4e4e7;');
console.log('%c🔗 https://linkedin.com/in/viraaji', 'font-size: 12px; color: #e4e4e7;');

// ===========================
// Performance Optimization
// ===========================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===========================
// Lazy Loading Images (if you add images later)
// ===========================
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===========================
// Form Validation (if you add a contact form later)
// ===========================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = form.querySelector('input[type="email"]').value;
        const message = form.querySelector('textarea').value;

        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (message.length < 10) {
            alert('Please enter a message with at least 10 characters');
            return;
        }

        // Add your form submission logic here
        console.log('Form submitted:', { email, message });
        alert('Thank you for your message! I\'ll get back to you soon.');
        form.reset();
    });
}

// ===========================
// Page Visibility API (Pause animations when tab is not visible)
// ===========================
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations
        document.querySelectorAll('[data-animation]').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.querySelectorAll('[data-animation]').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// ===========================
// Keyboard Navigation
// ===========================
document.addEventListener('keydown', function(e) {
    // Press 'H' to go home
    if (e.key === 'h' || e.key === 'H') {
        window.location.hash = '#home';
    }

    // Press 'C' to go to contact
    if (e.key === 'c' || e.key === 'C') {
        window.location.hash = '#contact';
    }

    // Press 'Escape' to close mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});