// Contact form validation and handling for Seben Event Organizers

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous validation states
            const inputs = contactForm.querySelectorAll('.form-control');
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            
            let isValid = true;
            
            // Validate required fields
            const requiredFields = [
                { id: 'firstName', name: 'First Name' },
                { id: 'lastName', name: 'Last Name' },
                { id: 'email', name: 'Email' },
                { id: 'phone', name: 'Phone' },
                { id: 'eventType', name: 'Event Type' },
                { id: 'message', name: 'Message' }
            ];
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field.id);
                const value = input.value.trim();
                
                if (!value) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    // Additional validation for specific fields
                    if (field.id === 'email' && !window.SebenValidation.validateEmail(value)) {
                        input.classList.add('is-invalid');
                        isValid = false;
                    } else if (field.id === 'phone' && !window.SebenValidation.validatePhone(value)) {
                        input.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        input.classList.add('is-valid');
                    }
                }
            });
            
            // Validate optional fields if they have values
            const optionalFields = ['eventDate', 'guestCount', 'budget'];
            optionalFields.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (input.value.trim()) {
                    input.classList.add('is-valid');
                }
            });
            
            if (isValid) {
                // Show success message
                showSuccessMessage();
                
                // Reset form after successful submission
                setTimeout(() => {
                    contactForm.reset();
                    inputs.forEach(input => {
                        input.classList.remove('is-valid', 'is-invalid');
                    });
                }, 2000);
            } else {
                // Show error message
                showErrorMessage();
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    }
    
    function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        field.classList.remove('is-valid', 'is-invalid');
        
        if (isRequired && !value) {
            field.classList.add('is-invalid');
            return false;
        }
        
        // Specific field validation
        if (field.type === 'email' && value) {
            if (window.SebenValidation.validateEmail(value)) {
                field.classList.add('is-valid');
                return true;
            } else {
                field.classList.add('is-invalid');
                return false;
            }
        }
        
        if (field.type === 'tel' && value) {
            if (window.SebenValidation.validatePhone(value)) {
                field.classList.add('is-valid');
                return true;
            } else {
                field.classList.add('is-invalid');
                return false;
            }
        }
        
        if (value || !isRequired) {
            field.classList.add('is-valid');
            return true;
        }
        
        return true;
    }
    
    function showSuccessMessage() {
        // Remove any existing alerts
        removeAlerts();
        
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show mt-3';
        alert.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you within 24 hours.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        contactForm.insertAdjacentElement('afterend', alert);
        
        // Scroll to the alert
        alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function showErrorMessage() {
        // Remove any existing alerts
        removeAlerts();
        
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show mt-3';
        alert.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Oops!</strong> Please fill in all required fields correctly.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        contactForm.insertAdjacentElement('afterend', alert);
        
        // Scroll to the alert
        alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function removeAlerts() {
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            
            e.target.value = value;
        });
    }
    
    // Set minimum date to today for event date
    const eventDateInput = document.getElementById('eventDate');
    if (eventDateInput) {
        const today = new Date().toISOString().split('T')[0];
        eventDateInput.setAttribute('min', today);
    }
    
    // Character counter for message textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const maxLength = 500;
        
        // Create character counter
        const counter = document.createElement('div');
        counter.className = 'form-text text-end';
        counter.id = 'messageCounter';
        messageTextarea.parentNode.insertBefore(counter, messageTextarea.nextSibling);
        
        function updateCounter() {
            const remaining = maxLength - messageTextarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 50) {
                counter.classList.add('text-warning');
                counter.classList.remove('text-muted');
            } else {
                counter.classList.add('text-muted');
                counter.classList.remove('text-warning');
            }
        }
        
        messageTextarea.setAttribute('maxlength', maxLength);
        messageTextarea.addEventListener('input', updateCounter);
        updateCounter(); // Initialize counter
    }
    
    console.log('Contact form initialized successfully!');
});