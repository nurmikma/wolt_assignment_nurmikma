export interface PricingDetails {
  cartValue: number;
  smallOrderSurcharge: number;
  deliveryFee: number;
  distance: number;
  totalPrice: number;
}

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
}): PricingDetails => {
  const orderMinimumNoSurcharge =
    dynamicData.venue_raw.delivery_specs.order_minimum_no_surcharge;
  const basePrice =
    dynamicData.venue_raw.delivery_specs.delivery_pricing.base_price;
  const distanceRanges =
    dynamicData.venue_raw.delivery_specs.delivery_pricing.distance_ranges;
  const venueCoordinates = staticData.venue_raw.location.coordinates;

  const smallOrderSurcharge = Math.max(0, orderMinimumNoSurcharge - cartValue);

  const distance = calculateDistance(
    userLatitude,
    userLongitude,
    venueCoordinates[1],
    venueCoordinates[0],
  );

  let deliveryFee = basePrice;
  for (const range of distanceRanges) {
    if (distance >= range.min && (range.max === 0 || distance < range.max)) {
      deliveryFee += range.a + Math.round((range.b * distance) / 100);
      break;
    }
  }

  if (distance >= distanceRanges[distanceRanges.length - 1].min) {
    throw new Error('Delivery not possible due to distance');
  }

  const totalPrice = cartValue + smallOrderSurcharge + deliveryFee;

  return {
    cartValue,
    smallOrderSurcharge,
    deliveryFee,
    distance,
    totalPrice,
  };
};

function calculateDistance(
  userLatitude: number,
  userLongitude: number,
  venueLatitude: number,
  venueLongitude: number,
): number {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const earthRadiusKm = 6371; // Radius of the Earth in kilometers
  const earthRadiusM = earthRadiusKm * 1000; // Radius of the Earth in meters

  const dLat = toRadians(venueLatitude - userLatitude);
  const dLon = toRadians(venueLongitude - userLongitude);

  const lat1 = toRadians(userLatitude);
  const lat2 = toRadians(venueLatitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const earthRadius = earthRadiusM * c;

  return parseFloat(earthRadius.toFixed(0));
}
