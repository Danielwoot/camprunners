export interface ForecastDay {
  day: string;
  condition: string;
  highTemp: number;
  lowTemp: number;
  precipProb: number;
  windSpeed: number;
  icon: string;
}

export interface Campsite {
  id: string;
  name: string;
  sector: string; // e.g. "Sector 1 - Rocky Mountains"
  elevation: string; // e.g. "8,038 ft (2,450 m)"
  elevationNum: number;
  lat: number;
  lng: number;
  latStr: string;
  lngStr: string;
  terrain: 'Alpine' | 'Rocky' | 'Forest' | 'Canyon' | 'Desert';
  status: 'Available' | 'Limited' | 'Booked';
  pricePerNight: number;
  image: string;
  summary: string;
  weather: {
    temp: number; // Fahrenheit
    tempTrend: string;
    windSpeed: number; // mph
    windGusts: number;
    precipProb: number; // %
    humidity: number; // %
    pressure: number; // inHg
    uvIndex: number;
    airQuality: string;
  };
  hasWeatherAlert: boolean;
  alertText?: string;
  amenities: string[];
  forecast: ForecastDay[];
}

export const CAMPSITES_DATA: Campsite[] = [
  {
    id: 'ozone-ridge',
    name: 'Ozone Ridge Campsite',
    sector: 'Sector 1 - Rocky Mountains',
    elevation: '8,038 ft (2,450 m)',
    elevationNum: 2450,
    lat: 40.3428,
    lng: -105.6836,
    latStr: '40.3428° N',
    lngStr: '105.6836° W',
    terrain: 'Alpine',
    status: 'Available',
    pricePerNight: 32.50,
    image: 'https://images.unsplash.com/photo-1504280390224-4f9b889396fc?q=80&w=1200&auto=format&fit=crop',
    summary: 'High-altitude scenic campsite positioned along the western divide ridge with panoramic mountain views.',
    weather: {
      temp: 42,
      tempTrend: '-2.4° / hr',
      windSpeed: 18,
      windGusts: 35,
      precipProb: 65,
      humidity: 78,
      pressure: 29.85,
      uvIndex: 4,
      airQuality: 'Good (98/100)'
    },
    hasWeatherAlert: true,
    alertText: 'Weather Advisory: High winds and cold temperatures above 8,000 ft. Micro-spikes and warm gear recommended.',
    amenities: [
      'Potable Drinking Water Spigot',
      'Campfire Ring & Barbecue Grill',
      '4G LTE Cellular Signal',
      'Clean Restrooms & Trash Disposal',
      'Solar Powered Charging Outlets'
    ],
    forecast: [
      { day: 'TODAY', condition: 'Freezing Rain / Fog', highTemp: 44, lowTemp: 32, precipProb: 65, windSpeed: 18, icon: 'ac_unit' },
      { day: 'MON', condition: 'Windy Conditions', highTemp: 48, lowTemp: 35, precipProb: 40, windSpeed: 22, icon: 'air' },
      { day: 'TUE', condition: 'Clear Sky', highTemp: 54, lowTemp: 38, precipProb: 10, windSpeed: 12, icon: 'wb_sunny' },
      { day: 'WED', condition: 'Partly Cloudy', highTemp: 52, lowTemp: 36, precipProb: 15, windSpeed: 14, icon: 'partly_cloudy_day' },
      { day: 'THU', condition: 'Alpine Storm', highTemp: 39, lowTemp: 28, precipProb: 80, windSpeed: 28, icon: 'thunderstorm' },
      { day: 'FRI', condition: 'Light Snowfall', highTemp: 36, lowTemp: 25, precipProb: 70, windSpeed: 20, icon: 'cloudy_snowing' },
      { day: 'SAT', condition: 'Clear & Sunny', highTemp: 41, lowTemp: 29, precipProb: 5, windSpeed: 10, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'black-mesa-point',
    name: 'Black Mesa Point',
    sector: 'Sector 2 - High Plateau',
    elevation: '6,200 ft (1,890 m)',
    elevationNum: 1890,
    lat: 36.9452,
    lng: -102.8987,
    latStr: '36.9452° N',
    lngStr: '102.8987° W',
    terrain: 'Canyon',
    status: 'Limited',
    pricePerNight: 28.00,
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
    summary: 'Rugged basalt plateau campsite offering wide open night sky views and natural wind-shielded sites.',
    weather: {
      temp: 58,
      tempTrend: '+1.1° / hr',
      windSpeed: 12,
      windGusts: 19,
      precipProb: 15,
      humidity: 42,
      pressure: 30.12,
      uvIndex: 8,
      airQuality: 'Excellent (100/100)'
    },
    hasWeatherAlert: false,
    amenities: [
      'Natural Rock Shelter Sites',
      'Satellite Emergency Radio',
      'Rainfall Water Reservoir',
      'Solar Charging Station'
    ],
    forecast: [
      { day: 'TODAY', condition: 'Sunny & Breezy', highTemp: 62, lowTemp: 45, precipProb: 15, windSpeed: 12, icon: 'wb_sunny' },
      { day: 'MON', condition: 'Clear Sky', highTemp: 66, lowTemp: 48, precipProb: 5, windSpeed: 9, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Scattered Clouds', highTemp: 64, lowTemp: 46, precipProb: 10, windSpeed: 14, icon: 'partly_cloudy_day' },
      { day: 'WED', condition: 'High Wind Advisory', highTemp: 59, lowTemp: 40, precipProb: 25, windSpeed: 30, icon: 'air' },
      { day: 'THU', condition: 'Mild Breeze', highTemp: 63, lowTemp: 43, precipProb: 10, windSpeed: 11, icon: 'sunny' },
      { day: 'FRI', condition: 'Clear Sky', highTemp: 68, lowTemp: 49, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Sunny & Warm', highTemp: 71, lowTemp: 51, precipProb: 0, windSpeed: 10, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'echo-canyon-outpost',
    name: 'Echo Canyon Campground',
    sector: 'Sector 3 - Desert Ravines',
    elevation: '4,658 ft (1,420 m)',
    elevationNum: 1420,
    lat: 37.2231,
    lng: -112.9568,
    latStr: '37.2231° N',
    lngStr: '112.9568° W',
    terrain: 'Desert',
    status: 'Available',
    pricePerNight: 24.50,
    image: 'https://images.unsplash.com/photo-1476514525535-ce74f45814ce?q=80&w=1200&auto=format&fit=crop',
    summary: 'Secluded desert canyon campground with shade structures and fresh creek water filtration.',
    weather: {
      temp: 74,
      tempTrend: '+2.8° / hr',
      windSpeed: 8,
      windGusts: 14,
      precipProb: 5,
      humidity: 22,
      pressure: 29.98,
      uvIndex: 9,
      airQuality: 'Excellent (96/100)'
    },
    hasWeatherAlert: false,
    amenities: [
      'Filtered Creek Water System',
      'Shaded Tent Pads',
      'High-Speed Wi-Fi Area',
      'Composting Toilets'
    ],
    forecast: [
      { day: 'TODAY', condition: 'Warm & Sunny', highTemp: 78, lowTemp: 52, precipProb: 5, windSpeed: 8, icon: 'wb_sunny' },
      { day: 'MON', condition: 'Intense Sun', highTemp: 82, lowTemp: 56, precipProb: 0, windSpeed: 10, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Canyon Wind', highTemp: 85, lowTemp: 58, precipProb: 0, windSpeed: 16, icon: 'air' },
      { day: 'WED', condition: 'Sunny', highTemp: 81, lowTemp: 54, precipProb: 5, windSpeed: 9, icon: 'wb_sunny' },
      { day: 'THU', condition: 'Clear Sky', highTemp: 79, lowTemp: 51, precipProb: 0, windSpeed: 7, icon: 'wb_sunny' },
      { day: 'FRI', condition: 'Sunny & Warm', highTemp: 83, lowTemp: 55, precipProb: 0, windSpeed: 9, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Clear Sky', highTemp: 84, lowTemp: 57, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'alpine-basin',
    name: 'Alpine Basin Basecamp',
    sector: 'Sector 4 - Glacial Lakes',
    elevation: '10,170 ft (3,100 m)',
    elevationNum: 3100,
    lat: 39.1178,
    lng: -106.4453,
    latStr: '39.1178° N',
    lngStr: '106.4453° W',
    terrain: 'Alpine',
    status: 'Booked',
    pricePerNight: 45.00,
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200&auto=format&fit=crop',
    summary: 'High-altitude expedition basecamp surrounded by alpine lakes and granite peaks.',
    weather: {
      temp: 34,
      tempTrend: '-3.1° / hr',
      windSpeed: 24,
      windGusts: 42,
      precipProb: 85,
      humidity: 88,
      pressure: 29.40,
      uvIndex: 5,
      airQuality: 'Pure Mountain Air (100/100)'
    },
    hasWeatherAlert: true,
    alertText: 'Snow Advisory: Heavy snow expected overnight. Cold-weather gear and winter tents required.',
    amenities: [
      'Weather-Protected Shelter Domes',
      'First Aid & Emergency Kit',
      'Warming Pavilion',
      'Satellite Location Beacon'
    ],
    forecast: [
      { day: 'TODAY', condition: 'Snow Storm', highTemp: 35, lowTemp: 18, precipProb: 85, windSpeed: 24, icon: 'cloudy_snowing' },
      { day: 'MON', condition: 'Freezing Fog', highTemp: 32, lowTemp: 14, precipProb: 60, windSpeed: 18, icon: 'ac_unit' },
      { day: 'TUE', condition: 'Cold & Clear', highTemp: 30, lowTemp: 12, precipProb: 20, windSpeed: 14, icon: 'ac_unit' },
      { day: 'WED', condition: 'Sunny Mountain Air', highTemp: 36, lowTemp: 19, precipProb: 10, windSpeed: 10, icon: 'wb_sunny' },
      { day: 'THU', condition: 'High Winds', highTemp: 33, lowTemp: 15, precipProb: 50, windSpeed: 26, icon: 'air' },
      { day: 'FRI', condition: 'Clear Sky', highTemp: 38, lowTemp: 21, precipProb: 5, windSpeed: 12, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Partly Cloudy', highTemp: 37, lowTemp: 20, precipProb: 15, windSpeed: 11, icon: 'partly_cloudy_day' }
    ]
  },
  {
    id: 'pinnacle-crest',
    name: 'Pinnacle Crest Campground',
    sector: 'Sector 5 - Cascade Forests',
    elevation: '7,053 ft (2,150 m)',
    elevationNum: 2150,
    lat: 44.1532,
    lng: -121.6834,
    latStr: '44.1532° N',
    lngStr: '121.6834° W',
    terrain: 'Forest',
    status: 'Available',
    pricePerNight: 30.00,
    image: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=1200&auto=format&fit=crop',
    summary: 'Dense fir forest campground situated above the cloud line with direct ridge hiking access.',
    weather: {
      temp: 52,
      tempTrend: '-0.5° / hr',
      windSpeed: 10,
      windGusts: 15,
      precipProb: 30,
      humidity: 64,
      pressure: 30.05,
      uvIndex: 6,
      airQuality: 'Excellent (99/100)'
    },
    hasWeatherAlert: false,
    amenities: [
      'Spring Water Tap System',
      'Covered Picnic Area',
      'Cellular Signal Booster',
      'Bear-Proof Trash Lockers'
    ],
    forecast: [
      { day: 'TODAY', condition: 'Light Mist', highTemp: 55, lowTemp: 42, precipProb: 30, windSpeed: 10, icon: 'rainy' },
      { day: 'MON', condition: 'Partly Sunny', highTemp: 61, lowTemp: 45, precipProb: 10, windSpeed: 8, icon: 'partly_cloudy_day' },
      { day: 'TUE', condition: 'Clear Sky', highTemp: 65, lowTemp: 47, precipProb: 5, windSpeed: 7, icon: 'wb_sunny' },
      { day: 'WED', condition: 'Overcast', highTemp: 58, lowTemp: 41, precipProb: 20, windSpeed: 11, icon: 'cloud' },
      { day: 'THU', condition: 'Passing Showers', highTemp: 53, lowTemp: 39, precipProb: 45, windSpeed: 13, icon: 'water_drop' },
      { day: 'FRI', condition: 'Clear Sky', highTemp: 60, lowTemp: 44, precipProb: 5, windSpeed: 6, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Sunny', highTemp: 64, lowTemp: 46, precipProb: 0, windSpeed: 8, icon: 'wb_sunny' }
    ]
  },
  {
    id: 'timberline-summit',
    name: 'Timberline Summit Campground',
    sector: 'Sector 6 - Mount Hood Ridge',
    elevation: '9,120 ft (2,780 m)',
    elevationNum: 2780,
    lat: 45.3735,
    lng: -121.6959,
    latStr: '45.3735° N',
    lngStr: '121.6959° W',
    terrain: 'Alpine',
    status: 'Available',
    pricePerNight: 38.00,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    summary: 'High volcanic timberline campground with 360-degree mountain views and trail access.',
    weather: {
      temp: 39,
      tempTrend: '-1.8° / hr',
      windSpeed: 21,
      windGusts: 38,
      precipProb: 50,
      humidity: 72,
      pressure: 29.68,
      uvIndex: 7,
      airQuality: 'Good (98/100)'
    },
    hasWeatherAlert: true,
    alertText: 'Wind Advisory: Strong gusts on open ridge trails. Secure tent stakes properly.',
    amenities: [
      'Timber Lodge Access',
      'Weather Monitoring Display',
      'Heated Restrooms',
      'Direct Trailhead Access'
    ],
    forecast: [
      { day: 'TODAY', condition: 'Breezy & Cold', highTemp: 41, lowTemp: 28, precipProb: 50, windSpeed: 21, icon: 'air' },
      { day: 'MON', condition: 'Clear & Cold', highTemp: 45, lowTemp: 30, precipProb: 15, windSpeed: 15, icon: 'wb_sunny' },
      { day: 'TUE', condition: 'Sunny Alpine Air', highTemp: 49, lowTemp: 33, precipProb: 5, windSpeed: 11, icon: 'wb_sunny' },
      { day: 'WED', condition: 'Cloudy Skies', highTemp: 44, lowTemp: 29, precipProb: 30, windSpeed: 18, icon: 'cloud' },
      { day: 'THU', condition: 'Flurries', highTemp: 37, lowTemp: 24, precipProb: 65, windSpeed: 23, icon: 'ac_unit' },
      { day: 'FRI', condition: 'Sun & Ice', highTemp: 42, lowTemp: 27, precipProb: 10, windSpeed: 12, icon: 'wb_sunny' },
      { day: 'SAT', condition: 'Clear Sky', highTemp: 46, lowTemp: 31, precipProb: 0, windSpeed: 9, icon: 'wb_sunny' }
    ]
  }
];
