document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrengthDiv = document.getElementById('passwordStrength');
    const passwordMatchDiv = document.getElementById('passwordMatch');
    const captchaImageDiv = document.getElementById('captchaImage');
    const captchaInput = document.getElementById('captcha');
    const storedCaptchaInput = document.getElementById('storedCaptcha');
    const form = document.getElementById('registrationForm');
    const usernameInput = document.getElementById('username');
    const usernameFeedbackDiv = document.createElement('div');
    usernameFeedbackDiv.className = 'username-feedback';
    usernameInput.parentElement.appendChild(usernameFeedbackDiv);

    // Dialog elements
    const messageDialog = document.getElementById('messageDialog');
    const dialogTitle = document.getElementById('dialogTitle');
    const dialogMessage = document.getElementById('dialogMessage');
    const dialogButton = document.getElementById('dialogButton');
    const closeDialog = document.querySelector('.close-dialog');

    // Show dialog function
    function showDialog(title, message, type = 'info') {
        dialogTitle.textContent = title;
        dialogMessage.textContent = message;
        messageDialog.classList.add('show');
        
        // Set dialog type (success, error, info)
        messageDialog.className = 'dialog show ' + type;
    }

    // Close dialog function
    function closeDialogBox() {
        messageDialog.classList.remove('show');
    }

    // Event listeners for dialog
    dialogButton.addEventListener('click', closeDialogBox);
    closeDialog.addEventListener('click', closeDialogBox);
    messageDialog.addEventListener('click', function(e) {
        if (e.target === messageDialog) {
            closeDialogBox();
        }
    });

    // Username validation with custom error messages and availability check
    usernameInput.addEventListener('input', function() {
        const username = this.value.trim();
        let message = '';
        let valid = true;
        
        // Check for length validation
        if (username.length > 0 && username.length < 3) {
            message = '<div class="error-message">✗ Username must be between 3 and 20 characters</div>';
            valid = false;
        } else if (username.length > 20) {
            message = '<div class="error-message">✗ Username must be between 3 and 20 characters</div>';
            valid = false;
        }
        // Check for invalid characters including @ and $
        else if (username.length > 0 && !/^[a-zA-Z0-9_-]*$/.test(username)) {
            if (username.includes('@') || username.includes('$')) {
                message = '<div class="error-message">✗ Symbols like "@" or "$" are not allowed. Only letters, numbers, hyphens, and underscores are allowed</div>';
            } else {
                message = '<div class="error-message">✗ Only letters, numbers, hyphens, and underscores are allowed</div>';
            }
            valid = false;
        }
        
        // If validation passes and username is long enough, check availability
        if (valid && username.length >= 3) {
            fetch('register.php?check_username=1&username=' + encodeURIComponent(username))
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        usernameFeedbackDiv.innerHTML = '<div class="error-message">✗ Username already taken</div>';
                        usernameInput.style.borderColor = 'var(--error-color)';
                    } else {
                        usernameFeedbackDiv.innerHTML = '<div class="success-message">✓ Username available</div>';
                        usernameInput.style.borderColor = 'var(--success-color)';
                    }
                })
                .catch(error => {
                    console.error('Error checking username:', error);
                    usernameFeedbackDiv.innerHTML = '';
                });
        } else {
            // Show validation error or clear if empty
            usernameFeedbackDiv.innerHTML = message;
            usernameInput.style.borderColor = valid ? '' : 'var(--error-color)';
        }
    });

    // Create and append the reload button ONCE
    const refreshButton = document.createElement('button');
    refreshButton.type = 'button';
    refreshButton.className = 'refresh-captcha';
    refreshButton.innerHTML = '↻';
    refreshButton.title = 'Refresh CAPTCHA';
    refreshButton.onclick = function(e) {
        e.preventDefault();
        fetchNewCaptcha();
    };
    captchaImageDiv.appendChild(refreshButton);

    // Add a span for the question text
    const captchaQuestionSpan = document.createElement('span');
    captchaQuestionSpan.style.flex = '1';
    captchaQuestionSpan.style.textAlign = 'center';
    captchaQuestionSpan.style.display = 'block';
    captchaImageDiv.insertBefore(captchaQuestionSpan, refreshButton);

    // Show password toggle
    const showPasswordToggle = document.createElement('input');
    showPasswordToggle.type = 'checkbox';
    showPasswordToggle.id = 'showPasswordToggle';
    const showPasswordLabel = document.createElement('label');
    showPasswordLabel.htmlFor = 'showPasswordToggle';
    showPasswordLabel.textContent = ' Show Password';
    passwordInput.parentElement.appendChild(showPasswordToggle);
    passwordInput.parentElement.appendChild(showPasswordLabel);
    showPasswordToggle.addEventListener('change', function() {
        passwordInput.type = this.checked ? 'text' : 'password';
        confirmPasswordInput.type = this.checked ? 'text' : 'password';
    });

    // Fetch new CAPTCHA from server
    function fetchNewCaptcha() {
        fetch('register.php?get_captcha=1')
            .then(response => response.json())
            .then(data => {
                storedCaptchaInput.value = data.answer;
                captchaQuestionSpan.textContent = data.question;
                captchaImageDiv.style.animation = 'fadeIn 0.3s ease';
                captchaInput.value = '';
            })
            .catch(error => {
                console.error('Error fetching CAPTCHA:', error);
                showError('Error loading CAPTCHA. Please try again.');
            });
    }

    // NIST-compliant password strength check and feedback
    function checkPasswordStrength(password) {
        let feedback = [];
        let minLength = 8;
        let maxLength = 64;
        let strength = 0;

        if (password.length < minLength) {
            feedback.push('Password should be at least 8 characters long.');
        } else {
            strength++;
        }
        if (password.length > maxLength) {
            feedback.push('Password should not exceed 64 characters.');
        }

        // Strength based on length and unpredictability
        if (password.length >= minLength) {
            if (password.length >= 12) strength++;
            if (password.length >= 16) strength++;
            if (/\s/.test(password)) strength++; // Encourage use of spaces/passphrases
        }

        let strengthText = '';
        let strengthClass = '';
        switch (strength) {
            case 0:
                strengthText = 'Very Weak';
                strengthClass = 'strength-weak';
                break;
            case 1:
                strengthText = 'Weak';
                strengthClass = 'strength-weak';
                break;
            case 2:
                strengthText = 'Moderate';
                strengthClass = 'strength-medium';
                break;
            case 3:
                strengthText = 'Strong';
                strengthClass = 'strength-strong';
                break;
            case 4:
                strengthText = 'Very Strong';
                strengthClass = 'strength-strong';
                break;
        }

        // NIST-compliant feedback
        if (password.length < minLength) {
            feedback.push('Longer passwords or passphrases are more secure.');
        } else if (password.length >= 16) {
            feedback.push('Great! Consider using a passphrase for even more security.');
        } else {
            feedback.push('You can use any characters, including spaces and symbols.');
        }
        // Optionally, check for common passwords here and add feedback

        passwordStrengthDiv.innerHTML = `
            <div class="strength-indicator">
                <span class="${strengthClass}">${strengthText}</span>
                <div class="strength-bar">
                    <div class="strength-progress" style="width: ${(strength / 4) * 100}%"></div>
                </div>
            </div>
            <div class="feedback-list">
                ${feedback.map(item => `<div class="feedback-item">${item}</div>`).join('')}
            </div>
        `;

        if (confirmPasswordInput.value) {
            checkPasswordMatch();
        }
    }

    // Check if passwords match
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword === '') {
            passwordMatchDiv.innerHTML = '';
            return;
        }

        if (password === confirmPassword) {
            passwordMatchDiv.innerHTML = '<div class="success-message">✓ Passwords match</div>';
            confirmPasswordInput.style.borderColor = 'var(--success-color)';
        } else {
            passwordMatchDiv.innerHTML = '<div class="error-message">✗ Passwords do not match</div>';
            confirmPasswordInput.style.borderColor = 'var(--error-color)';
        }
    }

    // Add input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Event listeners
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });

    confirmPasswordInput.addEventListener('input', checkPasswordMatch);

    // Generate initial CAPTCHA
    fetchNewCaptcha();

    // Update form submission to use dialog
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (passwordInput.value !== confirmPasswordInput.value) {
            showDialog('Password Mismatch', 'Passwords do not match! Please try again.', 'error');
            return;
        }

        if (captchaInput.value.trim() === '') {
            showDialog('CAPTCHA Required', 'Please solve the CAPTCHA to continue.', 'error');
            return;
        }

        if (captchaInput.value !== storedCaptchaInput.value) {
            showDialog('Invalid CAPTCHA', 'The CAPTCHA answer is incorrect. Please try again.', 'error');
            fetchNewCaptcha();
            return;
        }

        // If all validations pass, submit the form
        this.submit();
    });

    // Update error message function to use dialog
    function showError(message) {
        showDialog('Error', message, 'error');
    }
});