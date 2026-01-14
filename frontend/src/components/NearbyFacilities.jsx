import React, { useState, useEffect } from 'react';
import { hospitals, clinics, pharmacies } from '../assets/assets';
import locationService from '../services/locationService';
import { assets } from '../assets/assets';

const NearbyFacilities = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'hospitals', 'clinics', 'pharmacies'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(10); // km

  // Try to get user's current location on mount
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const location = await locationService.getCurrentPosition();
        setUserLocation(location);
        setSearchLocation(`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
      } catch (err) {
        console.log('Location access denied or failed:', err.message);
      }
    };
    getCurrentLocation();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    
    try {
      let searchLat, searchLon;

      if (searchLocation.trim()) {
        // Try to geocode the entered location
        const coords = await locationService.geocodeAddress(searchLocation);
        searchLat = coords.latitude;
        searchLon = coords.longitude;
      } else if (userLocation) {
        // Use current location if available
        searchLat = userLocation.latitude;
        searchLon = userLocation.longitude;
      } else {
        setError('Please enter a location or allow location access');
        setLoading(false);
        return;
      }

      // Get facilities based on selected type
      let facilities = [];
      if (selectedType === 'all' || selectedType === 'hospitals') {
        facilities = [...facilities, ...hospitals.map(h => ({ ...h, facilityType: 'hospital' }))];
      }
      if (selectedType === 'all' || selectedType === 'clinics') {
        facilities = [...facilities, ...clinics.map(c => ({ ...c, facilityType: 'clinic' }))];
      }
      if (selectedType === 'all' || selectedType === 'pharmacies') {
        facilities = [...facilities, ...pharmacies.map(p => ({ ...p, facilityType: 'pharmacy' }))];
      }

      // Get nearby facilities
      const nearbyFacilities = locationService.getNearbyProviders(
        facilities,
        searchLat,
        searchLon,
        radius
      );

      setResults(nearbyFacilities);
    } catch (err) {
      setError('Failed to search facilities. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLoading(true);
      const location = await locationService.getCurrentPosition();
      setUserLocation(location);
      setSearchLocation(`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
      setError('');
    } catch (err) {
      setError('Failed to get current location. Please allow location access.');
    } finally {
      setLoading(false);
    }
  };

  const getFacilityIcon = (type) => {
    switch (type) {
      case 'hospital':
        return '🏥';
      case 'clinic':
        return '🏥';
      case 'pharmacy':
        return '💊';
      default:
        return '📍';
    }
  };

  return (
    <div className='mt-8 border border-[#ADADAD] rounded-lg p-6 bg-white'>
      <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
        Find Nearby Healthcare Facilities
      </h2>

      {/* Search Section */}
      <div className='space-y-4 mb-6'>
        <div className='flex flex-col sm:flex-row gap-3'>
          <input
            type='text'
            placeholder='Enter location or use current location'
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className='flex-1 px-4 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
          <button
            onClick={handleUseCurrentLocation}
            className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap'
          >
            Use Current Location
          </button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Facility Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className='w-full px-4 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            >
              <option value='all'>All Facilities</option>
              <option value='hospitals'>Hospitals</option>
              <option value='clinics'>Clinics</option>
              <option value='pharmacies'>Pharmacies</option>
            </select>
          </div>

          <div className='w-full sm:w-32'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Radius (km)
            </label>
            <input
              type='number'
              min='1'
              max='50'
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className='w-full px-4 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className='mt-6 sm:mt-0 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
          {error}
        </div>
      )}

      {/* Results Section */}
      {results.length > 0 && (
        <div className='mt-6'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4'>
            Found {results.length} {results.length === 1 ? 'facility' : 'facilities'}
          </h3>
          <div className='space-y-4'>
            {results.map((facility) => (
              <div
                key={facility._id}
                className='border border-[#DDDDDD] rounded-lg p-4 hover:shadow-md transition-shadow'
              >
                <div className='flex flex-col sm:flex-row gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='text-2xl'>{getFacilityIcon(facility.facilityType)}</span>
                      <h4 className='text-lg font-semibold text-gray-800'>{facility.name}</h4>
                      {facility.rating && (
                        <div className='flex items-center gap-1 text-sm text-gray-600'>
                          <span>⭐</span>
                          <span>{facility.rating}</span>
                          {facility.reviewCount && (
                            <span className='text-gray-500'>({facility.reviewCount})</span>
                          )}
                        </div>
                      )}
                    </div>
                    <p className='text-sm text-gray-600 mb-2'>{facility.type}</p>
                    <div className='text-sm text-gray-600 mb-2'>
                      <p>{facility.address.line1}</p>
                      <p>{facility.address.line2}</p>
                    </div>
                    {facility.phone && (
                      <p className='text-sm text-gray-600 mb-2'>📞 {facility.phone}</p>
                    )}
                    {facility.distance !== null && facility.distance !== undefined && (
                      <p className='text-sm font-medium text-primary mt-2'>
                        📍 {locationService.formatDistance(facility.distance)}
                      </p>
                    )}
                  </div>
                  <div className='sm:w-48'>
                    {facility.departments && (
                      <div className='mb-2'>
                        <p className='text-xs font-medium text-gray-700 mb-1'>Departments:</p>
                        <div className='flex flex-wrap gap-1'>
                          {facility.departments.slice(0, 3).map((dept, idx) => (
                            <span
                              key={idx}
                              className='text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded'
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {facility.specialties && (
                      <div className='mb-2'>
                        <p className='text-xs font-medium text-gray-700 mb-1'>Specialties:</p>
                        <div className='flex flex-wrap gap-1'>
                          {facility.specialties.slice(0, 3).map((spec, idx) => (
                            <span
                              key={idx}
                              className='text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded'
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {facility.services && (
                      <div className='mb-2'>
                        <p className='text-xs font-medium text-gray-700 mb-1'>Services:</p>
                        <div className='flex flex-wrap gap-1'>
                          {facility.services.slice(0, 3).map((service, idx) => (
                            <span
                              key={idx}
                              className='text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded'
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {facility.openHours && (
                      <p className='text-xs text-gray-600 mt-2'>
                        🕐 {facility.openHours}
                      </p>
                    )}
                  </div>
                </div>
                {facility.about && (
                  <p className='text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200'>
                    {facility.about}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && searchLocation && (
        <div className='mt-6 text-center text-gray-500'>
          No facilities found in the specified radius. Try increasing the radius or checking a different location.
        </div>
      )}
    </div>
  );
};

export default NearbyFacilities;
