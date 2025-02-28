class Cache {
  constructor(defaultTTL = 300000) { // Default TTL: 5 minutes
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if not found or expired
   */
  get(key) {
    if (!this.cache.has(key)) return null;
    
    const { value, expiry } = this.cache.get(key);
    
    // Check if expired
    if (expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return value;
  }

  /**
   * Set a value in the cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set(key, value, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Remove a value from the cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cached values
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Remove all expired items from the cache
   */
  cleanup() {
    const now = Date.now();
    for (const [key, { expiry }] of this.cache.entries()) {
      if (expiry < now) {
        this.cache.delete(key);
      }
    }
  }
}

// Create a singleton instance
const cache = new Cache();

/**
 * Schedule periodic cleanup to remove expired items
 * Run every 10 minutes
 */
setInterval(() => {
  cache.cleanup();
}, 10 * 60 * 1000);

export default cache;