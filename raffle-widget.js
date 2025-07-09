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
    const paymentBtn = widget.querySelector('.raffle-payment-btn');

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
        this.showError('❌ Error, try again.');
      }
    });

    paymentBtn.addEventListener('click', async () => {
      try {
        const response = await axios.post('/api/create-checkout-session', {
          amount: 100,
          currency: 'usd',
        });
        window.location.href = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
      } catch (error) {
        this.showError('❌ Payment failed. Please try again.');
      }
    });
  },

  async fetchTicketCount() {
    try {
      const response = await axios.get('/api/raffle-status?userId=123');
      this.updateTicketCount(response.data.tickets);
    } catch (error) {
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
          // Clear URL params
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          this.showError('❌ Payment confirmation failed.');
        }
      } catch (error) {
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