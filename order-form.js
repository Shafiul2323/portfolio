// ============================================
// ORDER FORM FUNCTIONALITY
// ============================================

let currentStep = 1;
const totalSteps = 3;

// Make currentStep globally accessible
window.currentStep = currentStep;

// WhatsApp Configuration
const WHATSAPP_NUMBER = '8801612753707'; // Your WhatsApp number

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
});

// Also initialize when order section becomes active
document.addEventListener('DOMContentLoaded', () => {
    // Watch for order section activation
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const orderSection = document.querySelector('section.order');
                if (orderSection && orderSection.classList.contains('active')) {
                    // Ensure form is visible and reset to first step
                    setTimeout(() => {
                        currentStep = 1; // Reset to first step
                        window.currentStep = 1;
                        initializeForm();
                        showStep(1);
                        updateProgress();
                        
                        // Ensure form container is visible
                        const orderFormWrapper = orderSection.querySelector('.order-form-wrapper');
                        if (orderFormWrapper) {
                            orderFormWrapper.style.display = 'block';
                            orderFormWrapper.style.visibility = 'visible';
                            orderFormWrapper.style.opacity = '1';
                        }
                    }, 50);
                }
            }
        });
    });
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section, { attributes: true, attributeFilter: ['class'] });
    });
});

function initializeForm() {
    const form = document.getElementById('orderForm');
    if (!form) return;

    // Add event listeners (only once)
    if (!form.hasAttribute('data-initialized')) {
        form.addEventListener('submit', handleFormSubmit);
        form.setAttribute('data-initialized', 'true');
    }
    
    // Initialize first step
    currentStep = 1;
    window.currentStep = 1;
    showStep(1);
    updateProgress();
    
    // Ensure form is visible
    form.style.display = 'block';
    form.style.visibility = 'visible';
    form.style.opacity = '1';
}

// Make function globally available
window.initializeForm = initializeForm;

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            window.currentStep = currentStep;
            showStep(currentStep);
            updateProgress();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        window.currentStep = currentStep;
        showStep(currentStep);
        updateProgress();
    }
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
        stepEl.style.display = 'none';
        stepEl.style.opacity = '0';
        stepEl.style.visibility = 'hidden';
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
        currentStepEl.style.display = 'block';
        currentStepEl.style.opacity = '1';
        currentStepEl.style.visibility = 'visible';
    }
}

function updateProgress() {
    document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
        const stepNum = index + 1;
        if (stepNum <= currentStep) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
}

function validateCurrentStep() {
    const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (!currentStepEl) return false;

    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderBottomColor = '#d9534f';
            setTimeout(() => {
                field.style.borderBottomColor = '';
            }, 2000);
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
    }

    return isValid;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        return;
    }

    const formData = collectFormData();
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (!submitBtn) {
        showNotification('Submit button not found', 'error');
        return;
    }
    
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;

    // Send to WhatsApp immediately
    try {
        sendOrderToWhatsApp(formData);
        
        // Show success message
        showNotification('✅ Order details sent to WhatsApp! Please check your WhatsApp.', 'success');
        
        // Reset form after a short delay
        setTimeout(() => {
            const form = document.getElementById('orderForm');
            if (form) {
                form.reset();
            }
            
            currentStep = 1;
            showStep(1);
            updateProgress();
            
            // Reset floating labels
            document.querySelectorAll('.form-group label').forEach(label => {
                label.style.top = '1.5rem';
                label.style.fontSize = '1.6rem';
                label.style.color = 'rgba(255, 255, 255, 0.5)';
            });
        }, 2000);
        
    } catch (error) {
        console.error('Error sending order to WhatsApp:', error);
        showNotification('Error sending order. Please try again.', 'error');
    } finally {
        // Hide loading state
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
}

function collectFormData() {
    const form = document.getElementById('orderForm');
    const data = {
        name: document.getElementById('orderName').value.trim(),
        email: document.getElementById('orderEmail').value.trim(),
        phone: document.getElementById('orderPhone').value.trim(),
        whatsapp: document.getElementById('orderWhatsApp').value.trim() || null,
        projectType: document.getElementById('orderType').value,
        projectTitle: document.getElementById('orderTitle').value.trim(),
        description: document.getElementById('orderDescription').value.trim(),
        requirements: document.getElementById('orderRequirements').value.trim() || null,
        budget: document.getElementById('orderBudget').value,
        deadline: document.getElementById('orderDeadline').value || null,
        notes: document.getElementById('orderNotes').value.trim() || null,
        paymentMethod: form.querySelector('input[name="paymentMethod"]:checked')?.value || 'discuss'
    };

    return data;
}

// Format order data for WhatsApp message
function formatOrderForWhatsApp(orderData) {
    const projectTypeLabels = {
        'web-development': 'Web Development',
        'mobile-app': 'Mobile App Development',
        'ui-ux-design': 'UI/UX Design',
        'graphic-design': 'Graphic Design',
        'full-stack': 'Full Stack Project',
        'other': 'Other'
    };

    const budgetLabels = {
        'under-5k': 'Under ৳5,000',
        '5k-10k': '৳5,000 - ৳10,000',
        '10k-25k': '৳10,000 - ৳25,000',
        '25k-50k': '৳25,000 - ৳50,000',
        '50k-100k': '৳50,000 - ৳100,000',
        'above-100k': 'Above ৳100,000',
        'discuss': "Let's Discuss"
    };

    const paymentLabels = {
        'bkash': 'Bkash',
        'nagad': 'Nagad',
        'bank': 'Bank Transfer',
        'discuss': 'Discuss Later'
    };

    let message = `🆕 *নতুন অর্ডার!*\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `👤 *গ্রাহকের তথ্য:*\n`;
    message += `• নাম: ${orderData.name}\n`;
    message += `• ইমেইল: ${orderData.email}\n`;
    message += `• ফোন: ${orderData.phone}\n`;
    if (orderData.whatsapp) {
        message += `• WhatsApp: ${orderData.whatsapp}\n`;
    }
    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📋 *প্রজেক্টের বিবরণ:*\n`;
    message += `• প্রজেক্ট টাইপ: ${projectTypeLabels[orderData.projectType] || orderData.projectType}\n`;
    message += `• প্রজেক্ট টাইটেল: ${orderData.projectTitle}\n`;
    message += `• বিবরণ:\n${orderData.description}\n`;
    if (orderData.requirements) {
        message += `\n• বিশেষ প্রয়োজনীয়তা:\n${orderData.requirements}\n`;
    }
    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *বাজেট ও সময়সীমা:*\n`;
    message += `• বাজেট: ${budgetLabels[orderData.budget] || orderData.budget}\n`;
    if (orderData.deadline) {
        const deadlineDate = new Date(orderData.deadline).toLocaleDateString('en-BD');
        message += `• শেষ তারিখ: ${deadlineDate}\n`;
    }
    message += `• পেমেন্ট পদ্ধতি: ${paymentLabels[orderData.paymentMethod] || orderData.paymentMethod}\n`;
    if (orderData.notes) {
        message += `\n• অতিরিক্ত নোট:\n${orderData.notes}\n`;
    }
    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📅 তারিখ: ${new Date().toLocaleString('en-BD', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}\n`;

    return encodeURIComponent(message);
}

// Send order to WhatsApp
function sendOrderToWhatsApp(orderData) {
    const message = formatOrderForWhatsApp(orderData);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    // Open WhatsApp in a new window/tab
    window.open(whatsappUrl, '_blank');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('orderNotification');
    if (!notification) return;

    // Support HTML messages
    if (message.includes('<br>') || message.includes('<strong>')) {
        notification.innerHTML = message;
    } else {
        notification.textContent = message;
    }
    
    notification.className = `notification ${type} show`;
    
    // Scroll to notification if it's an error
    if (type === 'error') {
        notification.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Show notification timeout
    const timeout = type === 'error' ? 5000 : 5000;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, timeout);
}

// Make functions globally available
window.nextStep = nextStep;
window.prevStep = prevStep;
