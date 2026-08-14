import { DyrtCampsite } from '../data/dyrtCampsites';
import { MapBounds } from './dyrtService';

/**
 * Fetch premier Campspot private RV resorts, glamping destinations, and family campgrounds in bounding box.
 */
export async function fetchCampspotInBounds(bounds: MapBounds): Promise<DyrtCampsite[]> {
  const { minLat, maxLat, minLng, maxLng } = bounds;

  const url = `/api/campspot/search?swLat=${minLat.toFixed(4)}&swLng=${minLng.toFixed(4)}&neLat=${maxLat.toFixed(4)}&neLng=${maxLng.toFixed(4)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn('[Campspot Service] Received non-OK response from proxy:', response.status);
      return [];
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error('[Campspot Service] Error fetching Campspot listings:', error);
    return [];
  }
}
