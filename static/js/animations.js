/**
 * Mukuru Loyalty Rewards - Animation Library
 * Custom animations for enhanced user experience
 */

class MukuruAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupFloatingElements();
        this.setupParticleSystem();
    }

    // Intersection Observer for scroll animations
    setupIntersectionObserver() {
        if (!window.IntersectionObserver) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            this.observer.observe(el);
        });
    }

    // Animate elements when they come into view
    animateElement(element) {
        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = element.dataset.delay || 0;

        setTimeout(() => {
            element.classList.add('animate__animated', `animate__${animationType}`);
        }, delay);
    }

    // Setup floating background elements
    setupFloatingElements() {
        this.createFloatingCoins();
        this.createFloatingIcons();
    }

    // Create floating coins background animation
    createFloatingCoins() {
        const coinContainer = document.createElement('div');
        coinContainer.className = 'floating-coins-container';
        coinContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        document.body.appendChild(coinContainer);

        // Create floating coins
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createFloatingCoin(coinContainer);
            }, i * 2000 + Math.random() * 3000);
        }

        // Continue creating coins periodically
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.createFloatingCoin(coinContainer);
            }
        }, 5000);
    }

    createFloatingCoin(container) {
        const coin = document.createElement('div');
        coin.innerHTML = '<i class="fas fa-coins"></i>';
        coin.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: 100%;
            font-size: ${15 + Math.random() * 15}px;
            color: rgba(246, 173, 85, ${0.3 + Math.random() * 0.4});
            animation: floatUp ${15 + Math.random() * 10}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;
        
        container.appendChild(coin);

        // Remove coin after animation
        setTimeout(() => {
            if (container.contains(coin)) {
                container.removeChild(coin);
            }
        }, 25000);
    }

    // Create floating icons for visual appeal
    createFloatingIcons() {
        const icons = ['fa-paper-plane', 'fa-gift', 'fa-star', 'fa-heart'];
        
        setInterval(() => {
            if (Math.random() < 0.2) {
                this.createFloatingIcon(icons[Math.floor(Math.random() * icons.length)]);
            }
        }, 8000);
    }

    createFloatingIcon(iconClass) {
        const icon = document.createElement('div');
        icon.innerHTML = `<i class="fas ${iconClass}"></i>`;
        icon.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}%;
            top: 100%;
            font-size: ${12 + Math.random() * 8}px;
            color: rgba(26, 54, 93, ${0.2 + Math.random() * 0.3});
            animation: floatUp ${20 + Math.random() * 15}s linear forwards;
            pointer-events: none;
            z-index: -1;
        `;
        
        document.body.appendChild(icon);

        // Remove icon after animation
        setTimeout(() => {
            if (document.body.contains(icon)) {
                document.body.removeChild(icon);
            }
        }, 35000);
    }

    // Money transfer animation
    createMoneyTransferAnimation(fromElement, toElement, callback) {
        const money = document.createElement('div');
        money.innerHTML = '<i class="fas fa-money-bill-wave"></i>';
        money.className = 'money-transfer';
        
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        
        money.style.cssText = `
            position: fixed;
            left: ${fromRect.left + fromRect.width / 2}px;
            top: ${fromRect.top + fromRect.height / 2}px;
            font-size: 24px;
            color: #28a745;
            z-index: 9999;
            pointer-events: none;
            transition: all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        document.body.appendChild(money);
        
        // Animate to destination
        setTimeout(() => {
            money.style.left = `${toRect.left + toRect.width / 2}px`;
            money.style.top = `${toRect.top + toRect.height / 2}px`;
            money.style.transform = 'scale(0.5) rotate(360deg)';
            money.style.opacity = '0';
        }, 100);
        
        // Remove and callback
        setTimeout(() => {
            if (document.body.contains(money)) {
                document.body.removeChild(money);
            }
            if (callback) callback();
        }, 2100);
    }

    // Particle system for celebrations
    setupParticleSystem() {
        this.particleSystem = {
            particles: [],
            canvas: null,
            ctx: null,
            animationId: null
        };
    }

    // Confetti explosion animation
    createConfettiExplosion(x, y, particleCount = 50) {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98FB98'];
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createConfettiParticle(x, y, colors[Math.floor(Math.random() * colors.length)]);
            }, i * 20);
        }
    }

    createConfettiParticle(x, y, color) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${4 + Math.random() * 8}px;
            height: ${4 + Math.random() * 8}px;
            background: ${color};
            pointer-events: none;
            z-index: 9999;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0%'};
        `;
        
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 100 + Math.random() * 200;
        const gravity = 300;
        const drag = 0.98;
        
        let vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity;
        let posX = x;
        let posY = y;
        
        const animate = () => {
            vy += gravity / 60;
            vx *= drag;
            vy *= drag;
            
            posX += vx / 60;
            posY += vy / 60;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.transform = `rotate(${posX * 2}deg)`;
            
            if (posY < window.innerHeight + 100) {
                requestAnimationFrame(animate);
            } else {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Points earning animation
    createPointsEarnedAnimation(element, points) {
        const pointsEl = document.createElement('div');
        pointsEl.innerHTML = `<i class="fas fa-coins"></i> +${points}`;
        pointsEl.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: rgba(246, 173, 85, 0.9);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 25px;
            font-weight: bold;
            font-size: 1.1rem;
            z-index: 1000;
            pointer-events: none;
            animation: pointsEarned 2s ease-out forwards;
        `;
        
        element.style.position = 'relative';
        element.appendChild(pointsEl);
        
        setTimeout(() => {
            if (element.contains(pointsEl)) {
                element.removeChild(pointsEl);
            }
        }, 2000);
    }

    // Loading spinner with custom styling
    createLoadingSpinner(element, text = 'Loading...') {
        const spinner = document.createElement('div');
        spinner.className = 'mukuru-loading';
        spinner.innerHTML = `
            <div class="spinner-container">
                <div class="spinner">
                    <i class="fas fa-coins fa-spin"></i>
                </div>
                <div class="loading-text">${text}</div>
            </div>
        `;
        spinner.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            border-radius: inherit;
        `;
        
        element.style.position = 'relative';
        element.appendChild(spinner);
        
        return spinner;
    }

    removeLoadingSpinner(element) {
        const spinner = element.querySelector('.mukuru-loading');
        if (spinner) {
            element.removeChild(spinner);
        }
    }

    // Ripple effect for buttons
    createRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (element.contains(ripple)) {
                element.removeChild(ripple);
            }
        }, 600);
    }

    // Shake animation for errors
    shakeElement(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    // Pulse animation for notifications
    pulseElement(element, duration = 1000) {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    // Smooth scroll to element
    scrollToElement(element, offset = 0) {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// CSS animations (injected into page)
const animationCSS = `
@keyframes floatUp {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
    }
}

@keyframes pointsEarned {
    0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    }
    50% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -150%) scale(1);
        opacity: 0;
    }
}

@keyframes ripple {
    to {
        transform: scale(2);
        opacity: 0;
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.mukuru-loading .spinner-container {
    text-align: center;
}

.mukuru-loading .spinner {
    font-size: 2rem;
    color: #ed8936;
    margin-bottom: 1rem;
}

.mukuru-loading .loading-text {
    color: #1a365d;
    font-weight: 600;
}
`;

// Inject CSS into page
const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mukuruAnimations = new MukuruAnimations();
});

// Export for use in other scripts
window.MukuruAnimations = MukuruAnimations;
