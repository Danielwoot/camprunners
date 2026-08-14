import React, { useEffect, useState } from 'react';
import { useCamprunner } from '../context/CamprunnerContext';
import { WeatherTelemetryCard } from '../components/WeatherTelemetryCard';
import { DYRT_CAMPSITES_DATA } from '../data/dyrtCampsites';
import { fetchLiveGpsWeather, fetchNWSAlertsForLocation, LiveLocationWeather, NWSActiveAlert } from '../services/weatherRadarService';

export default function WeatherForecast() {
  const { campsites } = useCamprunner();
  const defaultSite = DYRT_CAMPSITES_DATA[0];
  const [selectedSiteId, setSelectedSiteId] = useState(campsites[0]?.id || defaultSite.id);
  const [liveWeather, setLiveWeather] = useState<LiveLocationWeather | null>(null);
  const [nwsAlert, setNwsAlert] = useState<NWSActiveAlert | null>(null);

  const activeCampsiteList = campsites.length > 0 ? campsites : DYRT_CAMPSITES_DATA;
  const selectedSite = activeCampsiteList.find((c) => c.id === selectedSiteId) || activeCampsiteList[0];

  // Fetch real-time GPS weather, true digital elevation, and NWS active alerts for selected campsite
  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetchLiveGpsWeather(selectedSite.lat, selectedSite.lng),
      fetchNWSAlertsForLocation(selectedSite.lat, selectedSite.lng)
    ]).then(([weather, alert]) => {
      if (isMounted) {
        if (weather) setLiveWeather(weather);
        setNwsAlert(alert);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedSite.lat, selectedSite.lng]);

  const currentTemp = liveWeather?.temp ?? selectedSite.weather.temp;
  const currentTempTrend = liveWeather?.tempTrend ?? selectedSite.weather.tempTrend;
  const currentWind = liveWeather?.windSpeed ?? selectedSite.weather.windSpeed;
  const currentWindGusts = liveWeather?.windGusts ?? selectedSite.weather.windGusts;
  const currentPrecip = liveWeather?.precipProb ?? selectedSite.weather.precipProb;
  const currentHumidity = liveWeather?.humidity ?? selectedSite.weather.humidity;
  const currentPressure = liveWeather?.pressure ?? selectedSite.weather.pressure;
  const currentElevation = liveWeather?.elevation || selectedSite.elevation;
  const activeForecast = liveWeather?.forecast && liveWeather.forecast.length > 0 ? liveWeather.forecast : selectedSite.forecast;

  const hasWeatherAlert = (nwsAlert && nwsAlert.hasAlert) || selectedSite.hasWeatherAlert;
  const weatherAlertTitle = nwsAlert?.event || selectedSite.weatherAlertTitle || 'OFFICIAL WEATHER ADVISORY';
  const weatherAlertText = nwsAlert?.description || nwsAlert?.headline || selectedSite.weatherAlertText || selectedSite.alertText;

  return (
    <main className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-[#a3e635] pb-4 gap-4">
        <div>
          <span className="font-mono text-xs text-[#00f0ff] font-bold tracking-widest uppercase">
            ATMOSPHERIC TELEMETRY HUB
          </span>
          <h1 className="font-['Orbitron'] font-black text-white text-3xl md:text-5xl uppercase tracking-widest" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.8)" }}>
            WEATHER FORECASTING
          </h1>
        </div>

        {/* Location Dropdown Selector */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-gray-400 font-bold uppercase">TARGET SECTOR:</span>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="bg-[#050505] border-2 border-[#00f0ff]/50 px-4 py-2 font-mono text-xs text-[#a3e635] font-bold focus:border-[#fcee0a] outline-none chamfered-btn uppercase"
          >
            {activeCampsiteList.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name} ({site.locationName}, {site.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Outpost Header Card */}
      <section className="bg-[#121212] border-2 border-[#00f0ff]/40 p-6 chamfered-card shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#a3e635] shadow-[0_0_8px_#a3e635]"></span>
            <span className="text-xs text-[#00f0ff] font-bold">GPS: {selectedSite.latStr} // {selectedSite.lngStr}</span>
          </div>
          <h2 className="font-['Orbitron'] text-2xl md:text-3xl font-black text-white uppercase">{selectedSite.name}</h2>
          <p className="text-xs text-gray-400">GPS Elevation: <span className="text-[#a3e635] font-bold">{currentElevation}</span> | Terrain: {selectedSite.terrain}</p>
        </div>

        <div className="flex items-center gap-6 bg-[#050505] border border-[#00f0ff]/30 p-4 chamfered-card font-mono">
          <div className="text-center">
            <span className="text-[10px] text-gray-500 block uppercase">CURRENT TEMP</span>
            <span className="font-['Orbitron'] text-3xl font-bold text-white">{currentTemp}°F</span>
          </div>
          <div className="h-8 w-px bg-gray-800"></div>
          <div className="text-center">
            <span className="text-[10px] text-gray-500 block uppercase">WIND VELOCITY</span>
            <span className="font-['Orbitron'] text-3xl font-bold text-[#00f0ff]">{currentWind} <span className="text-xs">MPH</span></span>
          </div>
        </div>
      </section>

      {/* NWS Weather Alert if applicable */}
      {hasWeatherAlert && (
        <div className="bg-[#fcee0a]/10 border-2 border-[#fcee0a] p-4 chamfered-card font-mono flex items-start gap-4 shadow-[0_0_15px_rgba(252,238,10,0.15)]">
          <span className="material-symbols-outlined text-3xl text-[#fcee0a]">thunderstorm</span>
          <div className="space-y-1">
            <span className="bg-[#fcee0a] text-black font-bold text-[10px] px-1.5 py-0.5 uppercase tracking-wider">
              {nwsAlert?.severity ? `NWS ${nwsAlert.severity.toUpperCase()}` : 'WEATHER HAZARD'}
            </span>
            <h4 className="text-[#fcee0a] font-['Orbitron'] font-bold text-xs uppercase">{weatherAlertTitle}</h4>
            <p className="text-yellow-100/90 text-xs font-sans leading-relaxed">{weatherAlertText}</p>
          </div>
        </div>
      )}

      {/* Live Telemetry Metric Grid */}
      <section className="space-y-4">
        <h3 className="text-lg font-['Orbitron'] font-bold text-[#a3e635] uppercase tracking-wide border-b border-gray-800 pb-2">
          REAL-TIME TELEMETRY METRICS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            trend={`Gusts up to ${currentWindGusts} MPH`}
            trendType="warning"
          />
          <WeatherTelemetryCard
            title="PRECIPITATION PROB"
            value={currentPrecip}
            unit="%"
            icon="water_drop"
            trend={`Humidity ${currentHumidity}%`}
            trendType="neutral"
          />
          <WeatherTelemetryCard
            title="BAROMETRIC PRESSURE"
            value={currentPressure}
            unit="inHg"
            icon="speed"
            trend="Stable"
            trendType="neutral"
          />
          <WeatherTelemetryCard
            title="HUMIDITY INDEX"
            value={currentHumidity}
            unit="%"
            icon="humidity_percentage"
            trend="Normal"
            trendType="neutral"
          />
          <WeatherTelemetryCard
            title="GPS ELEVATION"
            value={liveWeather?.elevationNum ?? selectedSite.elevationNum}
            unit="FT"
            icon="landscape"
            trend="USGS DEM"
            trendType="neutral"
          />
        </div>
      </section>

      {/* 7-Day Forecast Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-['Orbitron'] font-bold text-[#00f0ff] uppercase tracking-wide border-b border-gray-800 pb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00f0ff]">calendar_month</span>
          7-DAY METEOROLOGICAL PROJECTION
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
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
      </section>
    </main>
  );
}
