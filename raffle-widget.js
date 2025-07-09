const raffleWidget = {
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupEventListeners();
      this.checkPaymentStatus();
      this.fetchTicketCount();
    });
  },

  setupEventListeners() {
    const widget = document.getElementById('raffle-widget');
    const icon = widget.querySelector('.raffle-icon');
    const joinBtn = widget.querySelector('.raffle-join-btn');
    const paymentBtn = document.querySelector('.raffle-payment-btn');

    // Initialize Stripe.js with publishable key
    const stripe = Stripe('pk_test_51RiX7NAQjVZbHvvEwHOIESoY5r7QYD7BkraVqvr9AaV41o5y48oU9M5HkpWUmkLC1LsOcRGPmHm409L3vmDaqwhx00auFVHC8j'); // Replace with your pk_test_ key

    icon.addEventListener('click', () => {
      widget.classList.toggle('collapsed');
      widget.classList.toggle('expanded');
    });

    joinBtn.addEventListener('click', async () => {
      try {
        const response = await axios.post('/api/raffle-entry', { userId: 123 });
        if (response.data.success) {
          this.updateTicketCount(response.data.tickets);
        } else {
          this.showError('❌ Error, try again.');
        }
      } catch (error) {
        console.error('Error in POST /api/raffle-entry:', error.message);
        this.showError('❌ Error, try again.');
      }
    });

    paymentBtn.addEventListener('click', async () => {
      try {
        const response = await axios.post('/api/create-checkout-session', {
          amount: 100,
          currency: 'usd',
        });
        if (!response.data.sessionId) {
          throw new Error('No sessionId returned from server');
        }
        const result = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });
        if (result.error) {
          console.error('Stripe redirect error:', result.error.message);
          this.showError('❌ Payment failed: ' + result.error.message);
        }
      } catch (error) {
        console.error('Error in POST /api/create-checkout-session:', error.message);
        this.showError('❌ Payment failed. Please try again.');
      }
    });
  },

  async fetchTicketCount() {
    try {
      const response = await axios.get('/api/raffle-status?userId=123');
      this.updateTicketCount(response.data.tickets);
    } catch (error) {
      console.error('Error in GET /api/raffle-status:', error.message);
      this.showError('❌ Error, try again.');
    }
  },

  async checkPaymentStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      try {
        const response = await axios.post('/api/stripe-webhook');
        if (response.data.success) {
          this.updateTicketCount(response.data.tickets);
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          this.showError('❌ Payment confirmation failed.');
        }
      } catch (error) {
        console.error('Error in POST /api/stripe-webhook:', error.message);
        this.showError('❌ Payment confirmation failed.');
      }
    } else if (urlParams.get('success') === 'false') {
      this.showError('❌ Payment failed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },

  updateTicketCount(tickets) {
    const status = document.querySelector('.raffle-status');
    status.textContent = `✅ You have ${tickets} tickets.`;
  },

  showError(message) {
    const status = document.querySelector('.raffle-status');
    status.textContent = message;
    setTimeout(() => {
      this.fetchTicketCount();
    }, 3000);
  },
};

raffleWidget.init();