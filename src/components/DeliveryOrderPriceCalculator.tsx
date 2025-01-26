import React, { useState, useEffect } from 'react';
import { useLocation } from '../hooks/useLocation';
import {
  validateCartValue,
  validateLatitudeLongitude,
} from '../utils/validation';
import { fetchVenueData } from '../utils/apiService';
import {
  calculateDeliveryPricing,
  PricingDetails,
} from '../utils/deliveryPricing';
import '../styles/DeliveryOrderPriceCalculator.css';

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
  const [pricing, setPricing] = useState<PricingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setUserLatitude(latitude);
      setUserLongitude(longitude);
    }
  }, [latitude, longitude]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setPricing(null);

    try {
      const cartValueError = validateCartValue(cartValue);
      const latitudeError = validateLatitudeLongitude(userLatitude, 'latitude');
      const longitudeError = validateLatitudeLongitude(
        userLongitude,
        'longitude',
      );

      if (cartValueError || latitudeError || longitudeError) {
        setError(cartValueError || latitudeError || longitudeError);
        return;
      }

      const venueData = await fetchVenueData(venueSlug);

      const calculatedPricing = calculateDeliveryPricing({
        cartValue: parseFloat(cartValue as string),
        venueSlug,
        userLatitude: parseFloat(userLatitude as string),
        userLongitude: parseFloat(userLongitude as string),
        staticData: venueData.staticData,
        dynamicData: venueData.dynamicData,
      });

      setPricing(calculatedPricing);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="delivery-order-calculator">
      <h1>Delivery Order Price Calculator</h1>

      <label htmlFor="venueSlug" aria-label="Enter the venue slug">
        Venue Slug
      </label>
      <input
        id="venueSlug"
        type="text"
        data-test-id="venueSlug"
        value={venueSlug}
        onChange={(e) => setVenueSlug(e.target.value)}
      />

      <label htmlFor="cartValue" aria-label="Enter the cart value in euros">
        Cart Value (EUR)
      </label>
      <input
        id="cartValue"
        type="text"
        data-test-id="cartValue"
        value={cartValue}
        onChange={(e) => setCartValue(e.target.value)}
      />

      <label htmlFor="userLatitude" aria-label="Enter your latitude">
        User Latitude
      </label>
      <input
        id="userLatitude"
        type="text"
        data-test-id="userLatitude"
        value={userLatitude}
        onChange={(e) => setUserLatitude(e.target.value)}
      />

      <label htmlFor="userLongitude" aria-label="Enter your longitude">
        User Longitude
      </label>
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

      <button
        type="button"
        onClick={handleSubmit}
        data-test-id="calculateDelivery"
      >
        Calculate
      </button>

      {isLoading && <p>Loading...</p>}

      {pricing && (
        <div>
          <h2>Pricing Breakdown</h2>
          <p>Cart Value: €{pricing.cartValue}</p>
          <p>Small Order Surcharge: €{pricing.smallOrderSurcharge}</p>
          <p>Delivery Fee: €{pricing.deliveryFee}</p>
          <p>Distance: {pricing.distance} meters</p>
          <p>Total Price: €{pricing.totalPrice}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
    </div>
  );
};

export default DeliveryOrderPriceCalculator;
