// src/utils/deliveryPricing.ts
import { calculateDistance } from './deliveryUtils';

export const calculateDeliveryPricing = ({
  cartValue,
  venueSlug,
  userLatitude,
  userLongitude,
  staticData,
  dynamicData,
}: {
  cartValue: number;
  venueSlug: string;
  userLatitude: number;
  userLongitude: number;
  staticData: any;
  dynamicData: any;
}) => {
  const orderMinimumNoSurcharge =
    dynamicData.venue_raw.delivery_specs.order_minimum_no_surcharge;
  const basePrice =
    dynamicData.venue_raw.delivery_specs.delivery_pricing.base_price;
  const distanceRanges =
    dynamicData.venue_raw.delivery_specs.delivery_pricing.distance_ranges;
  const venueCoordinates = staticData.venue_raw.location.coordinates;

  // Calculate small order surcharge
  const smallOrderSurcharge = Math.max(0, orderMinimumNoSurcharge - cartValue);

  // Calculate distance
  const distance = calculateDistance(
    userLatitude,
    userLongitude,
    venueCoordinates[1], // Venue latitude
    venueCoordinates[0], // Venue longitude
  );

  // Calculate delivery fee
  let deliveryFee = basePrice;
  for (const range of distanceRanges) {
    if (distance >= range.min && (range.max === 0 || distance < range.max)) {
      deliveryFee += range.a + Math.round((range.b * distance) / 10);
      break;
    }
  }

  // If the distance is out of range
  if (distance >= distanceRanges[distanceRanges.length - 1].min) {
    throw new Error('Delivery not possible due to distance');
  }

  // Total price
  const totalPrice = cartValue + smallOrderSurcharge + deliveryFee;

  return {
    cartValue,
    smallOrderSurcharge,
    deliveryFee,
    distance,
    totalPrice,
  };
};
