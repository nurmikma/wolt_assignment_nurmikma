export const validateLatitudeLongitude = (
  value: string | number,
  type: 'latitude' | 'longitude',
): string => {
  const numValue = parseFloat(value as string);
  if (isNaN(numValue) || numValue < -90 || numValue > 90) {
    return `${type === 'latitude' ? 'Latitude' : 'Longitude'} must be between -90 and 90.`;
  }
  return '';
};

export const validateCartValue = (value: string | number): string => {
  const numValue = parseFloat(value as string);
  if (isNaN(numValue) || numValue < 0) {
    return 'Cart value must be a non-negative number.';
  }
  return '';
};
