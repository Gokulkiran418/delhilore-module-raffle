document.addEventListener('DOMContentLoaded', function () {
    // Submit Form with validation and inline success message
    const submitForm = document.querySelector('.submit-form');
    const submitButton = submitForm.querySelector('button[type="submit"]');
    
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'submit-success-message';
    successMessage.style.display = 'none';
    successMessage.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you for submitting your story! Your submission has been received.';
    submitForm.appendChild(successMessage);
    
    submitForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Get form fields
        const name = document.getElementById('name').value.trim();
        const type = document.getElementById('type').value;
        const title = document.getElementById('title').value.trim();
        const desc = document.getElementById('desc').value.trim();
        const image = document.getElementById('image').value.trim();
        
        // Validate required fields
        let isValid = true;
        let errorMessage = '';
        
        if (!name) {
            isValid = false;
            errorMessage = 'Please enter your name.';
        } else if (!type) {
            isValid = false;
            errorMessage = 'Please select a story type.';
        } else if (!title) {
            isValid = false;
            errorMessage = 'Please enter a story title.';
        } else if (!desc) {
            isValid = false;
            errorMessage = 'Please enter a description.';
        }
        
        if (!isValid) {
            // Show error message
            alert(errorMessage);
            return;
        }
        
        // Show loading state
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
        submitButton.disabled = true;
        
        // Simulate form submission delay
        setTimeout(() => {
            // If validation passes, show success message
            successMessage.style.display = 'block';
            successMessage.style.opacity = '0';
            
            // Animate the success message in
            setTimeout(() => {
                successMessage.style.opacity = '1';
            }, 10);
            
            // Reset form and button
            submitForm.reset();
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            
            // Reset field styles
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                field.style.borderColor = '#ccc';
                field.style.boxShadow = 'none';
            });
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.opacity = '0';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 300);
            }, 5000);
        }, 1000);
    });

    // Add real-time validation feedback
    const requiredFields = ['name', 'type', 'title', 'desc'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('blur', function() {
            const value = this.value.trim();
            if (!value) {
                this.style.borderColor = '#dc3545';
                this.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
            } else {
                this.style.borderColor = '#28a745';
                this.style.boxShadow = '0 0 0 0.2rem rgba(40, 167, 69, 0.25)';
            }
        });
        
        field.addEventListener('input', function() {
            const value = this.value.trim();
            if (value) {
                this.style.borderColor = '#28a745';
                this.style.boxShadow = '0 0 0 0.2rem rgba(40, 167, 69, 0.25)';
            } else {
                this.style.borderColor = '#ccc';
                this.style.boxShadow = 'none';
            }
        });
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                if (targetId === 'payments') {
                    target.classList.add('highlight-payments');
                    setTimeout(() => {
                        target.classList.remove('highlight-payments');
                    }, 1200);
                }
            }
        });
    });

    // Raffle Widget Logic
    let ticketsLeft = 50;
    const ticketsLeftSpan = document.getElementById('tickets-left');
    const progressBar = document.getElementById('progress-bar-fill');
    const raffleBtn = document.querySelector('.raffle-btn');
    const modal = document.getElementById('raffle-success-modal');
    const ticketNumSpan = document.getElementById('raffle-ticket-number');
    const closeModalBtn = document.getElementById('close-modal');

    function updateRaffleUI() {
        ticketsLeftSpan.textContent = ticketsLeft;
        progressBar.style.width = (ticketsLeft / 50 * 100) + '%';
        if (ticketsLeft <= 0) {
            raffleBtn.disabled = true;
            raffleBtn.textContent = 'Sold Out';
            raffleBtn.style.background = '#ccc';
            raffleBtn.style.cursor = 'not-allowed';
        }
    }
    updateRaffleUI();

    raffleBtn.addEventListener('click', function () {
        if (ticketsLeft > 0) {
            ticketsLeft--;
            updateRaffleUI();
            // Generate a random 5-digit ticket number
            const ticketNum = Math.floor(10000 + Math.random() * 90000);
            ticketNumSpan.textContent = ticketNum;
            modal.classList.add('active');
        }
    });

    closeModalBtn.addEventListener('click', function () {
        modal.classList.remove('active');
    });

    // Payment stepper logic with Stripe integration
    const paymentCards = document.querySelectorAll('.payment-card');
    const stepChoose = document.getElementById('payment-step-choose');
    const stepDetails = document.getElementById('payment-step-details');
    const stepSuccess = document.getElementById('payment-step-success');
    const paymentFormTitle = document.getElementById('payment-form-title');
    const paymentSubmitBtn = document.getElementById('payment-submit-btn');
    const paymentErrorMessage = document.getElementById('payment-error-message');
    const paymentErrorText = document.getElementById('payment-error-text');

    const cardFields = document.getElementById('card-fields');
    const upiFields = document.getElementById('upi-fields');
    const gpayFields = document.getElementById('gpay-fields');
    const applepayFields = document.getElementById('applepay-fields');
    const cardErrors = document.getElementById('card-errors');
    const cardErrorText = document.getElementById('card-error-text');

    // Mock Stripe implementation for demonstration
    const mockStripe = {
        elements: function() {
            return {
                create: function(type, options) {
                    return {
                        mount: function(selector) {
                            const container = document.querySelector(selector);
                            if (container) {
                                container.innerHTML = `
                                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                        <input type="text" placeholder="Card Number" style="padding: 0.7rem; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;" id="mock-card-number">
                                        <div style="display: flex; gap: 0.5rem;">
                                            <input type="text" placeholder="MM/YY" style="padding: 0.7rem; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; flex: 1;" id="mock-card-expiry">
                                            <input type="text" placeholder="CVC" style="padding: 0.7rem; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; flex: 1;" id="mock-card-cvc">
                                        </div>
                                    </div>
                                `;
                                
                                // Add validation listeners
                                const cardNumber = document.getElementById('mock-card-number');
                                const cardExpiry = document.getElementById('mock-card-expiry');
                                const cardCvc = document.getElementById('mock-card-cvc');
                                
                                [cardNumber, cardExpiry, cardCvc].forEach(input => {
                                    input.addEventListener('input', validateCardFields);
                                    input.addEventListener('blur', validateCardFields);
                                });
                            }
                        },
                        on: function(event, callback) {
                            // Store callback for validation
                            this.validationCallback = callback;
                        }
                    };
                },
                clear: function() {
                    const container = document.querySelector('#card-element');
                    if (container) {
                        container.innerHTML = '';
                    }
                }
            };
        }
    };

    // Card validation function
    function validateCardFields() {
        const cardNumber = document.getElementById('mock-card-number');
        const cardExpiry = document.getElementById('mock-card-expiry');
        const cardCvc = document.getElementById('mock-card-cvc');
        
        let hasError = false;
        let errorMessage = '';
        
        if (cardNumber && cardNumber.value.length < 13) {
            hasError = true;
            errorMessage = 'Card number is incomplete';
        } else if (cardExpiry && !/^\d{2}\/\d{2}$/.test(cardExpiry.value)) {
            hasError = true;
            errorMessage = 'Expiry date must be in MM/YY format';
        } else if (cardCvc && cardCvc.value.length < 3) {
            hasError = true;
            errorMessage = 'CVC must be at least 3 digits';
        }
        
        if (hasError) {
            showCardError(errorMessage);
        } else {
            hideCardError();
        }
    }

    // Function to show payment error
    function showPaymentError(message) {
        paymentErrorText.textContent = message;
        paymentErrorMessage.style.display = 'flex';
        paymentErrorMessage.style.opacity = '0';
        setTimeout(() => {
            paymentErrorMessage.style.opacity = '1';
        }, 10);
    }

    // Function to hide payment error
    function hidePaymentError() {
        paymentErrorMessage.style.opacity = '0';
        setTimeout(() => {
            paymentErrorMessage.style.display = 'none';
        }, 300);
    }

    // Function to show card error
    function showCardError(message) {
        cardErrorText.textContent = message;
        cardErrors.style.display = 'flex';
        cardErrors.style.opacity = '0';
        setTimeout(() => {
            cardErrors.style.opacity = '1';
        }, 10);
    }

    // Function to hide card error
    function hideCardError() {
        cardErrors.style.opacity = '0';
        setTimeout(() => {
            cardErrors.style.display = 'none';
        }, 300);
    }

    // Function to set loading state
    function setPaymentLoading(loading) {
        if (loading) {
            paymentSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            paymentSubmitBtn.disabled = true;
        } else {
            paymentSubmitBtn.innerHTML = '<i class="fa-solid fa-credit-card"></i> Pay Now';
            paymentSubmitBtn.disabled = false;
        }
    }

    // Function to initialize Stripe Elements
    function initializeStripeElements() {
        const elements = mockStripe.elements();
        const cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                },
                invalid: {
                    color: '#9e2146',
                },
            },
        });
        
        cardElement.mount('#card-element');
    }

    paymentCards.forEach(function (card) {
        card.addEventListener('click', function () {
            paymentCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            stepChoose.style.display = 'none';
            stepDetails.style.display = 'block';
            stepSuccess.style.display = 'none';
            
            // Hide all error messages
            hidePaymentError();
            hideCardError();

            // Hide all fields first
            cardFields.style.display = 'none';
            upiFields.style.display = 'none';
            gpayFields.style.display = 'none';
            applepayFields.style.display = 'none';

            // Show relevant fields
            const method = this.getAttribute('data-method');
            if (method === 'visa' || method === 'mastercard' || method === 'amex') {
                paymentFormTitle.innerHTML = `<i class="fa-solid fa-credit-card"></i> Enter your card details:`;
                cardFields.style.display = 'block';
                // Initialize Stripe Elements for card payments
                setTimeout(() => {
                    initializeStripeElements();
                }, 100);
            } else if (method === 'upi') {
                paymentFormTitle.innerHTML = `<i class="fa-solid fa-building-columns"></i> Enter your UPI ID:`;
                upiFields.style.display = 'block';
            } else if (method === 'gpay') {
                paymentFormTitle.innerHTML = `<i class="fa-brands fa-google-pay"></i> Pay with Google Pay:`;
                gpayFields.style.display = 'block';
            } else if (method === 'applepay') {
                paymentFormTitle.innerHTML = `<i class="fa-brands fa-apple-pay"></i> Pay with Apple Pay:`;
                applepayFields.style.display = 'block';
            }
        });
    });

    // Enhanced payment form submission
    stepDetails.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Hide any existing error messages
        hidePaymentError();
        hideCardError();
        
        // Get selected payment method
        const selectedCard = document.querySelector('.payment-card.selected');
        if (!selectedCard) {
            showPaymentError('Please select a payment method.');
            return;
        }
        
        const method = selectedCard.getAttribute('data-method');
        
        // Set loading state
        setPaymentLoading(true);
        
        // Simulate payment processing with different scenarios
        setTimeout(() => {
            // Simulate random payment failure (30% chance for demo purposes)
            const isSuccess = Math.random() > 0.3;
            
            if (isSuccess) {
                // Payment successful
                stepDetails.style.display = 'none';
                stepSuccess.style.display = 'block';
                setPaymentLoading(false);
                
                setTimeout(() => {
                    // Reset to first step after 3 seconds
                    stepSuccess.style.display = 'none';
                    stepChoose.style.display = 'block';
                    paymentCards.forEach(c => c.classList.remove('selected'));
                    stepDetails.reset();
                    hidePaymentError();
                    hideCardError();
                }, 3000);
            } else {
                // Payment failed
                setPaymentLoading(false);
                showPaymentError('❌ Payment failed. Please try again.');
                
                // For card payments, also show specific error
                if (method === 'visa' || method === 'mastercard' || method === 'amex') {
                    showCardError('❌ Payment failed. Please check your card details and try again.');
                }
            }
        }, 2000);
    });
});