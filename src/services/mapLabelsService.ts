export type TacticalLabelType = 'PARK' | 'PEAK' | 'PASS' | 'METRO' | 'VALLEY' | 'COAST';

export interface TacticalMapLabel {
  id: string;
  name: string;
  type: TacticalLabelType;
  lat: number;
  lng: number;
  minZoom: number;
  maxZoom?: number;
  elevation?: string;
  subtext?: string;
  badge?: string;
}

export const TACTICAL_MAP_LABELS: TacticalMapLabel[] = [
  // ================= NATIONAL PARKS & ICONIC WILDERNESS =================
  {
    id: 'park-yosemite',
    name: 'YOSEMITE NATIONAL PARK',
    type: 'PARK',
    lat: 37.8651,
    lng: -119.5383,
    minZoom: 6,
    maxZoom: 18,
    elevation: '3,966 - 13,114 FT',
    subtext: 'HIGH SIERRA SECTOR',
    badge: 'PARK'
  },
  {
    id: 'park-joshua-tree',
    name: 'JOSHUA TREE NATIONAL PARK',
    type: 'PARK',
    lat: 33.8734,
    lng: -115.9010,
    minZoom: 6,
    maxZoom: 18,
    elevation: '2,700 - 5,814 FT',
    subtext: 'MOJAVE / COLORADO DESERT',
    badge: 'PARK'
  },
  {
    id: 'park-lake-tahoe',
    name: 'LAKE TAHOE BASIN',
    type: 'PARK',
    lat: 39.0968,
    lng: -120.0324,
    minZoom: 6,
    maxZoom: 18,
    elevation: '6,225 FT',
    subtext: 'ALPINE CORRIDOR',
    badge: 'SECTOR'
  },
  {
    id: 'park-sequoia',
    name: 'SEQUOIA & KINGS CANYON',
    type: 'PARK',
    lat: 36.5647,
    lng: -118.7734,
    minZoom: 6,
    maxZoom: 18,
    elevation: '1,700 - 14,494 FT',
    subtext: 'ANCIENT GIANT FORESTS',
    badge: 'PARK'
  },
  {
    id: 'park-death-valley',
    name: 'DEATH VALLEY NATIONAL PARK',
    type: 'PARK',
    lat: 36.5323,
    lng: -116.9325,
    minZoom: 5,
    maxZoom: 18,
    elevation: '-282 FT TO 11,049 FT',
    subtext: 'ARID WILDERNESS',
    badge: 'PARK'
  },
  {
    id: 'park-big-bear',
    name: 'BIG BEAR LAKE & SAN BERNARDINO',
    type: 'PARK',
    lat: 34.2439,
    lng: -116.9114,
    minZoom: 7,
    maxZoom: 18,
    elevation: '6,752 FT',
    subtext: 'ALPINE BASECAMP',
    badge: 'SECTOR'
  },
  {
    id: 'park-zion',
    name: 'ZION NATIONAL PARK',
    type: 'PARK',
    lat: 37.2982,
    lng: -113.0263,
    minZoom: 6,
    maxZoom: 18,
    elevation: '3,666 - 8,726 FT',
    subtext: 'NAVAJO SANDSTONE CANYONS',
    badge: 'PARK'
  },
  {
    id: 'park-grand-canyon',
    name: 'GRAND CANYON NATIONAL PARK',
    type: 'PARK',
    lat: 36.0544,
    lng: -112.1401,
    minZoom: 5,
    maxZoom: 18,
    elevation: '2,400 - 8,803 FT',
    subtext: 'COLORADO PLATEAU SECTOR',
    badge: 'PARK'
  },
  {
    id: 'park-yellowstone',
    name: 'YELLOWSTONE NATIONAL PARK',
    type: 'PARK',
    lat: 44.4280,
    lng: -110.5885,
    minZoom: 5,
    maxZoom: 18,
    elevation: '7,733 FT',
    subtext: 'VOLCANIC CALDERA CORRIDOR',
    badge: 'PARK'
  },
  {
    id: 'park-grand-teton',
    name: 'GRAND TETON NATIONAL PARK',
    type: 'PARK',
    lat: 43.7904,
    lng: -110.6818,
    minZoom: 6,
    maxZoom: 18,
    elevation: '6,320 - 13,775 FT',
    subtext: 'TETON RANGE',
    badge: 'PARK'
  },
  {
    id: 'park-glacier',
    name: 'GLACIER NATIONAL PARK',
    type: 'PARK',
    lat: 48.7596,
    lng: -113.7870,
    minZoom: 5,
    maxZoom: 18,
    elevation: '3,153 - 10,466 FT',
    subtext: 'CONTINENTAL DIVIDE',
    badge: 'PARK'
  },
  {
    id: 'park-olympic',
    name: 'OLYMPIC NATIONAL PARK',
    type: 'PARK',
    lat: 47.8021,
    lng: -123.6044,
    minZoom: 6,
    maxZoom: 18,
    elevation: 'SEA LEVEL - 7,980 FT',
    subtext: 'PACIFIC TEMPERATE RAINFOREST',
    badge: 'PARK'
  },
  {
    id: 'park-rainier',
    name: 'MOUNT RAINIER NATIONAL PARK',
    type: 'PARK',
    lat: 46.8523,
    lng: -121.7603,
    minZoom: 6,
    maxZoom: 18,
    elevation: '14,411 FT',
    subtext: 'CASCADE VOLCANIC ARC',
    badge: 'PARK'
  },
  {
    id: 'park-crater-lake',
    name: 'CRATER LAKE NATIONAL PARK',
    type: 'PARK',
    lat: 42.8684,
    lng: -122.1685,
    minZoom: 6,
    maxZoom: 18,
    elevation: '6,178 FT',
    subtext: 'CALDERA BASIN',
    badge: 'PARK'
  },
  {
    id: 'park-redwood',
    name: 'REDWOOD NATIONAL & STATE PARKS',
    type: 'PARK',
    lat: 41.2132,
    lng: -124.0046,
    minZoom: 6,
    maxZoom: 18,
    elevation: 'SEA LEVEL - 3,100 FT',
    subtext: 'COASTAL REDWOOD CORRIDOR',
    badge: 'PARK'
  },
  {
    id: 'park-rocky-mountain',
    name: 'ROCKY MOUNTAIN NATIONAL PARK',
    type: 'PARK',
    lat: 40.3428,
    lng: -105.6836,
    minZoom: 6,
    maxZoom: 18,
    elevation: '7,860 - 14,259 FT',
    subtext: 'CONTINENTAL DIVIDE TRAIL',
    badge: 'PARK'
  },
  {
    id: 'park-arches',
    name: 'ARCHES & CANYONLANDS',
    type: 'PARK',
    lat: 38.7331,
    lng: -109.5925,
    minZoom: 6,
    maxZoom: 18,
    elevation: '4,085 - 5,653 FT',
    subtext: 'RED ROCK WILDERNESS',
    badge: 'PARK'
  },
  {
    id: 'park-sedona',
    name: 'SEDONA RED ROCK CORRIDOR',
    type: 'PARK',
    lat: 34.8697,
    lng: -111.7610,
    minZoom: 7,
    maxZoom: 18,
    elevation: '4,350 FT',
    subtext: 'OAK CREEK CANYON',
    badge: 'SECTOR'
  },
  {
    id: 'park-big-sur',
    name: 'BIG SUR COASTAL HIGHWAY',
    type: 'COAST',
    lat: 36.2704,
    lng: -121.8081,
    minZoom: 7,
    maxZoom: 18,
    elevation: 'PACIFIC COASTLINE',
    subtext: 'HWY 1 SCENIC BYWAY',
    badge: 'COAST'
  },
  {
    id: 'park-mammoth',
    name: 'MAMMOTH LAKES // EASTERN SIERRA',
    type: 'PARK',
    lat: 37.6485,
    lng: -118.9721,
    minZoom: 7,
    maxZoom: 18,
    elevation: '7,880 FT',
    subtext: 'ANSEL ADAMS WILDERNESS GATEWAY',
    badge: 'SECTOR'
  },
  {
    id: 'park-anza-borrego',
    name: 'ANZA-BORREGO DESERT STATE PARK',
    type: 'PARK',
    lat: 33.2560,
    lng: -116.3740,
    minZoom: 7,
    maxZoom: 18,
    elevation: '15 FT - 6,193 FT',
    subtext: 'CALIFORNIA DESERT SECTOR',
    badge: 'PARK'
  },
  {
    id: 'park-lassen',
    name: 'LASSEN VOLCANIC NATIONAL PARK',
    type: 'PARK',
    lat: 40.4977,
    lng: -121.4207,
    minZoom: 6,
    maxZoom: 18,
    elevation: '5,800 - 10,457 FT',
    subtext: 'HYDROTHERMAL SECTOR',
    badge: 'PARK'
  },

  // ================= ICONIC PEAKS & PASSES =================
  {
    id: 'peak-whitney',
    name: 'MOUNT WHITNEY',
    type: 'PEAK',
    lat: 36.5785,
    lng: -118.2923,
    minZoom: 8,
    maxZoom: 18,
    elevation: '14,505 FT',
    subtext: 'HIGHEST CONUS SUMMIT',
    badge: 'PEAK'
  },
  {
    id: 'peak-shasta',
    name: 'MOUNT SHASTA',
    type: 'PEAK',
    lat: 41.4092,
    lng: -122.1949,
    minZoom: 7,
    maxZoom: 18,
    elevation: '14,179 FT',
    subtext: 'STRATOVOLCANO SUMMIT',
    badge: 'PEAK'
  },
  {
    id: 'pass-tioga',
    name: 'TIOGA PASS // HIGHWAY 120',
    type: 'PASS',
    lat: 37.9108,
    lng: -119.2574,
    minZoom: 9,
    maxZoom: 18,
    elevation: '9,943 FT',
    subtext: 'HIGHEST HIGHWAY PASS IN CA',
    badge: 'PASS'
  },
  {
    id: 'pass-donner',
    name: 'DONNER PASS // INTERSTATE 80',
    type: 'PASS',
    lat: 39.3149,
    lng: -120.3291,
    minZoom: 8,
    maxZoom: 18,
    elevation: '7,056 FT',
    subtext: 'SIERRA TRANSIT CORRIDOR',
    badge: 'PASS'
  },
  {
    id: 'pass-grapevine',
    name: 'THE GRAPEVINE // TEJON PASS (I-5)',
    type: 'PASS',
    lat: 34.8755,
    lng: -118.8876,
    minZoom: 8,
    maxZoom: 18,
    elevation: '4,144 FT',
    subtext: 'SOCAL // CENTRAL VALLEY LINK',
    badge: 'PASS'
  },
  {
    id: 'pass-cajon',
    name: 'CAJON PASS // I-15',
    type: 'PASS',
    lat: 34.3128,
    lng: -117.4739,
    minZoom: 8,
    maxZoom: 18,
    elevation: '3,777 FT',
    subtext: 'MOJAVE FREEWAY PASS',
    badge: 'PASS'
  },
  {
    id: 'peak-san-gorgonio',
    name: 'SAN GORGONIO MOUNTAIN',
    type: 'PEAK',
    lat: 34.0992,
    lng: -116.8247,
    minZoom: 8,
    maxZoom: 18,
    elevation: '11,503 FT',
    subtext: 'SOCAL HIGHEST SUMMIT',
    badge: 'PEAK'
  },
  {
    id: 'peak-san-jacinto',
    name: 'SAN JACINTO PEAK',
    type: 'PEAK',
    lat: 33.8147,
    lng: -116.6794,
    minZoom: 8,
    maxZoom: 18,
    elevation: '10,834 FT',
    subtext: 'PALM SPRINGS OVERLOOK',
    badge: 'PEAK'
  },
  {
    id: 'peak-baldy',
    name: 'MT. SAN ANTONIO (MT. BALDY)',
    type: 'PEAK',
    lat: 34.2892,
    lng: -117.6464,
    minZoom: 9,
    maxZoom: 18,
    elevation: '10,064 FT',
    subtext: 'SAN GABRIEL MOUNTAINS',
    badge: 'PEAK'
  },

  // ================= METRO SECTORS & EXPEDITION HUBS =================
  {
    id: 'metro-la',
    name: 'LOS ANGELES METRO SECTOR',
    type: 'METRO',
    lat: 34.0522,
    lng: -118.2437,
    minZoom: 5,
    maxZoom: 12,
    subtext: '34.05° N · 118.24° W',
    badge: 'METRO'
  },
  {
    id: 'metro-sf',
    name: 'SAN FRANCISCO BAY SECTOR',
    type: 'METRO',
    lat: 37.7749,
    lng: -122.4194,
    minZoom: 5,
    maxZoom: 12,
    subtext: '37.77° N · 122.41° W',
    badge: 'METRO'
  },
  {
    id: 'metro-sd',
    name: 'SAN DIEGO PACIFIC SECTOR',
    type: 'METRO',
    lat: 32.7157,
    lng: -117.1611,
    minZoom: 5,
    maxZoom: 12,
    subtext: '32.71° N · 117.16° W',
    badge: 'METRO'
  },
  {
    id: 'metro-sacramento',
    name: 'SACRAMENTO VALLEY HUB',
    type: 'METRO',
    lat: 38.5816,
    lng: -121.4944,
    minZoom: 5,
    maxZoom: 12,
    subtext: 'CAPITAL TRANSIT SECTOR',
    badge: 'METRO'
  },
  {
    id: 'metro-las-vegas',
    name: 'LAS VEGAS BASIN',
    type: 'METRO',
    lat: 36.1699,
    lng: -115.1398,
    minZoom: 5,
    maxZoom: 12,
    subtext: 'MOJAVE DESERT HUB',
    badge: 'METRO'
  },
  {
    id: 'metro-phoenix',
    name: 'PHOENIX METRO SECTOR',
    type: 'METRO',
    lat: 33.4484,
    lng: -112.0740,
    minZoom: 5,
    maxZoom: 12,
    subtext: 'SONORAN DESERT SECTOR',
    badge: 'METRO'
  },
  {
    id: 'metro-seattle',
    name: 'SEATTLE PUGET SOUND SECTOR',
    type: 'METRO',
    lat: 47.6062,
    lng: -122.3321,
    minZoom: 5,
    maxZoom: 12,
    subtext: 'PACIFIC NORTHWEST HUB',
    badge: 'METRO'
  },
  {
    id: 'metro-portland',
    name: 'PORTLAND WILLAMETTE SECTOR',
    type: 'METRO',
    lat: 45.5152,
    lng: -122.6784,
    minZoom: 5,
    maxZoom: 12,
    subtext: 'COLUMBIA RIVER GORGE HUB',
    badge: 'METRO'
  },
  {
    id: 'metro-denver',
    name: 'DENVER FRONT RANGE SECTOR',
    type: 'METRO',
    lat: 39.7392,
    lng: -104.9903,
    minZoom: 5,
    maxZoom: 12,
    subtext: 'MILE HIGH EXPEDITION BASE',
    badge: 'METRO'
  },
  {
    id: 'metro-slc',
    name: 'SALT LAKE CITY SECTOR',
    type: 'METRO',
    lat: 40.7608,
    lng: -111.8910,
    minZoom: 5,
    maxZoom: 12,
    subtext: 'WASATCH FRONT CORRIDOR',
    badge: 'METRO'
  },
  {
    id: 'metro-san-fernando',
    name: 'SAN FERNANDO VALLEY',
    type: 'METRO',
    lat: 34.2819,
    lng: -118.4390,
    minZoom: 8,
    maxZoom: 16,
    subtext: 'ANGELES FOREST FOOTHILLS',
    badge: 'VALLEY'
  },
  {
    id: 'metro-irvine',
    name: 'IRVINE // ORANGE COUNTY',
    type: 'METRO',
    lat: 33.6846,
    lng: -117.8265,
    minZoom: 8,
    maxZoom: 16,
    subtext: 'SADDLEBACK FOOTHILLS',
    badge: 'VALLEY'
  },
  {
    id: 'metro-fresno',
    name: 'FRESNO // CENTRAL VALLEY',
    type: 'METRO',
    lat: 36.7468,
    lng: -119.7726,
    minZoom: 6,
    maxZoom: 14,
    subtext: 'YOSEMITE / SIERRA EXPEDITION GATEWAY',
    badge: 'GATEWAY'
  },
  {
    id: 'metro-bakersfield',
    name: 'BAKERSFIELD SECTOR',
    type: 'METRO',
    lat: 35.3733,
    lng: -119.0187,
    minZoom: 6,
    maxZoom: 14,
    subtext: 'KERN RIVER / TEJON JUNCTION',
    badge: 'METRO'
  },
  {
    id: 'metro-bishop',
    name: 'BISHOP // OWENS VALLEY',
    type: 'VALLEY',
    lat: 37.3639,
    lng: -118.3952,
    minZoom: 8,
    maxZoom: 18,
    elevation: '4,150 FT',
    subtext: 'EASTERN SIERRA ADVENTURE HUB',
    badge: 'BASECAMP'
  },
  {
    id: 'metro-lone-pine',
    name: 'LONE PINE // ALABAMA HILLS',
    type: 'VALLEY',
    lat: 36.6060,
    lng: -118.0629,
    minZoom: 8,
    maxZoom: 18,
    elevation: '3,727 FT',
    subtext: 'MT. WHITNEY PORTAL ACCESS',
    badge: 'BASECAMP'
  },
  {
    id: 'metro-truckee',
    name: 'TRUCKEE // DONNER SECTOR',
    type: 'VALLEY',
    lat: 39.3280,
    lng: -120.1833,
    minZoom: 8,
    maxZoom: 18,
    elevation: '5,817 FT',
    subtext: 'NORTH TAHOE EXPEDITION HUB',
    badge: 'BASECAMP'
  },
  {
    id: 'metro-moab',
    name: 'MOAB // CANYON CORRIDOR',
    type: 'VALLEY',
    lat: 38.5733,
    lng: -109.5498,
    minZoom: 8,
    maxZoom: 18,
    elevation: '4,026 FT',
    subtext: 'SLICKROCK ADVENTURE HUB',
    badge: 'BASECAMP'
  }
];

export function getTacticalLabelsInBounds(
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  zoom: number
): TacticalMapLabel[] {
  return TACTICAL_MAP_LABELS.filter((label) => {
    // Check zoom compatibility
    if (zoom < label.minZoom) return false;
    if (label.maxZoom && zoom > label.maxZoom) return false;

    // Check bounds
    const insideLat = label.lat >= bounds.minLat - 0.2 && label.lat <= bounds.maxLat + 0.2;
    const insideLng = label.lng >= bounds.minLng - 0.2 && label.lng <= bounds.maxLng + 0.2;
    return insideLat && insideLng;
  });
}
