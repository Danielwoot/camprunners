import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCamprunner } from '../context/CamprunnerContext';
import { WeatherTelemetryCard } from '../components/WeatherTelemetryCard';
import { fetchNWSAlertsForLocation, fetchLiveGpsWeather, NWSActiveAlert, LiveLocationWeather } from '../services/weatherRadarService';
import { fetchCampgroundAmenities, CampgroundSourceDetails } from '../services/dyrtService';
import { calculateCampgroundTransitTelemetry, TransitRouteTelemetry } from '../services/trafficService';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { campsites, selectedCampsite } = useCamprunner();
  
  const [nwsAlert, setNwsAlert] = useState<NWSActiveAlert | null>(null);
  const [liveWeather, setLiveWeather] = useState<LiveLocationWeather | null>(null);
  const [sourceDetails, setSourceDetails] = useState<CampgroundSourceDetails | null>(null);
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState(true);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);

  const campsite = campsites.find((c) => c.id === id) || (selectedCampsite?.id === id ? selectedCampsite : null) || campsites[0];
  const isCampspot = campsite.source === 'campspot';
  const isHipcamp = campsite.source === 'hipcamp';

  const bookingUrl = (campsite.contactUrl && campsite.contactUrl.startsWith('http'))
    ? campsite.contactUrl
    : isCampspot
    ? `https://www.campspot.com/search?location=${encodeURIComponent(campsite.locationName + ', ' + campsite.state)}`
    : isHipcamp
    ? `https://www.hipcamp.com/en-US/search?q=${encodeURIComponent(campsite.name)}`
    : `https://thedyrt.com/search?q=${encodeURIComponent(campsite.name)}`;

  const bookingBtnClass = isCampspot
    ? 'bg-[#10b981] hover:bg-[#059669] border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.4)] text-black font-black'
    : isHipcamp
    ? 'bg-[#ff6b35] hover:bg-[#e0531c] border-[#ff6b35] shadow-[0_0_15px_rgba(255,107,53,0.4)] text-black font-black'
    : 'bg-[#267865] hover:bg-[#349882] border-[#267865] shadow-[0_0_15px_rgba(38,120,101,0.4)] text-white';

  const bookingBtnLabel = isCampspot
    ? 'RESERVE ON CAMPSPOT'
    : isHipcamp
    ? 'BOOK ON HIPCAMP'
    : 'SHOW ORIGINAL LISTING';

  const [imgSrc, setImgSrc] = useState(campsite.image);
  useEffect(() => {
    setImgSrc(campsite.image);
  }, [campsite.image]);

  // Query live National Weather Service active alerts, Open-Meteo GPS elevation + forecast, and authentic campground amenities
  useEffect(() => {
    let isMounted = true;
    setIsLoadingTelemetry(true);

    const lookupId = campsite.locationId || campsite.id;

    Promise.all([
      fetchNWSAlertsForLocation(campsite.lat, campsite.lng),
      fetchLiveGpsWeather(campsite.lat, campsite.lng),
      fetchCampgroundAmenities(lookupId, campsite.source, campsite.contactUrl)
    ]).then(([alert, weather, details]) => {
      if (isMounted) {
        setNwsAlert(alert);
        if (weather) setLiveWeather(weather);
        if (details) {
          setSourceDetails(details);
          if (details.image || (details.photos && details.photos.length > 0)) {
            setImgSrc(details.photos?.[0] || details.image || campsite.image);
          }
        }
        setIsLoadingTelemetry(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoadingTelemetry(false);
    });

    return () => {
      isMounted = false;
    };
  }, [campsite.lat, campsite.lng, campsite.locationId, campsite.id, campsite.source, campsite.contactUrl]);

  const hasActiveWeatherHazard = (nwsAlert && nwsAlert.hasAlert) || campsite.hasWeatherAlert;
  const weatherHazardTitle = nwsAlert?.event || campsite.weatherAlertTitle || 'NATIONAL WEATHER SERVICE ADVISORY';
  const weatherHazardSeverity = nwsAlert?.severity || 'ACTIVE ADVISORY';
  const weatherHazardText = nwsAlert?.description || nwsAlert?.headline || campsite.weatherAlertText || campsite.alertText;

  // Active weather data (GPS-derived real-time or fallback)
  const currentTemp = liveWeather?.temp ?? campsite.weather.temp;
  const currentTempTrend = liveWeather?.tempTrend ?? campsite.weather.tempTrend;
  const currentWind = liveWeather?.windSpeed ?? campsite.weather.windSpeed;
  const currentWindGusts = liveWeather?.windGusts ?? campsite.weather.windGusts;
  const currentPrecip = liveWeather?.precipProb ?? campsite.weather.precipProb;
  const currentHumidity = liveWeather?.humidity ?? campsite.weather.humidity;
  const currentElevation = liveWeather?.elevation || campsite.elevation;
  const activeForecast = liveWeather?.forecast && liveWeather.forecast.length > 0 ? liveWeather.forecast : campsite.forecast;

  // Authentic Source Amenities & Photos
  const displayAmenities = sourceDetails?.amenities && sourceDetails.amenities.length > 0
    ? sourceDetails.amenities
    : campsite.amenities;

  const displayDescription = sourceDetails?.description || campsite.summary;
  const galleryPhotos = sourceDetails?.photos && sourceDetails.photos.length > 0 ? sourceDetails.photos : [imgSrc];

  return (
    <main className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Back Navigation Bar */}
      <div className="flex justify-between items-center font-mono text-xs">
        <Link
          to="/map"
          className="text-[#00f0ff] hover:text-[#fcee0a] font-bold uppercase tracking-wider flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> BACK TO MAP
        </Link>
        <span className="text-gray-500 uppercase">{campsite.sector || campsite.state}</span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Telemetry */}
        <div className="lg:col-span-2 space-y-8">
          {/* Visual Container */}
          <div className="bg-[#0c1212] border-2 border-[#00f0ff]/40 p-2 relative group chamfered-card shadow-2xl space-y-2">
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#a3e635] z-20"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#a3e635] z-20"></div>
            <div className="aspect-video bg-gray-900 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[#00f0ff]/10 mix-blend-overlay z-10"></div>
              <img
                src={imgSrc}
                alt={campsite.name}
                onError={() => setImgSrc('https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop')}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {/* GPS-Derived Elevation Badge */}
              <div className="absolute top-4 left-4 z-20 bg-[#050505]/95 border border-[#00f0ff]/70 px-3.5 py-1.5 font-mono text-xs text-[#a3e635] font-bold shadow-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#00f0ff]">landscape</span>
                <span>ELEVATION: {currentElevation}</span>
              </div>
            </div>

            {/* Authentic Photography Filmstrip / Gallery Selector */}
            {galleryPhotos.length > 1 && (
              <div className="pt-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {galleryPhotos.slice(0, 12).map((photoUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImgSrc(photoUrl)}
                      className={`shrink-0 w-20 h-14 border-2 ${
                        imgSrc === photoUrl ? 'border-[#00f0ff] scale-105 shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'border-gray-800 opacity-60 hover:opacity-100'
                      } overflow-hidden transition-all duration-200`}
                    >
                      <img src={photoUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* OFFICIAL NATIONAL WEATHER SERVICE ACTIVE HAZARD BANNER */}
          {hasActiveWeatherHazard && (
            <div className="flex items-start gap-4 bg-[#fcee0a]/10 border-2 border-[#fcee0a] p-5 shadow-[0_0_20px_rgba(252,238,10,0.2)] relative overflow-hidden chamfered-card">
              <div className="text-[#fcee0a] flex items-center justify-center shrink-0 pt-1">
                <span className="material-symbols-outlined text-4xl animate-pulse">thunderstorm</span>
              </div>
              <div className="flex flex-col flex-1 font-mono space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#fcee0a] text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-widest">
                    NWS {weatherHazardSeverity.toUpperCase()}
                  </span>
                  <span className="text-[#fcee0a] font-['Orbitron'] font-bold text-sm uppercase tracking-wider">
                    {weatherHazardTitle}
                  </span>
                </div>
                
                <p className="text-yellow-100 text-xs md:text-sm leading-relaxed whitespace-pre-line font-sans">
                  {weatherHazardText}
                </p>

                {nwsAlert?.instruction && (
                  <div className="mt-2 pt-2 border-t border-[#fcee0a]/30 text-[11px] text-[#fcee0a]">
                    <span className="font-bold">NWS INSTRUCTIONS: </span>
                    <span className="text-yellow-200/90">{nwsAlert.instruction}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detailed Real-Time GPS Weather Telemetry */}
          <div className="space-y-5 bg-[#0c1212] border-2 border-[#267865]/60 p-6 chamfered-card shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="text-lg font-['Orbitron'] font-bold text-[#a3e635] uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-[#a3e635]">sensors</span>
                <span>REAL-TIME GPS ATMOSPHERIC TELEMETRY</span>
              </h3>
              <span className="font-mono text-[10px] text-[#00f0ff] bg-[#050505] px-2 py-0.5 border border-[#00f0ff]/30">
                LAT: {campsite.latStr} // LNG: {campsite.lngStr}
              </span>
            </div>

            {/* Core Telemetry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <WeatherTelemetryCard
                title="CORE TEMP"
                value={currentTemp}
                unit="°F"
                icon="thermostat"
                trend={currentTempTrend}
                trendType="warning"
              />
              <WeatherTelemetryCard
                title="WIND VELOCITY"
                value={currentWind}
                unit="MPH"
                icon="air"
                trend={`Gusts ${currentWindGusts} MPH`}
                trendType="warning"
              />
              <WeatherTelemetryCard
                title="PRECIP PROB"
                value={currentPrecip}
                unit="%"
                icon="water_drop"
                trend={`Humidity ${currentHumidity}%`}
                trendType="neutral"
              />
            </div>

            {/* 7-Day GPS Forecast Projection */}
            <div className="space-y-3 pt-3 border-t border-gray-800/80">
              <h4 className="font-mono text-xs font-bold text-[#00f0ff] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                <span>7-DAY GPS WEATHER FORECAST</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {activeForecast.map((day, idx) => (
                  <div
                    key={idx}
                    className="bg-[#050505] border border-gray-800 hover:border-[#00f0ff]/60 p-3 text-center font-mono space-y-1.5 chamfered-card transition-all"
                  >
                    <span className="text-[10px] text-gray-400 font-bold block">{day.day}</span>
                    <span className="material-symbols-outlined text-2xl text-[#fcee0a] block">{day.icon}</span>
                    <div className="text-sm font-bold text-white">
                      <span>{day.highTemp}°</span>
                      <span className="text-gray-500 text-[11px] ml-1">{day.lowTemp}°</span>
                    </div>
                    <span className="text-[10px] text-[#00f0ff] block">💧 {day.precipProb}%</span>
                    <span className="text-[9px] text-gray-400 block">💨 {day.windSpeed} mph</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-Time Highway & 50-State Transit Authority Corridor Telemetry (Option A & B Hybrid) */}
          {(() => {
            const transit = calculateCampgroundTransitTelemetry(campsite.lat, campsite.lng, campsite.state);
            const isAlert = transit.status !== 'CLEAR';
            const statusColor = transit.status === 'ROAD_CLOSED'
              ? '#ef4444'
              : transit.status === 'HEAVY_DELAY'
              ? '#f97316'
              : transit.status === 'MODERATE_DELAY'
              ? '#fcee0a'
              : '#10b981';

            return (
              <div className={`space-y-4 bg-[#0c1212] border-2 p-6 chamfered-card shadow-2xl ${
                isAlert ? 'border-[#fcee0a]/60 shadow-[0_0_20px_rgba(252,238,10,0.15)]' : 'border-[#10b981]/40'
              }`}>
                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <h3 className="text-lg font-['Orbitron'] font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#fcee0a]">traffic</span>
                    <span>HIGHWAY & 511 TRANSIT CORRIDOR TELEMETRY</span>
                  </h3>
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 uppercase border ${
                    isAlert ? 'bg-amber-950/80 text-amber-300 border-amber-500' : 'bg-emerald-950/80 text-emerald-300 border-emerald-500'
                  }`}>
                    {transit.estDriveTime}
                  </span>
                </div>

                {/* Corridor Status Bar */}
                <div className={`p-4 border font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isAlert ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' : 'bg-[#050505] border-gray-800 text-gray-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: statusColor, boxShadow: `0 0 10px ${statusColor}` }}></span>
                    <span className="font-bold">{transit.corridorNote}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <span className="material-symbols-outlined text-sm text-[#00f0ff]">speed</span>
                    <span>Live 50-State DOT Corridor Telemetry</span>
                  </div>
                </div>

                {/* Active Transit Authority Incident Bulletins if any */}
                {transit.activeAlerts.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="font-mono text-xs font-bold text-[#fcee0a] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">notification_important</span>
                      <span>ACTIVE STATE TRANSIT AUTHORITY BULLETINS:</span>
                    </h4>

                    <div className="space-y-2.5">
                      {transit.activeAlerts.map((alert) => (
                        <div key={alert.id} className="bg-[#050505] border border-gray-800 p-4 chamfered-card space-y-2 font-mono text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-[#00f0ff] font-bold uppercase text-[11px]">{alert.agency}</span>
                            <span className="bg-red-950 text-red-300 border border-red-500 px-2 py-0.5 text-[9px] font-bold uppercase">
                              {alert.alertType.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-white font-bold text-sm font-['Space_Grotesk']">{alert.headline}</div>
                          <p className="text-gray-300 font-sans text-xs leading-relaxed">{alert.description}</p>
                          {alert.recommendedDetour && (
                            <div className="bg-[#121212] border-l-2 border-[#a3e635] p-2 text-[11px] text-[#a3e635]">
                              <span className="font-bold text-white">RECOMMENDED DETOUR: </span>
                              {alert.recommendedDetour}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Authentic Campsite Amenities & Services Panel */}
          <div className="bg-[#0c1212] border-2 border-[#00f0ff]/40 p-6 chamfered-card space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="text-lg font-['Orbitron'] font-bold text-[#a3e635] uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff]">view_module</span>
                <span>CAMPSITE AMENITIES & SERVICES</span>
              </h3>
              <span className="font-mono text-[10px] text-[#00ff41] bg-[#050505] px-2 py-0.5 border border-[#00ff41]/40 uppercase">
                {displayAmenities.length} VERIFIED FEATURES
              </span>
            </div>

            {/* Dynamic Amenities Grid */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {displayAmenities.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2.5 bg-[#050505]/90 border border-gray-800 hover:border-[#00f0ff]/50 px-3 py-2.5 transition-colors"
                >
                  <span className="text-[#a3e635] text-xs font-bold">►</span>
                  <span className="text-[#e5e2e1] leading-tight">{item}</span>
                </li>
              ))}
            </ul>

            {/* Campground Description / Overview if available */}
            {displayDescription && (
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <h4 className="font-mono text-xs font-bold text-[#00f0ff] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">description</span>
                  <span>OUTPOST OVERVIEW</span>
                </h4>

                <div 
                  className="text-xs text-gray-300 font-sans leading-relaxed bg-[#050505]/70 p-4 border border-gray-800 relative group cursor-pointer hover:border-[#00f0ff]/60 transition-colors" 
                  onClick={() => setIsOverviewModalOpen(true)}
                  title="Click to view full description"
                >
                  <p className="line-clamp-3">
                    {displayDescription.replace(/## /g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1')}
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-[#00f0ff] font-bold uppercase flex items-center gap-1 group-hover:text-[#fcee0a]">
                    <span>[ CLICK TO READ COMPLETE OVERVIEW ]</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dyrt Listing Direct Link Card */}
        <div className="space-y-8">
          <div className="bg-[#0c1212] border-2 border-[#00f0ff]/50 p-6 flex flex-col relative chamfered-card shadow-2xl h-full justify-between">
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#fcee0a]"></div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase tracking-widest block">
                    {campsite.locationName}, {campsite.state}
                  </span>
                  <span className={`font-mono text-[9px] font-black px-2 py-0.5 uppercase tracking-widest ${
                    campsite.source === 'hipcamp'
                      ? 'bg-[#ff6b35] text-black'
                      : campsite.source === 'campspot'
                      ? 'bg-[#10b981] text-black'
                      : 'bg-[#00f0ff] text-black'
                  }`}>
                    {campsite.source === 'hipcamp' ? 'HIPCAMP' : campsite.source === 'campspot' ? 'CAMPSPOT' : 'PUBLIC'}
                  </span>
                </div>
                <h2 className="text-3xl font-['Orbitron'] font-black text-white uppercase tracking-widest leading-tight">
                  {campsite.name}
                </h2>
              </div>

              <div className="space-y-3 font-mono text-xs border-y border-gray-800 py-4">
                <div className="flex justify-between border-b border-gray-800/60 pb-2">
                  <span className="text-gray-400 uppercase">Latitude</span>
                  <span className="text-[#00f0ff] font-bold">{campsite.latStr}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800/60 pb-2">
                  <span className="text-gray-400 uppercase">Longitude</span>
                  <span className="text-[#00f0ff] font-bold">{campsite.lngStr}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800/60 pb-2">
                  <span className="text-gray-400 uppercase">GPS Elevation</span>
                  <span className="text-[#a3e635] font-bold">{currentElevation}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800/60 pb-2">
                  <span className="text-gray-400 uppercase">Terrain Type</span>
                  <span className="text-[#a3e635] font-bold">{campsite.terrain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 uppercase">Availability</span>
                  <span className="text-[#00ff41] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></span>
                    {campsite.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-xs text-gray-400 uppercase block">Nightly Rate</span>
                <div className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-[#a3e635]">
                  {!campsite.priceDisplay || campsite.priceDisplay.includes('$0') || campsite.priceDisplay.toLowerCase().includes('free') || campsite.pricePerNight === 0
                    ? 'See original list'
                    : campsite.priceDisplay}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full ${bookingBtnClass} font-['Orbitron'] font-bold uppercase py-4 px-4 transition-colors border-2 text-sm tracking-wider chamfered-btn flex items-center justify-center gap-2`}
              >
                <span>{bookingBtnLabel}</span>
                <span className="material-symbols-outlined text-base">open_in_new</span>
              </a>
              <Link
                to="/map"
                className="w-full inline-block text-center bg-[#050505] border border-[#00f0ff]/50 text-[#00f0ff] hover:text-[#fcee0a] font-mono text-xs font-bold py-3 uppercase tracking-wider chamfered-btn"
              >
                LOCATE ON MAP
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Overview Pop-up Modal */}
      {isOverviewModalOpen && displayDescription && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setIsOverviewModalOpen(false)}
        >
          <div 
            className="bg-[#0c1212] border-2 border-[#00f0ff] p-6 md:p-8 max-w-2xl w-full max-h-[85vh] flex flex-col chamfered-card shadow-[0_0_35px_rgba(0,240,255,0.3)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff]">description</span>
                <h3 className="font-['Orbitron'] text-base md:text-lg font-bold text-white uppercase tracking-wider">
                  OUTPOST OVERVIEW // COMPLETE INTEL
                </h3>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 space-y-4 font-sans text-sm text-gray-200 leading-relaxed custom-scrollbar">
              <div className="text-xs font-mono text-[#a3e635] uppercase tracking-wider mb-2">
                LOCATION: {campsite.name} // {campsite.locationName}, {campsite.state}
              </div>
              <p className="whitespace-pre-line text-xs md:text-sm">
                {displayDescription.replace(/## /g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1')}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-800 mt-4 flex justify-between items-center">
              <span className="font-mono text-[10px] text-gray-500 uppercase">CAMPRUNNER FIELD DATABASE</span>
              <button
                onClick={() => setIsOverviewModalOpen(false)}
                className="bg-[#267865] hover:bg-[#349882] text-white font-mono text-xs font-bold px-6 py-2.5 uppercase tracking-wider chamfered-btn transition-colors"
              >
                CLOSE OVERVIEW
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
