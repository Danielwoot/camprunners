import { DyrtCampsite } from '../data/dyrtCampsites';
import { ALL_CAMPSPOT_PARKS } from '../data/campspotParksData';
import { MapBounds } from './dyrtService';

/**
 * Fetch premier Campspot private RV resorts, glamping destinations, and family campgrounds in bounding box.
 */
export async function fetchCampspotInBounds(bounds: MapBounds): Promise<DyrtCampsite[]> {
  const { minLat, maxLat, minLng, maxLng } = bounds;

  const url = `/api/campspot/search?swLat=${minLat.toFixed(4)}&swLng=${minLng.toFixed(4)}&neLat=${maxLat.toFixed(4)}&neLng=${maxLng.toFixed(4)}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (error) {
    console.error('[Campspot Service] Error fetching Campspot listings from proxy:', error);
  }

  // Fallback to verified nationwide database
  return ALL_CAMPSPOT_PARKS.filter(
    p => p.lat >= minLat && p.lat <= maxLat && p.lng >= minLng && p.lng <= maxLng
  );
}
