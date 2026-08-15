import { MapBounds } from './dyrtService';

export interface FuelStation {
  id: string;
  name: string;
  brand: string;
  lat: number;
  lng: number;
  address: string;
  highwayRef: string;
  hasDiesel: boolean;
  hasPropane: boolean;
  hasEVCharging: boolean;
  hasRVDump: boolean;
  isOpen24Hours: boolean;
  amenities: string[];
  priceEstimate?: string;
}

export const VERIFIED_HIGHWAY_FUEL_STATIONS: FuelStation[] = [
  // ==========================================
  // I-5 GRAPEVINE, SAN FERNANDO, CASTAIC, CENTRAL VALLEY
  // ==========================================
  {
    id: 'fuel-mission-hills-chevron',
    name: 'Chevron & ExtraMile (I-5 / CA-118 Interchange)',
    brand: 'Chevron',
    lat: 34.2725,
    lng: -118.4680,
    address: '11160 Sepulveda Blvd, Mission Hills, CA 91345',
    highwayRef: 'I-5 Exit 159A / CA-118',
    hasDiesel: true,
    hasPropane: false,
    hasEVCharging: false,
    hasRVDump: false,
    isOpen24Hours: true,
    amenities: ['Diesel (High Flow)', '24/7 ExtraMile C-Store', 'Air & Water Pump', 'Restrooms', 'ATM'],
    priceEstimate: '$4.89 / gal (Reg)'
  },
  {
    id: 'fuel-san-fernando-shell',
    name: 'Shell & 7-Eleven (San Fernando Corridor)',
    brand: 'Shell',
    lat: 34.2885,
    lng: -118.4410,
    address: '12981 San Fernando Rd, Sylmar, CA 91342',
    highwayRef: 'I-5 Exit 161 (Roxford St)',
    hasDiesel: true,
    hasPropane: false,
    hasEVCharging: true,
    hasRVDump: false,
    isOpen24Hours: true,
    amenities: ['V-Power Diesel', 'Tesla Supercharger (8 Stalls)', '7-Eleven 24/7', 'Car Wash', 'Air/Water'],
    priceEstimate: '$4.95 / gal (Reg)'
  },
  {
    id: 'fuel-sylmar-mobil',
    name: 'Mobil & Circle K (I-5 / CA-210 Junction)',
    brand: 'Mobil',
    lat: 34.3120,
    lng: -118.4820,
    address: '15544 Sierra Hwy, Sylmar, CA 91342',
    highwayRef: 'I-5 / CA-14 Junction',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: false,
    hasRVDump: false,
    isOpen24Hours: true,
    amenities: ['Synergy Diesel', 'Propane Cylinder Refills', 'Circle K Mart', 'Heavy Rig Accessible'],
    priceEstimate: '$4.79 / gal (Reg)'
  },
  {
    id: 'fuel-santa-clarita-loves',
    name: "Love's Travel Stop & Country Store (Santa Clarita Gateway)",
    brand: "Love's",
    lat: 34.4280,
    lng: -118.5620,
    address: '25750 The Old Rd, Stevenson Ranch, CA 91381',
    highwayRef: 'I-5 Exit 169 (Lyons Ave / Calgrove)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: true,
    hasRVDump: true,
    isOpen24Hours: true,
    amenities: ['High-Flow RV & Truck Diesel', 'Propane Tank Refills', 'RV Dump Station', 'Subway / Godfather Pizza', 'Showers', 'CAT Scale'],
    priceEstimate: '$4.75 / gal (Reg)'
  },
  {
    id: 'fuel-castaic-pilot',
    name: 'Pilot Travel Center #168 (Castaic Lake / I-5 North)',
    brand: 'Pilot Flying J',
    lat: 34.4895,
    lng: -118.6235,
    address: '31642 Castaic Rd, Castaic, CA 91384',
    highwayRef: 'I-5 Exit 176 (Lake Hughes Rd)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: true,
    hasRVDump: true,
    isOpen24Hours: true,
    amenities: ['Dedicated RV Lanes', 'Ultra-Low Sulfur Diesel', 'Bulk Propane Refill', 'Free Air/Water', 'Wendy\'s 24/7', 'RV Overnight Parking'],
    priceEstimate: '$4.85 / gal (Reg)'
  },
  {
    id: 'fuel-castaic-shell',
    name: 'Shell Travel Plaza & Market (Castaic Summit)',
    brand: 'Shell',
    lat: 34.5050,
    lng: -118.6300,
    address: '31700 Castaic Rd, Castaic, CA 91384',
    highwayRef: 'I-5 Exit 176B',
    hasDiesel: true,
    hasPropane: false,
    hasEVCharging: false,
    hasRVDump: false,
    isOpen24Hours: true,
    amenities: ['Diesel', 'Large Truck Turning Radius', 'Marketplace', 'Clean Restrooms'],
    priceEstimate: '$4.92 / gal (Reg)'
  },
  {
    id: 'fuel-gorman-valero',
    name: 'Valero & Gorman Travel Plaza (Grapevine Southern Base)',
    brand: 'Valero',
    lat: 34.7950,
    lng: -118.8550,
    address: '49700 Gorman Post Rd, Gorman, CA 93243',
    highwayRef: 'I-5 Exit 202 (Gorman Post Rd)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: false,
    hasRVDump: true,
    isOpen24Hours: true,
    amenities: ['Diesel', 'Propane Refilling', 'RV Sanitary Dump ($10)', 'Carl\'s Jr / Taco Bell', 'Large Rig Pull-Through'],
    priceEstimate: '$5.10 / gal (Reg)'
  },
  {
    id: 'fuel-lebec-flying-j',
    name: 'Flying J Travel Plaza #615 (Lebec / Tejon Pass Summit)',
    brand: 'Pilot Flying J',
    lat: 34.8420,
    lng: -118.8830,
    address: '42810 Frazier Mountain Park Rd, Lebec, CA 93243',
    highwayRef: 'I-5 Exit 205 (Frazier Park / Tejon Pass 4,144 ft)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: true,
    hasRVDump: true,
    isOpen24Hours: true,
    amenities: ['High-Altitude Winter Diesel', 'Propane Filling Master Station', 'Full RV Service Island', 'Tesla Supercharger (16 Stalls)', 'Denny\'s 24/7', 'Drivers Lounge'],
    priceEstimate: '$4.99 / gal (Reg)'
  },
  {
    id: 'fuel-tejon-outlets-chevron',
    name: 'Chevron ExtraMile & EV Hub (Outlets at Tejon / Grapevine Base)',
    brand: 'Chevron',
    lat: 34.9850,
    lng: -118.9480,
    address: '5602 Dennis McCarthy Dr, Lebec, CA 93243',
    highwayRef: 'I-5 Exit 219A (Wheeler Ridge / Tejon Outlets)',
    hasDiesel: true,
    hasPropane: false,
    hasEVCharging: true,
    hasRVDump: false,
    isOpen24Hours: true,
    amenities: ['Electrify America 350kW Ultra-Fast EV', 'High Flow Diesel', 'Food Court Corridor', 'Starbucks Adjacent'],
    priceEstimate: '$4.75 / gal (Reg)'
  },
  {
    id: 'fuel-wheeler-ridge-ta',
    name: 'TA TravelCenter of America (Grapevine North Foot)',
    brand: 'TA TravelCenter',
    lat: 35.0120,
    lng: -118.9680,
    address: '5821 Dennis McCarthy Dr, Wheeler Ridge, CA 93203',
    highwayRef: 'I-5 Exit 219 (CA-99 / I-5 Split)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: true,
    hasRVDump: true,
    isOpen24Hours: true,
    amenities: ['12 Dedicated RV / Truck Lanes', 'Propane Refill Station', 'Free RV Dump with Fuel Purchase', 'Popeyes / Country Pride', 'Truck Service Bay'],
    priceEstimate: '$4.69 / gal (Reg)'
  },

  // ==========================================
  // US-395 EASTERN SIERRA & YOSEMITE CORRIDOR
  // ==========================================
  {
    id: 'fuel-lone-pine-chevron',
    name: 'Chevron Lone Pine (Mt. Whitney Portal & Alabama Hills)',
    brand: 'Chevron',
    lat: 36.6060,
    lng: -118.0630,
    address: '320 S Main St, Lone Pine, CA 93545',
    highwayRef: 'US-395 / Whitney Portal Rd',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: true,
    hasRVDump: false,
    isOpen24Hours: true,
    amenities: ['Diesel', 'Propane Exchange', 'Tesla Supercharger', 'Sierra General Store'],
    priceEstimate: '$5.25 / gal (Reg)'
  },
  {
    id: 'fuel-bishop-sinclair',
    name: 'Sinclair & Manor Market (Bishop Eastern Sierra Gateway)',
    brand: 'Sinclair',
    lat: 37.3620,
    lng: -118.3950,
    address: '3100 W Line St, Bishop, CA 93514',
    highwayRef: 'US-395 / CA-168 (Bishop Creek Canyon)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: false,
    hasRVDump: true,
    isOpen24Hours: true,
    amenities: ['Diesel', 'Propane Bulk Refill', 'Sanitary Dump Station', 'Deli / Bakery Fresh Supplies'],
    priceEstimate: '$4.99 / gal (Reg)'
  },
  {
    id: 'fuel-mammoth-chevron',
    name: 'Chevron & Mammoth Supercharger (Mammoth Lakes)',
    brand: 'Chevron',
    lat: 37.6480,
    lng: -118.9720,
    address: '3236 Main St, Mammoth Lakes, CA 93546',
    highwayRef: 'US-395 Exit CA-203 (Mammoth Lakes 7,880 ft)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: true,
    hasRVDump: false,
    isOpen24Hours: true,
    amenities: ['Winter Blend Alpine Diesel', 'Propane Tanks', 'Tesla Superchargers (12 Stalls)', 'Snow Chain Sales & Installation'],
    priceEstimate: '$5.49 / gal (Reg)'
  },
  {
    id: 'fuel-lee-vining-mobil',
    name: 'Mobil & Whoa Nellie Deli (Tioga Pass / Yosemite East Entrance)',
    brand: 'Mobil',
    lat: 37.9575,
    lng: -119.1220,
    address: '22 Vista Point Rd, Lee Vining, CA 93541',
    highwayRef: 'US-395 / CA-120 (Tioga Pass 9,943 ft Gateway)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: true,
    hasRVDump: false,
    isOpen24Hours: true,
    amenities: ['Diesel', 'Famous Whoa Nellie Gourmet Deli', 'Propane', 'Tesla & Rivian Fast Chargers', 'Spectacular Mono Lake Overlook'],
    priceEstimate: '$5.69 / gal (Reg)'
  },

  // ==========================================
  // I-15 MOJAVE & CAJON PASS CORRIDOR
  // ==========================================
  {
    id: 'fuel-cajon-pass-chevron',
    name: 'Chevron & McDonald\'s (Cajon Pass Summit / I-15 & CA-138)',
    brand: 'Chevron',
    lat: 34.3160,
    lng: -117.4720,
    address: '3198 St Hwy 138, San Bernardino, CA 92407',
    highwayRef: 'I-15 Exit 138 (Cajon Pass 3,777 ft)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: true,
    hasRVDump: true,
    isOpen24Hours: true,
    amenities: ['Heavy Duty Diesel', 'Propane Refill Island', 'RV Dump ($10)', 'Tesla Supercharger (20 Stalls)'],
    priceEstimate: '$4.95 / gal (Reg)'
  },
  {
    id: 'fuel-barstow-loves',
    name: "Love's Travel Stop #620 (Barstow Route 66 / I-15 Junction)",
    brand: "Love's",
    lat: 34.8950,
    lng: -117.0250,
    address: '2974 Lenwood Rd, Barstow, CA 92311',
    highwayRef: 'I-15 Exit 178 (Lenwood Rd)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: true,
    hasRVDump: true,
    isOpen24Hours: true,
    amenities: ['Dedicated RV Pump Islands', 'Free Potable Water', 'Full RV Sanitary Dump Station', 'Hardee\'s 24/7', 'Dog Park'],
    priceEstimate: '$4.65 / gal (Reg)'
  },
  {
    id: 'fuel-baker-world-tallest-thermometer',
    name: '76 & World\'s Tallest Thermometer Travel Plaza (Death Valley Gateway)',
    brand: '76',
    lat: 35.2650,
    lng: -116.0720,
    address: '72157 Baker Blvd, Baker, CA 92309',
    highwayRef: 'I-15 Exit 245 (Baker / Death Valley CA-127)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: true,
    hasRVDump: true,
    isOpen24Hours: true,
    amenities: ['Ultra-Clean Restrooms', 'Tesla Supercharger (40 Stalls)', 'Diesel', 'Propane', 'Alien Fresh Jerky Adjacent'],
    priceEstimate: '$5.15 / gal (Reg)'
  },

  // ==========================================
  // I-80 SIERRA NEVADA DONNER PASS & LAKE TAHOE
  // ==========================================
  {
    id: 'fuel-auburn-chevron',
    name: 'Chevron & Sierra Gateway Center (Auburn Foothills / I-80)',
    brand: 'Chevron',
    lat: 38.9050,
    lng: -121.0750,
    address: '13400 Lincoln Way, Auburn, CA 95603',
    highwayRef: 'I-80 Exit 119A (Foresthill / Auburn)',
    hasDiesel: true,
    hasPropane: false,
    hasEVCharging: true,
    hasRVDump: false,
    isOpen24Hours: true,
    amenities: ['Diesel', 'Tesla Supercharger', 'Fresh Market', 'Free Air/Water'],
    priceEstimate: '$4.89 / gal (Reg)'
  },
  {
    id: 'fuel-truckee-loves',
    name: 'Truckee Tahoe Travel Plaza (I-80 / Donner Pass Foot)',
    brand: 'Shell',
    lat: 39.3400,
    lng: -120.1550,
    address: '10001 Soaring Way, Truckee, CA 96161',
    highwayRef: 'I-80 Exit 188 (CA-267 / Northstar Lake Tahoe)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: true,
    hasRVDump: true,
    isOpen24Hours: true,
    amenities: ['Anti-Gel Alpine Diesel', 'Propane Refill Station', 'Free Potable Water', 'Showers', 'Raley\'s O-N-E Market Adjacent'],
    priceEstimate: '$5.19 / gal (Reg)'
  },

  // ==========================================
  // TEXAS CORRIDORS (I-10, I-35, BUC-EE'S)
  // ==========================================
  {
    id: 'fuel-bucees-new-braunfels',
    name: 'Buc-ee\'s Mega Travel Center (World\'s Largest Travel Center)',
    brand: 'Buc-ee\'s',
    lat: 29.7250,
    lng: -98.0780,
    address: '2770 IH 35 S, New Braunfels, TX 78130',
    highwayRef: 'I-35 Exit 191 (Austin to San Antonio Corridor)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: true,
    hasRVDump: true,
    isOpen24Hours: true,
    amenities: ['120 Fuel Pumps', 'DEF at the Pump', 'Pristine Award-Winning Restrooms', 'Fresh Barbecue & Beaver Nuggets', 'Tesla Supercharger (48 Stalls)'],
    priceEstimate: '$2.89 / gal (Reg)'
  },
  {
    id: 'fuel-bucees-bastrop',
    name: 'Buc-ee\'s Bastrop (Austin / Bastrop State Park Gateway)',
    brand: 'Buc-ee\'s',
    lat: 30.1250,
    lng: -97.3150,
    address: '1700 State Hwy 71 E, Bastrop, TX 78602',
    highwayRef: 'TX-71 & TX-21 Junction',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: true,
    hasRVDump: true,
    isOpen24Hours: true,
    amenities: ['64 Fuel Pumps', 'High-Speed Diesel', 'Propane Tanks', 'Outdoor & Camping Supplies', 'Smoked Brisket 24/7'],
    priceEstimate: '$2.95 / gal (Reg)'
  },
  {
    id: 'fuel-loves-junction-tx',
    name: 'Love\'s Travel Stop #285 (I-10 Texas Hill Country Transcontinental)',
    brand: "Love's",
    lat: 30.4850,
    lng: -99.7750,
    address: '2020 N Main St, Junction, TX 76849',
    highwayRef: 'I-10 Exit 456 (US-83 / South Llano River State Park)',
    hasDiesel: true,
    hasPropane: true,
    hasEVCharging: false,
    hasRVDump: true,
    isOpen24Hours: true,
    amenities: ['RV Dump Island', 'Bulk Propane Refilling', 'Chester\'s Chicken / Godfather Pizza', 'Bulk Diesel'],
    priceEstimate: '$2.99 / gal (Reg)'
  }
];

// In-memory cache for live fuel queries
const liveFuelCache = new Map<string, { stations: FuelStation[]; timestamp: number }>();

/**
 * Filter verified fuel stations within active map bounds and dynamically query live nationwide gas stations.
 * Covers all 50 US States across all brands (Chevron, Shell, Exxon, Mobil, 76, Phillips 66, Valero, Sinclair,
 * Love's, Pilot Flying J, TA, Buc-ee's, Circle K, Wawa, Sheetz, Casey's, Speedway, ARCO, BP, Sunoco, Marathon,
 * Costco, Sam's Club, Murphy USA, Kum & Go, QuikTrip, RaceTrac, Maverik, Holiday, etc.).
 */
export async function fetchFuelStationsInBounds(bounds: MapBounds): Promise<FuelStation[]> {
  const { minLat, maxLat, minLng, maxLng } = bounds;

  // 1. Get verified static highway travel centers
  const verifiedInBounds = VERIFIED_HIGHWAY_FUEL_STATIONS.filter(
    (st) =>
      st.lat >= minLat &&
      st.lat <= maxLat &&
      st.lng >= minLng &&
      st.lng <= maxLng
  );

  const cacheKey = `${minLat.toFixed(2)},${minLng.toFixed(2)},${maxLat.toFixed(2)},${maxLng.toFixed(2)}`;
  const now = Date.now();

  if (liveFuelCache.has(cacheKey)) {
    const cached = liveFuelCache.get(cacheKey)!;
    if (now - cached.timestamp < 300000) {
      return mergeFuelStations(verifiedInBounds, cached.stations);
    }
  }

  try {
    const latSpan = maxLat - minLat;
    const lngSpan = maxLng - minLng;

    // Only query live local stations when zoomed in reasonably (< 1.8 degrees span) to prevent payload overload
    if (latSpan <= 1.8 && lngSpan <= 1.8) {
      const midLat = (minLat + maxLat) / 2;
      const midLng = (minLng + maxLng) / 2;
      const queryParams = `lat=${midLat.toFixed(4)}&lng=${midLng.toFixed(4)}&swLat=${minLat.toFixed(4)}&swLng=${minLng.toFixed(4)}&neLat=${maxLat.toFixed(4)}&neLng=${maxLng.toFixed(4)}`;

      const res = await fetch(`/api/fuel/search?${queryParams}`);
      if (res.ok) {
        const liveData: FuelStation[] = await res.json();
        if (Array.isArray(liveData) && liveData.length > 0) {
          liveFuelCache.set(cacheKey, { stations: liveData, timestamp: now });
          return mergeFuelStations(verifiedInBounds, liveData);
        }
      }
    }
  } catch (err) {
    console.warn('[Fuel Service] Live search fallback to verified:', err);
  }

  return verifiedInBounds;
}

function mergeFuelStations(verified: FuelStation[], live: FuelStation[]): FuelStation[] {
  const map = new Map<string, FuelStation>();

  // Verified travel plazas have highest priority
  verified.forEach(st => map.set(st.id, st));

  // Add live queried stations
  live.forEach(st => {
    // Avoid exact duplicate pins within ~0.005 degrees (~500 meters)
    const isDuplicate = verified.some(v => Math.abs(v.lat - st.lat) < 0.005 && Math.abs(v.lng - st.lng) < 0.005);
    if (!isDuplicate && !map.has(st.id)) {
      map.set(st.id, st);
    }
  });

  return Array.from(map.values());
}
