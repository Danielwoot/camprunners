import { DyrtCampsite } from '../data/dyrtCampsites';
import { MapBounds } from './dyrtService';

/**
 * Fetch authentic Hipcamp private lands, glamping retreats, and outposts within bounding box.
 */
export async function fetchHipcampInBounds(bounds: MapBounds): Promise<DyrtCampsite[]> {
  const { minLat, maxLat, minLng, maxLng } = bounds;

  const url = `/api/hipcamp/search?swLat=${minLat.toFixed(4)}&swLng=${minLng.toFixed(4)}&neLat=${maxLat.toFixed(4)}&neLng=${maxLng.toFixed(4)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn('[Hipcamp Service] Received non-OK response from proxy:', response.status);
      return [];
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error('[Hipcamp Service] Error fetching Hipcamp listings:', error);
    return [];
  }
}
