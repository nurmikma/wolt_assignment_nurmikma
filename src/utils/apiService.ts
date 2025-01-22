// src/utils/apiService.ts
export const fetchVenueData = async (venueSlug: string) => {
  const staticUrl = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`;
  const dynamicUrl = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`;

  try {
    const [staticResponse, dynamicResponse] = await Promise.all([
      fetch(staticUrl),
      fetch(dynamicUrl),
    ]);

    if (!staticResponse.ok || !dynamicResponse.ok) {
      throw new Error('Failed to fetch venue data');
    }

    const staticData = await staticResponse.json();
    const dynamicData = await dynamicResponse.json();

    return { staticData, dynamicData };
  } catch (error) {
    console.error('Error fetching venue data:', error);
    throw error;
  }
};
