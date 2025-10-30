// ============================================
// RESUME MANAGER - Dynamic Content & Add Forms
// ============================================

// Get data from localStorage or use default - Merge JSON data with localStorage
function getResumeData() {
    // Start with JSON data (portfolioData) - this has existing data
    let baseData = {
        experience: portfolioData?.experience || [],
        education: portfolioData?.education || [],
        skills: [],
        certificates: portfolioData?.certificates || []
    };
    
    // Merge with localStorage data (user-added items)
    const saved = localStorage.getItem('resumeData');
    if (saved) {
        try {
            const savedData = JSON.parse(saved);
            // Merge: combine arrays from both sources
            baseData.experience = [...baseData.experience, ...(savedData.experience || [])];
            baseData.education = [...baseData.education, ...(savedData.education || [])];
            baseData.certificates = [...baseData.certificates, ...(savedData.certificates || [])];
            
            // Merge skills - more complex as we need to merge categories
            if (savedData.skills) {
                savedData.skills.forEach(savedCategory => {
                    let existingCategory = baseData.skills.find(c => c.category === savedCategory.category);
                    if (existingCategory) {
                        existingCategory.items = [...existingCategory.items, ...(savedCategory.items || [])];
                    } else {
                        baseData.skills.push(savedCategory);
                    }
                });
            }
        } catch (e) {
            console.log('Error parsing saved data:', e);
        }
    }
    
    return baseData;
}

function saveResumeData(data) {
    // Only save user-added items to localStorage (not the base JSON data)
    const saved = localStorage.getItem('resumeData');
    let savedData = saved ? JSON.parse(saved) : {
        experience: [],
        education: [],
        skills: [],
        certificates: []
    };
    
    // Add new items to savedData based on what was just added
    // We'll track the last added item ID to merge properly
    if (data.experience && data.experience.length > 0) {
        savedData.experience = [...(savedData.experience || []), ...data.experience];
    }
    if (data.education && data.education.length > 0) {
        savedData.education = [...(savedData.education || []), ...data.education];
    }
    if (data.certificates && data.certificates.length > 0) {
        savedData.certificates = [...(savedData.certificates || []), ...data.certificates];
    }
    if (data.skills && data.skills.length > 0) {
        savedData.skills = [...(savedData.skills || []), ...data.skills];
    }
    
    localStorage.setItem('resumeData', JSON.stringify(savedData));
}

// Render Experience
function renderExperience() {
    const container = document.getElementById('experienceList');
    if (!container) return;
    
    const data = getResumeData();
    const allExperiences = data.experience || [];
    
    // Get existing experience IDs from JSON data to avoid duplicates
    const existingIds = new Set();
    if (portfolioData && portfolioData.experience) {
        portfolioData.experience.forEach(exp => {
            if (exp.id) existingIds.add(exp.id);
        });
    }
    
    // Add edit/delete buttons to existing HTML cards and add data attributes
    const existingCards = container.querySelectorAll('.resume-item.experience-card');
    
    existingCards.forEach((card, index) => {
        // Get the ID from HTML data attribute first, fallback to index + 1
        let expId = card.getAttribute('data-exp-id');
        if (!expId) {
            expId = index + 1;
            card.setAttribute('data-exp-id', expId);
        }
        expId = parseInt(expId); // Ensure it's a number
        
        // Check if buttons already exist
        const header = card.querySelector('.resume-item-header');
        if (header && !header.querySelector('.action-buttons')) {
            const buttonsHTML = `
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editExperience(${expId})" title="Edit"><i class='bx bx-edit'></i></button>
                    <button class="delete-btn" onclick="deleteExperience(${expId})" title="Delete"><i class='bx bx-trash'></i></button>
                </div>
            `;
            header.insertAdjacentHTML('beforeend', buttonsHTML);
        }
    });
    
    // Only add new items (from localStorage) that aren't already displayed
    allExperiences.forEach(exp => {
        // Check if this experience is already displayed (from JSON)
        if (existingIds.has(exp.id)) {
            return; // Skip items that are already in the HTML
        }
        
        // Check if item with same ID already exists in DOM
        const existingCard = container.querySelector(`[data-exp-id="${exp.id}"]`);
        if (existingCard) {
            return; // Already added, buttons should be added by the first loop
        }
        
        const expCard = document.createElement('div');
        expCard.className = 'resume-item experience-card';
        expCard.setAttribute('data-exp-id', exp.id);
        expCard.innerHTML = `
            <div class="resume-item-header">
                <div class="resume-icon">
                    <i class='bx ${exp.icon || 'bx-code-alt'}'></i>
                </div>
                <div class="resume-meta">
                    <span class="year-badge">${exp.year || ''}</span>
                    <span class="job-type">${exp.type || ''}</span>
                </div>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editExperience(${exp.id})" title="Edit"><i class='bx bx-edit'></i></button>
                    <button class="delete-btn" onclick="deleteExperience(${exp.id})" title="Delete"><i class='bx bx-trash'></i></button>
                </div>
            </div>
            <h3>${exp.position || ''}</h3>
            <p class="company"><i class='bx bx-buildings'></i> ${exp.company || ''}</p>
            <p class="job-description">${exp.description || ''}</p>
            ${exp.technologies && exp.technologies.length > 0 ? `
                <div class="job-tags">
                    ${exp.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                </div>
            ` : ''}
        `;
        container.appendChild(expCard);
    });
}

// Render Education
function renderEducation() {
    const container = document.getElementById('educationList');
    if (!container) return;
    
    const data = getResumeData();
    const allEducations = data.education || [];
    
    // Get existing education IDs from JSON data to avoid duplicates
    const existingIds = new Set();
    if (portfolioData && portfolioData.education) {
        portfolioData.education.forEach(edu => {
            if (edu.id) existingIds.add(edu.id);
        });
    }
    
    // Add edit/delete buttons to existing HTML cards and add data attributes
    const existingCards = container.querySelectorAll('.resume-item.education-card');
    existingCards.forEach((card, index) => {
        // Get the ID from HTML data attribute first, fallback to index + 1
        let eduId = card.getAttribute('data-edu-id');
        if (!eduId) {
            eduId = index + 1;
            card.setAttribute('data-edu-id', eduId);
        }
        eduId = parseInt(eduId); // Ensure it's a number
        
        // Check if buttons already exist
        const header = card.querySelector('.education-header');
        if (header && !header.querySelector('.action-buttons')) {
            const buttonsHTML = `
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editEducation(${eduId})" title="Edit"><i class='bx bx-edit'></i></button>
                    <button class="delete-btn" onclick="deleteEducation(${eduId})" title="Delete"><i class='bx bx-trash'></i></button>
                </div>
            `;
            header.insertAdjacentHTML('beforeend', buttonsHTML);
        }
    });
    
    // Only add new items (from localStorage) that aren't already displayed
    allEducations.forEach(edu => {
        // Check if this education is already displayed (from JSON)
        if (existingIds.has(edu.id)) {
            return; // Skip items that are already in the HTML
        }
        
        // Check if item with same ID already exists in DOM
        const existingCard = container.querySelector(`[data-edu-id="${edu.id}"]`);
        if (existingCard) {
            return; // Already added, buttons should be added by the first loop
        }
        
        const eduCard = document.createElement('div');
        eduCard.className = 'resume-item education-card';
        eduCard.setAttribute('data-edu-id', edu.id);
        eduCard.innerHTML = `
            <div class="education-header">
                <div class="education-icon">
                    <i class='bx ${edu.icon || 'bx-graduation'}'></i>
                </div>
                <div class="education-meta">
                    <span class="year-badge">${edu.year || ''}</span>
                    <span class="degree-level">${edu.level || ''}</span>
                </div>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editEducation(${edu.id})" title="Edit"><i class='bx bx-edit'></i></button>
                    <button class="delete-btn" onclick="deleteEducation(${edu.id})" title="Delete"><i class='bx bx-trash'></i></button>
                </div>
            </div>
            <h3>${edu.degree || ''}</h3>
            <p class="company"><i class='bx bx-buildings'></i> ${edu.institution || ''}</p>
            <p class="education-description">${edu.description || ''}</p>
            ${edu.highlights && edu.highlights.length > 0 ? `
                <div class="education-highlights">
                    ${edu.highlights.map(h => `<span class="highlight"><i class='bx bx-check-circle'></i> ${h}</span>`).join('')}
                </div>
            ` : ''}
        `;
        container.appendChild(eduCard);
    });
}

// Render Skills
function renderSkills() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    
    const data = getResumeData();
    const allSkills = data.skills || [];

    // Only use user-added skills; do not inject default JSON categories
    allSkills.forEach(category => {
        // Find existing category by heading text
        let categoryDiv = null;
        container.querySelectorAll('.skill-category').forEach(cat => {
            const h = cat.querySelector('h3');
            if (h && h.textContent.trim() === category.category) categoryDiv = cat;
        });
        if (!categoryDiv) {
            // Create the category if it doesn't exist
            categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';
            categoryDiv.innerHTML = `<h3>${category.category}</h3>`;
            const gridDiv = document.createElement('div');
            gridDiv.className = 'skills-grid';
            categoryDiv.appendChild(gridDiv);
            container.appendChild(categoryDiv);
        }
        const gridDiv = categoryDiv.querySelector('.skills-grid');
        const existingNames = new Set(Array.from(gridDiv.querySelectorAll('.skill-name')).map(e => e.textContent.trim()));
        (category.items || []).forEach(skill => {
            if (existingNames.has(skill.name)) return;
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-item';
            skillDiv.innerHTML = `
                <div class="skill-icon">
                    ${skill.image ? `<img src="${skill.image}" alt="${skill.name}">` : `<i class='bx ${skill.icon || 'bx-code-alt'}'></i>`}
                </div>
                <span class="skill-name">${skill.name}</span>
                <div class="skill-level" data-level="${skill.level || 80}">
                    <div class="skill-progress" data-level="${skill.level || 80}"></div>
                </div>
            `;
            gridDiv.appendChild(skillDiv);
        });
    });
}

// Render Certificates in Resume
function renderCertificatesInResume() {
    const container = document.getElementById('certificatesList');
    if (!container) return;
    
    const data = getResumeData();
    
    // Get existing certificate IDs from DOM to avoid duplicates
    const renderedIds = new Set();
    container.querySelectorAll('[data-cert-id]').forEach(card => {
        renderedIds.add(parseInt(card.getAttribute('data-cert-id')));
    });
    
    // Get all certificates (already merged in getResumeData)
    const allCertificates = data.certificates || [];
    
    // Render all certificates that haven't been rendered yet
    allCertificates.forEach(cert => {
        // Check if already rendered
        if (renderedIds.has(cert.id)) {
            return;
        }
        
        const certCard = document.createElement('div');
        certCard.className = 'resume-item certificate-card-resume';
        certCard.setAttribute('data-cert-id', cert.id);
        
        // Escape image path for onclick handler
        const safeImage = (cert.image || '').replace(/'/g, "\\'");
        const safeTitle = (cert.title || '').replace(/'/g, "\\'");
        
        certCard.innerHTML = `
            <div class="certificate-card-content">
                <div class="certificate-image-wrapper-resume">
                    ${cert.image && cert.image.startsWith('data:') 
                        ? `<img src="${cert.image}" alt="${cert.title}" class="cert-image-resume">` 
                        : cert.image 
                            ? `<img src="${cert.image}" alt="${cert.title}" class="cert-image-resume" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                               <div class="cert-icon-placeholder" style="display:none;"><i class='bx bx-certificate'></i></div>`
                            : `<div class="cert-icon-placeholder"><i class='bx bx-certificate'></i></div>`
                    }
                </div>
                <div class="certificate-info-resume">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <h3>${cert.title || ''}</h3>
                            <p class="cert-institution-resume">${cert.institution || ''}</p>
                            ${cert.description ? `<p class="cert-desc-resume">${cert.description}</p>` : ''}
                            <span class="cert-year-resume">${cert.year || ''}</span>
                        </div>
                        <div class="action-buttons">
                            <button class="edit-btn" onclick="editCertificate(${cert.id})" title="Edit"><i class='bx bx-edit'></i></button>
                            <button class="delete-btn" onclick="deleteCertificate(${cert.id})" title="Delete"><i class='bx bx-trash'></i></button>
                        </div>
                    </div>
                    ${cert.image ? `<button class="view-cert-btn-small" onclick="viewCertificate('${safeImage}', '${safeTitle}')">
                        <i class='bx bx-zoom-in'></i> View Image
                    </button>` : ''}
                </div>
            </div>
        `;
        container.appendChild(certCard);
        renderedIds.add(cert.id);
    });
    
    // Show message if no certificates
    if (allCertificates.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5); padding: 3rem;">No certificates added yet. Click "Add Certificate" to get started.</p>';
    }
}

// Open Add Form Modal
function openAddForm(type) {
    const modal = document.createElement('div');
    modal.className = 'add-form-modal';
    modal.id = 'addFormModal';
    
    let formHTML = '';
    
    if (type === 'experience') {
        formHTML = `
            <div class="modal-content-form">
                <button class="modal-close" onclick="closeAddForm()"><i class='bx bx-x'></i></button>
                <h2>Add Experience</h2>
                <form id="addExperienceForm" onsubmit="addExperience(event)">
                    <div class="form-row">
                        <input type="text" placeholder="Year (e.g., 2025 - Present)" required>
                        <input type="text" placeholder="Position" required>
                    </div>
                    <div class="form-row">
                        <input type="text" placeholder="Company" required>
                        <select required>
                            <option>Full Time</option>
                            <option>Part Time</option>
                            <option>Contract</option>
                            <option>Freelance</option>
                        </select>
                    </div>
                    <textarea placeholder="Description" rows="3" required></textarea>
                    <input type="text" placeholder="Technologies (comma separated)">
                    <button type="submit" class="btn">Add Experience</button>
                </form>
            </div>
        `;
    } else if (type === 'education') {
        formHTML = `
            <div class="modal-content-form">
                <button class="modal-close" onclick="closeAddForm()"><i class='bx bx-x'></i></button>
                <h2>Add Education</h2>
                <form id="addEducationForm" onsubmit="addEducation(event)">
                    <div class="form-row">
                        <input type="text" placeholder="Year" required>
                        <select required>
                            <option>Bachelor's Degree</option>
                            <option>Master's Degree</option>
                            <option>Certification</option>
                            <option>Course</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <input type="text" placeholder="Degree Name" required>
                        <input type="text" placeholder="Institution" required>
                    </div>
                    <textarea placeholder="Description" rows="3" required></textarea>
                    <input type="text" placeholder="Highlights (comma separated)">
                    <button type="submit" class="btn">Add Education</button>
                </form>
            </div>
        `;
    } else if (type === 'skills') {
        formHTML = `
            <div class="modal-content-form">
                <button class="modal-close" onclick="closeAddForm()"><i class='bx bx-x'></i></button>
                <h2>Add Skill</h2>
                <form id="addSkillForm" onsubmit="addSkill(event)">
                    <select required>
                        <option>Frontend Technologies</option>
                        <option>Backend Technologies</option>
                        <option>Other Skills</option>
                    </select>
                    <div class="form-row">
                        <input type="text" placeholder="Skill Name" required>
                        <input type="number" placeholder="Level (1-100)" min="1" max="100" required>
                    </div>
                    <input type="text" placeholder="Icon Class (e.g., bxl-react)">
                    <button type="submit" class="btn">Add Skill</button>
                </form>
            </div>
        `;
    } else if (type === 'certificates') {
        formHTML = `
            <div class="modal-content-form">
                <button class="modal-close" onclick="closeAddForm()"><i class='bx bx-x'></i></button>
                <h2>Add Certificate</h2>
                <form id="addCertificateForm" onsubmit="addCertificate(event)">
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
                        <div class="image-upload-area" onclick="document.getElementById('certImageInputResume').click()">
                            <i class='bx bx-camera' style="font-size: 3rem;"></i>
                            <p>Click to upload or use camera</p>
                            <input type="file" id="certImageInputResume" accept="image/*" capture="environment" style="display:none;" onchange="previewCertificateImage(event)">
                        </div>
                        <img id="certPreviewResume" class="cert-preview" style="display:none;">
                        <input type="text" id="certImagePathResume" placeholder="Or enter image path" style="display:none;">
                    </div>
                    <button type="submit" class="btn">Add Certificate</button>
                </form>
            </div>
        `;
    }
    
    modal.innerHTML = formHTML;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeAddForm() {
    const modal = document.getElementById('addFormModal');
    if (modal) {
        modal.remove();
    }
}

function previewCertificateImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('certPreviewResume');
            const pathInput = document.getElementById('certImagePathResume');
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
            if (pathInput) {
                pathInput.value = e.target.result; // Base64
            }
        };
        reader.readAsDataURL(file);
    }
}

// Add Functions
function addExperience(event) {
    event.preventDefault();
    const form = event.target;
    
    const expData = {
        id: Date.now(),
        year: form[0].value,
        position: form[1].value,
        company: form[2].value,
        type: form[3].value,
        description: form[4].value,
        technologies: form[5].value ? form[5].value.split(',').map(t => t.trim()) : [],
        icon: 'bx-code-alt'
    };
    
    // Save new item
    saveResumeData({ experience: [expData] });
    renderExperience();
    closeAddForm();
}

function addEducation(event) {
    event.preventDefault();
    const form = event.target;
    
    const eduData = {
        id: Date.now(),
        year: form[0].value,
        level: form[1].value,
        degree: form[2].value,
        institution: form[3].value,
        description: form[4].value,
        highlights: form[5].value ? form[5].value.split(',').map(h => h.trim()) : [],
        icon: 'bx-graduation'
    };
    
    // Save new item
    saveResumeData({ education: [eduData] });
    renderEducation();
    closeAddForm();
}

function addSkill(event) {
    event.preventDefault();
    const form = event.target;
    
    const category = form[0].value;
    const skillData = {
        name: form[1].value,
        level: parseInt(form[2].value),
        icon: form[3].value || 'bx-code-alt'
    };
    
    // Get saved skills from localStorage
    const saved = localStorage.getItem('resumeData');
    let savedData = saved ? JSON.parse(saved) : { skills: [] };
    
    if (!savedData.skills) savedData.skills = [];
    
    // Find or create category
    let categoryFound = savedData.skills.find(s => s.category === category);
    if (categoryFound) {
        categoryFound.items.push(skillData);
    } else {
        savedData.skills.push({ category: category, items: [skillData] });
    }
    
    saveResumeData({ skills: savedData.skills });
    renderSkills();
    closeAddForm();
}

function addCertificate(event) {
    event.preventDefault();
    const form = event.target;
    const imagePath = document.getElementById('certImagePathResume')?.value || '';
    
    const certData = {
        id: Date.now(),
        title: form[0].value,
        institution: form[1].value,
        year: form[2].value,
        description: form[3].value || '',
        image: imagePath || ''
    };
    
    // Save new item
    saveResumeData({ certificates: [certData] });
    renderCertificatesInResume();
    closeAddForm();
}

// ============================================
// EDIT & DELETE FUNCTIONS
// ============================================

// Edit Experience
function editExperience(id) {
    // Try to find in portfolioData first (HTML cards)
    let exp = null;
    if (portfolioData && portfolioData.experience) {
        exp = portfolioData.experience.find(e => e.id === id);
    }
    
    // If not found, try localStorage
    if (!exp) {
        const data = getResumeData();
        exp = data.experience.find(e => e.id === id);
    }
    
    if (!exp) {
        alert('Item not found!');
        return;
    }
    
    openEditForm('experience', exp);
}

// Delete Experience
function deleteExperience(id) {
    if (confirm('Are you sure you want to delete this experience?')) {
        // Check if it's from localStorage
        const saved = localStorage.getItem('resumeData');
        let savedData = saved ? JSON.parse(saved) : { experience: [] };
        
        // Remove from localStorage if it exists there
        const localExpIndex = savedData.experience.findIndex(e => e.id === id);
        if (localExpIndex !== -1) {
            savedData.experience = savedData.experience.filter(e => e.id !== id);
            localStorage.setItem('resumeData', JSON.stringify(savedData));
        }
        
        // Remove from DOM
        const card = document.querySelector(`[data-exp-id="${id}"]`);
        if (card) {
            card.remove();
        }
    }
}

// Edit Education
function editEducation(id) {
    // Try to find in portfolioData first (HTML cards)
    let edu = null;
    if (portfolioData && portfolioData.education) {
        edu = portfolioData.education.find(e => e.id === id);
    }
    
    // If not found, try localStorage
    if (!edu) {
        const data = getResumeData();
        edu = data.education.find(e => e.id === id);
    }
    
    if (!edu) {
        alert('Item not found!');
        return;
    }
    
    openEditForm('education', edu);
}

// Delete Education
function deleteEducation(id) {
    if (confirm('Are you sure you want to delete this education?')) {
        // Check if it's from localStorage
        const saved = localStorage.getItem('resumeData');
        let savedData = saved ? JSON.parse(saved) : { education: [] };
        
        // Remove from localStorage if it exists there
        const localEduIndex = savedData.education.findIndex(e => e.id === id);
        if (localEduIndex !== -1) {
            savedData.education = savedData.education.filter(e => e.id !== id);
            localStorage.setItem('resumeData', JSON.stringify(savedData));
        }
        
        // Remove from DOM
        const card = document.querySelector(`[data-edu-id="${id}"]`);
        if (card) {
            card.remove();
        }
    }
}

// Edit Certificate
function editCertificate(id) {
    const data = getResumeData();
    const cert = data.certificates.find(c => c.id === id);
    if (!cert) return;
    
    openEditForm('certificates', cert);
}

// Delete Certificate
function deleteCertificate(id) {
    if (confirm('Are you sure you want to delete this certificate?')) {
        const saved = localStorage.getItem('resumeData');
        let savedData = saved ? JSON.parse(saved) : { certificates: [] };
        savedData.certificates = savedData.certificates.filter(c => c.id !== id);
        localStorage.setItem('resumeData', JSON.stringify(savedData));
        
        // Also remove from DOM if it exists
        const card = document.querySelector(`[data-cert-id="${id}"]`);
        if (card) {
            card.remove();
        }
    }
}

// Open Edit Form
function openEditForm(type, item) {
    closeAddForm(); // Close any existing forms
    
    const modal = document.createElement('div');
    modal.className = 'add-form-modal';
    modal.id = 'editFormModal';
    
    let formHTML = '';
    
    if (type === 'experience') {
        formHTML = `
            <div class="modal-content-form">
                <button class="modal-close" onclick="closeEditForm()"><i class='bx bx-x'></i></button>
                <h2>Edit Experience</h2>
                <form id="editExperienceForm" onsubmit="updateExperience(event, ${item.id})">
                    <div class="form-row">
                        <input type="text" placeholder="Year (e.g., 2025 - Present)" value="${item.year || ''}" required>
                        <input type="text" placeholder="Position" value="${item.position || ''}" required>
                    </div>
                    <div class="form-row">
                        <input type="text" placeholder="Company" value="${item.company || ''}" required>
                        <select required>
                            <option ${item.type === 'Full Time' ? 'selected' : ''}>Full Time</option>
                            <option ${item.type === 'Part Time' ? 'selected' : ''}>Part Time</option>
                            <option ${item.type === 'Contract' ? 'selected' : ''}>Contract</option>
                            <option ${item.type === 'Freelance' ? 'selected' : ''}>Freelance</option>
                        </select>
                    </div>
                    <textarea placeholder="Description" rows="3" required>${item.description || ''}</textarea>
                    <input type="text" placeholder="Technologies (comma separated)" value="${item.technologies ? item.technologies.join(', ') : ''}">
                    <button type="submit" class="btn">Update Experience</button>
                </form>
            </div>
        `;
    } else if (type === 'education') {
        formHTML = `
            <div class="modal-content-form">
                <button class="modal-close" onclick="closeEditForm()"><i class='bx bx-x'></i></button>
                <h2>Edit Education</h2>
                <form id="editEducationForm" onsubmit="updateEducation(event, ${item.id})">
                    <div class="form-row">
                        <input type="text" placeholder="Year" value="${item.year || ''}" required>
                        <select required>
                            <option ${item.level === "Bachelor's Degree" ? 'selected' : ''}>Bachelor's Degree</option>
                            <option ${item.level === "Master's Degree" ? 'selected' : ''}>Master's Degree</option>
                            <option ${item.level === 'Certification' ? 'selected' : ''}>Certification</option>
                            <option ${item.level === 'Course' ? 'selected' : ''}>Course</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <input type="text" placeholder="Degree Name" value="${item.degree || ''}" required>
                        <input type="text" placeholder="Institution" value="${item.institution || ''}" required>
                    </div>
                    <textarea placeholder="Description" rows="3" required>${item.description || ''}</textarea>
                    <input type="text" placeholder="Highlights (comma separated)" value="${item.highlights ? item.highlights.join(', ') : ''}">
                    <button type="submit" class="btn">Update Education</button>
                </form>
            </div>
        `;
    } else if (type === 'certificates') {
        formHTML = `
            <div class="modal-content-form">
                <button class="modal-close" onclick="closeEditForm()"><i class='bx bx-x'></i></button>
                <h2>Edit Certificate</h2>
                <form id="editCertificateForm" onsubmit="updateCertificate(event, ${item.id})">
                    <div class="form-row">
                        <input type="text" placeholder="Certificate Title" value="${item.title || ''}" required>
                        <input type="text" placeholder="Institution" value="${item.institution || ''}" required>
                    </div>
                    <div class="form-row">
                        <input type="text" placeholder="Year" value="${item.year || ''}" required>
                        <input type="text" placeholder="Description" value="${item.description || ''}">
                    </div>
                    <button type="submit" class="btn">Update Certificate</button>
                </form>
            </div>
        `;
    }
    
    modal.innerHTML = formHTML;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeEditForm() {
    const modal = document.getElementById('editFormModal');
    if (modal) {
        modal.remove();
    }
}

// Update Functions
function updateExperience(event, id) {
    event.preventDefault();
    const form = event.target;
    
    const expData = {
        id: id,
        year: form[0].value,
        position: form[1].value,
        company: form[2].value,
        type: form[3].value,
        description: form[4].value,
        technologies: form[5].value ? form[5].value.split(',').map(t => t.trim()) : [],
        icon: 'bx-code-alt'
    };
    
    // Save to localStorage (always - for both HTML cards and new items)
    const saved = localStorage.getItem('resumeData');
    let savedData = saved ? JSON.parse(saved) : { experience: [] };
    const index = savedData.experience.findIndex(e => e.id === id);
    if (index !== -1) {
        savedData.experience[index] = expData;
        localStorage.setItem('resumeData', JSON.stringify(savedData));
    } else {
        // If not in localStorage, add it (HTML card being edited)
        savedData.experience.push(expData);
        localStorage.setItem('resumeData', JSON.stringify(savedData));
    }
    
    // Update the card in DOM
    const card = document.querySelector(`[data-exp-id="${id}"]`);
    if (card) {
        // Update the card content
        const header = card.querySelector('.resume-item-header');
        if (header) {
            const metaDiv = header.querySelector('.resume-meta');
            if (metaDiv) {
                metaDiv.innerHTML = `
                    <span class="year-badge">${expData.year || ''}</span>
                    <span class="job-type">${expData.type || ''}</span>
                `;
            }
        }
        
        const h3 = card.querySelector('h3');
        if (h3) h3.textContent = expData.position || '';
        
        const company = card.querySelector('.company');
        if (company) company.innerHTML = `<i class='bx bx-buildings'></i> ${expData.company || ''}`;
        
        const description = card.querySelector('.job-description');
        if (description) description.textContent = expData.description || '';
        
        const tags = card.querySelector('.job-tags');
        if (tags && expData.technologies && expData.technologies.length > 0) {
            tags.innerHTML = expData.technologies.map(tech => `<span class="tag">${tech}</span>`).join('');
        }
    }
    
    closeEditForm();
}

function updateEducation(event, id) {
    event.preventDefault();
    const form = event.target;
    
    const eduData = {
        id: id,
        year: form[0].value,
        level: form[1].value,
        degree: form[2].value,
        institution: form[3].value,
        description: form[4].value,
        highlights: form[5].value ? form[5].value.split(',').map(h => h.trim()) : [],
        icon: 'bx-graduation'
    };
    
    // Save to localStorage (always - for both HTML cards and new items)
    const saved = localStorage.getItem('resumeData');
    let savedData = saved ? JSON.parse(saved) : { education: [] };
    const index = savedData.education.findIndex(e => e.id === id);
    if (index !== -1) {
        savedData.education[index] = eduData;
        localStorage.setItem('resumeData', JSON.stringify(savedData));
    } else {
        // If not in localStorage, add it (HTML card being edited)
        savedData.education.push(eduData);
        localStorage.setItem('resumeData', JSON.stringify(savedData));
    }
    
    // Update the card in DOM
    const card = document.querySelector(`[data-edu-id="${id}"]`);
    if (card) {
        // Update the card content
        const header = card.querySelector('.education-header');
        if (header) {
            const metaDiv = header.querySelector('.education-meta');
            if (metaDiv) {
                metaDiv.innerHTML = `
                    <span class="year-badge">${eduData.year || ''}</span>
                    <span class="degree-level">${eduData.level || ''}</span>
                `;
            }
        }
        
        const h3 = card.querySelector('h3');
        if (h3) h3.textContent = eduData.degree || '';
        
        const company = card.querySelector('.company');
        if (company) company.innerHTML = `<i class='bx bx-buildings'></i> ${eduData.institution || ''}`;
        
        const description = card.querySelector('.education-description');
        if (description) description.textContent = eduData.description || '';
        
        const highlights = card.querySelector('.education-highlights');
        if (highlights && eduData.highlights && eduData.highlights.length > 0) {
            highlights.innerHTML = eduData.highlights.map(h => `<span class="highlight"><i class='bx bx-check-circle'></i> ${h}</span>`).join('');
        }
    }
    
    closeEditForm();
}

function updateCertificate(event, id) {
    event.preventDefault();
    const form = event.target;
    
    const certData = {
        id: id,
        title: form[0].value,
        institution: form[1].value,
        year: form[2].value,
        description: form[3].value || '',
        image: form[4]?.value || ''
    };
    
    const saved = localStorage.getItem('resumeData');
    let savedData = saved ? JSON.parse(saved) : { certificates: [] };
    const index = savedData.certificates.findIndex(c => c.id === id);
    if (index !== -1) {
        savedData.certificates[index] = certData;
        localStorage.setItem('resumeData', JSON.stringify(savedData));
    }
    
    renderCertificatesInResume();
    closeEditForm();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait longer to ensure portfolioData is loaded from script.js
    setTimeout(() => {
        setupResumeTabs();
        // Render existing data
        renderExperience();
        renderEducation();
        renderSkills();
        renderCertificatesInResume();
    }, 800);
});

// Also try on window load in case DOMContentLoaded fired too early
window.addEventListener('load', () => {
    setTimeout(() => {
        if (typeof portfolioData !== 'undefined') {
            renderCertificatesInResume();
        }
    }, 500);
});

