import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { specialityData } from '../assets/assets';
import locationService from '../services/locationService';

const Hospitals = () => {
  const { category } = useParams();
  const { hospitals, clinics } = useContext(AppContext);
  const navigate = useNavigate();

  const [searchLocation, setSearchLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'hospitals', 'clinics'
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(10);
  const [showFilter, setShowFilter] = useState(false);

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

  // Filter facilities by category
  const filterByCategory = (facilities) => {
    if (selectedCategory === 'all') return facilities;
    
    return facilities.filter(facility => {
      if (facility.departments) {
        return facility.departments.some(dept => 
          dept.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }
      if (facility.specialties) {
        return facility.specialties.some(spec => 
          spec.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }
      return false;
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    
    try {
      let searchLat, searchLon;

      if (searchLocation.trim()) {
        const coords = await locationService.geocodeAddress(searchLocation);
        searchLat = coords.latitude;
        searchLon = coords.longitude;
      } else if (userLocation) {
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

      // Filter by category
      facilities = filterByCategory(facilities);

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

  const handleCategoryClick = (cat) => {
    if (selectedCategory === cat) {
      setSelectedCategory('all');
      navigate('/hospitals');
    } else {
      setSelectedCategory(cat);
      navigate(`/hospitals/${cat}`);
    }
  };

  const handleBookAppointment = (facility) => {
    navigate(`/hospital-appointment/${facility._id}`);
  };

  return (
    <div className='min-h-screen'>
      <div className='mb-6'>
        <h1 className='text-3xl font-semibold text-gray-800 mb-2'>
          Search Hospitals & Clinics
        </h1>
        <p className='text-gray-600'>
          Find nearby healthcare facilities and book appointments
        </p>
      </div>

      {/* Search Section */}
      <div className='border border-gray-300 rounded-lg p-6 bg-white mb-6'>
        <div className='space-y-4'>
          <div className='flex flex-col sm:flex-row gap-3'>
            <input
              type='text'
              placeholder='Enter location or use current location'
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
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
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
              >
                <option value='all'>All Facilities</option>
                <option value='hospitals'>Hospitals</option>
                <option value='clinics'>Clinics</option>
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
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
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

        {error && (
          <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
            {error}
          </div>
        )}
      </div>

      {/* Category Filters */}
      <div className='mb-6'>
        <div className='flex items-center gap-4 mb-4'>
          <button
            className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
            onClick={() => setShowFilter(prev => !prev)}
          >
            Categories
          </button>
          <h2 className='text-lg font-semibold text-gray-800'>
            Filter by Specialty
          </h2>
        </div>
        <div className={`flex flex-wrap gap-3 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {specialityData.map((item, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(item.speciality)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                selectedCategory === item.speciality
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item.speciality}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            Found {results.length} {results.length === 1 ? 'facility' : 'facilities'}
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {results.map((facility) => (
              <div
                key={facility._id}
                className='border border-gray-300 rounded-lg p-4 bg-white hover:shadow-lg transition-shadow'
              >
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-2xl'>
                    {facility.facilityType === 'hospital' ? '🏥' : '🏥'}
                  </span>
                  <h4 className='text-lg font-semibold text-gray-800'>
                    {facility.name}
                  </h4>
                </div>
                <p className='text-sm text-gray-600 mb-2'>{facility.type}</p>
                <div className='text-sm text-gray-600 mb-2'>
                  <p>{facility.address.line1}</p>
                  <p>{facility.address.line2}</p>
                </div>
                {facility.phone && (
                  <p className='text-sm text-gray-600 mb-2'>
                    📞 {facility.phone}
                  </p>
                )}
                {facility.rating && (
                  <div className='flex items-center gap-1 text-sm text-gray-600 mb-2'>
                    <span>⭐</span>
                    <span>{facility.rating}</span>
                    {facility.reviewCount && (
                      <span className='text-gray-500'>
                        ({facility.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                )}
                {facility.distance !== null && facility.distance !== undefined && (
                  <p className='text-sm font-medium text-primary mb-3'>
                    📍 {locationService.formatDistance(facility.distance)}
                  </p>
                )}
                <button
                  onClick={() => handleBookAppointment(facility)}
                  className='w-full mt-3 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors'
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && searchLocation && (
        <div className='text-center text-gray-500 py-8'>
          No facilities found in the specified radius. Try increasing the radius or checking a different location.
        </div>
      )}
    </div>
  );
};

export default Hospitals;
