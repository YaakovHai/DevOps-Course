// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            updateActiveNav();
        }
    });
});

// Update active navigation link based on scroll position
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Scroll to top button functionality
const scrollToTopBtn = document.getElementById('scrollToTopBtn') || createScrollToTopBtn();

function createScrollToTopBtn() {
    const btn = document.createElement('button');
    btn.id = 'scrollToTopBtn';
    btn.className = 'scroll-to-top';
    btn.innerHTML = '↑';
    btn.title = 'Scroll to top';
    document.body.appendChild(btn);
    return btn;
}

window.addEventListener('scroll', () => {
    if (document.documentElement.scrollTop > 100 || document.body.scrollTop > 100) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Copy to clipboard functionality for contact links
document.querySelectorAll('.contact-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Handle email copy
        if (href.startsWith('mailto:')) {
            e.preventDefault();
            const email = href.replace('mailto:', '');
            copyToClipboard(email, 'Email copied to clipboard!');
        }
    });
});

function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(message);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 255, 0, 0.9);
        color: #000000;
        padding: 15px 20px;
        border: 2px solid #00ff00;
        border-radius: 0;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        text-shadow: none;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes for notifications
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Skill card filtering (optional feature)
let selectedSkills = [];

document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.opacity = '0.6';
        setTimeout(() => {
            this.style.opacity = '1';
        }, 200);
    });
});

// Project item filtering by tags
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function(e) {
        e.stopPropagation();
        const tagText = this.textContent;
        filterProjectsByTag(tagText);
    });
});

function filterProjectsByTag(tagText) {
    const projects = document.querySelectorAll('.project-item');
    let matchCount = 0;

    projects.forEach(project => {
        const tags = project.querySelectorAll('.tag');
        const hasTag = Array.from(tags).some(tag => tag.textContent === tagText);
        
        if (hasTag) {
            project.style.display = 'block';
            project.style.animation = 'fadeInUp 0.5s ease-out';
            matchCount++;
        } else {
            project.style.display = 'none';
        }
    });

    // Show all if no matches found
    if (matchCount === 0) {
        projects.forEach(project => {
            project.style.display = 'block';
            project.style.animation = 'fadeInUp 0.5s ease-out';
        });
    }

    showNotification(`Filtered by: ${tagText}`);
}

// Reset filter on section click
document.getElementById('projects')?.addEventListener('dblclick', () => {
    document.querySelectorAll('.project-item').forEach(project => {
        project.style.display = 'block';
    });
    showNotification('Filter reset');
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNav();
    console.log('Portfolio loaded successfully!');
});

// Analytics tracking (optional)
function trackEvent(eventName, eventData) {
    console.log(`Event: ${eventName}`, eventData);
}

// Track section visits
document.querySelectorAll('section[id]').forEach(section => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('Section viewed', { section: entry.target.id });
            }
        });
    });
    observer.observe(section);
});
