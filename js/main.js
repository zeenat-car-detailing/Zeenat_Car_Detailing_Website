/**
 * Zeenat Car Detailing - Main JavaScript
 * Centralized logic for navigation, dates, WhatsApp, and scroll sync.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initOfferDates();
    initContactForm();
    initSmoothScrolling();
    initFooterYear();
    initGalleryRandomizer();
    initLightbox();
});

/**
 * Gallery Randomizer for Homepage
 * Picks 4 random unique images from the 'homepage' set
 */
function initGalleryRandomizer() {
    const container = document.getElementById('gallery-preview-container');
    if (!container) return;

    const homepageImages = [
        { src: 'assets/images/gallery/gallerypic_1_on_homepage.webp', alt: 'Premium Ceramic Coating' },
        { src: 'assets/images/gallery/gallerypic_13_on_homepage.webp', alt: 'Paint Protection Film' },
        { src: 'assets/images/gallery/galleryppic_18_on_homepage.jpeg', alt: 'Interior Detailing' },
        { src: 'assets/images/gallery/onhomepage.jpeg', alt: 'Exterior Shine' },
        { src: 'assets/images/gallery/onhomepage_34.jpeg', alt: 'Wheel & Tire Detail' },
        { src: 'assets/images/gallery/onhomepage_45.jpeg', alt: 'Gloss Finish' },
        { src: 'assets/images/gallery/onhomepage_46.jpeg', alt: 'Mobile Service' },
        { src: 'assets/images/gallery/onhomepage_56.jpeg', alt: 'Deep Cleaning' },
        { src: 'assets/images/gallery/also_on_homepage.jpeg', alt: 'Mirror Reflection' }
    ];

    // Shuffle and pick 4
    const shuffled = homepageImages.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    container.innerHTML = selected.map(img => `
        <div class="aspect-[4/5] bg-gray-900 rounded-lg overflow-hidden relative group cursor-pointer lightbox-trigger" data-src="${img.src}">
             <img src="${img.src}" alt="${img.alt}" class="w-full h-full object-cover">
             <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                 <span class="text-primary font-bold uppercase text-xs">View Work</span>
             </div>
        </div>
    `).join('');
}

/**
 * Responsive Lightbox / Slider Logic
 */
function initLightbox() {
    let images = [];
    let currentIndex = 0;

    // Create Modal HTML
    const modal = document.createElement('div');
    modal.id = 'lightbox-modal';
    modal.className = 'fixed inset-0 z-[100] bg-black/95 flex items-center justify-center hidden opacity-0 transition-opacity duration-300';
    modal.innerHTML = `
        <div class="absolute inset-0 flex items-center justify-center p-4 md:p-12">
            <img id="lightbox-img" src="" alt="Gallery Image" class="max-w-full max-h-full object-contain shadow-2xl scale-95 transition-transform duration-300">
        </div>
        
        <!-- Controls -->
        <button id="lightbox-close" class="absolute top-6 right-6 text-white hover:text-primary transition z-[110]">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        
        <button id="lightbox-prev" class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary transition p-2 bg-black/50 rounded-full md:bg-transparent z-[110]">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"/></svg>
        </button>
        
        <button id="lightbox-next" class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary transition p-2 bg-black/50 rounded-full md:bg-transparent z-[110]">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"/></svg>
        </button>

        <div id="lightbox-counter" class="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 font-bold uppercase tracking-widest text-xs"></div>
    `;
    document.body.appendChild(modal);

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxCounter = document.getElementById('lightbox-counter');

    function updateLightbox() {
        if (!images[currentIndex]) return;
        lightboxImg.src = images[currentIndex];
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
        
        // Scale animation
        lightboxImg.classList.add('scale-95');
        setTimeout(() => lightboxImg.classList.remove('scale-95'), 10);
    }

    function openLightbox(trigger) {
        // Collect all triggers on the page every time (handles dynamic content)
        const triggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
        images = triggers.map(t => t.dataset.src || t.querySelector('img').src);
        const source = trigger.dataset.src || trigger.querySelector('img').src;
        currentIndex = images.indexOf(source);

        updateLightbox();
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    function navigate(direction) {
        currentIndex = (currentIndex + direction + images.length) % images.length;
        updateLightbox();
    }

    // Event Listeners
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.lightbox-trigger');
        if (trigger) {
            openLightbox(trigger);
        }
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
    lightboxNext.addEventListener('click', e => { e.stopPropagation(); navigate(1); });
    modal.addEventListener('click', closeLightbox);
    lightboxImg.addEventListener('click', e => e.stopPropagation());

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    // Mobile Swipes
    let touchStartX = 0;
    modal.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, {passive: true});
    modal.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) navigate(1);
        if (touchStartX - touchEndX < -50) navigate(-1);
    }, {passive: true});
}

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
            
            const fname = document.getElementById('fname')?.value || '';
            const lname = document.getElementById('lname')?.value || '';
            const phone = document.getElementById('phone')?.value || '';
            const service = document.getElementById('service')?.value || '';
            const message = document.getElementById('message')?.value || '';
            
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
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Account for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Deals Slider Dot Navigation Sync (Mobile)
 * NO LONGER NEEDED - Deals section uses proper grid, no scrolling
 * Kept here for reference if you want to add scrolling back
 */
/*
function initDealsSliderSync() {
    const dealsContainer = document.getElementById('deals-container');
    const dealCards = document.querySelectorAll('.deal-card');
    const dots = document.querySelectorAll('.dot-indicator');
    
    if (!dealsContainer || dealCards.length === 0 || dots.length === 0) return;

    // Update active dot based on scroll position
    function updateActiveDot() {
        const scrollLeft = dealsContainer.scrollLeft;
        const cardWidth = dealCards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(dealsContainer).gap) || 24;
        const activeIndex = Math.round(scrollLeft / (cardWidth + gap));
        
        // Update dots
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.remove('bg-gray-700');
                dot.classList.add('bg-primary');
            } else {
                dot.classList.remove('bg-primary');
                dot.classList.add('bg-gray-700');
            }
        });
    }

    // Scroll event listener with throttle for performance
    let scrollTimeout;
    dealsContainer.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveDot, 50);
    });

    // Click dots to scroll to that card
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const cardWidth = dealCards[0].offsetWidth;
            const gap = parseInt(getComputedStyle(dealsContainer).gap) || 24;
            const scrollPosition = index * (cardWidth + gap);
            
            dealsContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        });
    });

    // Initialize on load
    updateActiveDot();
}
*/

/**
 * Footer year auto update
 */
function initFooterYear() {
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        const year = new Date().getFullYear();
        footerYear.textContent = `© ${year} Zeenat Car Detailing. All rights reserved.`;
    }
}

/**
 * Utility: Throttle function for scroll events
 */
function throttle(func, wait) {
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

/**
 * Optional: Add lazy loading for images
 * Uncomment to enable
 */
/*
function initLazyLoading() {
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
*/

/**
 * Optional: Auto-play deals slider
 * Uncomment to enable auto-rotation every 5 seconds
 */
/*
function initAutoPlaySlider() {
    const dealsContainer = document.getElementById('deals-container');
    const dealCards = document.querySelectorAll('.deal-card');
    
    if (!dealsContainer || dealCards.length === 0) return;
    
    let currentIndex = 0;
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % dealCards.length;
        const cardWidth = dealCards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(dealsContainer).gap) || 24;
        
        dealsContainer.scrollTo({
            left: currentIndex * (cardWidth + gap),
            behavior: 'smooth'
        });
    }, 5000);
}
*/

// Export functions for external use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        initOfferDates,
        initContactForm,
        initSmoothScrolling,
        initDealsSliderSync,
        initFooterYear
    };
}