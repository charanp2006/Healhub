// Location service for handling geolocation and nearby searches

class LocationService {
  constructor() {
    this.currentLocation = null;
    this.watchId = null;
  }

  // Get user's current position
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };
          resolve(this.currentLocation);
        },
        (error) => {
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = 'An unknown error occurred';
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  // Geocode an address to get coordinates (mock implementation)
  async geocodeAddress(address) {
    // In a real implementation, this would use a geocoding API like Google Maps
    // For now, return mock coordinates based on address
    return new Promise((resolve) => {
      // Mock coordinates - in production, use a geocoding service
      const mockCoordinates = {
        '17th Cross, Richmond': { latitude: 12.9716, longitude: 77.5946 },
        '27th Cross, Richmond': { latitude: 12.9750, longitude: 77.6000 },
        'London': { latitude: 51.5074, longitude: -0.1278 },
        'Downtown': { latitude: 40.7128, longitude: -74.0060 },
        'Midtown': { latitude: 40.7589, longitude: -73.9851 }
      };

      // Try to find matching address
      const addressKey = Object.keys(mockCoordinates).find(key => 
        address.toLowerCase().includes(key.toLowerCase())
      );

      if (addressKey) {
        resolve(mockCoordinates[addressKey]);
      } else {
        // Default to a central location if address not found
        resolve({ latitude: 12.9716, longitude: 77.5946 });
      }
    });
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Get distance to a healthcare provider
  getDistanceToProvider(provider, userLat, userLon) {
    if (!userLat || !userLon || !provider.latitude || !provider.longitude) {
      return null;
    }

    return this.calculateDistance(
      userLat,
      userLon,
      provider.latitude,
      provider.longitude
    );
  }

  // Get nearby providers within a radius (in km)
  getNearbyProviders(providers, userLat, userLon, radius = 10) {
    if (!userLat || !userLon) {
      return [];
    }

    return providers
      .map(provider => ({
        ...provider,
        distance: this.getDistanceToProvider(provider, userLat, userLon)
      }))
      .filter(provider => provider.distance !== null && provider.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }

  // Format distance for display
  formatDistance(distance) {
    if (distance === null || distance === undefined) {
      return 'Distance unavailable';
    }
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  }
}

// Create and export a singleton instance
const locationService = new LocationService();
export default locationService;
