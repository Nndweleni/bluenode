/**
 * Bluenode Onboarding Form - Multi-Step Form Logic
 * Handles form state, navigation, validation, and submission
 */

// ===== FORM STATE MANAGEMENT =====
const FormState = {
    currentStep: 1,
    totalSteps: 9,
    formData: {},
    packageInfo: {
        package: '',
        type: '',
        maxPages: 3
    },

    init: function() {
        this.loadPackageFromURL();
        this.loadFromSessionStorage();
    },

    save: function() {
        sessionStorage.setItem('onboardingFormData', JSON.stringify(this.formData));
        sessionStorage.setItem('onboardingCurrentStep', this.currentStep.toString());
        showAutosaveIndicator();
    },

    loadFromSessionStorage: function() {
        const savedData = sessionStorage.getItem('onboardingFormData');
        const savedStep = sessionStorage.getItem('onboardingCurrentStep');
        if (savedData) {
            this.formData = JSON.parse(savedData);
        }
        if (savedStep) {
            this.currentStep = parseInt(savedStep);
        }
    },

    clear: function() {
        sessionStorage.removeItem('onboardingFormData');
        sessionStorage.removeItem('onboardingCurrentStep');
        this.formData = {};
        this.currentStep = 1;
    },

    loadPackageFromURL: function() {
        const urlParams = new URLSearchParams(window.location.search);

        this.packageInfo.package = urlParams.get('package') || 'basic-website';
        this.packageInfo.type = urlParams.get('type') || 'website-only';
        const pagesParam = urlParams.get('pages');
        this.packageInfo.maxPages = pagesParam ? parseInt(pagesParam) : 3;

        // Pre-fill package in form
        const packageInput = document.getElementById('selectedPackage');
        const packageTypeInput = document.getElementById('packageType');
        if (packageInput) {
            packageInput.value = getPackageDisplayName(this.packageInfo.package);
        }
        if (packageTypeInput) {
            packageTypeInput.value = this.packageInfo.type;
        }

        // Update hero subtitle
        updatePageHeader(this.packageInfo.package);

        // Update max pages display
        const maxPagesDisplay = document.getElementById('maxPagesDisplay');
        if (maxPagesDisplay) {
            maxPagesDisplay.textContent = this.packageInfo.maxPages;
        }
    }
};

// ===== PACKAGE DISPLAY NAMES =====
function getPackageDisplayName(packageKey) {
    const displayNames = {
        'basic-website': 'Basic Website',
        'standard-website': 'Standard Website',
        'hosting-only': 'Starter Online Bundle (Hosting Only)',
        'starter-bundle': 'Starter Website + Hosting',
        'email-setup': 'Email Setup',
        'custom': 'Custom Package'
    };
    return displayNames[packageKey] || 'Website Package';
}

function updatePageHeader(packageKey) {
    const packageDisplayName = document.getElementById('packageDisplayName');
    if (packageDisplayName) {
        packageDisplayName.textContent = getPackageDisplayName(packageKey);
    }
}

// ===== STEP NAVIGATION =====
function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(function(step) {
        step.classList.remove('active');
    });

    // Show current step
    const currentStep = document.querySelector('.form-step[data-step="' + stepNumber + '"]');
    if (currentStep) {
        // Check if this is a conditional step
        if (currentStep.dataset.condition) {
            if (!checkCondition(currentStep.dataset.condition)) {
                // Skip this step - find next/previous visible step
                const visibleSteps = getVisibleSteps();
                if (stepNumber > FormState.currentStep) {
                    const nextStep = getNextVisibleStep(stepNumber);
                    if (nextStep !== stepNumber) {
                        showStep(nextStep);
                    }
                } else {
                    const prevStep = getPreviousVisibleStep(stepNumber);
                    if (prevStep !== stepNumber) {
                        showStep(prevStep);
                    }
                }
                return;
            }
        }

        currentStep.classList.add('active');

        // Focus management for accessibility
        // Focus on the step heading for screen readers
        const stepHeading = currentStep.querySelector('h2');
        if (stepHeading) {
            stepHeading.setAttribute('tabindex', '-1');
            stepHeading.focus();
        }
    }

    // Update progress sidebar (show/hide steps based on package)
    updateProgressSidebar();

    // Update progress indicator
    updateProgressIndicator(stepNumber);

    // Update button visibility
    updateNavigationButtons(stepNumber);

    // Update domain/hosting step sections
    if (stepNumber === 6) {
        updateDomainHostingStep();
    }

    // Generate summary when reaching step 9
    if (stepNumber === 9) {
        generateSummary();
    }

    // Scroll to form container (not the very top)
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        const offsetTop = formContainer.getBoundingClientRect().top + window.pageYOffset - 80; // 80px offset for navbar
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }

    FormState.currentStep = stepNumber;
    FormState.save();
}

function nextStep() {
    // Validate current step
    if (!validateCurrentStep()) {
        return;
    }

    // Capture current step data
    captureStepData(FormState.currentStep);

    // Move to next visible step
    const nextVisibleStep = getNextVisibleStep(FormState.currentStep);
    if (nextVisibleStep !== FormState.currentStep) {
        showStep(nextVisibleStep);
    }
}

function previousStep() {
    // Move to previous visible step
    const prevVisibleStep = getPreviousVisibleStep(FormState.currentStep);
    if (prevVisibleStep !== FormState.currentStep) {
        showStep(prevVisibleStep);
    }
}

function updateNavigationButtons(stepNumber) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const visibleSteps = getVisibleSteps();

    // Check if this is the first visible step
    const isFirstStep = visibleSteps[0] === stepNumber;
    // Check if this is the last visible step
    const isLastStep = visibleSteps[visibleSteps.length - 1] === stepNumber;

    // Hide previous on first step
    prevBtn.style.display = isFirstStep ? 'none' : 'flex';

    // Show submit on last step, next on others
    if (isLastStep) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
    } else {
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }
}

function updateProgressIndicator(stepNumber) {
    const visibleSteps = getVisibleSteps();
    const currentVisibleIndex = visibleSteps.indexOf(stepNumber);

    document.querySelectorAll('.progress-step').forEach(function(step) {
        const dataStep = parseInt(step.dataset.step);
        const visibleIndex = visibleSteps.indexOf(dataStep);

        // Skip if this step is not visible
        if (visibleIndex === -1) return;

        step.classList.remove('active', 'completed');

        if (dataStep === stepNumber) {
            step.classList.add('active');
            // Show the current step number
            const numberEl = step.querySelector('.progress-step-number');
            if (numberEl) {
                numberEl.textContent = visibleIndex + 1;
            }
        } else if (visibleIndex < currentVisibleIndex) {
            step.classList.add('completed');
            // Add checkmark icon
            const numberEl = step.querySelector('.progress-step-number');
            if (numberEl) {
                numberEl.textContent = '✓';
            }
        } else {
            // Reset number to sequential
            const numberEl = step.querySelector('.progress-step-number');
            if (numberEl) {
                numberEl.textContent = visibleIndex + 1;
            }
        }
    });
}

// ===== DATA CAPTURE =====
function captureStepData(stepNumber) {
    const stepEl = document.querySelector('.form-step[data-step="' + stepNumber + '"]');
    if (!stepEl) return;

    // Capture all form inputs in this step
    const inputs = stepEl.querySelectorAll('input, textarea, select');
    inputs.forEach(function(input) {
        const name = input.name || input.id;
        if (!name) return;

        if (input.type === 'checkbox') {
            FormState.formData[name] = input.checked;
        } else if (input.type === 'radio') {
            if (input.checked) {
                FormState.formData[name] = input.value;
            }
        } else if (input.type === 'file') {
            if (input.files && input.files[0]) {
                FormState.formData[name] = input.files[0];
            }
        } else {
            FormState.formData[name] = input.value;
        }
    });

    FormState.save();
}

// ===== VALIDATION =====
const ValidationRules = {
    email: function(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    phone: function(value) {
        return /^[\d\s\+\-\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10;
    },
    required: function(value) {
        return value && value.trim().length > 0;
    },
    domain: function(value) {
        if (!value) return true;
        // Match domain format: letters, numbers, hyphens, with valid TLD
        // Examples: example.com, my-site.co.za, business.org
        return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(value.trim());
    },
    emailName: function(value) {
        if (!value) return true;
        // Email prefix: letters, numbers, dots, hyphens, underscores
        // Examples: info, hello, support.team, john_doe
        return /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/.test(value.trim());
    },
    fileSize: function(file, maxMB) {
        if (!file) return true;
        return file.size <= maxMB * 1024 * 1024;
    },
    fileType: function(file, types) {
        if (!file) return true;
        return types.some(function(type) {
            return file.name.toLowerCase().endsWith(type);
        });
    },
    fileMimeType: function(file, mimeTypes) {
        if (!file) return true;
        return mimeTypes.includes(file.type);
    }
};

// Allowed MIME types for logo upload
const ALLOWED_MIME_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/svg+xml'
];

function validateCurrentStep() {
    const stepEl = document.querySelector('.form-step[data-step="' + FormState.currentStep + '"]');
    if (!stepEl) return true;

    let isValid = true;

    // Clear all previous errors
    stepEl.querySelectorAll('.form-error').forEach(function(errorEl) {
        errorEl.classList.remove('visible');
    });
    stepEl.querySelectorAll('.form-input, .form-textarea').forEach(function(input) {
        input.classList.remove('error');
    });

    // Validate required inputs
    const requiredInputs = stepEl.querySelectorAll('[required]');

    requiredInputs.forEach(function(input) {
        const errorEl = document.getElementById(input.id + '-error');
        let error = null;

        if (input.type === 'radio') {
            // Check if any radio in the group is checked
            const radioGroup = stepEl.querySelectorAll('input[name="' + input.name + '"]');
            const isChecked = Array.from(radioGroup).some(function(radio) {
                return radio.checked;
            });
            if (!isChecked) {
                error = 'Please select an option';
                if (errorEl) {
                    isValid = false;
                    errorEl.textContent = error;
                    errorEl.classList.add('visible');
                }
                return;
            }
        } else if (input.type === 'checkbox') {
            if (!input.checked) {
                error = 'This field is required';
            }
        } else if (input.hasAttribute('required') && !ValidationRules.required(input.value)) {
            error = 'This field is required';
        } else if (input.type === 'email' && input.value && !ValidationRules.email(input.value)) {
            error = 'Please enter a valid email address';
        } else if (input.type === 'tel' && input.value && !ValidationRules.phone(input.value)) {
            error = 'Please enter a valid phone number';
        }

        if (error) {
            isValid = false;
            input.classList.add('error');
            if (errorEl) {
                errorEl.textContent = error;
                errorEl.classList.add('visible');
            }
        }
    });

    // File upload validation
    const fileInput = document.getElementById('logoUpload');
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const errorEl = document.getElementById('logoUpload-error');
        let error = null;

        if (!ValidationRules.fileSize(file, 5)) {
            error = 'File size must be less than 5MB';
        } else if (!ValidationRules.fileType(file, ['.png', '.jpg', '.jpeg', '.svg'])) {
            error = 'Only PNG, JPG, and SVG files are allowed';
        } else if (!ValidationRules.fileMimeType(file, ALLOWED_MIME_TYPES)) {
            error = 'Invalid file type. Please upload a valid image file.';
        }

        if (error && errorEl) {
            isValid = false;
            errorEl.textContent = error;
            errorEl.classList.add('visible');
        }
    }

    // Domain validation for Step 6
    if (FormState.currentStep === 6) {
        const domainInputs = ['domainName', 'clientDomainName', 'emailDomain', 'preferredDomain', 'hostingDomainName'];
        domainInputs.forEach(function(inputId) {
            const input = document.getElementById(inputId);
            if (input && input.value && input.offsetParent !== null) { // Check if visible
                const errorEl = document.getElementById(inputId + '-error');
                if (!ValidationRules.domain(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                    if (errorEl) {
                        errorEl.textContent = 'Please enter a valid domain (e.g., example.co.za)';
                        errorEl.classList.add('visible');
                    }
                }
            }
        });
    }

    // Email name validation for Step 7
    if (FormState.currentStep === 7) {
        const emailNameInputs = stepEl.querySelectorAll('input[name^="emailName"]');
        emailNameInputs.forEach(function(input) {
            if (input.value) {
                const errorEl = document.getElementById(input.id + '-error');
                if (!ValidationRules.emailName(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                    if (errorEl) {
                        errorEl.textContent = 'Invalid email name. Use only letters, numbers, dots, hyphens, or underscores.';
                        errorEl.classList.add('visible');
                    }
                }
            }
        });
    }

    // Page count validation
    const pageCountInput = document.getElementById('numberOfPages');
    if (pageCountInput && pageCountInput.value) {
        const errorEl = document.getElementById('numberOfPages-error');
        const pageCount = parseInt(pageCountInput.value);
        const maxPages = FormState.packageInfo.maxPages;

        if (pageCount > maxPages) {
            isValid = false;
            pageCountInput.classList.add('error');
            if (errorEl) {
                errorEl.textContent = 'Your package allows up to ' + maxPages + ' pages';
                errorEl.classList.add('visible');
            }
        }
    }

    // Step 8: All checkboxes must be checked
    if (FormState.currentStep === 8) {
        const checkboxes = stepEl.querySelectorAll('input[type="checkbox"][required]');
        checkboxes.forEach(function(cb) {
            if (!cb.checked) {
                isValid = false;
                cb.closest('.checkbox-option').style.borderColor = 'var(--color-error)';
            } else {
                cb.closest('.checkbox-option').style.borderColor = '';
            }
        });

        if (!isValid) {
            const errorEl = document.getElementById('terms-error');
            if (errorEl) {
                errorEl.textContent = 'You must accept all terms to continue';
                errorEl.classList.add('visible');
            }
        }
    }

    return isValid;
}

// ===== INLINE VALIDATION (UX Enhancement) =====
/**
 * Validate a single field inline (on blur or real-time)
 * Research: Reduces form errors by 18% (Nielsen Norman Group)
 */
function validateFieldInline(input) {
    const errorEl = document.getElementById(input.id + '-error');
    let error = null;

    // Skip if field is empty and not required (allow optional fields)
    if (!input.hasAttribute('required') && !input.value.trim()) {
        clearFieldError(input);
        return true;
    }

    // Required field check
    if (input.hasAttribute('required') && !ValidationRules.required(input.value)) {
        error = 'This field is required';
    }
    // Email validation
    else if (input.type === 'email' && input.value && !ValidationRules.email(input.value)) {
        error = 'Please enter a valid email address (e.g., you@example.com)';
    }
    // Phone validation
    else if (input.type === 'tel' && input.value && !ValidationRules.phone(input.value)) {
        error = 'Please enter a valid phone number (at least 10 digits)';
    }
    // Domain validation
    else if (input.classList.contains('domain-input') && input.value && !ValidationRules.domain(input.value)) {
        error = 'Please enter a valid domain (e.g., example.co.za)';
    }
    // Email name validation (for mailbox prefixes)
    else if (input.classList.contains('email-name-input') && input.value && !ValidationRules.emailName(input.value)) {
        error = 'Only letters, numbers, dots, hyphens, and underscores allowed';
    }

    if (error) {
        showFieldError(input, error);
        return false;
    } else {
        showFieldSuccess(input);
        return true;
    }
}

/**
 * Show error state for a field
 * WCAG 2.1 AA compliant: icon + color + text
 */
function showFieldError(input, message) {
    const errorEl = document.getElementById(input.id + '-error');

    input.classList.remove('success');
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');

    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
        errorEl.setAttribute('role', 'alert'); // Announce to screen readers
    }
}

/**
 * Clear error state for a field
 */
function clearFieldError(input) {
    const errorEl = document.getElementById(input.id + '-error');

    input.classList.remove('error');
    input.classList.remove('success');
    input.setAttribute('aria-invalid', 'false');

    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    }
}

/**
 * Show success state for a field
 * Research: Success feedback reduces completion time by 11% (Luke Wroblewski)
 */
function showFieldSuccess(input) {
    // Only show success for filled valid fields
    if (input.value && input.value.trim()) {
        input.classList.remove('error');
        input.classList.add('success');
        input.setAttribute('aria-invalid', 'false');

        const errorEl = document.getElementById(input.id + '-error');
        if (errorEl) {
            errorEl.classList.remove('visible');
        }
    }
}

/**
 * Initialize inline validation for all form inputs
 * Applies blur validation for better UX
 */
function initInlineValidation() {
    // Get all form inputs that should have inline validation
    const inputs = document.querySelectorAll('input[type="email"], input[type="tel"], input.domain-input, input.email-name-input, input[type="text"][required]');

    inputs.forEach((input) => {
        // Blur validation - validate when user leaves field
        input.addEventListener('blur', () => {
            if (input.value) { // Only validate if field has content
                validateFieldInline(input);
            }
        });

        // Clear error when user starts typing (gives them a chance to correct)
        input.addEventListener('focus', () => {
            if (input.classList.contains('error')) {
                const errorEl = document.getElementById(input.id + '-error');
                if (errorEl) {
                    errorEl.classList.remove('visible');
                }
            }
        });
    });

    // Real-time validation for domain fields (debounced)
    const domainInputs = document.querySelectorAll('.domain-input');
    domainInputs.forEach((input) => {
        let timeout;
        input.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (input.value.length >= 3) {
                    validateFieldInline(input);
                }
            }, 500); // 500ms debounce
        });
    });
}

// ===== CONDITIONAL LOGIC =====

/**
 * Get the list of visible steps based on package type
 * @returns {number[]} Array of step numbers that should be visible
 */
function getVisibleSteps() {
    const pkg = FormState.packageInfo.package;
    const packageType = FormState.packageInfo.type;

    // Business Email Hosting only: Steps 1, 2, 7, 8, 9
    // Skips website steps (3,4,5) and domain/hosting step (6) since email setup handles domain
    if (pkg === 'email-setup' || packageType === 'email-only') {
        return [1, 2, 7, 8, 9];
    }

    // Hosting without website: Steps 1, 2, 6, 7, 8, 9
    // Includes domain/hosting step and email setup option
    if (pkg === 'hosting-only') {
        return [1, 2, 6, 7, 8, 9];
    }

    // Website development only OR Website + Hosting: All steps (1-9)
    // Full flow includes all website steps, domain/hosting, and email setup
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
}

/**
 * Update the progress sidebar to show only relevant steps
 */
function updateProgressSidebar() {
    const visibleSteps = getVisibleSteps();
    const progressSteps = document.querySelectorAll('.progress-step');

    progressSteps.forEach(function(stepEl) {
        const stepNum = parseInt(stepEl.dataset.step);
        const isVisible = visibleSteps.includes(stepNum);

        if (isVisible) {
            stepEl.style.display = '';
            // Update the displayed number to be sequential
            const displayIndex = visibleSteps.indexOf(stepNum) + 1;
            const numberEl = stepEl.querySelector('.progress-step-number');
            if (numberEl && !stepEl.classList.contains('completed')) {
                numberEl.textContent = displayIndex;
            }
        } else {
            stepEl.style.display = 'none';
        }
    });

    // Update total steps in FormState for proper navigation
    FormState.totalSteps = 9; // Keep internal tracking at 9
}

/**
 * Get the next visible step from current position
 * @param {number} currentStep - Current step number
 * @returns {number} Next visible step number
 */
function getNextVisibleStep(currentStep) {
    const visibleSteps = getVisibleSteps();
    const currentIndex = visibleSteps.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex === visibleSteps.length - 1) {
        return currentStep;
    }
    return visibleSteps[currentIndex + 1];
}

/**
 * Get the previous visible step from current position
 * @param {number} currentStep - Current step number
 * @returns {number} Previous visible step number
 */
function getPreviousVisibleStep(currentStep) {
    const visibleSteps = getVisibleSteps();
    const currentIndex = visibleSteps.indexOf(currentStep);
    if (currentIndex <= 0) {
        return currentStep;
    }
    return visibleSteps[currentIndex - 1];
}

/**
 * Check if a condition is met for showing a step
 * @param {string} conditionName - Name of the condition to check
 * @returns {boolean} Whether the condition is met
 */
function checkCondition(conditionName) {
    const pkg = FormState.packageInfo.package;
    const packageType = FormState.packageInfo.type;

    switch (conditionName) {
        case 'emailSetup':
            // Step 7 visibility is now determined by getVisibleSteps(), not this condition
            // Return true to allow the step to show when it's in the visible steps array
            return true;
        case 'requiresWebsite':
            return !['email-setup', 'hosting-only'].includes(pkg) && packageType !== 'email-only';
        default:
            return true;
    }
}

function updateDomainHostingStep() {
    const websiteHostingSection = document.getElementById('websiteHostingSection');
    const websiteOnlySection = document.getElementById('websiteOnlySection');
    const emailOnlySection = document.getElementById('emailOnlySection');
    const hostingOnlySection = document.getElementById('hostingOnlySection');

    const pkg = FormState.packageInfo.package;
    const packageType = FormState.packageInfo.type;

    // Hide all sections first
    if (websiteHostingSection) websiteHostingSection.style.display = 'none';
    if (websiteOnlySection) websiteOnlySection.style.display = 'none';
    if (emailOnlySection) emailOnlySection.style.display = 'none';
    if (hostingOnlySection) hostingOnlySection.style.display = 'none';

    // Show the appropriate section based on package
    if (pkg === 'email-setup') {
        // Email-only package: show simplified domain section
        if (emailOnlySection) emailOnlySection.style.display = 'block';
    } else if (pkg === 'hosting-only') {
        // Hosting-only package: show hosting domain section
        if (hostingOnlySection) hostingOnlySection.style.display = 'block';
    } else if (packageType === 'website-hosting' || packageType === 'starter-bundle') {
        // Website + Hosting packages
        if (websiteHostingSection) websiteHostingSection.style.display = 'block';
    } else if (packageType === 'website-only') {
        // Website only (client has own hosting)
        if (websiteOnlySection) websiteOnlySection.style.display = 'block';
    } else {
        // Custom or fallback: show website hosting section
        if (websiteHostingSection) websiteHostingSection.style.display = 'block';
    }
}

/**
 * Handle hasDomain radio button changes for email-only package
 */
function updateEmailDomainFields() {
    const hasDomainYes = document.querySelector('input[name="hasDomain"][value="yes"]');
    const hasDomainNo = document.querySelector('input[name="hasDomain"][value="no"]');
    const existingDomainGroup = document.getElementById('existingDomainGroup');
    const newDomainGroup = document.getElementById('newDomainGroup');

    if (!existingDomainGroup || !newDomainGroup) return;

    if (hasDomainYes && hasDomainYes.checked) {
        existingDomainGroup.style.display = 'block';
        newDomainGroup.style.display = 'none';
    } else if (hasDomainNo && hasDomainNo.checked) {
        existingDomainGroup.style.display = 'none';
        newDomainGroup.style.display = 'block';
    } else {
        existingDomainGroup.style.display = 'none';
        newDomainGroup.style.display = 'none';
    }
}

function updateEmailInputs() {
    const count = parseInt(document.getElementById('numberOfMailboxes').value) || 1;
    const container = document.getElementById('emailNamesContainer');

    // Clear existing inputs
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = 'form-group';

        const domainName = FormState.formData.domainName || FormState.formData.clientDomainName || 'yourdomain.com';

        div.innerHTML = `<label class="form-label required">Email ${i} Name</label>
            <input type="text" class="form-input" name="emailName${i}" id="emailName${i}" placeholder="e.g., info, hello, support" required>
            <div class="form-helper">@${domainName}</div>
            <div id="emailName${i}-error" class="form-error"></div>`;
        container.appendChild(div);
    }
}

// ===== FILE UPLOAD HANDLING =====
function initFileUpload() {
    const uploadArea = document.getElementById('logoUploadArea');
    const fileInput = document.getElementById('logoUpload');
    const preview = document.getElementById('logoPreview');
    const removeBtn = document.getElementById('logoRemove');

    if (!uploadArea || !fileInput) return;

    // Click to upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            showFilePreview(files[0]);
        }
    });

    // File selected
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            showFilePreview(e.target.files[0]);
        }
    });

    // Remove file
    if (removeBtn) {
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            fileInput.value = '';
            preview.classList.remove('visible');
        });
    }
}

function showFilePreview(file) {
    const preview = document.getElementById('logoPreview');
    const fileName = preview.querySelector('.file-name');
    const fileSize = preview.querySelector('.file-size');

    if (fileName) {
        fileName.textContent = file.name;
    }
    if (fileSize) {
        fileSize.textContent = (file.size / 1024).toFixed(1) + ' KB';
    }
    preview.classList.add('visible');
}

// ===== SUMMARY GENERATION (Step 9) =====

/**
 * Escape HTML entities to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML
 */
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function generateSummary() {
    const container = document.getElementById('summaryContainer');
    if (!container) return;

    // Clear existing content safely
    container.textContent = '';

    const sections = [
        {
            title: 'Client Details',
            step: 1,
            fields: [
                { label: 'Name', value: FormState.formData.fullName || 'Not provided' },
                { label: 'Business', value: FormState.formData.businessName || 'N/A' },
                { label: 'Email', value: FormState.formData.email || 'Not provided' },
                { label: 'Phone', value: FormState.formData.phone || 'Not provided' }
            ]
        },
        {
            title: 'Package & Services',
            step: 2,
            fields: [
                { label: 'Package', value: getPackageDisplayName(FormState.packageInfo.package) },
                { label: 'Email Setup', value: FormState.formData.emailSetup ? 'Yes' : 'No' },
                { label: 'Additional Mailboxes', value: FormState.formData.additionalMailboxes ? 'Yes' : 'No' },
                { label: 'Website Maintenance', value: FormState.formData.addonMaintenance ? 'Yes (R400/mo)' : 'No' },
                { label: 'DNS Management', value: FormState.formData.addonDNS ? 'Yes (R100/mo)' : 'No' },
                { label: 'SEO Starter Boost', value: FormState.formData.addonSEO ? 'Yes (R500)' : 'No' },
                { label: 'WhatsApp Button', value: FormState.formData.addonWhatsApp ? 'Yes (R150)' : 'No' },
                { label: 'Priority Support', value: FormState.formData.addonPrioritySupport ? 'Yes (R150/mo)' : 'No' }
            ]
        },
        {
            title: 'Website Information',
            step: 3,
            fields: [
                { label: 'Website Type', value: FormState.formData.websiteType || 'Not specified' },
                { label: 'Primary Goal', value: FormState.formData.primaryGoal || 'Not specified' },
                { label: 'Number of Pages', value: FormState.formData.numberOfPages || 'Not specified' }
            ]
        },
        {
            title: 'Design Preferences',
            step: 4,
            fields: [
                { label: 'Color Preference', value: FormState.formData.colorPreference || 'Not specified' },
                { label: 'Style', value: FormState.formData.stylePreference || 'Not specified' }
            ]
        }
    ];

    // Build summary using safe DOM methods (prevents XSS)
    sections.forEach(function(section) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'summary-section';

        const heading = document.createElement('h3');
        heading.textContent = section.title + ' ';

        const editLink = document.createElement('a');
        editLink.href = '#';
        editLink.className = 'summary-edit';
        editLink.dataset.step = section.step;
        editLink.textContent = 'Edit';
        editLink.addEventListener('click', function(e) {
            e.preventDefault();
            showStep(section.step);
        });

        heading.appendChild(editLink);
        sectionDiv.appendChild(heading);

        section.fields.forEach(function(field) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'summary-item';

            const labelSpan = document.createElement('span');
            labelSpan.className = 'summary-label';
            labelSpan.textContent = field.label + ':';

            const valueSpan = document.createElement('span');
            valueSpan.className = 'summary-value';
            valueSpan.textContent = field.value; // Safe: textContent escapes HTML

            itemDiv.appendChild(labelSpan);
            itemDiv.appendChild(valueSpan);
            sectionDiv.appendChild(itemDiv);
        });

        container.appendChild(sectionDiv);
    });
}

// ===== FORM SUBMISSION =====
let isSubmitting = false;

/**
 * Show progressive loading messages (UX enhancement)
 * Research: Reduces perceived wait time by 20-30% (NN/g)
 */
function showProgressiveLoading() {
    const loadingSteps = [
        { text: 'Validating your information...', duration: 800 },
        { text: 'Preparing your application...', duration: 1200 },
        { text: 'Uploading files...', duration: 1500 },
        { text: 'Sending to server...', duration: 2000 },
        { text: 'Almost done...', duration: 1500 }
    ];

    const messageEl = document.querySelector('#loadingOverlay .loading-message');
    if (!messageEl) return;

    let currentStep = 0;

    function updateStep() {
        if (currentStep < loadingSteps.length) {
            messageEl.textContent = loadingSteps[currentStep].text;
            currentStep++;
            setTimeout(updateStep, loadingSteps[currentStep - 1].duration);
        }
    }

    // Start the progressive messages
    messageEl.textContent = loadingSteps[0].text;
    currentStep = 1;
    if (loadingSteps.length > 1) {
        setTimeout(updateStep, loadingSteps[0].duration);
    }
}

function submitForm(e) {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) {
        return;
    }

    // Final validation
    if (!validateCurrentStep()) {
        return;
    }

    // Capture final step data
    captureStepData(FormState.currentStep);

    // Disable submit button and show loading state
    const submitBtn = document.getElementById('submitBtn');
    isSubmitting = true;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('submitting');
        // Clear button and add spinner
        submitBtn.textContent = '';
        const spinner = document.createElement('span');
        spinner.className = 'btn-spinner';
        submitBtn.appendChild(spinner);
        submitBtn.appendChild(document.createTextNode(' Submitting...'));
    }

    // Show loading overlay with progressive messages (UX enhancement)
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('visible');
    showProgressiveLoading();

    // Prepare FormData for submission
    const formData = new FormData();

    // Add all text data
    for (const key in FormState.formData) {
        const value = FormState.formData[key];
        if (value instanceof File) {
            formData.append(key, value);
        } else if (typeof value === 'boolean') {
            formData.append(key, value ? 'Yes' : 'No');
        } else if (value !== null && value !== undefined) {
            formData.append(key, value);
        }
    }

    // Add package info
    formData.append('package', FormState.packageInfo.package);
    formData.append('packageType', FormState.packageInfo.type);
    formData.append('packageDisplayName', getPackageDisplayName(FormState.packageInfo.package));

    // Add Web3Forms access key
    formData.append('access_key', '82ff91fe-c08c-431d-bb15-f186a9526d8c');

    // Add custom subject line for easier email identification
    formData.append('subject', 'New Client Onboarding: ' + getPackageDisplayName(FormState.packageInfo.package));

    // Add from name (client's name)
    formData.append('from_name', FormState.formData.fullName || 'BlueNode Client');

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(function() {
        controller.abort();
    }, 30000); // 30 second timeout

    // Submit to Web3Forms
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        },
        signal: controller.signal
    })
    .then(function(response) {
        clearTimeout(timeoutId);
        // Parse response body for error details
        return response.json().then(function(data) {
            if (response.ok) {
                // Capture client data BEFORE clearing form state
                const clientName = FormState.formData.fullName || 'valued client';
                const packageName = FormState.packageInfo.package;

                // Clear form state
                FormState.clear();

                // Redirect to thank you page
                window.location.href = 'thank-you.html?name=' + encodeURIComponent(clientName) + '&package=' + encodeURIComponent(packageName);
            } else {
                // Log the actual error from Web3Forms for debugging
                console.error('Web3Forms API Error:', data);
                throw new Error(data.message || 'Submission failed');
            }
        });
    })
    .catch(function(error) {
        clearTimeout(timeoutId);
        console.error('Submission error:', error);
        loadingOverlay.classList.remove('visible');

        // Reset submit button
        isSubmitting = false;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('submitting');
            submitBtn.textContent = 'Submit Application';
        }

        // Show user-friendly error message
        let errorMessage = 'There was an error submitting your form. Please try again or contact us directly at hello@bluenode.co.za';
        if (error.name === 'AbortError') {
            errorMessage = 'The request timed out. Please check your internet connection and try again.';
        } else if (!navigator.onLine) {
            errorMessage = 'You appear to be offline. Please check your internet connection and try again.';
        }
        alert(errorMessage);
    });
}

// ===== UTILITY: AUTOSAVE INDICATOR =====
let autosaveTimeout = null;

function showAutosaveIndicator() {
    const indicator = document.getElementById('autosaveIndicator');
    if (!indicator) return;

    // Clear any existing timeout
    if (autosaveTimeout) {
        clearTimeout(autosaveTimeout);
    }

    // Show the indicator
    indicator.classList.add('visible', 'saved');

    // Hide after 2 seconds
    autosaveTimeout = setTimeout(function() {
        indicator.classList.remove('visible');
    }, 2000);
}

// ===== UTILITY: DEBOUNCE =====
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form state
    FormState.init();

    // Show the current step
    showStep(FormState.currentStep);

    // Event listeners
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const onboardingForm = document.getElementById('onboardingForm');

    if (nextBtn) {
        nextBtn.addEventListener('click', nextStep);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', previousStep);
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', submitForm);
    }

    if (onboardingForm) {
        onboardingForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }

    // Dynamic updates
    const numberOfMailboxes = document.getElementById('numberOfMailboxes');
    if (numberOfMailboxes) {
        numberOfMailboxes.addEventListener('change', updateEmailInputs);
        // Initialize email inputs
        updateEmailInputs();
    }

    // Email setup checkbox listener
    const emailSetupCheckbox = document.getElementById('emailSetup');
    if (emailSetupCheckbox) {
        emailSetupCheckbox.addEventListener('change', function() {
            captureStepData(FormState.currentStep);
        });
    }

    // File upload
    initFileUpload();

    // Initialize inline validation (UX enhancement)
    initInlineValidation();

    // Conditional rendering for Step 6
    updateDomainHostingStep();

    // hasDomain radio button listeners for email-only package
    const hasDomainRadios = document.querySelectorAll('input[name="hasDomain"]');
    hasDomainRadios.forEach(function(radio) {
        radio.addEventListener('change', updateEmailDomainFields);
    });

    // Initialize progress sidebar based on package
    updateProgressSidebar();

    // Auto-save on input change (debounced)
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(function(input) {
        input.addEventListener('input', debounce(function() {
            captureStepData(FormState.currentStep);
        }, 500));
    });

    // Radio button selection styling
    const radioOptions = document.querySelectorAll('.radio-option');
    radioOptions.forEach(function(option) {
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
            radio.addEventListener('change', function() {
                // Remove selected class from all options in this group
                const groupName = radio.name;
                document.querySelectorAll('input[name="' + groupName + '"]').forEach(function(r) {
                    r.closest('.radio-option').classList.remove('selected');
                });
                // Add selected class to this option
                if (radio.checked) {
                    option.classList.add('selected');
                }
            });
        }
    });

    // Checkbox selection styling
    const checkboxOptions = document.querySelectorAll('.checkbox-option');
    checkboxOptions.forEach(function(option) {
        const checkbox = option.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                if (checkbox.checked) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
        }
    });

    // Warn before leaving with unsaved data
    window.addEventListener('beforeunload', function(e) {
        if (Object.keys(FormState.formData).length > 0 && FormState.currentStep > 1) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});
