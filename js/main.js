
// API Configuration
const API_BASE_URL = 'http://localhost:1337/api';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const lightbox = document.querySelector('.lightbox');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadPageContent();
    initializeLightbox();
});

// Navigation functionality
function initializeNavigation() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Load content based on current page
function loadPageContent() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            loadHomeContent();
            break;
        case 'contrataciones':
            loadContratacionesContent();
            break;
        case 'about':
            loadAboutContent();
            break;
    }
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page || 'index';
}

// Load Home page content
async function loadHomeContent() {
    try {
        const bandInfo = await fetchData('/band-info?populate=*');
        if (bandInfo.data) {
            updateBandInfo(bandInfo.data.attributes);
        }

        const services = await fetchData('/services');
        if (services.data) {
            updateServices(services.data);
        }

        const socialMedia = await fetchData('/social-medias');
        if (socialMedia.data) {
            updateSocialMedia(socialMedia.data);
        }
    } catch (error) {
        console.error('Error loading home content:', error);
        loadFallbackContent();
    }
}

// Load Contrataciones page content
async function loadContratacionesContent() {
    try {
        const services = await fetchData('/services');
        if (services.data) {
            updateServicesDetailed(services.data);
        }

        const contactInfo = await fetchData('/contact-info');
        if (contactInfo.data) {
            updateContactInfo(contactInfo.data.attributes);
        }
    } catch (error) {
        console.error('Error loading contrataciones content:', error);
        loadFallbackContactContent();
    }
}

// Load About page content
async function loadAboutContent() {
    try {
        const bandInfo = await fetchData('/band-info?populate=*');
        if (bandInfo.data) {
            updateAboutInfo(bandInfo.data.attributes);
        }

        const gallery = await fetchData('/gallery-items?populate=*');
        if (gallery.data) {
            updateGallery(gallery.data);
        }
    } catch (error) {
        console.error('Error loading about content:', error);
        loadFallbackAboutContent();
    }
}

// Fetch data from Strapi API
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Update band info on home page
function updateBandInfo(bandInfo) {
    const heroTitle = document.querySelector('.hero-content h1');
    const heroDescription = document.querySelector('.hero-content p');
    
    if (heroTitle && bandInfo.bandName) {
        heroTitle.textContent = bandInfo.bandName;
    }
    
    if (heroDescription && bandInfo.shortBio) {
        heroDescription.textContent = bandInfo.shortBio;
    }
}

// Update services on home page
function updateServices(services) {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = '';
    
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
            <button class="service-btn" style="background-color: ${service.attributes.buttonColor || '#FFD700'}">
                ${service.attributes.title}
            </button>
            <p style="color: #ccc; margin-top: 1rem;">${service.attributes.description || ''}</p>
        `;
        servicesGrid.appendChild(serviceCard);
    });
}

// Update social media icons
function updateSocialMedia(socialMedia) {
    const socialIcons = document.querySelector('.social-icons');
    if (!socialIcons) return;

    socialIcons.innerHTML = '';
    
    socialMedia.forEach(social => {
        const socialIcon = document.createElement('a');
        socialIcon.href = social.attributes.url;
        socialIcon.target = '_blank';
        socialIcon.className = 'social-icon';
        socialIcon.innerHTML = getSocialIcon(social.attributes.platform);
        socialIcons.appendChild(socialIcon);
    });
}

// Get social media icon
function getSocialIcon(platform) {
    const icons = {
        'instagram': '📷',
        'spotify': '🎵',
        'apple-music': '🎶',
        'youtube': '📺',
        'facebook': '📘',
        'twitter': '🐦'
    };
    return icons[platform] || '🔗';
}

// Update services detailed view
function updateServicesDetailed(services) {
    const servicesContainer = document.querySelector('.services-detailed');
    if (!servicesContainer) return;

    servicesContainer.innerHTML = '';
    
    services.forEach(service => {
        const serviceDetail = document.createElement('div');
        serviceDetail.className = 'service-detail';
        serviceDetail.innerHTML = `
            <h3>${service.attributes.title}</h3>
            <div class="service-description">
                ${service.attributes.fullDescription || service.attributes.description || ''}
            </div>
            ${service.attributes.price ? `<p class="service-price">Precio: ${service.attributes.price}</p>` : ''}
        `;
        servicesContainer.appendChild(serviceDetail);
    });
}

// Update contact info
function updateContactInfo(contactInfo) {
    const contactInfoContainer = document.querySelector('.contact-info-content');
    if (!contactInfoContainer) return;

    contactInfoContainer.innerHTML = `
        ${contactInfo.email ? `<p><strong>Email:</strong> <a href="mailto:${contactInfo.email}">${contactInfo.email}</a></p>` : ''}
        ${contactInfo.phone ? `<p><strong>Teléfono:</strong> <a href="tel:${contactInfo.phone}">${contactInfo.phone}</a></p>` : ''}
        ${contactInfo.whatsapp ? `<p><strong>WhatsApp:</strong> <a href="https://wa.me/${contactInfo.whatsapp}" target="_blank">${contactInfo.whatsapp}</a></p>` : ''}
        ${contactInfo.contactMessage ? `<div class="contact-message">${contactInfo.contactMessage}</div>` : ''}
    `;
}

// Update about page info
function updateAboutInfo(bandInfo) {
    const bioSection = document.querySelector('.bio-content');
    const historySection = document.querySelector('.history-content');
    
    if (bioSection && bandInfo.fullBio) {
        bioSection.innerHTML = bandInfo.fullBio;
    }
    
    if (historySection && bandInfo.history) {
        historySection.innerHTML = bandInfo.history;
    }
}

// Update gallery
function updateGallery(galleryItems) {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = '';
    
    galleryItems.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        if (item.attributes.type === 'image' && item.attributes.media.data) {
            const imageUrl = `http://localhost:1337${item.attributes.media.data.attributes.url}`;
            galleryItem.innerHTML = `
                <img src="${imageUrl}" alt="${item.attributes.title || ''}" onclick="openLightbox('${imageUrl}')">
                <div class="gallery-overlay">
                    <p>${item.attributes.title || ''}</p>
                </div>
            `;
        } else if (item.attributes.type === 'spotify' && item.attributes.embedUrl) {
            galleryItem.innerHTML = `
                <iframe src="${item.attributes.embedUrl}" width="100%" height="250" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            `;
        } else if (item.attributes.type === 'youtube' && item.attributes.embedUrl) {
            galleryItem.innerHTML = `
                <iframe src="${item.attributes.embedUrl}" width="100%" height="250" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
        }
        
        galleryGrid.appendChild(galleryItem);
    });
}

// Initialize lightbox functionality
function initializeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
}

// Open lightbox
function openLightbox(imageSrc) {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-content img');
    
    if (lightbox && lightboxImg) {
        lightboxImg.src = imageSrc;
        lightbox.style.display = 'block';
    }
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
    }
}

// Fallback content for when API is not available
function loadFallbackContent() {
    const heroTitle = document.querySelector('.hero-content h1');
    const heroDescription = document.querySelector('.hero-content p');
    const servicesGrid = document.querySelector('.services-grid');
    const socialIcons = document.querySelector('.social-icons');
    
    if (heroTitle) {
        heroTitle.textContent = 'SODA STEREO';
    }
    
    if (heroDescription) {
        heroDescription.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    }
    
    if (servicesGrid) {
        servicesGrid.innerHTML = `
            <div class="service-card">
                <button class="service-btn">TRIBUTE BAND</button>
                <p style="color: #ccc; margin-top: 1rem;">Espectáculos tributo completos</p>
            </div>
            <div class="service-card">
                <button class="service-btn">PRIVATE EVENTS</button>
                <p style="color: #ccc; margin-top: 1rem;">Eventos privados y corporativos</p>
            </div>
        `;
    }
    
    if (socialIcons) {
        socialIcons.innerHTML = `
            <a href="#" class="social-icon">📷</a>
            <a href="#" class="social-icon">🎵</a>
            <a href="#" class="social-icon">🎶</a>
            <a href="#" class="social-icon">📺</a>
        `;
    }
}

function loadFallbackContactContent() {
    const contactInfoContainer = document.querySelector('.contact-info-content');
    if (contactInfoContainer) {
        contactInfoContainer.innerHTML = `
            <p><strong>Email:</strong> <a href="mailto:info@banda.com">info@banda.com</a></p>
            <p><strong>Teléfono:</strong> <a href="tel:+1234567890">+123 456 7890</a></p>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/1234567890" target="_blank">+123 456 7890</a></p>
        `;
    }
}

function loadFallbackAboutContent() {
    const bioSection = document.querySelector('.bio-content');
    const historySection = document.querySelector('.history-content');
    
    if (bioSection) {
        bioSection.innerHTML = '<p>Biografía completa de la banda...</p>';
    }
    
    if (historySection) {
        historySection.innerHTML = '<p>Historia de la banda...</p>';
    }
}
