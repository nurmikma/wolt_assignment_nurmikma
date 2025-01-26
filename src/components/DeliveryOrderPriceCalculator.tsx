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

  const formatPrice = (value: number): string => {
    return `€${(value / 100).toFixed(2)}`;
  };

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
        cartValue: Math.round(parseFloat(cartValue as string) * 100), // Convert to cents
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
        data-testid="venueSlug"
        value={venueSlug}
        onChange={(e) => setVenueSlug(e.target.value)}
      />

      <label htmlFor="cartValue" aria-label="Enter the cart value in euros">
        Cart Value (EUR)
      </label>
      <input
        id="cartValue"
        type="text"
        data-testid="cartValue"
        value={cartValue}
        onChange={(e) => setCartValue(e.target.value)}
      />

      <label htmlFor="userLatitude" aria-label="Enter your latitude">
        User Latitude
      </label>
      <input
        id="userLatitude"
        type="text"
        data-testid="userLatitude"
        value={userLatitude}
        onChange={(e) => setUserLatitude(e.target.value)}
      />

      <label htmlFor="userLongitude" aria-label="Enter your longitude">
        User Longitude
      </label>
      <input
        id="userLongitude"
        type="text"
        data-testid="userLongitude"
        value={userLongitude}
        onChange={(e) => setUserLongitude(e.target.value)}
      />

      <button type="button" onClick={getLocation} data-testid="getLocation">
        Get Location
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        data-testid="calculateDelivery"
      >
        Calculate
      </button>

      {isLoading && <p>Loading...</p>}

      {pricing && (
        <div>
          <h2>Pricing Breakdown</h2>
          <p>
            Cart Value:{' '}
            <span data-raw-value={pricing.cartValue}>
              {formatPrice(pricing.cartValue)}
            </span>
          </p>
          <p>
            Small Order Surcharge:{' '}
            <span data-raw-value={pricing.smallOrderSurcharge}>
              {formatPrice(pricing.smallOrderSurcharge)}
            </span>
          </p>
          <p>
            Delivery Fee:{' '}
            <span data-raw-value={pricing.deliveryFee}>
              {formatPrice(pricing.deliveryFee)}
            </span>
          </p>
          <p>
            Distance:{' '}
            <span data-raw-value={pricing.distance}>{pricing.distance} m</span>
          </p>
          <p>
            Total Price:{' '}
            <span data-raw-value={pricing.totalPrice}>
              {formatPrice(pricing.totalPrice)}
            </span>
          </p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
    </div>
  );
};

export default DeliveryOrderPriceCalculator;
