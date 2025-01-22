// src/components/DeliveryOrderPriceCalculator.tsx
import React, { useState } from 'react';
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
  const [userLatitude, setUserLatitude] = useState<string | number>(latitude);
  const [userLongitude, setUserLongitude] = useState<string | number>(
    longitude,
  );
  const [error, setError] = useState<string>('');
  const [pricing, setPricing] = useState<any>(null);

  const handleSubmit = async () => {
    const cartValueParsed = parseFloat(cartValue as string);
    const userLatitudeParsed = parseFloat(userLatitude as string);
    const userLongitudeParsed = parseFloat(userLongitude as string);

    const venueData = await fetchVenueData(venueSlug);

    try {
      const calculatedPricing = calculateDeliveryPricing({
        cartValue: cartValueParsed,
        venueSlug,
        userLatitude: userLatitudeParsed,
        userLongitude: userLongitudeParsed,
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
      {/* Form elements */}
      <button onClick={handleSubmit}>Calculate</button>
      {pricing && <div>{JSON.stringify(pricing)}</div>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default DeliveryOrderPriceCalculator;
