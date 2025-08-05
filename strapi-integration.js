// API Integration for Gonzalo Baumgartner Website
// This script connects the frontend with Strapi backend

const API_BASE_URL = 'http://localhost:1337/api';

// API Service Class
class StrapiAPI {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    async fetchData(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API fetch error:', error);
            return null;
        }
    }

    async postData(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API post error:', error);
            return null;
        }
    }

    // Get band members
    async getBandMembers() {
        return await this.fetchData('/band-members?populate=photo&sort=order:asc');
    }

    // Get services
    async getServices() {
        return await this.fetchData('/services?sort=order:asc');
    }

    // Get timeline events
    async getTimelineEvents() {
        return await this.fetchData('/timeline-events?sort=order:asc');
    }

    // Get site settings
    async getSiteSettings() {
        return await this.fetchData('/site-setting?populate=heroImage');
    }

    // Submit contact form
    async submitContact(contactData) {
        return await this.postData('/contacts', contactData);
    }
}

// Initialize API
const api = new StrapiAPI();

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', async function() {
    await loadDynamicContent();
    setupContactForm();
});

// Load dynamic content from Strapi
async function loadDynamicContent() {
    // Load band members
    const bandMembers = await api.getBandMembers();
    if (bandMembers && bandMembers.data) {
        renderBandMembers(bandMembers.data);
    }

    // Load services
    const services = await api.getServices();
    if (services && services.data) {
        renderServices(services.data);
    }

    // Load timeline
    const timeline = await api.getTimelineEvents();
    if (timeline && timeline.data) {
        renderTimeline(timeline.data);
    }

    // Load site settings
    const settings = await api.getSiteSettings();
    if (settings && settings.data) {
        updateSiteSettings(settings.data);
    }
}

// Render band members
function renderBandMembers(members) {
    const container = document.getElementById('band-members-container');
    if (!container) return;

    container.innerHTML = members.map(member => `
        <div class="member-card" data-aos="fade-up">
            <div class="member-image">
                ${member.attributes.photo?.data ? 
                    `<img src="${API_BASE_URL.replace('/api', '')}${member.attributes.photo.data.attributes.url}" alt="${member.attributes.name}">` :
                    `<div class="placeholder-image">${member.attributes.name.charAt(0)}</div>`
                }
            </div>
            <div class="member-info">
                <h3>${member.attributes.name}</h3>
                <p class="role">${member.attributes.role}</p>
                <p class="bio">${member.attributes.bio || ''}</p>
            </div>
        </div>
    `).join('');
}

// Render services
function renderServices(services) {
    const container = document.getElementById('services-container');
    if (!container) return;

    container.innerHTML = services.map(service => `
        <div class="service-card" data-aos="fade-up">
            <h3>${service.attributes.title}</h3>
            <p class="description">${service.attributes.description}</p>
            <div class="service-details">
                <p class="price">${service.attributes.price}</p>
                <p class="duration">${service.attributes.duration}</p>
            </div>
            ${service.attributes.features ? `
                <ul class="features">
                    ${service.attributes.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            ` : ''}
            <button class="btn-primary" onclick="openContactModal('${service.attributes.category}')">
                Solicitar Cotización
            </button>
        </div>
    `).join('');
}

// Render timeline
function renderTimeline(events) {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    container.innerHTML = events.map((event, index) => `
        <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}" data-aos="fade-up">
            <div class="timeline-content">
                <div class="year">${event.attributes.year}</div>
                <h3>${event.attributes.title}</h3>
                <p>${event.attributes.description}</p>
            </div>
        </div>
    `).join('');
}

// Update site settings
function updateSiteSettings(settings) {
    const attrs = settings.attributes;
    
    // Update site title
    if (attrs.siteName) {
        document.title = attrs.siteName;
        const titleElements = document.querySelectorAll('.site-title');
        titleElements.forEach(el => el.textContent = attrs.siteName);
    }

    // Update tagline
    if (attrs.tagline) {
        const taglineElements = document.querySelectorAll('.tagline');
        taglineElements.forEach(el => el.textContent = attrs.tagline);
    }

    // Update about text
    if (attrs.aboutText) {
        const aboutElements = document.querySelectorAll('.about-text');
        aboutElements.forEach(el => el.innerHTML = attrs.aboutText);
    }

    // Update contact info
    if (attrs.contactEmail) {
        const emailElements = document.querySelectorAll('.contact-email');
        emailElements.forEach(el => {
            el.textContent = attrs.contactEmail;
            el.href = `mailto:${attrs.contactEmail}`;
        });
    }

    if (attrs.contactPhone) {
        const phoneElements = document.querySelectorAll('.contact-phone');
        phoneElements.forEach(el => {
            el.textContent = attrs.contactPhone;
            el.href = `tel:${attrs.contactPhone}`;
        });
    }

    // Update social media links
    if (attrs.socialMedia) {
        Object.entries(attrs.socialMedia).forEach(([platform, url]) => {
            const elements = document.querySelectorAll(`.social-${platform}`);
            elements.forEach(el => el.href = url);
        });
    }
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            eventType: formData.get('eventType'),
            eventDate: formData.get('eventDate'),
            message: formData.get('message')
        };

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        const result = await api.submitContact(contactData);
        
        if (result) {
            showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            contactForm.reset();
        } else {
            showNotification('Error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
        }

        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Open contact modal with pre-filled service type
function openContactModal(serviceType) {
    const modal = document.getElementById('contact-modal');
    const eventTypeSelect = document.getElementById('eventType');
    
    if (modal && eventTypeSelect) {
        eventTypeSelect.value = serviceType;
        modal.style.display = 'block';
    }
}

// Export for use in other scripts
window.StrapiAPI = StrapiAPI;
window.api = api;