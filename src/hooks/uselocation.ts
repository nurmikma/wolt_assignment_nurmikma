import { useState } from 'react';

export const useLocation = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(parseFloat(position.coords.latitude.toFixed(6)));
          setLongitude(parseFloat(position.coords.longitude.toFixed(6)));
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
