import React, { useState, useEffect } from 'react';
import { useLocation } from '../hooks/useLocation';
import {
  validateCartValue,
  validateLatitudeLongitude,
} from '../utils/validation';
import { fetchVenueData } from '../utils/apiService';
import { calculateDeliveryPricing } from '../utils/deliveryPricing';

const DeliveryOrderPriceCalculator: React.FC = () => {
  const {
    latitude,
    longitude,
    error: locationError,
    getLocation,
  } = useLocation();

  const [venueSlug, setVenueSlug] = useState('');
  const [cartValue, setCartValue] = useState<string | number>('');
  const [userLatitude, setUserLatitude] = useState<number | string>(
    latitude ?? '',
  );
  const [userLongitude, setUserLongitude] = useState<number | string>(
    longitude ?? '',
  );
  const [error, setError] = useState<string>('');
  const [pricing, setPricing] = useState<any>(null);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setUserLatitude(latitude);
      setUserLongitude(longitude);
    }
  }, [latitude, longitude]);

  const handleSubmit = async () => {
    try {
      if (!validateCartValue(cartValue)) {
        setError('Invalid cart value.');
        return;
      }

      if (
        typeof userLatitude === 'string' ||
        typeof userLongitude === 'string'
      ) {
        setError('Invalid latitude or longitude.');
        return;
      }

      const venueData = await fetchVenueData(venueSlug);

      const calculatedPricing = calculateDeliveryPricing({
        cartValue: parseFloat(cartValue as string),
        venueSlug,
        userLatitude, // use number directly here
        userLongitude, // use number directly here
        staticData: venueData.staticData,
        dynamicData: venueData.dynamicData,
      });

      setPricing(calculatedPricing);
      setError('');
    } catch (err) {
      setError('Delivery not possible.');
    }
  };

  return (
    <div className="delivery-order-calculator">
      <h1>Delivery Order Price Calculator</h1>
      <label htmlFor="venueSlug">Venue Slug</label>
      <input
        id="venueSlug"
        type="text"
        data-test-id="venueSlug"
        value={venueSlug}
        onChange={(e) => setVenueSlug(e.target.value)}
      />
      <label htmlFor="cartValue">Cart Value (EUR)</label>
      <input
        id="cartValue"
        type="text"
        data-test-id="cartValue"
        value={cartValue}
        onChange={(e) => setCartValue(e.target.value)}
      />
      <label htmlFor="userLatitude">User Latitude</label>
      <input
        id="userLatitude"
        type="text"
        data-test-id="userLatitude"
        value={userLatitude}
        onChange={(e) => setUserLatitude(e.target.value)}
      />
      <label htmlFor="userLongitude">User Longitude</label>
      <input
        id="userLongitude"
        type="text"
        data-test-id="userLongitude"
        value={userLongitude}
        onChange={(e) => setUserLongitude(e.target.value)}
      />
      <button type="button" onClick={getLocation} data-test-id="getLocation">
        Get Location
      </button>
      <button type="button" onClick={handleSubmit}>
        Calculate
      </button>

      {pricing && (
        <div>
          <h2>Pricing Breakdown</h2>
          {/* display pricing */}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
    </div>
  );
};

export default DeliveryOrderPriceCalculator;
