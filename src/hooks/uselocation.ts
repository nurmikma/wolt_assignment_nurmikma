// src/hooks/useLocation.ts
import { useState } from 'react';

export const useLocation = () => {
  const [latitude, setLatitude] = useState<string | number>('');
  const [longitude, setLongitude] = useState<string | number>('');
  const [error, setError] = useState<string>('');

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
        },
        () => {
          setError('Unable to fetch your location.');
        },
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  return {
    latitude,
    longitude,
    error,
    getLocation,
  };
};
