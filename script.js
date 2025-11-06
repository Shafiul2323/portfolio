// ============================================
// PROJECTS DATA - Easy to add new projects
// ============================================
const projectsData = [
    {
        id: 1,
        title: "Frontend Project",
        description: "Modern responsive web application with interactive UI components",
        tech: ["HTML5", "CSS3", "JavaScript"],
        image: "image/portfolio1.jpg",
        liveLink: "#",
        githubLink: "#",
        category: "Frontend"
    },
    {
        id: 2,
        title: "Full Stack Project",
        description: "Complete web application with frontend and backend integration",
        tech: ["MongoDB", "Express.js", "React.js", "Node.js"],
        image: "image/portfolio2.jpg",
        liveLink: "#",
        githubLink: "#",
        category: "Full Stack"
    },
    {
        id: 3,
        title: "Frontend Project",
        description: "React-based single page application with modern design",
        tech: ["React.js", "Tailwind CSS"],
        image: "image/portfolio3.jpg",
        liveLink: "#",
        githubLink: "#",
        category: "Frontend"
    },
    {
        id: 4,
        title: "Full Stack Project",
        description: "Dynamic web platform with real-time features",
        tech: ["HTML5", "Tailwind", "JavaScript"],
        image: "image/portfolio4.jpg",
        liveLink: "#",
        githubLink: "#",
        category: "Full Stack"
    },
    {
        id: 5,
        title: "Backend Project",
        description: "RESTful API with database integration",
        tech: ["MongoDB", "Express.js"],
        image: "image/portfolio5.jpg",
        liveLink: "#",
        githubLink: "#",
        category: "Backend"
    },
    {
        id: 6,
        title: "Full Stack Project",
        description: "Vue.js application with Node.js backend",
        tech: ["Vue.js", "Node.js", "Express.js"],
        image: "image/portfolio6.jpg",
        liveLink: "#",
        githubLink: "#",
        category: "Full Stack"
    },
    {
        id: 7,
        title: "Android Project",
        description: "Native Android App with modern UI and Firebase integration",
        tech: ["Java", "XML", "Firebase"],
        image: "image/portfolio.7.jpg",
        liveLink: "#",
        githubLink: "#",
        category: "Mobile"
    }
    // Add more projects here easily by copying the format above
];

// ============================================
// USER PROJECTS (localStorage)
// ============================================
const USER_PROJECTS_KEY = 'userProjects';
function loadUserProjects() { try { const raw = localStorage.getItem(USER_PROJECTS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } }
function saveUserProjects(list) { localStorage.setItem(USER_PROJECTS_KEY, JSON.stringify(list)); }
function addUserProject(p) { const list = loadUserProjects(); list.push({ ...p, user: true }); saveUserProjects(list); }

// Render projects with filter support
function renderProjects(filterCategory = 'all') {
    const portfolioDetailsContainer = document.querySelector('.portfolio-box .portfolio-details-container');
    const portfolioImagesContainer = document.querySelector('.portfolio-carousel .img-slide');
    
    if (!portfolioDetailsContainer || !portfolioImagesContainer) return;
    
    // Clear existing content
    portfolioDetailsContainer.innerHTML = '';
    portfolioImagesContainer.innerHTML = '';
    
    // Merge base projects with user projects
    const allProjects = [...projectsData, ...loadUserProjects()];
    
    // Filter projects
    const filteredProjects = filterCategory === 'all' 
        ? allProjects 
        : allProjects.filter(project => project.category === filterCategory);
    
    if (filteredProjects.length === 0) {
        portfolioDetailsContainer.innerHTML = '<p class="no-projects">No projects found in this category.</p>';
        return;
    }
    
    // Generate project details
    filteredProjects.forEach((project, idx) => {
        const projectDetail = document.createElement('div');
        projectDetail.className = `portfolio-detail ${idx === 0 ? 'active' : ''}`;
        const isUser = !!project.user;
        projectDetail.innerHTML = `
            <p class="numb">${String(idx + 1).padStart(2, '0')}</p>
            <span class="project-category">${project.category}</span>
            <h3>${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="tech">
                <p>${project.tech.join(', ')}</p>
            </div>
            <div class="live-github">
                <a href="${project.liveLink}" target="_blank" title="Live Project">
                    <i class='bx bx-arrow-back'></i>
                    <span>Live Project</span>
                </a>
                <a href="${project.githubLink}" target="_blank" title="Github Repository">
                    <i class='bx bxl-github'></i>
                    <span>Github Repository</span>
                </a>
            </div>
            ${isUser ? `
            <div class="service-actions project-actions" style="display:flex; gap:.5rem; margin-top:1rem;">
                <button class="btn" style="padding:.5rem 1rem;" onclick="openEditProjectForm(${project.id})"><i class='bx bx-edit'></i> Edit</button>
                <button class="btn" style="padding:.5rem 1rem; background:#ff4d4f;" onclick="deleteProject(${project.id})"><i class='bx bx-trash'></i> Delete</button>
            </div>` : ''}
        `;
        portfolioDetailsContainer.appendChild(projectDetail);
        
        // Generate project images
        const imageItem = document.createElement('div');
        imageItem.className = 'img-item';
        imageItem.innerHTML = `<img src="${project.image}" alt="${project.title}">`;
        portfolioImagesContainer.appendChild(imageItem);
    });
    
    // Reset portfolio navigation - remove old listeners first
    const arrowRight = document.querySelector('.portfolio-box .navigation .arrow-right');
    const arrowLeft = document.querySelector('.portfolio-box .navigation .arrow-left');
    
    if (arrowRight && arrowLeft) {
        // Clone and replace to remove old event listeners
        const newRight = arrowRight.cloneNode(true);
        const newLeft = arrowLeft.cloneNode(true);
        arrowRight.parentNode.replaceChild(newRight, arrowRight);
        arrowLeft.parentNode.replaceChild(newLeft, arrowLeft);
    }
    
    portfolioIndex = 0;
    setTimeout(() => {
        initializePortfolioNavigation();
    }, 100);
}

// ============================================
// LOAD DATA FROM JSON
// ============================================
let portfolioData = {
    certificates: [],
    experience: [],
    education: []
};

async function loadPortfolioData() {
    try {
        const response = await fetch('data.json');
        portfolioData = await response.json();
        
        // Load certificates
        renderCertificates();
        
        // Render resume sections will be handled by resume-manager.js
        
        // Update projects from JSON if available
        if (portfolioData.projects && portfolioData.projects.length > 0) {
            projectsData.length = 0;
            projectsData.push(...portfolioData.projects);
        }
        
        return Promise.resolve();
    } catch (error) {
        console.log('Using default data');
        // Use default certificates
        portfolioData.certificates = [
            {
                id: 1,
                title: "Web Development Certification",
                institution: "Online Platform",
                year: "2024",
                description: "Professional web development certification",
                image: "image/cert1.jpg"
            },
            {
                id: 2,
                title: "Full Stack Developer",
                institution: "Professional Certification",
                year: "2024",
                description: "Complete full-stack development certification",
                image: "image/cert2.jpg"
            },
            {
                id: 3,
                title: "Best Project Award",
                institution: "Tech Innovation Summit",
                year: "2024",
                description: "Award for outstanding project in tech innovation",
                image: "image/cert3.jpg"
            },
            {
                id: 4,
                title: "Graphic Design Certificate",
                institution: "Online Course",
                year: "2018",
                description: "Professional graphic design certification",
                image: "image/cert4.jpg"
            }
        ];
        renderCertificates();
        return Promise.resolve();
    }
}

// Render certificates dynamically
function renderCertificates() {
    const container = document.getElementById('certificatesContainer');
    if (!container) return;

    // Merge certificates from data.json with any saved via resume add form (localStorage)
    let merged = Array.isArray(portfolioData?.certificates) ? [...portfolioData.certificates] : [];
    try {
        const saved = localStorage.getItem('resumeData');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed?.certificates)) {
                merged = [...merged, ...parsed.certificates];
            }
        }
    } catch {}

    container.innerHTML = '';

    merged.forEach(cert => {
        const certItem = document.createElement('div');
        certItem.className = 'certificate-item';
        certItem.innerHTML = `
            <div class="certificate-image-wrapper">
                ${cert.image && cert.image.startsWith('data:') 
                    ? `<img src="${cert.image}" alt="${cert.title}" class="certificate-image" onerror="this.src='image/default-cert.jpg'">` 
                    : cert.image 
                        ? `<img src="${cert.image}" alt="${cert.title}" class="certificate-image" onerror="this.parentElement.innerHTML='<div class=\\'certificate-icon\\'><i class=\\'bx bx-certificate\\'></i></div>'">`
                        : `<div class="certificate-icon"><i class='bx bx-certificate'></i></div>`
                }
                <div class="certificate-overlay">
                    <button class="view-cert-btn" onclick="viewCertificate('${cert.image || ''}', '${cert.title}')">
                        <i class='bx bx-zoom-in'></i> View
                    </button>
                </div>
            </div>
            <div class="certificate-content">
                <h3>${cert.title}</h3>
                <p class="cert-institution">${cert.institution}</p>
                ${cert.description ? `<p class="cert-description">${cert.description}</p>` : ''}
                <span class="cert-year">${cert.year}</span>
            </div>
        `;
        container.appendChild(certItem);
    });
}

// View certificate in modal
function viewCertificate(imageSrc, title) {
    if (!imageSrc || imageSrc === '') {
        alert('Certificate image not available');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'certificate-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
                <i class='bx bx-x'></i>
            </button>
            <h3>${title}</h3>
            <img src="${imageSrc}" alt="${title}" class="modal-cert-image">
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Initialize projects on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioData().then(() => {
        // Trigger certificate rendering after data is loaded
        if (typeof renderCertificatesInResume === 'function') {
            renderCertificatesInResume();
        }
        // Trigger experience and education rendering after data is loaded
        if (typeof renderExperience === 'function') {
            renderExperience();
        }
        if (typeof renderEducation === 'function') {
            renderEducation();
        }
    });
    renderProjects();
    initializePortfolioNavigation();
    initAllFeatures();
});

// Ensure certificates render even if section is added later
window.addEventListener('load', () => {
    try { renderCertificates(); } catch {}
});

// ============================================
// NAVIGATION
// ============================================
const navLinks = document.querySelectorAll('header nav a');
const logoLink = document.querySelector('.logo');
const sections = document.querySelectorAll('section');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('header nav');

menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});

// ============================================
// SMOOTH PAGE NAVIGATION (No Slide Animation)
// ============================================
const activePage = () => {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    sections.forEach(section => {
        section.classList.remove('active');
    });

    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
}

// Map navbar links to sections by data-section attribute
const sectionMap = {
    'home': 'home',
    'services': 'services',
    'resume': 'resume',
    'portfolio': 'portfolio',
    'about': 'about',
    'order': 'order',
    'contact': 'contact'
};

navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionName = link.getAttribute('data-section');
        
        if (sectionName) {
            activePage();
            link.classList.add('active');
            
            // Find the matching section
            let targetSection = null;
            sections.forEach(section => {
                // Check if section has the matching class (handles 'order section' case)
                if (section.classList.contains(sectionName)) {
                    section.classList.add('active');
                    targetSection = section;
                }
            });
            
            // Double-check: if section not found by class, try by id
            if (!targetSection) {
                targetSection = document.querySelector(`section.${sectionName}`);
                if (targetSection && !targetSection.classList.contains('active')) {
                    targetSection.classList.add('active');
                }
            }
            
            // Special handling for order section - ensure form is visible immediately
            if (sectionName === 'order' && targetSection) {
                // Ensure section is active and visible
                targetSection.classList.add('active');
                targetSection.style.visibility = 'visible';
                targetSection.style.opacity = '1';
                
                // Reset form to first step immediately
                window.currentStep = 1;
                
                // Show first step immediately
                const firstStep = targetSection.querySelector('.form-step[data-step="1"]');
                if (firstStep) {
                    // Hide all steps
                    targetSection.querySelectorAll('.form-step').forEach(step => {
                        step.classList.remove('active');
                        step.style.display = 'none';
                        step.style.opacity = '0';
                        step.style.visibility = 'hidden';
                    });
                    // Show first step
                    firstStep.classList.add('active');
                    firstStep.style.display = 'block';
                    firstStep.style.opacity = '1';
                    firstStep.style.visibility = 'visible';
                }
                
                // Update progress indicators
                targetSection.querySelectorAll('.progress-step').forEach((stepEl, index) => {
                    if (index === 0) {
                        stepEl.classList.add('active');
                    } else {
                        stepEl.classList.remove('active');
                    }
                });
                
                // Ensure form elements are visible
                const orderForm = targetSection.querySelector('#orderForm');
                const orderFormWrapper = targetSection.querySelector('.order-form-wrapper');
                const orderContainer = targetSection.querySelector('.order-container');
                
                if (orderForm) {
                    orderForm.style.display = 'block';
                    orderForm.style.visibility = 'visible';
                    orderForm.style.opacity = '1';
                }
                if (orderFormWrapper) {
                    orderFormWrapper.style.display = 'block';
                    orderFormWrapper.style.visibility = 'visible';
                    orderFormWrapper.style.opacity = '1';
                }
                if (orderContainer) {
                    orderContainer.style.display = 'flex';
                    orderContainer.style.visibility = 'visible';
                    orderContainer.style.opacity = '1';
                }
                
                // Initialize form if function exists
                if (typeof window.initializeForm === 'function') {
                    window.initializeForm();
                }
                
                // Ensure form step is visible after a short delay
                setTimeout(() => {
                    if (firstStep) {
                        firstStep.classList.add('active');
                        firstStep.style.display = 'block';
                        firstStep.style.opacity = '1';
                        firstStep.style.visibility = 'visible';
                    }
                }, 50);
            }
            
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    activePage();
    
    // Find and activate home section
    sections.forEach(section => {
        if (section.classList.contains('home')) {
            section.classList.add('active');
        }
    });
    
    // Activate home nav link
    navLinks.forEach(link => {
        if (link.getAttribute('data-section') === 'home') {
            link.classList.add('active');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// RESUME SECTION TABS
// ============================================
function setupResumeTabs() {
    const resumeBtns = document.querySelectorAll('.resume-btn');
    const tabMap = {
        'experience': 'experienceDetail',
        'education': 'educationDetail',
        'skills': 'skillsDetail',
        'certificates': 'certificatesDetail'
    };

    resumeBtns.forEach((btn) => { 
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            if (!tabName) return;

            resumeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.resume-detail').forEach(detail => {
                detail.classList.remove('active');
            });
            
            const targetId = tabMap[tabName];
            const targetDetail = document.getElementById(targetId);
            if (targetDetail) {
                targetDetail.classList.add('active');
            }
        });
    });
}

// ============================================
// PORTFOLIO CAROUSEL
// ============================================
let portfolioIndex = 0;

function initializePortfolioNavigation() {
    const arrowRight = document.querySelector('.portfolio-box .navigation .arrow-right');
    const arrowLeft = document.querySelector('.portfolio-box .navigation .arrow-left');
    
    if (!arrowRight || !arrowLeft) return;

    const portfolioDetails = document.querySelectorAll('.portfolio-detail');
    const totalProjects = portfolioDetails.length || projectsData.length;
    
    if (totalProjects === 0) return;

    const activePortfolio = () => {
        const imgSlide = document.querySelector('.portfolio-carousel .img-slide');
        const portfolioDetails = document.querySelectorAll('.portfolio-detail');

        if (imgSlide && portfolioDetails.length > 0) {
            imgSlide.style.transform = `translateX(calc(${portfolioIndex * -100}% - ${portfolioIndex * 2}rem))`;

            portfolioDetails.forEach(detail => {
                detail.classList.remove('active');
            });
            if (portfolioDetails[portfolioIndex]) {
                portfolioDetails[portfolioIndex].classList.add('active');
            }

            // Update arrow states
            if (portfolioIndex === 0) {
                arrowLeft.classList.add('disabled');
            } else {
                arrowLeft.classList.remove('disabled');
            }

            if (portfolioIndex >= totalProjects - 1) {
                arrowRight.classList.add('disabled');
            } else {
                arrowRight.classList.remove('disabled');
            }
        }
    }

    arrowRight.addEventListener('click', () => {
        if (portfolioIndex < totalProjects - 1) {
            portfolioIndex++;
            activePortfolio();
        }
    });

    arrowLeft.addEventListener('click', () => {
        if (portfolioIndex > 0) {
            portfolioIndex--;
            activePortfolio();
        }
    });

    // Initialize first state
    activePortfolio();
}

// ============================================
// SKILLS ANIMATION
// ============================================
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('animate-in');
    });

    // Animate progress bars
    const progressBars = document.querySelectorAll('.skill-progress');
    progressBars.forEach((bar, index) => {
        const level = bar.getAttribute('data-level');
        if (level) {
            setTimeout(() => {
                bar.style.width = `${level}%`;
            }, index * 100 + 500);
        }
    });
}

// Trigger skills animation when skills section is viewed
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe skills section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const skillsSection = document.querySelector('.resume-detail.skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
});

// Also trigger when skills tab is clicked
document.addEventListener('DOMContentLoaded', () => {
    const resumeBtns = document.querySelectorAll('.resume-btn');
    resumeBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            if (idx === 2) { // Skills button index
                setTimeout(() => {
                    const skillsSection = document.querySelector('.resume-detail.skills');
                    if (skillsSection && skillsSection.classList.contains('active')) {
                        animateSkills();
                    }
                }, 100);
            }
        });
    });
});

// ============================================
// PROJECT FILTER
// ============================================
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            const filter = btn.getAttribute('data-filter');
            renderProjects(filter);
        });
    });
}

// ============================================
// STATISTICS COUNTER
// ============================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
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

function initStatistics() {
    const statsSection = document.querySelector('.statistics');
    if (!statsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    if (stat.textContent === '0') {
                        animateCounter(stat);
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (testimonials.length === 0) return;
    
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((test, idx) => {
            test.classList.toggle('active', idx === index);
        });
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === index);
        });
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
    if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
    
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            currentTestimonial = idx;
            showTestimonial(currentTestimonial);
        });
    });
    
    // Auto-slide testimonials
    setInterval(nextTestimonial, 5000);
}

// ============================================
// ENHANCED CONTACT FORM
// ============================================
function initContactForm() {
    const form = document.querySelector('.contact form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ff4444';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (isValid) {
            // Show success message
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Message Sent! ✓';
            submitBtn.style.background = '#5fc025';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                form.reset();
            }, 3000);
        }
    });
}

// ============================================
// COPY EMAIL TO CLIPBOARD
// ============================================
function initEmailCopy() {
    const emailElement = document.querySelector('.contact-detail .detail p:last-child');
    if (!emailElement) return;
    
    emailElement.style.cursor = 'pointer';
    emailElement.title = 'Click to copy email';
    
    emailElement.addEventListener('click', () => {
        const email = emailElement.textContent;
        navigator.clipboard.writeText(email).then(() => {
            const originalText = emailElement.textContent;
            emailElement.textContent = 'Email Copied! ✓';
            emailElement.style.color = 'var(--main-color)';
            
            setTimeout(() => {
                emailElement.textContent = originalText;
                emailElement.style.color = '';
            }, 2000);
        });
    });
}

// ============================================
// INITIALIZE ALL FEATURES
// ============================================
// ============================================
// FAQ FUNCTIONALITY
// ============================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
}

function initAllFeatures() {
    initStatistics();
    initScrollToTop();
    initProjectFilter();
    initTestimonials();
    initContactForm();
    initEmailCopy();
    initFAQ();
}

// ============================================
// SMOOTH SCROLLING
// ============================================
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

// ============================================
// SERVICES: Add, Edit, Delete (built-in + user)
// ============================================
const USER_SERVICES_KEY = 'userServices';
const BUILTIN_SERVICES_HIDDEN_KEY = 'builtinServicesHidden';
const BUILTIN_SERVICES_OVERRIDES_KEY = 'builtinServicesOverrides';

function getServiceIconByName(name) {
    if (!name) return 'bx-cog';
    const n = name.toLowerCase();
    if (n.includes('web') || n.includes('frontend') || n.includes('website')) return 'bx-code-alt';
    if (n.includes('backend') || n.includes('api') || n.includes('server')) return 'bx-server';
    if (n.includes('full') && n.includes('stack')) return 'bx-layer';
    if (n.includes('app') || n.includes('android') || n.includes('mobile')) return 'bx-mobile-alt';
    if (n.includes('ui') || n.includes('ux') || n.includes('design')) return 'bxs-paint';
    if (n.includes('graphic')) return 'bx-palette';
    if (n.includes('seo')) return 'bx-trending-up';
    if (n.includes('blockchain') || n.includes('crypto')) return 'bx-link';
    if (n.includes('database') || n.includes('db')) return 'bx-data';
    return 'bx-cog';
}

function loadUserServices() {
    try { const raw = localStorage.getItem(USER_SERVICES_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveUserServices(list) { localStorage.setItem(USER_SERVICES_KEY, JSON.stringify(list)); }
function addUserService(svc) { const list = loadUserServices(); list.push(svc); saveUserServices(list); }

function renderUserServices() {
    const container = document.querySelector('.services.section .services-container');
    if (!container) return;
    container.querySelectorAll('[data-user-service="true"]').forEach(el => el.remove());
    loadUserServices().forEach(svc => {
        const box = document.createElement('div');
        box.className = 'services-box';
        box.setAttribute('data-user-service', 'true');
        const iconClass = svc.icon || getServiceIconByName(svc.title);
        box.innerHTML = `
            <div class="icon">
                <i class='bx ${iconClass}'></i>
            </div>
            <h3>${svc.title || ''}</h3>
            <p>${svc.description || ''}</p>
            <div class="service-actions" style="display:flex; gap:.5rem; margin-top:.75rem;">
                <button class="btn" style="padding:.5rem 1rem;" onclick="openEditServiceForm(${svc.id})"><i class='bx bx-edit'></i> Edit</button>
                <button class="btn" style="padding:.5rem 1rem; background:#ff4d4f;" onclick="deleteService(${svc.id})"><i class='bx bx-trash'></i> Delete</button>
            </div>
        `;
        container.appendChild(box);
    });
    applyBuiltinServiceState();
}

function openAddServiceForm() {
    showPasswordPrompt(() => {
        openAddServiceFormAction();
    }, 'add a new service');
}

function openAddServiceFormAction() {
    const modal = document.createElement('div');
    modal.className = 'add-form-modal';
    modal.id = 'addServiceModal';
    modal.innerHTML = `
        <div class="modal-content-form">
            <button class="modal-close" onclick="closeAddServiceForm()"><i class='bx bx-x'></i></button>
            <h2>Add Service</h2>
            <form id="addServiceForm" onsubmit="addService(event)">
                <div class="form-row">
                    <input type="text" placeholder="Service Title (e.g., Web Development)" required>
                </div>
                <textarea placeholder="Short description" rows="3" required></textarea>
                <button type="submit" class="btn">Add Service</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}
function closeAddServiceForm() { const m = document.getElementById('addServiceModal'); if (m) m.remove(); }
function addService(e) {
    e.preventDefault();
    showPasswordPrompt(() => {
        addServiceAction(e);
    }, 'add this service');
}

function addServiceAction(e) {
    e.preventDefault();
    const f = e.target;
    const titleInput = f.querySelector('input[type="text"]');
    const descriptionInput = f.querySelector('textarea');
    if (!titleInput || !descriptionInput) {
        alert('Please fill in all fields');
        return;
    }
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    if (!title || !description) {
        alert('Please fill in all fields');
        return;
    }
    addUserService({ id: Date.now(), title, icon: getServiceIconByName(title), description });
    renderUserServices();
    closeAddServiceForm();
}

function openEditServiceForm(id) {
    const svc = loadUserServices().find(s => s.id === id); if (!svc) return;
    const modal = document.createElement('div');
    modal.className = 'add-form-modal';
    modal.id = 'editServiceModal';
    modal.innerHTML = `
        <div class="modal-content-form">
            <button class="modal-close" onclick="closeEditServiceForm()"><i class='bx bx-x'></i></button>
            <h2>Edit Service</h2>
            <form id="editServiceForm" onsubmit="saveEditedService(event, ${id})">
                <div class="form-row">
                    <input type="text" placeholder="Service Title" value="${svc.title || ''}" required>
                </div>
                <textarea placeholder="Short description" rows="3" required>${svc.description || ''}</textarea>
                <button type="submit" class="btn">Save</button>
            </form>
        </div>`;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}
function closeEditServiceForm() { const m = document.getElementById('editServiceModal'); if (m) m.remove(); }
function saveEditedService(e, id) {
    e.preventDefault();
    showPasswordPrompt(() => {
        saveEditedServiceAction(e, id);
    }, 'save changes to this service');
}

function saveEditedServiceAction(e, id) {
    e.preventDefault();
    const f = e.target; const title = f[0].value; const description = f[1].value;
    const list = loadUserServices(); const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) { list[idx].title = title; list[idx].description = description; list[idx].icon = getServiceIconByName(title); saveUserServices(list); }
    renderUserServices(); closeEditServiceForm();
}
function deleteService(id) {
    showPasswordPrompt(() => {
        deleteServiceAction(id);
    }, 'delete this service');
}

function deleteServiceAction(id) {
    saveUserServices(loadUserServices().filter(s => s.id !== id));
    renderUserServices();
}

// Built-in services controls
function loadHiddenBuiltinServices() { try { const r = localStorage.getItem(BUILTIN_SERVICES_HIDDEN_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function saveHiddenBuiltinServices(list) { localStorage.setItem(BUILTIN_SERVICES_HIDDEN_KEY, JSON.stringify(list)); }
function loadBuiltinOverrides() { try { const r = localStorage.getItem(BUILTIN_SERVICES_OVERRIDES_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; } }
function saveBuiltinOverrides(map) { localStorage.setItem(BUILTIN_SERVICES_OVERRIDES_KEY, JSON.stringify(map)); }

function ensureServiceActionsOnBox(boxEl, idx) {
    if (boxEl.getAttribute('data-user-service') === 'true') return;
    if (boxEl.querySelector('.service-actions')) return;
    const actions = document.createElement('div');
    actions.className = 'service-actions';
    actions.style.display = 'flex';
    actions.style.gap = '.5rem';
    actions.style.marginTop = '.75rem';
    actions.innerHTML = `
        <button class="btn" style="padding:.5rem 1rem;" onclick="openEditBuiltinServiceForm(${idx})"><i class='bx bx-edit'></i> Edit</button>
        <button class="btn" style="padding:.5rem 1rem; background:#ff4d4f;" onclick="deleteBuiltinService(${idx})"><i class='bx bx-trash'></i> Delete</button>`;
    boxEl.appendChild(actions);
}

function applyBuiltinServiceState() {
    const container = document.querySelector('.services.section .services-container'); if (!container) return;
    const boxes = Array.from(container.querySelectorAll('.services-box')).filter(b => b.getAttribute('data-user-service') !== 'true');
    const hidden = new Set(loadHiddenBuiltinServices());
    const overrides = loadBuiltinOverrides();
    boxes.forEach((box, idx) => {
        box.setAttribute('data-builtin-idx', String(idx));
        box.style.display = hidden.has(idx) ? 'none' : '';
        const h3 = box.querySelector('h3'); const p = box.querySelector('p'); const iconEl = box.querySelector('.icon i');
        const ov = overrides[idx];
        if (ov) { if (h3 && ov.title) h3.textContent = ov.title; if (p && ov.description) p.textContent = ov.description; if (iconEl && ov.icon) iconEl.className = `bx ${ov.icon}`; }
        ensureServiceActionsOnBox(box, idx);
    });
}

function openEditBuiltinServiceForm(idx) {
    showPasswordPrompt(() => {
        openEditBuiltinServiceFormAction(idx);
    }, 'edit this built-in service');
}

function openEditBuiltinServiceFormAction(idx) {
    const container = document.querySelector('.services.section .services-container'); if (!container) return;
    const box = container.querySelector(`.services-box[data-builtin-idx="${idx}"]`); if (!box) return;
    const currentTitle = box.querySelector('h3')?.textContent || '';
    const currentDesc = box.querySelector('p')?.textContent || '';
    const modal = document.createElement('div');
    modal.className = 'add-form-modal'; modal.id = 'editBuiltinServiceModal';
    modal.innerHTML = `
        <div class="modal-content-form">
            <button class="modal-close" onclick="closeEditBuiltinServiceForm()"><i class='bx bx-x'></i></button>
            <h2>Edit Service</h2>
            <form id="editBuiltinServiceForm" onsubmit="saveEditedBuiltinService(event, ${idx})">
                <div class="form-row"><input type="text" placeholder="Service Title" value="${currentTitle}" required></div>
                <textarea placeholder="Short description" rows="3" required>${currentDesc}</textarea>
                <button type="submit" class="btn">Save</button>
            </form>
        </div>`;
    document.body.appendChild(modal); modal.style.display = 'flex';
}
function closeEditBuiltinServiceForm() { const m = document.getElementById('editBuiltinServiceModal'); if (m) m.remove(); }
function saveEditedBuiltinService(e, idx) {
    e.preventDefault();
    showPasswordPrompt(() => {
        saveEditedBuiltinServiceAction(e, idx);
    }, 'save changes to this built-in service');
}

function saveEditedBuiltinServiceAction(e, idx) {
    e.preventDefault();
    const f = e.target; const title = f[0].value; const description = f[1].value;
    const overrides = loadBuiltinOverrides(); overrides[idx] = { title, description, icon: getServiceIconByName(title) }; saveBuiltinOverrides(overrides);
    closeEditBuiltinServiceForm(); applyBuiltinServiceState();
}
function deleteBuiltinService(idx) {
    showPasswordPrompt(() => {
        deleteBuiltinServiceAction(idx);
    }, 'delete this built-in service');
}

function deleteBuiltinServiceAction(idx) {
    const s = new Set(loadHiddenBuiltinServices()); s.add(idx); saveHiddenBuiltinServices(Array.from(s)); applyBuiltinServiceState();
}

// Initialize services controls
document.addEventListener('DOMContentLoaded', () => { renderUserServices(); applyBuiltinServiceState(); });
window.addEventListener('load', () => { try { renderUserServices(); applyBuiltinServiceState(); } catch {} });

// ============================================
// PROJECTS: Add form
// ============================================
function openAddProjectForm() {
    showPasswordPrompt(() => {
        openAddProjectFormAction();
    }, 'add a new project');
}

function openAddProjectFormAction() {
    const modal = document.createElement('div');
    modal.className = 'add-form-modal';
    modal.id = 'addProjectModal';
    modal.innerHTML = `
        <div class="modal-content-form">
            <button class="modal-close" onclick="(function(){const m=document.getElementById('addProjectModal'); if(m) m.remove();})()"><i class='bx bx-x'></i></button>
            <h2>Add Project</h2>
            <form id="addProjectForm">
                <div class="form-row">
                    <input type="text" placeholder="Project Title" required>
                    <select required>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Full Stack">Full Stack</option>
                        <option value="Mobile">Mobile</option>
                    </select>
                </div>
                <textarea placeholder="Short description" rows="3" required></textarea>
                <div class="form-row">
                    <input type="url" placeholder="Live Link (https://...)" required>
                    <input type="url" placeholder="GitHub Link (https://...)" required>
                </div>
                <div class="image-upload-box">
                    <label>Project Image</label>
                    <div class="image-upload-area" onclick="document.getElementById('projectImageInput').click()">
                        <i class='bx bx-camera' style="font-size: 3rem;"></i>
                        <p>Click to upload</p>
                        <input type="file" id="projectImageInput" accept="image/*" style="display:none;">
                    </div>
                    <img id="projectPreview" class="cert-preview" style="display:none;">
                </div>
                <input type="text" placeholder="Technologies (comma separated e.g., React.js, Node.js)">
                <button type="submit" class="btn">Add Project</button>
            </form>
        </div>`;
    document.body.appendChild(modal); modal.style.display = 'flex';

    const imgInput = modal.querySelector('#projectImageInput');
    const preview = modal.querySelector('#projectPreview');
    imgInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0]; if (!file) return;
        const reader = new FileReader(); reader.onload = (ev) => { preview.src = ev.target.result; preview.style.display = 'block'; }; reader.readAsDataURL(file);
    });

    modal.querySelector('#addProjectForm').addEventListener('submit', (e) => {
        e.preventDefault(); const f = e.target;
        const title = f[0].value;
        const category = f[1].value;
        const description = f[2].value;
        const liveLink = f[3].value;
        const githubLink = f[4].value;
        const image = (preview && preview.src) ? preview.src : 'image/portfolio1.jpg';
        const techText = f[6].value || '';
        const tech = techText ? techText.split(',').map(t => t.trim()).filter(Boolean) : [];
        addUserProject({ id: Date.now(), title, description, tech, image, liveLink, githubLink, category });
        renderProjects();
        const m = document.getElementById('addProjectModal'); if (m) m.remove();
    });
}

function openEditProjectForm(id) {
    showPasswordPrompt(() => {
        openEditProjectFormAction(id);
    }, 'edit this project');
}

function openEditProjectFormAction(id) {
    const list = loadUserProjects(); const proj = list.find(p => p.id === id); if (!proj) return;
    const modal = document.createElement('div');
    modal.className = 'add-form-modal'; modal.id = 'editProjectModal';
    modal.innerHTML = `
        <div class="modal-content-form">
            <button class="modal-close" onclick="(function(){const m=document.getElementById('editProjectModal'); if(m) m.remove();})()"><i class='bx bx-x'></i></button>
            <h2>Edit Project</h2>
            <form id="editProjectForm">
                <div class="form-row">
                    <input type="text" placeholder="Project Title" value="${proj.title || ''}" required>
                    <select required>
                        <option ${proj.category==='Frontend'?'selected':''}>Frontend</option>
                        <option ${proj.category==='Backend'?'selected':''}>Backend</option>
                        <option ${proj.category==='Full Stack'?'selected':''}>Full Stack</option>
                        <option ${proj.category==='Mobile'?'selected':''}>Mobile</option>
                    </select>
                </div>
                <textarea placeholder="Short description" rows="3" required>${proj.description || ''}</textarea>
                <div class="form-row">
                    <input type="url" placeholder="Live Link (https://...)" value="${proj.liveLink || ''}" required>
                    <input type="url" placeholder="GitHub Link (https://...)" value="${proj.githubLink || ''}" required>
                </div>
                <div class="image-upload-box">
                    <label>Project Image</label>
                    <div class="image-upload-area" onclick="document.getElementById('editProjectImageInput').click()">
                        <i class='bx bx-camera' style="font-size: 3rem;"></i>
                        <p>Click to upload</p>
                        <input type="file" id="editProjectImageInput" accept="image/*" style="display:none;">
                    </div>
                    <img id="editProjectPreview" class="cert-preview" style="display:${proj.image ? 'block' : 'none'};" src="${proj.image || ''}">
                </div>
                <input type="text" placeholder="Technologies (comma separated)" value="${(proj.tech||[]).join(', ')}">
                <button type="submit" class="btn">Save</button>
            </form>
        </div>`;
    document.body.appendChild(modal); modal.style.display = 'flex';

    const imgInput = modal.querySelector('#editProjectImageInput');
    const preview = modal.querySelector('#editProjectPreview');
    imgInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0]; if (!file) return;
        const reader = new FileReader(); reader.onload = (ev) => { preview.src = ev.target.result; preview.style.display = 'block'; }; reader.readAsDataURL(file);
    });

    modal.querySelector('#editProjectForm').addEventListener('submit', (e) => {
        e.preventDefault(); const f = e.target; const title = f[0].value; const category = f[1].value; const description = f[2].value; const liveLink = f[3].value; const githubLink = f[4].value; const image = (preview && preview.src) ? preview.src : proj.image; const techText = f[6].value || ''; const tech = techText ? techText.split(',').map(t => t.trim()).filter(Boolean) : [];
        const list2 = loadUserProjects(); const idx = list2.findIndex(p => p.id === id);
        if (idx !== -1) { list2[idx] = { ...list2[idx], title, category, description, liveLink, githubLink, image, tech }; saveUserProjects(list2); }
        renderProjects(); const m = document.getElementById('editProjectModal'); if (m) m.remove();
    });
}

function deleteProject(id) {
    showPasswordPrompt(() => {
        deleteProjectAction(id);
    }, 'delete this project');
}

function deleteProjectAction(id) {
    saveUserProjects(loadUserProjects().filter(p => p.id !== id));
    renderProjects();
}

// ============================================
// Certificates: fallback add form if resume-manager.js not present
// ============================================
if (typeof window.openAddForm !== 'function') {
    function fallbackSaveResumeDataCerts(newCert) {
        const saved = localStorage.getItem('resumeData');
        let data = saved ? JSON.parse(saved) : { certificates: [], experience: [], education: [], skills: [] };
        data.certificates = [...(data.certificates || []), newCert];
        localStorage.setItem('resumeData', JSON.stringify(data));
    }

    window.openAddForm = function(type) {
        if (type !== 'certificates') return;
        const modal = document.createElement('div');
        modal.className = 'add-form-modal';
        modal.id = 'addFormModal';
        modal.innerHTML = `
            <div class="modal-content-form">
                <button class="modal-close" onclick="(function(){const m=document.getElementById('addFormModal'); if(m) m.remove();})()"><i class='bx bx-x'></i></button>
                <h2>Add Certificate</h2>
                <form id="fallbackAddCertificateForm">
                    <div class="form-row">
                        <input type="text" placeholder="Certificate Title" required>
                        <input type="text" placeholder="Institution" required>
                    </div>
                    <div class="form-row">
                        <input type="text" placeholder="Year" required>
                        <input type="text" placeholder="Description">
                    </div>
                    <div class="image-upload-box">
                        <label>Certificate Image</label>
                        <div class="image-upload-area" onclick="document.getElementById('fallbackCertImage').click()">
                            <i class='bx bx-camera' style="font-size: 3rem;"></i>
                            <p>Click to upload</p>
                            <input type="file" id="fallbackCertImage" accept="image/*" style="display:none;">
                        </div>
                        <img id="fallbackCertPreview" class="cert-preview" style="display:none;">
                    </div>
                    <button type="submit" class="btn">Add Certificate</button>
                </form>
            </div>`;
        document.body.appendChild(modal);
        modal.style.display = 'flex';

        const fileInput = modal.querySelector('#fallbackCertImage');
        const previewImg = modal.querySelector('#fallbackCertPreview');
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => { previewImg.src = ev.target.result; previewImg.style.display = 'block'; };
            reader.readAsDataURL(file);
        });

        modal.querySelector('#fallbackAddCertificateForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const f = e.target;
            const title = f[0].value;
            const institution = f[1].value;
            const year = f[2].value;
            const description = f[3].value || '';
            const image = previewImg && previewImg.src ? previewImg.src : '';
            const certData = { id: Date.now(), title, institution, year, description, image };
            fallbackSaveResumeDataCerts(certData);
            try { renderCertificates(); } catch {}
            const m = document.getElementById('addFormModal'); if (m) m.remove();
        });
    }
}

// ============================================
// EXPERIENCE: Edit/Delete for all cards
// ============================================
const BUILTIN_EXPERIENCE_HIDDEN_KEY = 'builtinExperienceHidden';
const BUILTIN_EXPERIENCE_OVERRIDES_KEY = 'builtinExperienceOverrides';

function loadHiddenBuiltinExperience() { try { const r = localStorage.getItem(BUILTIN_EXPERIENCE_HIDDEN_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function saveHiddenBuiltinExperience(list) { localStorage.setItem(BUILTIN_EXPERIENCE_HIDDEN_KEY, JSON.stringify(list)); }
function loadBuiltinExperienceOverrides() { try { const r = localStorage.getItem(BUILTIN_EXPERIENCE_OVERRIDES_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; } }
function saveBuiltinExperienceOverrides(map) { localStorage.setItem(BUILTIN_EXPERIENCE_OVERRIDES_KEY, JSON.stringify(map)); }

function getResumeLocal() { try { const r = localStorage.getItem('resumeData'); return r ? JSON.parse(r) : { experience: [], education: [], skills: [], certificates: [] }; } catch { return { experience: [], education: [], skills: [], certificates: [] }; } }
function saveResumeLocal(data) { localStorage.setItem('resumeData', JSON.stringify(data)); }

function ensureExperienceActions() {
    const container = document.getElementById('experienceList'); if (!container) return;
    const cards = Array.from(container.querySelectorAll('.resume-item.experience-card'));
    const hidden = new Set(loadHiddenBuiltinExperience());
    const overrides = loadBuiltinExperienceOverrides();
    let builtinCounter = 0;

    cards.forEach((card) => {
        const isUser = card.hasAttribute('data-exp-id');
        let builtinIdx = -1;
        if (!isUser) {
            builtinIdx = builtinCounter++;
            card.setAttribute('data-builtin-exp-idx', String(builtinIdx));
            // Hide
            card.style.display = hidden.has(builtinIdx) ? 'none' : '';
            // Apply overrides
            const ov = overrides[builtinIdx];
            if (ov) {
                const yearEl = card.querySelector('.resume-meta .year-badge'); if (yearEl && ov.year) yearEl.textContent = ov.year;
                const typeEl = card.querySelector('.resume-meta .job-type'); if (typeEl && ov.type) typeEl.textContent = ov.type;
                const titleEl = card.querySelector('h3'); if (titleEl && ov.position) titleEl.textContent = ov.position;
                const companyEl = card.querySelector('.company'); if (companyEl && ov.company) companyEl.innerHTML = `<i class='bx bx-buildings'></i> ${ov.company}`;
                const descEl = card.querySelector('.job-description'); if (descEl && ov.description) descEl.textContent = ov.description;
                const tags = card.querySelector('.job-tags'); if (tags && Array.isArray(ov.technologies)) { tags.innerHTML = ov.technologies.map(t => `<span class='tag'>${t}</span>`).join(''); }
                const iconI = card.querySelector('.resume-icon i'); if (iconI && ov.icon) iconI.className = `bx ${ov.icon}`;
            }
        }

        if (!card.querySelector('.experience-actions')) {
            const actions = document.createElement('div');
            actions.className = 'experience-actions'; actions.style.display = 'flex'; actions.style.gap = '.5rem'; actions.style.marginTop = '.75rem';
            if (isUser) {
                const id = card.getAttribute('data-exp-id');
                actions.innerHTML = `
                    <button class="btn" style="padding:.5rem 1rem;" onclick="openEditUserExperience(${id})"><i class='bx bx-edit'></i> Edit</button>
                    <button class="btn" style="padding:.5rem 1rem; background:#ff4d4f;" onclick="deleteUserExperience(${id})"><i class='bx bx-trash'></i> Delete</button>`;
            } else {
                actions.innerHTML = `
                    <button class="btn" style="padding:.5rem 1rem;" onclick="openEditBuiltinExperience(${builtinIdx})"><i class='bx bx-edit'></i> Edit</button>
                    <button class="btn" style="padding:.5rem 1rem; background:#ff4d4f;" onclick="deleteBuiltinExperience(${builtinIdx})"><i class='bx bx-trash'></i> Delete</button>`;
            }
            card.appendChild(actions);
        }
    });
}

function openEditBuiltinExperience(idx) {
    showPasswordPrompt(() => {
        openEditBuiltinExperienceAction(idx);
    }, 'edit this built-in experience');
}

function openEditBuiltinExperienceAction(idx) {
    const container = document.getElementById('experienceList'); if (!container) return;
    const builtins = Array.from(container.querySelectorAll('.resume-item.experience-card')).filter(c => !c.hasAttribute('data-exp-id'));
    const card = builtins[idx]; if (!card) return;
    const year = card.querySelector('.year-badge')?.textContent || '';
    const type = card.querySelector('.job-type')?.textContent || '';
    const position = card.querySelector('h3')?.textContent || '';
    const companyText = (card.querySelector('.company')?.textContent || '').trim();
    const description = card.querySelector('.job-description')?.textContent || '';
    const techs = Array.from(card.querySelectorAll('.job-tags .tag')).map(t => t.textContent.trim());

    const modal = document.createElement('div'); modal.className = 'add-form-modal'; modal.id = 'editBuiltinExpModal';
    modal.innerHTML = `
        <div class="modal-content-form">
            <button class="modal-close" onclick="(function(){const m=document.getElementById('editBuiltinExpModal'); if(m) m.remove();})()"><i class='bx bx-x'></i></button>
            <h2>Edit Experience</h2>
            <form id="editBuiltinExpForm">
                <div class="form-row">
                    <input type="text" placeholder="Year" value="${year}" required>
                    <input type="text" placeholder="Type (e.g., Full Time)" value="${type}">
                </div>
                <div class="form-row">
                    <input type="text" placeholder="Position" value="${position}" required>
                    <input type="text" placeholder="Company" value="${companyText}">
                </div>
                <textarea placeholder="Description" rows="3" required>${description}</textarea>
                <input type="text" placeholder="Technologies (comma separated)" value="${techs.join(', ')}">
                <button type="submit" class="btn">Save</button>
            </form>
        </div>`;
    document.body.appendChild(modal); modal.style.display = 'flex';

    modal.querySelector('#editBuiltinExpForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showPasswordPrompt(() => {
            saveBuiltinExperienceAction(e, idx);
        }, 'save changes to this built-in experience');
    });
}

function saveBuiltinExperienceAction(e, idx) {
    e.preventDefault();
    const f = e.target; const inputs = Array.from(f.querySelectorAll('input, textarea')).map(el => el.value);
    const [yearV, typeV, positionV, companyV, descriptionV, techV] = [inputs[0], inputs[1], inputs[2], inputs[3], inputs[4], inputs[5] || ''];
    const technologies = techV ? techV.split(',').map(t => t.trim()).filter(Boolean) : [];
    const ov = loadBuiltinExperienceOverrides(); ov[idx] = { year: yearV, type: typeV, position: positionV, company: companyV, description: descriptionV, technologies };
    saveBuiltinExperienceOverrides(ov);
    const m = document.getElementById('editBuiltinExpModal'); if (m) m.remove();
    // ensureExperienceActions(); // Disabled - using new system
    if (typeof window.renderExperience === 'function') { window.renderExperience(); }
}

function deleteBuiltinExperience(idx) {
    showPasswordPrompt(() => {
        deleteBuiltinExperienceAction(idx);
    }, 'delete this built-in experience');
}

function deleteBuiltinExperienceAction(idx) {
    const s = new Set(loadHiddenBuiltinExperience()); s.add(idx); saveHiddenBuiltinExperience(Array.from(s)); 
    // ensureExperienceActions(); // Disabled - using new system
    if (typeof window.renderExperience === 'function') { window.renderExperience(); }
}

function openEditUserExperience(id) {
    const d = getResumeLocal(); const exp = (d.experience || []).find(e => String(e.id) === String(id)); if (!exp) return;
    const modal = document.createElement('div'); modal.className = 'add-form-modal'; modal.id = 'editUserExpModal';
    modal.innerHTML = `
        <div class="modal-content-form">
            <button class="modal-close" onclick="(function(){const m=document.getElementById('editUserExpModal'); if(m) m.remove();})()"><i class='bx bx-x'></i></button>
            <h2>Edit Experience</h2>
            <form id="editUserExpForm">
                <div class="form-row">
                    <input type="text" placeholder="Year" value="${exp.year || ''}" required>
                    <input type="text" placeholder="Type" value="${exp.type || ''}">
                </div>
                <div class="form-row">
                    <input type="text" placeholder="Position" value="${exp.position || ''}" required>
                    <input type="text" placeholder="Company" value="${exp.company || ''}">
                </div>
                <textarea placeholder="Description" rows="3" required>${exp.description || ''}</textarea>
                <input type="text" placeholder="Technologies (comma separated)" value="${(exp.technologies||[]).join(', ')}">
                <button type="submit" class="btn">Save</button>
            </form>
        </div>`;
    document.body.appendChild(modal); modal.style.display = 'flex';

    modal.querySelector('#editUserExpForm').addEventListener('submit', (e) => {
        e.preventDefault(); const f = e.target; const values = Array.from(f.querySelectorAll('input, textarea')).map(el => el.value);
        const [yearV, typeV, positionV, companyV, descriptionV, techV] = [values[0], values[1], values[2], values[3], values[4], values[5] || ''];
        const technologies = techV ? techV.split(',').map(t => t.trim()).filter(Boolean) : [];
        const data = getResumeLocal(); const idx = (data.experience || []).findIndex(e => String(e.id) === String(id));
        if (idx !== -1) { data.experience[idx] = { ...data.experience[idx], year: yearV, type: typeV, position: positionV, company: companyV, description: descriptionV, technologies }; saveResumeLocal(data); }
        if (typeof window.renderExperience === 'function') { window.renderExperience(); }
        const m = document.getElementById('editUserExpModal'); if (m) m.remove();
        // setTimeout(ensureExperienceActions, 100); // Disabled - using new system
    });
}

function deleteUserExperience(id) {
    const data = getResumeLocal(); data.experience = (data.experience || []).filter(e => String(e.id) !== String(id)); saveResumeLocal(data);
    if (typeof window.renderExperience === 'function') { window.renderExperience(); }
    // setTimeout(ensureExperienceActions, 100); // Disabled - using new system
}

// Disabled old ensureExperienceActions - now using action-buttons from resume-manager.js
// document.addEventListener('DOMContentLoaded', () => { setTimeout(ensureExperienceActions, 700); });
// window.addEventListener('load', () => { setTimeout(ensureExperienceActions, 700); });
