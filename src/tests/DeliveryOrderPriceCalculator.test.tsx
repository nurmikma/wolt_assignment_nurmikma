import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeliveryOrderPriceCalculator from '../components/DeliveryOrderPriceCalculator';
import React from 'react';
import '@testing-library/jest-dom';

jest.mock('../hooks/useLocation', () => ({
  useLocation: () => ({
    latitude: 60.192059,
    longitude: 24.945831,
    error: null,
    getLocation: jest.fn(),
  }),
}));

jest.mock('../utils/apiService', () => ({
  fetchVenueData: jest.fn(() =>
    Promise.resolve({
      staticData: {
        venue_raw: {
          location: { coordinates: [24.945831, 60.192059] },
        },
      },
      dynamicData: {
        venue_raw: {
          delivery_specs: {
            order_minimum_no_surcharge: 1000,
            delivery_pricing: {
              base_price: 500,
              distance_ranges: [
                { min: 0, max: 2000, a: 100, b: 50 },
                { min: 2000, max: 0, a: 200, b: 75 },
              ],
            },
          },
        },
      },
    }),
  ),
}));

describe('DeliveryOrderPriceCalculator', () => {
  beforeEach(() => {
    render(<DeliveryOrderPriceCalculator />);
  });

  it('renders input fields and buttons with data-test-ids', () => {
    expect(screen.getByTestId('venueSlug')).toBeInTheDocument();
    expect(screen.getByTestId('cartValue')).toBeInTheDocument();
    expect(screen.getByTestId('userLatitude')).toBeInTheDocument();
    expect(screen.getByTestId('userLongitude')).toBeInTheDocument();
    expect(screen.getByTestId('getLocation')).toBeInTheDocument();
    expect(screen.getByTestId('calculateDelivery')).toBeInTheDocument();
  });

  it('updates input values correctly', () => {
    const venueSlugInput = screen.getByTestId('venueSlug');
    const cartValueInput = screen.getByTestId('cartValue');

    fireEvent.change(venueSlugInput, { target: { value: 'test-venue' } });
    fireEvent.change(cartValueInput, { target: { value: '20' } });

    expect(venueSlugInput).toHaveValue('test-venue');
    expect(cartValueInput).toHaveValue('20');
  });

  it('displays error message for invalid cart value', async () => {
    const cartValueInput = screen.getByTestId('cartValue');
    fireEvent.change(cartValueInput, { target: { value: '-10' } });

    fireEvent.click(screen.getByTestId('calculateDelivery'));

    expect(
      await screen.findByText(/Cart value must be a non-negative number/i),
    ).toBeInTheDocument();
  });

  it('calculates delivery pricing correctly', async () => {
    const cartValueInput = screen.getByTestId('cartValue');
    fireEvent.change(cartValueInput, { target: { value: '2000' } });

    fireEvent.click(screen.getByTestId('calculateDelivery'));

    await waitFor(() => {
      expect(screen.getByText('€2000.00')).toHaveAttribute(
        'data-raw-value',
        '200000',
      );
    });
  });

  it('fetches user location and updates latitude/longitude fields', async () => {
    const { getLocation } = require('../hooks/useLocation').useLocation();

    fireEvent.click(screen.getByTestId('getLocation'));

    expect(getLocation).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByTestId('userLatitude')).toHaveValue('60.192059');
      expect(screen.getByTestId('userLongitude')).toHaveValue('24.945831');
    });
  });
});
