/**
 * Mukuru Loyalty Rewards - Main JavaScript
 * Core functionality and user interactions
 */

class MukuruApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidations();
        this.setupUIInteractions();
        this.setupRippleEffects();
        this.initializeCounters();
    }

    // Setup global event listeners
    setupEventListeners() {
        // Navigation interactions
        document.addEventListener('click', (e) => {
            this.handleGlobalClicks(e);
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            this.handleFormSubmissions(e);
        });

        // Window events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Custom events
        document.addEventListener('pointsEarned', (e) => {
            this.handlePointsEarned(e);
        });
    }

    // Handle global click events
    handleGlobalClicks(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;
        
        switch(action) {
            case 'select-customer':
                this.handleCustomerSelection(target, e);
                break;
            case 'send-money':
                this.handleSendMoney(target, e);
                break;
            case 'redeem-reward':
                this.handleRewardRedemption(target, e);
                break;
            case 'toggle-details':
                this.toggleDetails(target);
                break;
        }
    }

    // Handle form submissions
    handleFormSubmissions(e) {
        const form = e.target;
        
        if (form.id === 'remittanceForm') {
            e.preventDefault();
            this.processRemittance(form);
        }
    }

    // Setup form validations
    setupFormValidations() {
        // Real-time validation for amount input
        const amountInputs = document.querySelectorAll('input[name="amount"]');
        amountInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateAmount(e.target);
                this.updatePointsPreview(e.target);
            });

            input.addEventListener('blur', (e) => {
                this.formatAmount(e.target);
            });
        });

        // Recipient name validation
        const recipientInputs = document.querySelectorAll('input[name="recipient"]');
        recipientInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateRecipient(e.target);
            });
        });

        // Form submission validation
        const forms = document.querySelectorAll('form[data-validate]');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    // Validate amount input
    validateAmount(input) {
        const value = parseFloat(input.value);
        const feedback = input.parentNode.querySelector('.amount-feedback') || this.createFeedbackElement(input.parentNode);
        
        if (isNaN(value) || value <= 0) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            feedback.textContent = 'Please enter a valid amount greater than R0';
            feedback.className = 'amount-feedback invalid-feedback';
        } else if (value < 1) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            feedback.textContent = 'Minimum amount is R1.00';
            feedback.className = 'amount-feedback invalid-feedback';
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            feedback.textContent = `You'll earn ${Math.floor(value / 100)} loyalty points`;
            feedback.className = 'amount-feedback valid-feedback';
        }
    }

    // Validate recipient name
    validateRecipient(input) {
        const value = input.value.trim();
        const feedback = input.parentNode.querySelector('.recipient-feedback') || this.createFeedbackElement(input.parentNode);
        
        if (value.length < 2) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            feedback.textContent = 'Recipient name must be at least 2 characters';
            feedback.className = 'recipient-feedback invalid-feedback';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            feedback.textContent = 'Recipient name can only contain letters and spaces';
            feedback.className = 'recipient-feedback invalid-feedback';
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            feedback.textContent = 'Valid recipient name';
            feedback.className = 'recipient-feedback valid-feedback';
        }
    }

    // Create feedback element
    createFeedbackElement(parent) {
        const feedback = document.createElement('div');
        parent.appendChild(feedback);
        return feedback;
    }

    // Format amount input
    formatAmount(input) {
        const value = parseFloat(input.value);
        if (!isNaN(value) && value > 0) {
            input.value = value.toFixed(2);
        }
    }

    // Update points preview
    updatePointsPreview(input) {
        const amount = parseFloat(input.value) || 0;
        const points = Math.floor(amount / 100);
        
        const pointsPreview = document.getElementById('pointsPreview');
        const pointsProgress = document.getElementById('pointsProgress');
        
        if (pointsPreview) {
            pointsPreview.textContent = points;
            
            // Animate the number change
            pointsPreview.style.transform = 'scale(1.2)';
            setTimeout(() => {
                pointsPreview.style.transform = 'scale(1)';
            }, 200);
        }
        
        if (pointsProgress) {
            const progressWidth = Math.min((amount % 100) / 100 * 100, 100);
            pointsProgress.style.width = progressWidth + '%';
        }
    }

    // Validate entire form
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            if (input.name === 'amount') {
                this.validateAmount(input);
            } else if (input.name === 'recipient') {
                this.validateRecipient(input);
            }
            
            if (input.classList.contains('is-invalid')) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Handle customer selection
    handleCustomerSelection(element, event) {
        const customerId = element.dataset.customerId;
        
        // Add loading state
        element.style.opacity = '0.7';
        element.style.transform = 'scale(0.98)';
        
        // Create ripple effect
        if (window.mukuruAnimations) {
            window.mukuruAnimations.createRippleEffect(element, event);
        }
        
        // Navigate after animation
        setTimeout(() => {
            window.location.href = `/select_customer/${customerId}`;
        }, 300);
    }

    // Process remittance form
    processRemittance(form) {
        if (!this.validateForm(form)) {
            if (window.mukuruAnimations) {
                window.mukuruAnimations.shakeElement(form);
            }
            return;
        }

        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.button-text');
        const buttonLoading = submitButton.querySelector('.button-loading');
        
        // Show loading state
        this.setButtonLoading(submitButton, true);
        
        // Create money animation
        this.createSendingAnimation();
        
        // Submit form
        fetch('/process_remittance', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            this.setButtonLoading(submitButton, false);
            
            if (data.success) {
                this.handleTransactionSuccess(data, form);
            } else {
                this.handleTransactionError(data.message, form);
            }
        })
        .catch(error => {
            console.error('Transaction error:', error);
            this.setButtonLoading(submitButton, false);
            this.handleTransactionError('Transaction failed. Please try again.', form);
        });
    }

    // Set button loading state
    setButtonLoading(button, isLoading) {
        const buttonText = button.querySelector('.button-text');
        const buttonLoading = button.querySelector('.button-loading');
        
        if (isLoading) {
            buttonText?.classList.add('d-none');
            buttonLoading?.classList.remove('d-none');
            button.disabled = true;
        } else {
            buttonText?.classList.remove('d-none');
            buttonLoading?.classList.add('d-none');
            button.disabled = false;
        }
    }

    // Handle transaction success
    handleTransactionSuccess(data, form) {
        // Show success modal
        const modal = document.getElementById('successModal');
        const successMessage = document.getElementById('successMessage');
        const pointsEarned = document.getElementById('pointsEarned');
        
        if (successMessage) successMessage.textContent = data.message;
        if (pointsEarned) pointsEarned.textContent = data.points_earned;
        
        if (modal) {
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        }
        
        // Create celebration animation
        if (window.mukuruAnimations) {
            const rect = form.getBoundingClientRect();
            window.mukuruAnimations.createConfettiExplosion(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                30
            );
        }
        
        // Reset form
        form.reset();
        this.updatePointsPreview(form.querySelector('input[name="amount"]') || {value: 0});
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('pointsEarned', {
            detail: { points: data.points_earned, balance: data.new_balance }
        }));
    }

    // Handle transaction error
    handleTransactionError(message, form) {
        // Show error message
        this.showToast(message, 'error');
        
        // Shake form
        if (window.mukuruAnimations) {
            window.mukuruAnimations.shakeElement(form);
        }
    }

    // Create sending animation
    createSendingAnimation() {
        // Create floating money animation
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createFloatingMoney();
            }, i * 200);
        }
    }

    createFloatingMoney() {
        const money = document.createElement('div');
        money.innerHTML = '<i class="fas fa-money-bill-wave"></i>';
        money.style.cssText = `
            position: fixed;
            left: ${Math.random() * window.innerWidth}px;
            top: ${window.innerHeight}px;
            font-size: 24px;
            color: #28a745;
            z-index: 9999;
            pointer-events: none;
            transition: all 2s ease-out;
        `;
        
        document.body.appendChild(money);
        
        // Animate upward
        setTimeout(() => {
            money.style.transform = `translateY(-${window.innerHeight + 100}px) rotate(360deg)`;
            money.style.opacity = '0';
        }, 100);
        
        // Remove element
        setTimeout(() => {
            if (document.body.contains(money)) {
                document.body.removeChild(money);
            }
        }, 2100);
    }

    // Handle points earned event
    handlePointsEarned(event) {
        const { points, balance } = event.detail;
        
        // Update any points displays on the page
        document.querySelectorAll('[data-points-balance]').forEach(el => {
            el.textContent = balance;
        });
        
        // Show points earned animation
        const pointsElements = document.querySelectorAll('.points-display, .stat-card.points-card');
        pointsElements.forEach(el => {
            if (window.mukuruAnimations) {
                window.mukuruAnimations.createPointsEarnedAnimation(el, points);
            }
        });
    }

    // Setup UI interactions
    setupUIInteractions() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target && window.mukuruAnimations) {
                    window.mukuruAnimations.scrollToElement(target, 80);
                }
            });
        });

        // Card hover effects
        document.querySelectorAll('.reward-card, .customer-card, .stat-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Tooltip initialization for Bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(tooltipTriggerEl => {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Setup ripple effects for buttons
    setupRippleEffects() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (window.mukuruAnimations) {
                    window.mukuruAnimations.createRippleEffect(button, e);
                }
            });
        });
    }

    // Initialize number counters
    initializeCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const animateCounter = (element) => {
            const target = parseInt(element.dataset.counter) || parseInt(element.textContent);
            const duration = 2000;
            const start = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                const current = Math.floor(progress * target);
                element.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        };

        // Intersection observer for counters
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    // Handle scroll events
    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // Navbar background on scroll
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero-section');
        if (hero) {
            const offset = scrollTop * 0.5;
            hero.style.transform = `translateY(${offset}px)`;
        }
    }

    // Handle window resize
    handleResize() {
        // Responsive adjustments if needed
        this.adjustLayoutForMobile();
    }

    // Adjust layout for mobile
    adjustLayoutForMobile() {
        const isMobile = window.innerWidth < 768;
        
        document.querySelectorAll('.stat-card').forEach(card => {
            if (isMobile) {
                card.classList.add('mobile-stat-card');
            } else {
                card.classList.remove('mobile-stat-card');
            }
        });
    }

    // Show toast notification
    showToast(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.mukuru-toast').forEach(toast => {
            toast.remove();
        });

        const toast = document.createElement('div');
        toast.className = `mukuru-toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getToastIcon(type)} me-2"></i>
                <span>${message}</span>
            </div>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getToastBackground(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getToastBackground(type) {
        const backgrounds = {
            success: '#48bb78',
            error: '#f56565',
            warning: '#ed8936',
            info: '#4299e1'
        };
        return backgrounds[type] || backgrounds.info;
    }

    // Toggle details sections
    toggleDetails(element) {
        const target = document.querySelector(element.dataset.target);
        if (target) {
            target.classList.toggle('show');
            element.classList.toggle('active');
        }
    }

    // Handle reward redemption
    handleRewardRedemption(element, event) {
        const rewardId = element.dataset.rewardId;
        const rewardName = element.dataset.rewardName;
        const pointsCost = parseInt(element.dataset.pointsCost);
        
        // Call global function if available
        if (typeof redeemReward === 'function') {
            redeemReward(rewardId, rewardName, pointsCost);
        }
    }

    // Utility function to format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(amount);
    }

    // Utility function to format date
    formatDate(dateString) {
        return new Intl.DateTimeFormat('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    }
}

// Additional CSS for mobile and interactions
const additionalCSS = `
.mobile-stat-card {
    margin-bottom: 1rem;
}

.navbar.scrolled {
    background: rgba(26, 54, 93, 0.95) !important;
    backdrop-filter: blur(10px);
}

.mukuru-toast {
    font-weight: 500;
}

.toast-content {
    display: flex;
    align-items: center;
}

@media (max-width: 768px) {
    .mukuru-toast {
        right: 10px;
        left: 10px;
        transform: translateY(-100%);
    }
    
    .mukuru-toast.show {
        transform: translateY(0);
    }
}
`;

// Inject additional CSS
const additionalStyleSheet = document.createElement('style');
additionalStyleSheet.textContent = additionalCSS;
document.head.appendChild(additionalStyleSheet);

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mukuruApp = new MukuruApp();
});

// Export for use in other scripts
window.MukuruApp = MukuruApp;
