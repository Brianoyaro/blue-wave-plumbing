// services/keepAliveService.js
class KeepAliveService {
  constructor() {
    this.intervalId = null;
    this.backendURL = import.meta.env.VITE_BACKEND_URL;
    this.isRunning = false;
    this.pingInterval = 60000; // 1 minute in milliseconds
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 seconds
  }

  // Start the keep-alive pings
  start() {
    if (this.isRunning) {
      console.log('Keep-alive service is already running');
      return;
    }

    console.log('Starting keep-alive service...');
    this.isRunning = true;
    
    // Initial ping
    this.ping();
    
    // Set up interval for regular pings
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.pingInterval);
  }

  // Stop the keep-alive pings
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Keep-alive service stopped');
  }

  // Ping the server
  async ping(retryCount = 0) {
    try {
      const response = await fetch(`${this.backendURL.replace('/api/items', '')}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 seconds timeout
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Keep-alive ping successful: ${data.message} at ${data.timestamp}`);
      } else {
        throw new Error(`Health check failed with status: ${response.status}`);
      }
    } catch (error) {
      console.warn(`Keep-alive ping failed (attempt ${retryCount + 1}):`, error.message);
      
      // Retry logic
      if (retryCount < this.maxRetries) {
        setTimeout(() => {
          this.ping(retryCount + 1);
        }, this.retryDelay);
      } else {
        console.error('Keep-alive ping failed after all retries');
      }
    }
  }

  // Get service status
  getStatus() {
    return {
      isRunning: this.isRunning,
      pingInterval: this.pingInterval,
      backendURL: this.backendURL
    };
  }

  // Update ping interval (in milliseconds)
  setPingInterval(interval) {
    if (interval < 30000) { // Minimum 30 seconds
      console.warn('Ping interval cannot be less than 30 seconds');
      return;
    }
    
    this.pingInterval = interval;
    
    // Restart with new interval if already running
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}

// Create and export singleton instance
const keepAliveService = new KeepAliveService();
export default keepAliveService;