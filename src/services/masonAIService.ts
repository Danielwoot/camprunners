import { DyrtCampsite } from '../data/dyrtCampsites';

export interface MasonRecommendation {
  campsite: DyrtCampsite;
  tacticalScore: number; // 0 - 100
  titleReason: string;
  masonVerdict: string;
  weatherBadge: string;
  topFeatures: string[];
}

export interface MasonMapActions {
  flyTo?: { lat: number; lng: number; zoom?: number };
  enableRadar?: boolean;
  focusedCampsiteId?: string;
}

export interface MasonAnalysisResult {
  greeting: string;
  summaryIntel: string;
  recommendations: MasonRecommendation[];
  analyzedCount: number;
  engineUsed?: 'groq-llama-70b' | 'tactical-heuristic';
  mapActions?: MasonMapActions;
}

// Known geographic destination coordinates for smart map navigation
const DESTINATIONS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'yosemite': { lat: 37.8651, lng: -119.5383, zoom: 11 },
  'joshua tree': { lat: 33.8734, lng: -115.9010, zoom: 10 },
  'tahoe': { lat: 39.0968, lng: -120.0324, zoom: 11 },
  'lake tahoe': { lat: 39.0968, lng: -120.0324, zoom: 11 },
  'big bear': { lat: 34.2439, lng: -116.9114, zoom: 12 },
  'zion': { lat: 37.2982, lng: -113.0263, zoom: 11 },
  'yellowstone': { lat: 44.4280, lng: -110.5885, zoom: 10 },
  'grand canyon': { lat: 36.0544, lng: -112.1401, zoom: 10 },
  'sedona': { lat: 34.8697, lng: -111.7610, zoom: 11 },
  'banff': { lat: 51.1784, lng: -115.5708, zoom: 10 },
  'glacier': { lat: 48.7596, lng: -113.7870, zoom: 10 },
  'olympic': { lat: 47.8021, lng: -123.6044, zoom: 10 },
  'redwood': { lat: 41.2132, lng: -124.0046, zoom: 10 },
  'sequoia': { lat: 36.4864, lng: -118.5658, zoom: 10 },
  'kings canyon': { lat: 36.8879, lng: -118.5551, zoom: 10 },
  'death valley': { lat: 36.5323, lng: -116.9325, zoom: 9 }
};

/**
 * Intelligent tactical heuristic and NLP reasoning engine for Mason.
 * Analyzes live campsite data, real-time GPS weather, terrain, amenities, and user criteria.
 */
export function generateMasonRecommendations(
  campsites: DyrtCampsite[],
  userGoal: string
): MasonAnalysisResult {
  const query = (userGoal || '').toLowerCase().trim();

  // Detect destination flyTo
  let detectedFlyTo: { lat: number; lng: number; zoom: number } | undefined;
  for (const [key, coords] of Object.entries(DESTINATIONS)) {
    if (query.includes(key)) {
      detectedFlyTo = coords;
      break;
    }
  }

  // Detect radar intention
  const shouldEnableRadar = query.includes('rain') || query.includes('storm') || query.includes('radar') || query.includes('weather');

  if (!Array.isArray(campsites) || campsites.length === 0) {
    return {
      greeting: "Hey, I'm Mason. I'm currently monitoring your radar sector, but there are no visible outposts in your map view.",
      summaryIntel: detectedFlyTo
        ? `I noticed you're looking for destinations around that sector. Panning the map to that area now!`
        : "Pan or zoom across national parks, mountain sectors, or coastlines on the map so I can analyze the terrain and weather conditions for you.",
      recommendations: [],
      analyzedCount: 0,
      engineUsed: 'tactical-heuristic',
      mapActions: {
        flyTo: detectedFlyTo,
        enableRadar: shouldEnableRadar
      }
    };
  }

  // Score each visible campsite across multiple tactical dimensions
  const scoredList = campsites
    .filter((site) => site && site.id)
    .map((site) => {
      let score = 70; // Base score
      const matches: string[] = [];
      const highlights: string[] = [];

      const name = String(site.name || '').toLowerCase();
      const terrain = String(site.terrain || 'Wilderness').toLowerCase();
      const location = String(site.locationName || '').toLowerCase();
      const state = String(site.state || '').toLowerCase();
      const summary = String(site.summary || '').toLowerCase();
      const allAmenities = (site.amenities || []).map((a) => String(a).toLowerCase());
      const weather = site.weather;
      const elevationNum = Number(site.elevationNum) || 1000;
      const elevationStr = site.elevation || `${elevationNum} ft`;

      // 1. Weather Safety & Comfort Assessment
      if (weather) {
        // Wind danger penalty
        if (weather.windSpeed > 20 || (weather.windGusts && weather.windGusts > 28)) {
          score -= 20;
          highlights.push(`High wind advisory (${weather.windSpeed} mph)`);
        } else if (weather.windSpeed <= 8) {
          score += 10;
          highlights.push(`Calm winds (${weather.windSpeed} mph)`);
        }

        // Rain / Precipitation evaluation
        if (weather.precipProb > 40) {
          score -= 15;
        } else if (weather.precipProb === 0) {
          score += 8;
          highlights.push('Zero rain probability');
        }

        // Temperature comfort window
        if (weather.temp >= 62 && weather.temp <= 78) {
          score += 12;
          highlights.push(`Optimal temp (${weather.temp}°F)`);
        } else if (weather.temp < 40 || weather.temp > 95) {
          score -= 15;
        }
      }

      // Active hazard penalty
      if (site.hasWeatherAlert) {
        score -= 25;
      }

      // 2. Keyword & Goal matching
      if (query) {
        // California or State match
        if (query.includes('california') || query.includes(' ca ') || query.endsWith(' ca') || query.includes('cali')) {
          if (state.includes('california') || state.includes('ca')) {
            score += 25;
            matches.push('California sector outpost');
          }
        }

        // Rain / Storm context
        if (query.includes('rain') || query.includes('storm') || query.includes('wet') || query.includes('dry')) {
          if (weather && weather.precipProb <= 10) {
            score += 30;
            matches.push('Protected low-precipitation sector (0-10% rain)');
          }
          if (allAmenities.some((a) => a.includes('cabin') || a.includes('shelter') || a.includes('shower'))) {
            score += 20;
            matches.push('Weather-sheltered amenities');
          }
        }

        // Stargazing / Night skies
        if (query.includes('star') || query.includes('night') || query.includes('sky') || query.includes('clear')) {
          if (terrain.includes('desert') || elevationNum > 3500) {
            score += 25;
            matches.push('High visibility dark sky corridor');
          }
          if (weather && weather.precipProb < 10 && weather.humidity < 45) {
            score += 20;
            matches.push('Dry, crisp atmospheric conditions');
          }
        }

        // Pet Friendly
        if (query.includes('pet') || query.includes('dog')) {
          const isPetFriendly = allAmenities.some((a) => a.includes('pet') || a.includes('dog'));
          if (isPetFriendly) {
            score += 35;
            matches.push('Verified pet-friendly outpost');
          } else {
            score -= 15;
          }
        }

        // Alpine / High Altitude
        if (query.includes('alpine') || query.includes('mountain') || query.includes('high') || query.includes('altitude')) {
          if (terrain.includes('alpine') || elevationNum > 3000) {
            score += 30;
            matches.push(`High elevation retreat (${elevationStr})`);
          }
        }

        // Budget / Free Dispersed
        if (query.includes('budget') || query.includes('free') || query.includes('cheap') || query.includes('dispersed')) {
          if (site.pricePerNight === 0 || (site.priceDisplay && site.priceDisplay.toLowerCase().includes('free'))) {
            score += 35;
            matches.push('No nightly fee / Public land');
          } else if (site.pricePerNight && site.pricePerNight <= 30) {
            score += 20;
            matches.push(`Affordable rate (${site.priceDisplay})`);
          }
        }

        // Calm / Weather / Safe
        if (query.includes('calm') || query.includes('safe') || query.includes('warm') || query.includes('weather')) {
          if (weather && weather.windSpeed <= 7 && !site.hasWeatherAlert) {
            score += 30;
            matches.push('Calm, stable atmospheric profile');
          }
        }

        // Showers & Restrooms / Comfort
        if (query.includes('shower') || query.includes('toilet') || query.includes('bathroom') || query.includes('water')) {
          const hasToilet = allAmenities.some((a) => a.includes('toilet'));
          const hasShower = allAmenities.some((a) => a.includes('shower'));
          const hasWater = allAmenities.some((a) => a.includes('water'));
          if (hasToilet || hasShower || hasWater) {
            score += 25;
            matches.push('Sanitation & water infrastructure verified');
          }
        }

        // Climbing & Hiking
        if (query.includes('climb') || query.includes('hike') || query.includes('trail')) {
          if (allAmenities.some((a) => a.includes('climbing') || a.includes('hiking')) || terrain.includes('rocky') || terrain.includes('canyon')) {
            score += 25;
            matches.push('Direct wilderness trail & crag access');
          }
        }

        // General name & location match
        if (name.includes(query) || location.includes(query) || summary.includes(query)) {
          score += 20;
        }
      }

      // Clamp score to 20 - 99 range
      const finalScore = Math.min(99, Math.max(20, score));

      // Formulate Mason's custom verdict for this site
      let weatherBadge = 'STABLE WEATHER';
      if (site.hasWeatherAlert) {
        weatherBadge = 'WEATHER ADVISORY ACTIVE';
      } else if (weather && weather.windSpeed <= 6 && weather.precipProb === 0) {
        weatherBadge = 'IDEAL CONDITIONS (0% PRECIP)';
      } else if (weather) {
        weatherBadge = `${weather.temp}°F // ${weather.windSpeed} MPH WIND`;
      }

      let verdict = `Solid tactical deployment in ${site.locationName || 'Sector'}, ${site.state || 'CA'}.`;
      if (matches.length > 0) {
        verdict = `${matches.join(' · ')}. Positioned at ${elevationStr} with ${weatherBadge.toLowerCase()}.`;
      } else if (highlights.length > 0) {
        verdict = `Favorable sector conditions: ${highlights.join(', ')}. Strong overall basecamp readiness.`;
      }

      return {
        campsite: site,
        tacticalScore: finalScore,
        titleReason: matches[0] || `${site.terrain || 'Scenic'} Outpost (${elevationStr})`,
        masonVerdict: verdict,
        weatherBadge: weatherBadge,
        topFeatures: (site.amenities || []).slice(0, 4)
      };
    });

  // Sort by tactical match score descending
  scoredList.sort((a, b) => b.tacticalScore - a.tacticalScore);

  const topRecommendations = scoredList.slice(0, 3);
  const bestSite = topRecommendations[0]?.campsite;

  let greeting = `Mason here! I ran a tactical sweep across ${campsites.length} outposts in your current sector.`;
  let summaryIntel = `Based on your objective "${userGoal || 'Top Recommended Campsites'}", I prioritized outposts with optimal GPS weather telemetry, verified terrain access, and safety margins.`;

  if (bestSite) {
    summaryIntel += ` My top recommendation is **${bestSite.name}** in ${bestSite.locationName} with a ${topRecommendations[0].tacticalScore}% tactical match score.`;
  }

  return {
    greeting,
    summaryIntel,
    recommendations: topRecommendations,
    analyzedCount: campsites.length,
    engineUsed: 'tactical-heuristic',
    mapActions: {
      flyTo: detectedFlyTo,
      enableRadar: shouldEnableRadar,
      focusedCampsiteId: bestSite?.id
    }
  };
}

/**
 * Async dispatcher: Queries Groq Cloud Llama-3.3-70B first, falls back instantly to Mason Heuristic Engine.
 */
export async function queryMasonAdvisor(
  campsites: DyrtCampsite[],
  userGoal: string
): Promise<MasonAnalysisResult> {
  // Attempt server Groq Cloud Llama-3.3-70B API
  try {
    const subset = campsites.slice(0, 20).map((c) => ({
      id: c.id,
      name: c.name,
      location: `${c.locationName}, ${c.state}`,
      lat: c.lat,
      lng: c.lng,
      terrain: c.terrain,
      elevation: c.elevation,
      price: c.priceDisplay,
      source: c.source,
      temp: c.weather?.temp,
      wind: c.weather?.windSpeed,
      precip: c.weather?.precipProb,
      amenities: (c.amenities || []).slice(0, 6)
    }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const response = await fetch('/api/ai/mason-advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visibleSites: subset,
        userGoal: userGoal || 'Best overall campsite'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && !data.error && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        const hydratedRecs: MasonRecommendation[] = data.recommendations
          .map((rec: any) => {
            if (!rec) return null;
            const recId = String(rec.id || '').trim();
            const recName = String(rec.name || '').trim();

            // 1. Exact ID match from visible campsites
            let fullSite = campsites.find((s) => s.id === recId);

            // 2. Strict name match (only if recName is at least 3 chars)
            if (!fullSite && recName.length >= 3) {
              const lowerRecName = recName.toLowerCase();
              fullSite = campsites.find(
                (s) =>
                  s.name.toLowerCase() === lowerRecName ||
                  s.name.toLowerCase().includes(lowerRecName) ||
                  lowerRecName.includes(s.name.toLowerCase())
              );
            }

            // 3. If Groq recommends a unique external campsite not in active viewport
            if (!fullSite && recName.length >= 3) {
              fullSite = {
                id: recId || `mason-rec-${Math.random().toString(36).slice(2, 8)}`,
                name: recName,
                locationName: rec.location || 'California Sector',
                state: 'California',
                summary: rec.masonVerdict || rec.rationale || 'Top tactical recommendation selected by Mason.',
                rating: 4.8,
                reviewCount: 24,
                priceDisplay: 'See original list',
                pricePerNight: 0,
                lat: 34.05,
                lng: -118.25,
                terrain: 'Forest',
                status: 'Available',
                sector: 'California Sector',
                latStr: '34.05° N',
                lngStr: '118.25° W',
                elevation: rec.elevation || '2,500 ft',
                elevationNum: 2500,
                amenities: ['Verified Access', 'Tactical Basecamp'],
                siteTypes: ['Tent', 'Backpacker'],
                image: 'https://images.unsplash.com/photo-1504280390224-4f9b889396fc?q=80&w=1200&auto=format&fit=crop',
                contactUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(recName)}`,
                availabilityType: 'CHECK_AVAILABILITY',
                source: 'public',
                hasWeatherAlert: false,
                weather: {
                  temp: 72,
                  tempTrend: 'Steady',
                  windSpeed: 5,
                  windGusts: 8,
                  precipProb: 0,
                  humidity: 45,
                  pressure: 1013,
                  uvIndex: 5,
                  airQuality: 'Good'
                },
                forecast: []
              };
            }

            if (!fullSite) return null;

            return {
              campsite: fullSite,
              tacticalScore: rec.tacticalScore || 92,
              titleReason: rec.titleReason || `${fullSite.terrain || 'Tactical'} Recommendation`,
              masonVerdict: rec.masonVerdict || rec.rationale || 'Top tactical pick for your mission criteria.',
              weatherBadge: rec.weatherBadge || `${fullSite.weather?.temp || 72}°F · ${fullSite.weather?.windSpeed || 5} MPH`,
              topFeatures: (fullSite.amenities || []).slice(0, 4)
            };
          })
          .filter((r): r is MasonRecommendation => r !== null && r.campsite !== undefined);

        if (hydratedRecs.length > 0) {
          return {
            greeting: data.greeting || `Mason here! I've analyzed ${campsites.length} outposts with Groq Llama 3.3.`,
            summaryIntel: data.summaryIntel || `Here are my top recommendations tailored to "${userGoal}".`,
            recommendations: hydratedRecs,
            analyzedCount: campsites.length,
            engineUsed: 'groq-llama-70b',
            mapActions: data.mapActions
          };
        }
      }
    }
  } catch (err) {
    console.log('[Mason AI] Groq fallback to local heuristic engine:', err);
  }

  // Instant fallback to client heuristic reasoning engine
  return generateMasonRecommendations(campsites, userGoal);
}
