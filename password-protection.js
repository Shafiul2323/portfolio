// ============================================
// PASSWORD PROTECTION SYSTEM
// Password: 1234 (encoded to hide in code)
// ============================================

// Simple encoding to hide password (not secure, just to hide from plain view)
function getPassword() {
    // Base64 encoded: MTIzNA== (which is "1234")
    const encoded = 'MTIzNA==';
    try {
        return atob(encoded);
    } catch {
        // Fallback if atob not available
        return String.fromCharCode(49, 50, 51, 52);
    }
}

// Password verification
function verifyPassword(input) {
    return input === getPassword();
}

// Store pending action
let pendingAction = null;
let pendingActionArgs = [];

// Show password prompt modal
function showPasswordPrompt(actionCallback, actionType = 'perform this action') {
    // Store the callback and args
    pendingAction = actionCallback;
    pendingActionArgs = Array.from(arguments).slice(2); // Get all args after callback and actionType
    
    // Remove existing modal if any
    const existing = document.getElementById('passwordProtectionModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'passwordProtectionModal';
    modal.className = 'password-modal';
    modal.innerHTML = `
        <div class="password-modal-content">
            <div class="password-modal-header">
                <h3><i class='bx bx-lock-alt'></i> Password Required</h3>
                <button class="password-modal-close" onclick="closePasswordModal()">
                    <i class='bx bx-x'></i>
                </button>
            </div>
            <div class="password-modal-body">
                <p>Please enter the password to ${actionType}</p>
                <div class="password-input-group">
                    <input type="password" id="passwordInput" placeholder="Enter password" autofocus>
                    <i class='bx bx-lock-alt password-icon'></i>
                </div>
                <div id="passwordError" class="password-error" style="display: none;">
                    <i class='bx bx-error-circle'></i> Incorrect password. Please try again.
                </div>
            </div>
            <div class="password-modal-footer">
                <button class="btn btn-secondary" onclick="closePasswordModal()">Cancel</button>
                <button class="btn btn-primary" onclick="submitPassword()">
                    <i class='bx bx-check'></i> Verify
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Focus input
    setTimeout(() => {
        const input = document.getElementById('passwordInput');
        if (input) input.focus();
    }, 100);
    
    // Enter key to submit
    const input = document.getElementById('passwordInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitPassword();
            }
        });
    }
}

// Close password modal
function closePasswordModal() {
    const modal = document.getElementById('passwordProtectionModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
            pendingAction = null;
            pendingActionArgs = [];
        }, 300);
    }
}

// Submit password
function submitPassword() {
    const input = document.getElementById('passwordInput');
    const errorDiv = document.getElementById('passwordError');
    
    if (!input) return;
    
    const password = input.value.trim();
    
    if (!password) {
        if (errorDiv) {
            errorDiv.textContent = 'Please enter a password';
            errorDiv.style.display = 'block';
        }
        input.focus();
        return;
    }
    
    if (verifyPassword(password)) {
        // Correct password
        closePasswordModal();
        
        // Execute the pending action
        if (pendingAction) {
            if (typeof pendingAction === 'function') {
                pendingAction.apply(null, pendingActionArgs);
            }
            pendingAction = null;
            pendingActionArgs = [];
        }
    } else {
        // Wrong password
        if (errorDiv) {
            errorDiv.style.display = 'block';
        }
        input.value = '';
        input.focus();
        // Shake animation
        input.style.animation = 'shake 0.5s';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }
}

// Wrapper function to protect any action
function protectAction(actionCallback, actionType = 'perform this action') {
    return function(...args) {
        showPasswordPrompt(actionCallback, actionType, ...args);
    };
}

// Make functions globally available
window.showPasswordPrompt = showPasswordPrompt;
window.closePasswordModal = closePasswordModal;
window.submitPassword = submitPassword;
window.protectAction = protectAction;
window.verifyPassword = verifyPassword;

