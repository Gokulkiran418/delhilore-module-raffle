const raffleWidget = {
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Raffle widget initialized');
      this.hasJoinedRaffle = false; // Track first join
      this.currentTickets = 0; // Initialize to 0
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

    const stripe = Stripe('pk_test_51RiX7NAQjVZbHvvEwHOIESoY5r7QYD7BkraVqvr9AaV41o5y48oU9M5HkpWUmkLC1LsOcRGPmHm409L3vmDaqwhx00auFVHC8j');
    console.log('Stripe.js initialized');

    icon.addEventListener('click', () => {
      console.log('Raffle icon clicked');
      widget.classList.toggle('collapsed');
      widget.classList.toggle('expanded');
    });

    joinBtn.addEventListener('click', async () => {
      console.log('Join the Raffle clicked');
      try {
        if (this.hasJoinedRaffle) {
          this.showMessage('Click Proceed to Payment');
          return;
        }
        console.log('Sending POST to /api/raffle-entry');
        const response = await axios.post('/api/raffle-entry', {
          userId: 123,
          previousTickets: this.currentTickets,
        });
        console.log('Response:', response.data);
        if (response.data.success) {
          this.hasJoinedRaffle = true; // Mark first join
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
      console.log('Proceed to Payment clicked');
      try {
        const response = await axios.post('/api/create-checkout-session', {
          amount: 100,
          currency: 'usd',
        });
        console.log('Checkout session response:', response.data);
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
      console.log('Fetching ticket count');
      const response = await axios.get('/api/raffle-status?userId=123');
      console.log('Ticket count response:', response.data);
      this.currentTickets = response.data.tickets; // Store tickets
      this.updateTicketCount(response.data.tickets);
    } catch (error) {
      console.error('Error in GET /api/raffle-status:', error.message);
      this.showError('❌ Error, try again.');
    }
  },

  async checkPaymentStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      console.log('Checking payment status: success');
      try {
        const response = await axios.post('/api/stripe-webhook', {
          previousTickets: this.currentTickets || 1,
        });
        console.log('Webhook response:', response.data);
        if (response.data.success) {
          this.hasJoinedRaffle = false; // Reset for new entry
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
      console.log('Payment status: failed');
      this.showError('❌ Payment failed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },

  updateTicketCount(tickets) {
    console.log('Updating ticket count:', tickets);
    this.currentTickets = tickets; // Update stored tickets
    const status = document.querySelector('.raffle-status');
    status.textContent = `✅ You have ${tickets} tickets.`;
  },

  showMessage(message) {
    console.log('Showing message:', message);
    const status = document.querySelector('.raffle-status');
    status.textContent = message;
    setTimeout(() => {
      this.fetchTicketCount();
    }, 3000);
  },

  showError(message) {
    console.log('Showing error:', message);
    const status = document.querySelector('.raffle-status');
    status.textContent = message;
    setTimeout(() => {
      this.fetchTicketCount();
    }, 3000);
  },
};

raffleWidget.init();