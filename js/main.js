/**
 * Zeenat Car Detailing - Main JavaScript
 * Centralized logic for navigation, dynamic dates, and WhatsApp integration.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initOfferDates();
    initContactForm();
    initSmoothScrolling();
});

/**
 * Mobile Menu Toggle Logic
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking a link
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

/**
 * Dynamic Offer Dates with persistence
 */
function initOfferDates() {
    const offerHeader = document.getElementById('offer-date-header');
    const offerFooter = document.getElementById('offer-date-footer');

    if (!offerHeader && !offerFooter) return;

    let savedDate = localStorage.getItem('zeenatOfferEndDate');
    let endDate;

    if (savedDate) {
        endDate = new Date(savedDate);
        const now = new Date();
        // If expired, generate new one
        if (now > endDate) {
            endDate = generateNewDate();
        }
    } else {
        endDate = generateNewDate();
    }

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const dateString = endDate.toLocaleDateString('en-US', options);

    const fullText = `Limited Time Offer - Valid Until ${dateString}`;

    if (offerHeader) offerHeader.textContent = fullText;
    if (offerFooter) offerFooter.textContent = dateString;
}

function generateNewDate() {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 10) + 1; // 1 to 10 days
    const endDate = new Date(now.getTime() + (randomDays * 24 * 60 * 60 * 1000));
    localStorage.setItem('zeenatOfferEndDate', endDate.toISOString());
    return endDate;
}

/**
 * Contact Form WhatsApp Submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fname = document.getElementById('fname').value;
            const lname = document.getElementById('lname').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            const text = `Hi, I am interested in ${service}.%0A%0A*Name:* ${fname} ${lname}%0A*Phone:* ${phone}%0A*Message:* ${message}`;
            
            window.open(`https://wa.me/923086144661?text=${text}`, '_blank');
        });
    }
}

/**
 * Smooth scrolling for internal links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}
