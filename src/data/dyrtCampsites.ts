export interface ForecastDay {
  day: string;
  condition: string;
  highTemp: number;
  lowTemp: number;
  precipProb: number;
  windSpeed: number;
  icon: string;
}

export interface DyrtCampsite {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  locationName: string;
  state: string;
  sector: string;
  lat: number;
  lng: number;
  latStr: string;
  lngStr: string;
  elevation: string;
  elevationNum: number;
  terrain: 'Alpine' | 'Rocky' | 'Forest' | 'Canyon' | 'Desert';
  status: 'Available' | 'Limited' | 'Booked';
  priceDisplay: string;
  pricePerNight: number;
  siteTypes: string[];
  image: string;
  summary: string;
  hasWeatherAlert?: boolean;
  weatherAlertTitle?: string;
  weatherAlertText?: string;
  nwsAlertSeverity?: string;
  nwsAlertInstruction?: string;
  alertText?: string;
  locationId?: number | string;
  source?: 'public' | 'hipcamp' | 'campspot';
  amenities: string[];
  availabilityType: 'CHECK_AVAILABILITY' | 'FIRST_COME_FIRST_SERVED';
  contactUrl: string;
  weather: {
    temp: number;
    tempTrend: string;
    windSpeed: number;
    windGusts: number;
    precipProb: number;
    humidity: number;
    pressure: number;
    uvIndex: number;
    airQuality: string;
  };
  forecast: ForecastDay[];
}

export const DYRT_CAMPSITES_DATA: DyrtCampsite[] = [
  // ==========================================
  // CALIFORNIA & LAKE TAHOE
  // ==========================================
  {
    id: 'newport-dunes-waterfront-rv-resort',
    name: 'Newport Dunes Waterfront RV Resort',
    rating: 4.6,
    reviewCount: 92,
    locationName: 'Newport Beach',
    state: 'California',
    sector: 'Southern California Coast',
    lat: 33.6133,
    lng: -117.8922,
    latStr: '33.6133° N',
    lngStr: '117.8922° W',
    elevation: '10 ft',
    elevationNum: 10,
    terrain: 'Forest',
    status: 'Available',
    priceDisplay: '$65 - $120 / night',
    pricePerNight: 65.00,
    siteTypes: ['RV', 'Tent', 'Cottages', 'Waterfront sites'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    summary: 'Luxury waterfront RV resort located inside Newport Beach bay. Features private lagoon beach, marina boat rentals, swimming pools, and beachfront fire pits.',
    hasWeatherAlert: false,
    amenities: ['Waterfront RV Hookups', 'Private Lagoon Beach', 'Swimming Pools', 'Marina & Boat Rentals', 'Water Park'],
    availabilityType: 'CHECK_AVAILABILITY',
    contactUrl: 'https://thedyrt.com/camping/california/newport-dunes-waterfront-rv-resort',
    weather: { temp: 72, tempTrend: '+0.5°/hr', windSpeed: 8, windGusts: 14, precipProb: 0, humidity: 65, pressure: 30.14, uvIndex: 8, airQuality: 'Coastal Fresh' },
    forecast: [
      { day: 'TODAY', condition: 'Sunny & Warm', highTemp: 75, lowTemp: 60, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'MON', condition: 'Clear Sky', highTemp: 78, lowTemp: 62, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Sunny', highTemp: 80, lowTemp: 64, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'WED', condition: 'Clear Sky', highTemp: 76, lowTemp: 61, precipProb: 0, windSpeed: 9, icon: 'wb_sunny' },
      { day: 'THU', condition: 'Sunny', highTemp: 77, lowTemp: 63, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' },
      { day: 'FRI', condition: 'Clear Sky', highTemp: 81, lowTemp: 65, precipProb: 0, windSpeed: 6, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Sunny', highTemp: 82, lowTemp: 66, precipProb: 0, windSpeed: 6, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'pleasant-valley-pit',
    name: 'Pleasant Valley Pit Campground',
    rating: 4.0,
    reviewCount: 9,
    locationName: 'Bishop',
    state: 'California',
    sector: 'Eastern Sierra - Bishop',
    lat: 37.4085,
    lng: -118.5283,
    latStr: '37.4085° N',
    lngStr: '118.5283° W',
    elevation: '4,200 ft',
    elevationNum: 4200,
    terrain: 'Desert',
    status: 'Available',
    priceDisplay: '$5 / night',
    pricePerNight: 5.00,
    siteTypes: ['RV', 'Tent', 'Standard sites'],
    image: 'https://images.unsplash.com/photo-1504280390224-4f9b889396fc?q=80&w=1200&auto=format&fit=crop',
    summary: 'Pleasant Valley Pit Campground, near Bishop, California, caters to those looking for a simple camping experience with stunning views of the Sierra.',
    hasWeatherAlert: false,
    amenities: ['Primitive Camping', 'Vault Toilets', 'Fire Rings', 'Sierra Mountain Views', 'No Water Hookups'],
    availabilityType: 'FIRST_COME_FIRST_SERVED',
    contactUrl: 'https://thedyrt.com/camping/california/pleasant-valley-pit',
    weather: { temp: 64, tempTrend: '+1.2°/hr', windSpeed: 8, windGusts: 14, precipProb: 0, humidity: 25, pressure: 29.95, uvIndex: 7, airQuality: 'Excellent' },
    forecast: [
      { day: 'TODAY', condition: 'Sunny & Clear', highTemp: 68, lowTemp: 44, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'MON', condition: 'Clear Sky', highTemp: 72, lowTemp: 46, precipProb: 0, windSpeed: 6, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Sunny', highTemp: 74, lowTemp: 48, precipProb: 0, windSpeed: 9, icon: 'wb_sunny' },
      { day: 'WED', condition: 'Mild Breeze', highTemp: 70, lowTemp: 45, precipProb: 5, windSpeed: 11, icon: 'air' },
      { day: 'THU', condition: 'Clear Sky', highTemp: 73, lowTemp: 47, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' },
      { day: 'FRI', condition: 'Sunny', highTemp: 76, lowTemp: 49, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Clear Sky', highTemp: 78, lowTemp: 50, precipProb: 0, windSpeed: 6, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'june-lake-rv-park',
    name: 'June Lake RV Park',
    rating: 4.5,
    reviewCount: 2,
    locationName: 'June Lake',
    state: 'California',
    sector: 'June Lake Loop',
    lat: 37.7785,
    lng: -119.0754,
    latStr: '37.7785° N',
    lngStr: '119.0754° W',
    elevation: '7,600 ft',
    elevationNum: 7600,
    terrain: 'Forest',
    status: 'Available',
    priceDisplay: '$30 - $32 / night',
    pricePerNight: 30.00,
    siteTypes: ['RV', 'Tent', 'Cabin', 'Group', 'Standard sites'],
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
    summary: 'Fishing, cycling, and lake access draw campers to June Lake RV Park, a small, privately run park within walking distance of boat rentals and June Lake Loop.',
    hasWeatherAlert: false,
    amenities: ['Full RV Hookups', 'Wi-Fi Signal', 'Hot Showers', 'Laundry Facilities', 'Lake Access', 'Cellular Coverage'],
    availabilityType: 'CHECK_AVAILABILITY',
    contactUrl: 'https://thedyrt.com/camping/california/june-lake-rv-park',
    weather: { temp: 54, tempTrend: '-0.8°/hr', windSpeed: 10, windGusts: 16, precipProb: 10, humidity: 45, pressure: 30.05, uvIndex: 6, airQuality: 'Good' },
    forecast: [
      { day: 'TODAY', condition: 'Partly Sunny', highTemp: 58, lowTemp: 38, precipProb: 10, windSpeed: 10, icon: 'partly_cloudy_day' },
      { day: 'MON', condition: 'Clear Sky', highTemp: 62, lowTemp: 40, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Sunny', highTemp: 65, lowTemp: 42, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'WED', condition: 'Breezy', highTemp: 60, lowTemp: 39, precipProb: 15, windSpeed: 14, icon: 'air' },
      { day: 'THU', condition: 'Clear Sky', highTemp: 63, lowTemp: 41, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'FRI', condition: 'Sunny', highTemp: 66, lowTemp: 43, precipProb: 0, windSpeed: 9, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Clear Sky', highTemp: 68, lowTemp: 45, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'saddlebag-lake-campground',
    name: 'Saddlebag Lake Campground',
    rating: 4.8,
    reviewCount: 14,
    locationName: 'Lee Vining',
    state: 'California',
    sector: 'Tioga Pass / Yosemite',
    lat: 37.9642,
    lng: -119.2715,
    latStr: '37.9642° N',
    lngStr: '119.2715° W',
    elevation: '10,087 ft',
    elevationNum: 10087,
    terrain: 'Alpine',
    status: 'Limited',
    priceDisplay: '$24 / night',
    pricePerNight: 24.00,
    siteTypes: ['Tent', 'Standard sites'],
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200&auto=format&fit=crop',
    summary: 'Located just outside Yosemite National Park near Tioga Pass, Saddlebag Lake Campground is one of the highest elevation drive-in campgrounds in California.',
    hasWeatherAlert: true,
    weatherAlertTitle: 'NWS HIGH ELEVATION FREEZE & SQUALL ADVISORY',
    weatherAlertText: 'Sub-freezing temperatures dropping to 26°F overnight with sudden squalls and high wind gusts exceeding 30 MPH.',
    amenities: ['Potable Water', 'Vault Toilets', 'Bear Lockers', 'Lake Fishing', 'Trailhead Access'],
    availabilityType: 'FIRST_COME_FIRST_SERVED',
    contactUrl: 'https://thedyrt.com/camping/california/saddlebag-lake',
    weather: { temp: 40, tempTrend: '-2.1°/hr', windSpeed: 18, windGusts: 30, precipProb: 40, humidity: 70, pressure: 29.80, uvIndex: 5, airQuality: 'Pure' },
    forecast: [
      { day: 'TODAY', condition: 'Cold & Windy', highTemp: 42, lowTemp: 28, precipProb: 40, windSpeed: 18, icon: 'air' },
      { day: 'MON', condition: 'Clear Alpine Air', highTemp: 46, lowTemp: 30, precipProb: 10, windSpeed: 12, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Sunny', highTemp: 50, lowTemp: 32, precipProb: 5, windSpeed: 9, icon: 'wb_sunny' },
      { day: 'WED', condition: 'High Wind Flurries', highTemp: 41, lowTemp: 26, precipProb: 45, windSpeed: 22, icon: 'ac_unit' },
      { day: 'THU', condition: 'Clear & Cold', highTemp: 44, lowTemp: 29, precipProb: 10, windSpeed: 11, icon: 'wb_sunny' },
      { day: 'FRI', condition: 'Sunny', highTemp: 48, lowTemp: 31, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Clear Sky', highTemp: 51, lowTemp: 33, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'mammoth-mountain-rv-park',
    name: 'Mammoth Mountain RV Park',
    rating: 4.3,
    reviewCount: 28,
    locationName: 'Mammoth Lakes',
    state: 'California',
    sector: 'Mammoth Lakes',
    lat: 37.6485,
    lng: -118.9721,
    latStr: '37.6485° N',
    lngStr: '118.9721° W',
    elevation: '7,800 ft',
    elevationNum: 7800,
    terrain: 'Forest',
    status: 'Available',
    priceDisplay: '$45 - $65 / night',
    pricePerNight: 45.00,
    siteTypes: ['RV', 'Tent', 'Cabin', 'Standard sites'],
    image: 'https://images.unsplash.com/photo-1476514525535-ce74f45814ce?q=80&w=1200&auto=format&fit=crop',
    summary: 'Year-round camping in the heart of Mammoth Lakes. Full hookups, indoor heated pool, hot tub, and direct shuttle service.',
    hasWeatherAlert: false,
    amenities: ['Full Hookups', 'Heated Pool', 'Hot Tub', 'Wi-Fi', 'Hot Showers', 'Shuttle Stop'],
    availabilityType: 'CHECK_AVAILABILITY',
    contactUrl: 'https://thedyrt.com/camping/california/mammoth-mountain-rv-park',
    weather: { temp: 50, tempTrend: '-0.5°/hr', windSpeed: 12, windGusts: 20, precipProb: 20, humidity: 50, pressure: 30.00, uvIndex: 6, airQuality: 'Excellent' },
    forecast: [
      { day: 'TODAY', condition: 'Passing Clouds', highTemp: 54, lowTemp: 36, precipProb: 20, windSpeed: 12, icon: 'partly_cloudy_day' },
      { day: 'MON', condition: 'Clear Sky', highTemp: 58, lowTemp: 38, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Sunny', highTemp: 61, lowTemp: 40, precipProb: 0, windSpeed: 9, icon: 'wb_sunny' },
      { day: 'WED', condition: 'Breezy', highTemp: 56, lowTemp: 35, precipProb: 15, windSpeed: 16, icon: 'air' },
      { day: 'THU', condition: 'Clear Sky', highTemp: 59, lowTemp: 37, precipProb: 0, windSpeed: 9, icon: 'wb_sunny' },
      { day: 'FRI', condition: 'Sunny', highTemp: 63, lowTemp: 41, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Clear Sky', highTemp: 65, lowTemp: 43, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'convict-lake-campground',
    name: 'Convict Lake Campground',
    rating: 4.7,
    reviewCount: 42,
    locationName: 'Mammoth Lakes',
    state: 'California',
    sector: 'Convict Canyon',
    lat: 37.5942,
    lng: -118.8572,
    latStr: '37.5942° N',
    lngStr: '118.8572° W',
    elevation: '7,580 ft',
    elevationNum: 7580,
    terrain: 'Alpine',
    status: 'Available',
    priceDisplay: '$32 / night',
    pricePerNight: 32.00,
    siteTypes: ['RV', 'Tent', 'Standard sites'],
    image: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=1200&auto=format&fit=crop',
    summary: 'Famous for its crystal-clear trout lake and dramatic mountain backdrop. Located adjacent to Convict Lake Resort with boat rentals.',
    hasWeatherAlert: false,
    amenities: ['Flush Toilets', 'Piped Water', 'Bear Boxes', 'Marina & Boat Rental', 'Restaurant Nearby'],
    availabilityType: 'CHECK_AVAILABILITY',
    contactUrl: 'https://thedyrt.com/camping/california/convict-lake',
    weather: { temp: 52, tempTrend: '-0.3°/hr', windSpeed: 10, windGusts: 18, precipProb: 15, humidity: 48, pressure: 30.02, uvIndex: 6, airQuality: 'Excellent' },
    forecast: [
      { day: 'TODAY', condition: 'Sunny', highTemp: 56, lowTemp: 37, precipProb: 15, windSpeed: 10, icon: 'wb_sunny' },
      { day: 'MON', condition: 'Clear Sky', highTemp: 60, lowTemp: 39, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Sunny', highTemp: 63, lowTemp: 41, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'WED', condition: 'Cloudy Spells', highTemp: 57, lowTemp: 36, precipProb: 10, windSpeed: 12, icon: 'cloud' },
      { day: 'THU', condition: 'Clear Sky', highTemp: 61, lowTemp: 38, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'FRI', condition: 'Sunny', highTemp: 65, lowTemp: 42, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Clear Sky', highTemp: 67, lowTemp: 44, precipProb: 0, windSpeed: 6, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'dl-bliss-state-park',
    name: 'D.L. Bliss State Park',
    rating: 4.8,
    reviewCount: 47,
    locationName: 'South Lake Tahoe',
    state: 'California',
    sector: 'Lake Tahoe West Shore',
    lat: 38.9806,
    lng: -120.1006,
    latStr: '38.9806° N',
    lngStr: '120.1006° W',
    elevation: '6,250 ft',
    elevationNum: 6250,
    terrain: 'Forest',
    status: 'Available',
    priceDisplay: '$35 / night',
    pricePerNight: 35.00,
    siteTypes: ['Tent', 'Standard sites'],
    image: 'https://images.unsplash.com/photo-1504280390224-4f9b889396fc?q=80&w=1200&auto=format&fit=crop',
    summary: 'Located on the magnificent west shore of Lake Tahoe. Offers beach access to Rubicon Bay, turquoise waters, granite cliffs, and direct access to the Rubicon Trail.',
    hasWeatherAlert: false,
    amenities: ['Potable Water', 'Flush Toilets', 'Bear Food Lockers', 'Beach Access', 'Rubicon Trailhead'],
    availabilityType: 'CHECK_AVAILABILITY',
    contactUrl: 'https://thedyrt.com/camping/california/dl-bliss-state-park',
    weather: { temp: 58, tempTrend: '-1.0°/hr', windSpeed: 8, windGusts: 14, precipProb: 10, humidity: 45, pressure: 30.05, uvIndex: 6, airQuality: 'Excellent' },
    forecast: [
      { day: 'TODAY', condition: 'Sunny & Clear', highTemp: 62, lowTemp: 40, precipProb: 10, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'MON', condition: 'Clear Sky', highTemp: 65, lowTemp: 42, precipProb: 0, windSpeed: 6, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Sunny', highTemp: 67, lowTemp: 44, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' },
      { day: 'WED', condition: 'Partly Cloudy', highTemp: 61, lowTemp: 39, precipProb: 15, windSpeed: 10, icon: 'partly_cloudy_day' },
      { day: 'THU', condition: 'Clear Sky', highTemp: 64, lowTemp: 41, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' },
      { day: 'FRI', condition: 'Sunny', highTemp: 68, lowTemp: 45, precipProb: 0, windSpeed: 6, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Clear Sky', highTemp: 70, lowTemp: 47, precipProb: 0, windSpeed: 5, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'fallen-leaf-campground',
    name: 'Fallen Leaf Campground',
    rating: 4.7,
    reviewCount: 39,
    locationName: 'South Lake Tahoe',
    state: 'California',
    sector: 'Fallen Leaf Lake',
    lat: 38.8950,
    lng: -120.0630,
    latStr: '38.8950° N',
    lngStr: '120.0630° W',
    elevation: '6,300 ft',
    elevationNum: 6300,
    terrain: 'Forest',
    status: 'Available',
    priceDisplay: '$36 / night',
    pricePerNight: 36.00,
    siteTypes: ['Tent', 'RV', 'Standard sites'],
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
    summary: 'Tucked between Fallen Leaf Lake and Lake Tahoe. Features pine groves, creek access, and proximity to Mt. Tallac trailhead.',
    hasWeatherAlert: false,
    amenities: ['Flush Toilets', 'Hot Showers', 'Piped Water', 'Bear Boxes', 'Trail Access'],
    availabilityType: 'CHECK_AVAILABILITY',
    contactUrl: 'https://thedyrt.com/camping/california/fallen-leaf-campground',
    weather: { temp: 56, tempTrend: '-0.8°/hr', windSpeed: 7, windGusts: 12, precipProb: 5, humidity: 48, pressure: 30.08, uvIndex: 6, airQuality: 'Excellent' },
    forecast: [
      { day: 'TODAY', condition: 'Sunny', highTemp: 60, lowTemp: 38, precipProb: 5, windSpeed: 7, icon: 'wb_sunny' },
      { day: 'MON', condition: 'Clear Sky', highTemp: 64, lowTemp: 40, precipProb: 0, windSpeed: 6, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Sunny', highTemp: 66, lowTemp: 42, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' },
      { day: 'WED', condition: 'Partly Cloudy', highTemp: 59, lowTemp: 37, precipProb: 10, windSpeed: 9, icon: 'partly_cloudy_day' },
      { day: 'THU', condition: 'Clear Sky', highTemp: 63, lowTemp: 39, precipProb: 0, windSpeed: 6, icon: 'wb_sunny' },
      { day: 'FRI', condition: 'Sunny', highTemp: 67, lowTemp: 43, precipProb: 0, windSpeed: 5, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Clear Sky', highTemp: 69, lowTemp: 45, precipProb: 0, windSpeed: 5, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'lower-pines-yosemite',
    name: 'Lower Pines Campground',
    rating: 4.8,
    reviewCount: 84,
    locationName: 'Yosemite Valley',
    state: 'California',
    sector: 'Yosemite Valley',
    lat: 37.7421,
    lng: -119.5694,
    latStr: '37.7421° N',
    lngStr: '119.5694° W',
    elevation: '4,000 ft',
    elevationNum: 4000,
    terrain: 'Forest',
    status: 'Booked',
    priceDisplay: '$36 / night',
    pricePerNight: 36.00,
    siteTypes: ['Tent', 'RV', 'Standard sites'],
    image: 'https://images.unsplash.com/photo-1504280390224-4f9b889396fc?q=80&w=1200&auto=format&fit=crop',
    summary: 'Iconic Yosemite Valley campground located alongside the Merced River with unobstructed views of Half Dome and Glacier Point.',
    hasWeatherAlert: false,
    amenities: ['River Access', 'Flush Toilets', 'Bear Food Lockers', 'Shuttle Stop', 'Dump Station'],
    availabilityType: 'CHECK_AVAILABILITY',
    contactUrl: 'https://thedyrt.com/camping/california/lower-pines',
    weather: { temp: 68, tempTrend: '+1.5°/hr', windSpeed: 6, windGusts: 10, precipProb: 5, humidity: 35, pressure: 30.10, uvIndex: 8, airQuality: 'Good' },
    forecast: [
      { day: 'TODAY', condition: 'Warm & Sunny', highTemp: 72, lowTemp: 48, precipProb: 5, windSpeed: 6, icon: 'wb_sunny' },
      { day: 'MON', condition: 'Clear Sky', highTemp: 76, lowTemp: 50, precipProb: 0, windSpeed: 5, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Sunny', highTemp: 78, lowTemp: 52, precipProb: 0, windSpeed: 6, icon: 'wb_sunny' },
      { day: 'WED', condition: 'Partly Cloudy', highTemp: 73, lowTemp: 47, precipProb: 10, windSpeed: 8, icon: 'partly_cloudy_day' },
      { day: 'THU', condition: 'Clear Sky', highTemp: 75, lowTemp: 49, precipProb: 0, windSpeed: 6, icon: 'wb_sunny' },
      { day: 'FRI', condition: 'Sunny', highTemp: 79, lowTemp: 53, precipProb: 0, windSpeed: 5, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Clear Sky', highTemp: 81, lowTemp: 55, precipProb: 0, windSpeed: 5, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'trillium-lake-campground',
    name: 'Trillium Lake Campground',
    rating: 4.9,
    reviewCount: 78,
    locationName: 'Government Camp',
    state: 'Oregon',
    sector: 'Mount Hood National Forest',
    lat: 45.2708,
    lng: -121.7375,
    latStr: '45.2708° N',
    lngStr: '121.7375° W',
    elevation: '3,600 ft',
    elevationNum: 3600,
    terrain: 'Forest',
    status: 'Available',
    priceDisplay: '$26 / night',
    pricePerNight: 26.00,
    siteTypes: ['Tent', 'RV', 'Standard sites'],
    image: 'https://images.unsplash.com/photo-1504280390224-4f9b889396fc?q=80&w=1200&auto=format&fit=crop',
    summary: 'Famous mirror reflection of Mount Hood across Trillium Lake. Popular for paddleboarding, kayaking, fishing, and lakeside boardwalk strolls.',
    hasWeatherAlert: false,
    amenities: ['Lake Swimming', 'Paddleboard Rentals', 'Vault Toilets', 'Piped Water', 'Mount Hood Views'],
    availabilityType: 'CHECK_AVAILABILITY',
    contactUrl: 'https://thedyrt.com/camping/oregon/trillium-lake',
    weather: { temp: 56, tempTrend: '-0.5°/hr', windSpeed: 6, windGusts: 10, precipProb: 15, humidity: 55, pressure: 30.08, uvIndex: 6, airQuality: 'Good' },
    forecast: [
      { day: 'TODAY', condition: 'Partly Sunny', highTemp: 60, lowTemp: 42, precipProb: 15, windSpeed: 6, icon: 'partly_cloudy_day' },
      { day: 'MON', condition: 'Clear Sky', highTemp: 64, lowTemp: 44, precipProb: 0, windSpeed: 5, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Sunny', highTemp: 67, lowTemp: 46, precipProb: 0, windSpeed: 6, icon: 'wb_sunny' },
      { day: 'WED', condition: 'Light Rain', highTemp: 58, lowTemp: 40, precipProb: 45, windSpeed: 10, icon: 'water_drop' },
      { day: 'THU', condition: 'Clear Sky', highTemp: 62, lowTemp: 43, precipProb: 5, windSpeed: 6, icon: 'wb_sunny' },
      { day: 'FRI', condition: 'Sunny', highTemp: 66, lowTemp: 45, precipProb: 0, windSpeed: 5, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Clear Sky', highTemp: 68, lowTemp: 47, precipProb: 0, windSpeed: 5, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'moraine-park-campground',
    name: 'Moraine Park Campground',
    rating: 4.7,
    reviewCount: 45,
    locationName: 'Estes Park',
    state: 'Colorado',
    sector: 'Rocky Mountain National Park',
    lat: 40.3582,
    lng: -105.6021,
    latStr: '40.3582° N',
    lngStr: '105.6021° W',
    elevation: '8,160 ft',
    elevationNum: 8160,
    terrain: 'Alpine',
    status: 'Available',
    priceDisplay: '$35 / night',
    pricePerNight: 35.00,
    siteTypes: ['Tent', 'RV', 'Standard sites'],
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200&auto=format&fit=crop',
    summary: 'Located in Rocky Mountain National Park. Offers sweeping views of Moraine Park meadow, frequent elk sightings, and access to Bear Lake trailheads.',
    hasWeatherAlert: false,
    amenities: ['Dump Station', 'Flush Toilets', 'Trash Collection', 'Elk Viewing', 'Shuttle Bus'],
    availabilityType: 'CHECK_AVAILABILITY',
    contactUrl: 'https://thedyrt.com/camping/colorado/moraine-park',
    weather: { temp: 56, tempTrend: '-0.4°/hr', windSpeed: 11, windGusts: 18, precipProb: 20, humidity: 52, pressure: 30.00, uvIndex: 7, airQuality: 'Excellent' },
    forecast: [
      { day: 'TODAY', condition: 'Partly Cloudy', highTemp: 60, lowTemp: 40, precipProb: 20, windSpeed: 11, icon: 'partly_cloudy_day' },
      { day: 'MON', condition: 'Clear Sky', highTemp: 64, lowTemp: 42, precipProb: 5, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Sunny', highTemp: 67, lowTemp: 44, precipProb: 0, windSpeed: 9, icon: 'wb_sunny' },
      { day: 'WED', condition: 'Afternoon Showers', highTemp: 59, lowTemp: 38, precipProb: 40, windSpeed: 14, icon: 'water_drop' },
      { day: 'THU', condition: 'Clear Sky', highTemp: 62, lowTemp: 41, precipProb: 10, windSpeed: 9, icon: 'wb_sunny' },
      { day: 'FRI', condition: 'Sunny', highTemp: 66, lowTemp: 43, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Clear Sky', highTemp: 68, lowTemp: 45, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' }
    ]
  }
];
