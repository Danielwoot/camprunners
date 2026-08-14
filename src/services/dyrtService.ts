import { DYRT_CAMPSITES_DATA, DyrtCampsite } from '../data/dyrtCampsites';
import { fetchHipcampInBounds } from './hipcampService';
import { fetchCampspotInBounds } from './campspotService';

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface CampgroundSourceDetails {
  amenities: string[];
  description?: string | null;
  numberOfSites?: number | null;
  maxVehicleLength?: number | null;
  checkIn?: string | null;
  checkOut?: string | null;
  photos?: string[];
  image?: string | null;
}

/**
 * Fetch campgrounds dynamically using the local Vite scraper proxy.
 * If the scraper returns results, they are used; otherwise falls back to static dataset.
 */
export async function fetchCampsitesInBounds(bounds: MapBounds): Promise<DyrtCampsite[]> {
  const { minLat, maxLat, minLng, maxLng } = bounds;
  
  // Convert standard min/max to a bbox string: minLng,minLat,maxLng,maxLat
  const bbox = `${minLng.toFixed(3)},${minLat.toFixed(3)},${maxLng.toFixed(3)},${maxLat.toFixed(3)}`;

  try {
    const response = await fetch(`/api/dyrt/search?bbox=${bbox}`);

    if (!response.ok) {
      console.warn('Scraper API returned non-OK status, falling back to static bounds filter.');
      return getStaticCampsitesInBounds(bounds);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }

    // If live scraper is loading or returned 0, provide local bounds data
    return getStaticCampsitesInBounds(bounds);

  } catch (error) {
    console.error('Failed to fetch campsites from Dyrt Scraper, using fallback:', error);
    return getStaticCampsitesInBounds(bounds);
  }
}

/**
 * Fetch unified stream combining Public campgrounds, Hipcamp retreats, and Campspot resorts concurrently.
 */
export async function fetchUnifiedCampsitesInBounds(bounds: MapBounds): Promise<DyrtCampsite[]> {
  const [publicSites, hipcampSites, campspotSites] = await Promise.all([
    fetchCampsitesInBounds(bounds),
    fetchHipcampInBounds(bounds),
    fetchCampspotInBounds(bounds)
  ]);

  const map = new Map<string, DyrtCampsite>();
  for (const site of publicSites) {
    map.set(site.id, { ...site, source: site.source || 'public' });
  }
  for (const site of hipcampSites) {
    if (!map.has(site.id)) {
      map.set(site.id, { ...site, source: 'hipcamp' });
    }
  }
  for (const site of campspotSites) {
    if (!map.has(site.id)) {
      map.set(site.id, { ...site, source: 'campspot' });
    }
  }

  return Array.from(map.values());
}

/**
 * Fetch 100% authentic amenities and services directly from source API for any campground.
 */
export async function fetchCampgroundAmenities(
  locationIdOrSlug: string | number,
  source?: string,
  contactUrl?: string
): Promise<CampgroundSourceDetails | null> {
  try {
    if (source === 'campspot' || String(locationIdOrSlug).startsWith('campspot-')) {
      const slugParam = contactUrl || String(locationIdOrSlug);
      const response = await fetch(`/api/campspot/park?slug=${encodeURIComponent(slugParam)}`);
      if (!response.ok) return null;
      const data = await response.json();
      if (data && Array.isArray(data.amenities) && data.amenities.length > 0) {
        return data;
      }
      return null;
    }

    if (source === 'hipcamp' || String(locationIdOrSlug).startsWith('hipcamp-')) {
      const urlParam = contactUrl || String(locationIdOrSlug);
      const response = await fetch(`/api/hipcamp/land?url=${encodeURIComponent(urlParam)}`);
      if (!response.ok) return null;
      const data = await response.json();
      if (data && Array.isArray(data.amenities) && data.amenities.length > 0) {
        return data;
      }
      return null;
    }

    const rawId = String(locationIdOrSlug).replace(/^dyrt-/, '');
    const response = await fetch(`/api/dyrt/campground?id=${encodeURIComponent(rawId)}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data && Array.isArray(data.amenities) && data.amenities.length > 0) {
      return data;
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch campground source amenities:', err);
    return null;
  }
}

function getStaticCampsitesInBounds(bounds: MapBounds): DyrtCampsite[] {
  const { minLat, maxLat, minLng, maxLng } = bounds;
  const filtered = DYRT_CAMPSITES_DATA.filter((site) => {
    return site.lat >= minLat && site.lat <= maxLat && site.lng >= minLng && site.lng <= maxLng;
  });
  return filtered.length > 0 ? filtered : DYRT_CAMPSITES_DATA.slice(0, 8);
}
