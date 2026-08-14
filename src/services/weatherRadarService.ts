import { ForecastDay } from '../data/dyrtCampsites';

/**
 * Weather Service integrating:
 * 1. NOAA / IEM NEXRAD Base Reflectivity Doppler Radar Tiles (works at ALL zoom levels 0-19+ with zero limits).
 * 2. Official National Weather Service (NWS) Active Alerts API (https://api.weather.gov).
 * 3. High-Precision Digital Elevation Model (DEM) & Live 7-Day GPS Forecasting (Open-Meteo API).
 * 100% free, open, public APIs with zero API keys required.
 */

export interface NWSActiveAlert {
  hasAlert: boolean;
  event?: string;
  headline?: string;
  description?: string;
  severity?: string;
  instruction?: string;
  urgency?: string;
}

export interface LiveLocationWeather {
  elevationNum: number;
  elevation: string;
  temp: number;
  tempTrend: string;
  windSpeed: number;
  windGusts: number;
  humidity: number;
  pressure: number;
  precipProb: number;
  condition: string;
  icon: string;
  forecast: ForecastDay[];
}

// In-memory cache for NWS alert requests to avoid repeated point lookups
const alertsCache = new Map<string, { data: NWSActiveAlert; timestamp: number }>();
// In-memory cache for GPS weather data
const weatherCache = new Map<string, { data: LiveLocationWeather; timestamp: number }>();

/**
 * Return the NOAA NEXRAD Doppler radar tile URL pattern.
 * This service supports ALL zoom levels (0 to 19+) without any zoom level restrictions.
 */
export function getNOAANexradRadarTileUrl(): string {
  return 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png';
}

/**
 * Fetch official National Weather Service (NWS) active alerts for a specific GPS coordinate.
 */
export async function fetchNWSAlertsForLocation(lat: number, lng: number): Promise<NWSActiveAlert> {
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const now = Date.now();

  if (alertsCache.has(cacheKey)) {
    const cached = alertsCache.get(cacheKey)!;
    if (now - cached.timestamp < 300000) { // 5 min cache
      return cached.data;
    }
  }

  try {
    const url = `https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lng.toFixed(4)}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/geo+json',
        'User-Agent': 'Camprunners-Tactical-App (contact@camprunners.io)'
      }
    });

    if (!res.ok) {
      return { hasAlert: false };
    }

    const json = await res.json();
    const features = json.features || [];

    if (features.length > 0) {
      const active = features[0].properties;
      const result: NWSActiveAlert = {
        hasAlert: true,
        event: active.event || 'National Weather Service Advisory',
        headline: active.headline || active.event,
        description: active.description || 'Active advisory issued by the National Weather Service for this geographic sector.',
        severity: active.severity || 'Moderate',
        instruction: active.instruction || undefined,
        urgency: active.urgency || 'Expected'
      };

      alertsCache.set(cacheKey, { data: result, timestamp: now });
      return result;
    }

    const noAlert: NWSActiveAlert = { hasAlert: false };
    alertsCache.set(cacheKey, { data: noAlert, timestamp: now });
    return noAlert;

  } catch (error) {
    console.warn('[NWS Alerts] Query error:', error);
    return { hasAlert: false };
  }
}

function getWeatherCondition(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: 'Sunny & Clear', icon: 'wb_sunny' };
  if (code >= 1 && code <= 3) return { condition: 'Partly Cloudy', icon: 'partly_cloudy_day' };
  if (code >= 45 && code <= 48) return { condition: 'Foggy / Haze', icon: 'foggy' };
  if (code >= 51 && code <= 55) return { condition: 'Light Drizzle', icon: 'grain' };
  if (code >= 56 && code <= 67) return { condition: 'Rain Showers', icon: 'rainy' };
  if (code >= 71 && code <= 77) return { condition: 'Snow Flurries', icon: 'ac_unit' };
  if (code >= 80 && code <= 82) return { condition: 'Heavy Rain', icon: 'thunderstorm' };
  if (code >= 85 && code <= 86) return { condition: 'Snow Squalls', icon: 'weather_snowy' };
  if (code >= 95) return { condition: 'Thunderstorm', icon: 'bolt' };
  return { condition: 'Clear Sky', icon: 'wb_sunny' };
}

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/**
 * Fetch live GPS-localized true elevation, current weather, and 7-day forecast using Open-Meteo
 */
export async function fetchLiveGpsWeather(lat: number, lng: number): Promise<LiveLocationWeather | null> {
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const now = Date.now();

  if (weatherCache.has(cacheKey)) {
    const cached = weatherCache.get(cacheKey)!;
    if (now - cached.timestamp < 300000) { // 5 min cache
      return cached.data;
    }
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;
    
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;
    if (!current || !daily) return null;

    const elevationM = typeof data.elevation === 'number' ? data.elevation : 500;
    const elevationFt = Math.round(elevationM * 3.28084);
    const elevationStr = `${elevationFt.toLocaleString()} ft`;

    const currentWeather = getWeatherCondition(current.weather_code || 0);

    // Build 7-day forecast array
    const forecast: ForecastDay[] = (daily.time || []).map((dateStr: string, idx: number) => {
      const d = new Date(dateStr + 'T00:00:00');
      const dayLabel = idx === 0 ? 'TODAY' : DAY_NAMES[d.getDay()];
      const dayWeather = getWeatherCondition(daily.weather_code?.[idx] || 0);

      return {
        day: dayLabel,
        condition: dayWeather.condition,
        highTemp: Math.round(daily.temperature_2m_max?.[idx] ?? 75),
        lowTemp: Math.round(daily.temperature_2m_min?.[idx] ?? 50),
        precipProb: Math.round(daily.precipitation_probability_max?.[idx] ?? 0),
        windSpeed: Math.round(daily.wind_speed_10m_max?.[idx] ?? 8),
        icon: dayWeather.icon
      };
    });

    const pressureInHg = Number(((current.surface_pressure || 1013.25) * 0.02953).toFixed(2));
    const precipProb = forecast.length > 0 ? forecast[0].precipProb : 0;

    const result: LiveLocationWeather = {
      elevationNum: elevationFt,
      elevation: elevationStr,
      temp: Math.round(current.temperature_2m),
      tempTrend: current.temperature_2m > (daily.temperature_2m_min?.[0] ?? 50) + 10 ? '+0.8°/hr' : '-0.5°/hr',
      windSpeed: Math.round(current.wind_speed_10m),
      windGusts: Math.round(current.wind_gusts_10m || current.wind_speed_10m * 1.3),
      humidity: Math.round(current.relative_humidity_2m),
      pressure: pressureInHg,
      precipProb: precipProb,
      condition: currentWeather.condition,
      icon: currentWeather.icon,
      forecast
    };

    weatherCache.set(cacheKey, { data: result, timestamp: now });
    return result;

  } catch (err) {
    console.warn('[WeatherRadar] Open-Meteo live weather query failed:', err);
    return null;
  }
}
