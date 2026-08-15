import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCamprunner } from '../context/CamprunnerContext';
import { DyrtCampsite } from '../data/dyrtCampsites';
import { fetchUnifiedCampsitesInBounds } from '../services/dyrtService';
import { getNOAANexradRadarTileUrl } from '../services/weatherRadarService';
import {
  getRealTimeTrafficTileUrl,
  fetchTransitAlertsInBounds,
  calculateCampgroundTransitTelemetry,
  StateTransitAlert
} from '../services/trafficService';
import { fetchFuelStationsInBounds, FuelStation } from '../services/fuelService';
import { getCamprunnersVectorStyle } from '../services/maplibreStyle';
import { MasonAIAdvisorDrawer } from './MasonAIAdvisorDrawer';

interface GoogleMapTrackerProps {
  heightClass?: string;
}

export const GoogleMapTracker: React.FC<GoogleMapTrackerProps> = ({ heightClass = 'h-[calc(100vh-64px)]' }) => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const campsiteMarkersRef = useRef<maplibregl.Marker[]>([]);
  const transitMarkersRef = useRef<maplibregl.Marker[]>([]);
  const fuelMarkersRef = useRef<maplibregl.Marker[]>([]);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  const { registerCampsites, setSelectedCampsite } = useCamprunner();

  const [activeSite, setActiveSite] = useState<DyrtCampsite | null>(null);
  const [allVisibleSites, setAllVisibleSites] = useState<DyrtCampsite[]>([]);
  const [showRadar, setShowRadar] = useState<boolean>(false);
  const [radarTimeLabel, setRadarTimeLabel] = useState<string>('LIVE RADAR');
  const [showTraffic, setShowTraffic] = useState<boolean>(false);
  const [showFuelStations, setShowFuelStations] = useState<boolean>(false);
  const [visibleFuelStations, setVisibleFuelStations] = useState<FuelStation[]>([]);
  const [selectedFuelStation, setSelectedFuelStation] = useState<FuelStation | null>(null);
  const [activeTransitAlerts, setActiveTransitAlerts] = useState<StateTransitAlert[]>([]);
  const [selectedTransitAlert, setSelectedTransitAlert] = useState<StateTransitAlert | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isMasonDrawerOpen, setIsMasonDrawerOpen] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'reviews'>('recommended');
  const [selectedProvider, setSelectedProvider] = useState<'ALL' | 'PUBLIC' | 'HIPCAMP' | 'CAMPSPOT'>('ALL');
  const [aiTargetIds, setAiTargetIds] = useState<string[]>([]);

  const handleApplyMapActions = (
    actions?: { flyTo?: { lat: number; lng: number; zoom?: number }; enableRadar?: boolean; enableTraffic?: boolean; enableFuel?: boolean; focusedCampsiteId?: string; focusedFuelStationId?: string },
    recommendedIds: string[] = []
  ) => {
    if (recommendedIds.length > 0) {
      setAiTargetIds(recommendedIds);
    }
    if (!actions) return;

    if (actions.enableRadar) {
      setShowRadar(true);
    }
    if (actions.enableTraffic) {
      setShowTraffic(true);
    }
    if (actions.enableFuel) {
      setShowFuelStations(true);
    }

    if (actions.flyTo && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [actions.flyTo.lng, actions.flyTo.lat],
        zoom: actions.flyTo.zoom || 11,
        speed: 1.2
      });
    }

    if (actions.focusedCampsiteId) {
      const found = allVisibleSites.find(s => s.id === actions.focusedCampsiteId);
      if (found) {
        setActiveSite(found);
        if (mapInstanceRef.current && !actions.flyTo) {
          mapInstanceRef.current.flyTo({
            center: [found.lng, found.lat],
            zoom: 13,
            speed: 1.2
          });
        }
      }
    }

    if (actions.focusedFuelStationId) {
      const foundFuel = visibleFuelStations.find(f => f.id === actions.focusedFuelStationId);
      if (foundFuel) {
        setSelectedFuelStation(foundFuel);
        if (mapInstanceRef.current && !actions.flyTo) {
          mapInstanceRef.current.flyTo({
            center: [foundFuel.lng, foundFuel.lat],
            zoom: 14,
            speed: 1.2
          });
        }
      }
    }
  };

  // Debounce ref for map pan/zoom fetching
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize MapLibre GL Vector Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let initialCenter: [number, number] = [-119.5936, 37.7456]; // [lng, lat] for Yosemite National Park, CA
    let initialZoom = 9;

    try {
      const savedView = sessionStorage.getItem('camprunners_map_view');
      if (savedView) {
        const parsed = JSON.parse(savedView);
        if (Array.isArray(parsed.center) && parsed.center.length === 2 && typeof parsed.zoom === 'number') {
          initialCenter = [parsed.center[1], parsed.center[0]];
          initialZoom = parsed.zoom;
        }
      }
    } catch {}

    let isMounted = true;

    async function initMap() {
      const vectorStyle = await getCamprunnersVectorStyle();
      if (!isMounted || !mapContainerRef.current) return;

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: vectorStyle,
        center: initialCenter,
        zoom: initialZoom,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      map.on('load', () => {
        if (!isMounted) return;
        fetchCampsitesForCurrentBounds(map);
      });

      map.on('moveend', () => {
        if (!isMounted) return;
        try {
          const center = map.getCenter();
          const zoom = map.getZoom();
          sessionStorage.setItem(
            'camprunners_map_view',
            JSON.stringify({ center: [center.lat, center.lng], zoom })
          );
        } catch {}

        if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = setTimeout(() => {
          fetchCampsitesForCurrentBounds(map);
        }, 350);
      });

      map.on('click', () => {
        setActiveSite(null);
      });
    }

    initMap();

    return () => {
      isMounted = false;
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch unified campgrounds, Hipcamp retreats, Campspot resorts, fuel stations, and 50-State transit alerts
  const fetchCampsitesForCurrentBounds = async (map: maplibregl.Map) => {
    try {
      setIsLoading(true);
      const bounds = map.getBounds();
      const mapBounds = {
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLng: bounds.getWest(),
        maxLng: bounds.getEast()
      };

      const [sites, transitAlerts, fuelStops] = await Promise.all([
        fetchUnifiedCampsitesInBounds(mapBounds),
        Promise.resolve(fetchTransitAlertsInBounds(mapBounds)),
        fetchFuelStationsInBounds(mapBounds)
      ]);

      // Strictly keep only sites whose lat/lng is actually inside the active map bounds
      const inViewSites = sites.filter((s) => bounds.contains([s.lng, s.lat]));
      setAllVisibleSites(inViewSites);
      setActiveTransitAlerts(transitAlerts);
      setVisibleFuelStations(fuelStops);
      registerCampsites(inViewSites);

    } catch (err) {
      console.error('[Map Tracker] Failed to fetch campsites & transit alerts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter & Sort campsites by provider, viewport bounds, and search query
  const visibleCampsites = useMemo(() => {
    let list = [...allVisibleSites];

    if (mapInstanceRef.current) {
      const b = mapInstanceRef.current.getBounds();
      list = list.filter((s) => b.contains([s.lng, s.lat]));
    }

    if (selectedProvider === 'PUBLIC') {
      list = list.filter((s) => s.source === 'public' || (!s.source && s.source !== 'hipcamp' && s.source !== 'campspot'));
    } else if (selectedProvider === 'HIPCAMP') {
      list = list.filter((s) => s.source === 'hipcamp');
    } else if (selectedProvider === 'CAMPSPOT') {
      list = list.filter((s) => s.source === 'campspot');
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(
        (site) =>
          site.name.toLowerCase().includes(q) ||
          site.locationName.toLowerCase().includes(q) ||
          site.state.toLowerCase().includes(q) ||
          site.terrain.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return list;
  }, [allVisibleSites, searchFilter, sortBy, selectedProvider]);

  // Handle Live NOAA Radar Overlay Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const radarTileUrl = getNOAANexradRadarTileUrl();

    if (showRadar) {
      if (!map.getSource('radar-source')) {
        map.addSource('radar-source', {
          type: 'raster',
          tiles: [radarTileUrl],
          tileSize: 256
        });
      }
      if (!map.getLayer('radar-layer')) {
        map.addLayer({
          id: 'radar-layer',
          type: 'raster',
          source: 'radar-source',
          paint: { 'raster-opacity': 0.75 }
        });
      }
      setRadarTimeLabel('NOAA NEXRAD (LIVE)');
    } else {
      if (map.getLayer('radar-layer')) map.removeLayer('radar-layer');
      if (map.getSource('radar-source')) map.removeSource('radar-source');
    }
  }, [showRadar]);

  // Handle Real-Time High-Speed Traffic Flow Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (showTraffic) {
      if (!map.getSource('traffic-source')) {
        map.addSource('traffic-source', {
          type: 'raster',
          tiles: [
            'https://mt0.google.com/vt?lyrs=h,traffic|seconds_into_week:-1&style=15&x={x}&y={y}&z={z}',
            'https://mt1.google.com/vt?lyrs=h,traffic|seconds_into_week:-1&style=15&x={x}&y={y}&z={z}',
            'https://mt2.google.com/vt?lyrs=h,traffic|seconds_into_week:-1&style=15&x={x}&y={y}&z={z}',
            'https://mt3.google.com/vt?lyrs=h,traffic|seconds_into_week:-1&style=15&x={x}&y={y}&z={z}'
          ],
          tileSize: 256
        });
      }
      if (!map.getLayer('traffic-layer')) {
        map.addLayer({
          id: 'traffic-layer',
          type: 'raster',
          source: 'traffic-source',
          paint: { 'raster-opacity': 0.85 }
        });
      }
    } else {
      if (map.getLayer('traffic-layer')) map.removeLayer('traffic-layer');
      if (map.getSource('traffic-source')) map.removeSource('traffic-source');
    }
  }, [showTraffic]);

  // Render 50-State Transit Authority & Mountain Pass Incident Pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    transitMarkersRef.current.forEach((m) => m.remove());
    transitMarkersRef.current = [];

    if (!showTraffic) return;

    activeTransitAlerts.forEach((alert) => {
      const isCritical = alert.severity === 'CRITICAL' || alert.alertType === 'PASS_CLOSURE';
      const isChain = alert.alertType === 'CHAIN_CONTROL';
      const isAccident = alert.alertType === 'SEVERE_ACCIDENT';

      const alertColor = isCritical
        ? '#ef4444' // red
        : isChain
        ? '#00f0ff' // icy cyan
        : isAccident
        ? '#f97316' // orange
        : '#fcee0a'; // yellow

      const alertIconSymbol = isCritical
        ? 'block'
        : isChain
        ? 'ac_unit'
        : isAccident
        ? 'car_crash'
        : alert.alertType === 'FLOOD_WASHOUT'
        ? 'waves'
        : alert.alertType === 'HIGH_WIND_WARNING'
        ? 'air'
        : 'construction';

      const el = document.createElement('div');
      el.className = 'group relative flex items-center justify-center cursor-pointer';
      el.innerHTML = `
        <div style="
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${alertColor}33;
          border: 1px dashed ${alertColor};
          animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: #050505;
          border: 2px solid ${alertColor};
          box-shadow: 0 0 12px ${alertColor};
          border-radius: 4px;
          color: ${alertColor};
          font-family: monospace;
          transform: rotate(45deg);
          transition: all 0.2s ease;
        ">
          <span class="material-symbols-outlined" style="font-size: 14px; transform: rotate(-45deg); font-weight: bold;">
            ${alertIconSymbol}
          </span>
        </div>
        <div style="
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(5, 5, 5, 0.95);
          border: 1px solid ${alertColor};
          color: ${alertColor};
          font-family: monospace;
          font-size: 9px;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 2px;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.9);
        ">
          ${alert.highway}
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedTransitAlert(alert);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([alert.lng, alert.lat])
        .addTo(map);

      transitMarkersRef.current.push(marker);
    });
  }, [showTraffic, activeTransitAlerts]);

  // Render Interactive Fuel & Gas Stations Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    fuelMarkersRef.current.forEach((m) => m.remove());
    fuelMarkersRef.current = [];

    if (!showFuelStations) return;

    visibleFuelStations.forEach((station) => {
      const el = document.createElement('div');
      el.className = 'group relative flex items-center justify-center cursor-pointer';
      el.innerHTML = `
        <div style="
          position: absolute;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.2);
          border: 1px dashed #f59e0b;
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: #0f172a;
          border: 2px solid #f59e0b;
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.6);
          border-radius: 50%;
          color: #f59e0b;
          font-family: monospace;
          transition: all 0.2s ease;
        ">
          <span class="material-symbols-outlined" style="font-size: 14px; font-weight: bold;">
            local_gas_station
          </span>
        </div>
        <div style="
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(5, 5, 5, 0.95);
          border: 1px solid #f59e0b;
          color: #f59e0b;
          font-family: monospace;
          font-size: 9px;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 2px;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.9);
        ">
          ⛽ ${station.brand}
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedFuelStation(station);
        map.flyTo({ center: [station.lng, station.lat], zoom: 14, speed: 1.2 });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([station.lng, station.lat])
        .addTo(map);

      fuelMarkersRef.current.push(marker);
    });
  }, [showFuelStations, visibleFuelStations]);

  // Render Campsite Markers at exact real-world GPS coordinates with tactical radar pulse pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    campsiteMarkersRef.current.forEach((m) => m.remove());
    campsiteMarkersRef.current = [];

    visibleCampsites.forEach((site) => {
      const isSelected = activeSite?.id === site.id;
      const isAiTarget = aiTargetIds.includes(site.id);
      const isHipcamp = site.source === 'hipcamp';
      const isCampspot = site.source === 'campspot';
      const mainColor = isSelected
        ? '#fcee0a'
        : isAiTarget
        ? '#a3e635'
        : isHipcamp
        ? '#ff6b35'
        : isCampspot
        ? '#10b981'
        : '#00f0ff';

      const pulseBg = isSelected
        ? 'rgba(252, 238, 10, 0.25)'
        : isAiTarget
        ? 'rgba(163, 230, 53, 0.25)'
        : isHipcamp
        ? 'rgba(255, 107, 53, 0.2)'
        : isCampspot
        ? 'rgba(16, 185, 129, 0.2)'
        : 'rgba(0, 240, 255, 0.2)';

      const badgeIcon = isHipcamp ? 'bolt' : isCampspot ? 'hotel' : 'camping';

      const el = document.createElement('div');
      el.className = 'group relative flex items-center justify-center cursor-pointer';
      el.innerHTML = `
        <div style="
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${pulseBg};
          border: 1px dashed ${mainColor};
          animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: #050505;
          border: 2px solid ${mainColor};
          box-shadow: 0 0 10px ${mainColor};
          border-radius: 50%;
          color: ${mainColor};
          transition: all 0.2s ease;
        ">
          <span class="material-symbols-outlined" style="font-size: 14px; font-weight: bold;">
            ${badgeIcon}
          </span>
        </div>
        <div style="
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(5, 5, 5, 0.95);
          border: 1px solid ${mainColor};
          color: ${mainColor};
          font-family: monospace;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 2px;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.8);
          display: ${isSelected || isAiTarget ? 'block' : 'none'};
        " class="group-hover:!block">
          ${isAiTarget ? '🎯 ' : isHipcamp ? '⚡ ' : isCampspot ? '⬡ ' : '⛺ '}${site.name}
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedCampsite(site);
        setActiveSite(site);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([site.lng, site.lat])
        .addTo(map);

      campsiteMarkersRef.current.push(marker);
    });
  }, [visibleCampsites, activeSite, aiTargetIds]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleCenterMap = () => {
    if (mapInstanceRef.current && activeSite) {
      mapInstanceRef.current.flyTo({ center: [activeSite.lng, activeSite.lat], zoom: 12, speed: 1.2 });
    }
  };

  const handleSelectCampsiteFromList = (site: DyrtCampsite) => {
    setSelectedCampsite(site);
    setActiveSite(site);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({ center: [site.lng, site.lat], zoom: 12, speed: 1.2 });
    }
  };

  return (
    <div className={`relative w-full ${heightClass} bg-[#050505] overflow-hidden`}>
      {/* Search Bar Toggle Button on Map Left End */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`absolute top-6 left-6 z-30 bg-[#050505]/95 border-2 ${
          isSidebarOpen ? 'border-[#fcee0a] text-[#fcee0a]' : 'border-[#00f0ff] text-[#00f0ff]'
        } px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:bg-[#00f0ff]/10 chamfered-btn transition-all duration-300`}
      >
        <span className="material-symbols-outlined text-base">
          {isSidebarOpen ? 'chevron_left' : 'travel_explore'}
        </span>
        <span>{isSidebarOpen ? 'CLOSE DIRECTORY' : 'SEARCH SECTOR OUTPOSTS'}</span>
        <span className="bg-[#00f0ff]/20 text-[#00f0ff] px-1.5 py-0.5 rounded text-[10px]">
          {visibleCampsites.length}
        </span>
      </button>

      {/* Expandable / Collapsible Left Drawer Menu */}
      <div
        ref={sidebarContainerRef}
        className={`sidebar-drawer absolute top-0 left-0 z-40 h-full w-84 sm:w-96 bg-[#050505]/95 border-r-2 border-[#00f0ff]/50 backdrop-blur-xl shadow-2xl flex flex-col transition-all duration-300 transform ${
          isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#00f0ff]/30 bg-[#0c1212] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLoading ? 'bg-[#fcee0a]' : 'bg-[#00ff41]'} animate-pulse`}></span>
            <div>
              <h4 className="font-['Orbitron'] text-sm font-bold text-white tracking-widest uppercase flex items-center gap-1.5">
                <span>CAMPRUNNER</span>
                <span className="text-[#00f0ff]">//</span>
                <span className="text-[#a3e635]">EXPLORER</span>
              </h4>
              <span className="font-mono text-[10px] text-gray-400 block">
                {isLoading ? 'Scanning active sector...' : `${visibleCampsites.length} Outposts in Viewport`}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#fcee0a] hover:bg-[#00f0ff]/10 border border-gray-700 hover:border-[#fcee0a] transition-colors chamfered-btn"
            title="Contract back inside"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>
        </div>

        {/* Provider Source Tabs & Search Bar */}
        <div className="p-3 border-b border-gray-800/80 bg-[#080808] space-y-2.5">
          {/* Provider Filter Segment */}
          <div className="grid grid-cols-4 gap-1 font-mono text-[9px] font-bold">
            <button
              onClick={() => setSelectedProvider('ALL')}
              className={`py-1.5 text-center uppercase tracking-wider transition-colors chamfered-btn ${
                selectedProvider === 'ALL'
                  ? 'bg-[#00f0ff] text-black font-black'
                  : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              ALL ({allVisibleSites.length})
            </button>
            <button
              onClick={() => setSelectedProvider('PUBLIC')}
              className={`py-1.5 text-center uppercase tracking-wider transition-colors chamfered-btn ${
                selectedProvider === 'PUBLIC'
                  ? 'bg-[#00f0ff] text-black font-black'
                  : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              PUBLIC
            </button>
            <button
              onClick={() => setSelectedProvider('HIPCAMP')}
              className={`py-1.5 text-center uppercase tracking-wider transition-colors chamfered-btn ${
                selectedProvider === 'HIPCAMP'
                  ? 'bg-[#ff6b35] text-black font-black'
                  : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              HIPCAMP
            </button>
            <button
              onClick={() => setSelectedProvider('CAMPSPOT')}
              className={`py-1.5 text-center uppercase tracking-wider transition-colors chamfered-btn ${
                selectedProvider === 'CAMPSPOT'
                  ? 'bg-[#10b981] text-black font-black'
                  : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              CAMPSPOT
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Filter by name, park, or terrain..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#121212] border border-[#00f0ff]/40 px-3 py-2 pl-9 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] chamfered-card"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-sm text-gray-500">
              search
            </span>
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-2.5 text-gray-500 hover:text-white"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('recommended')}
              className={`flex-1 py-1.5 font-mono text-[10px] font-bold uppercase transition-colors chamfered-btn ${
                sortBy === 'recommended'
                  ? 'bg-[#00f0ff] text-black font-black'
                  : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`flex-1 py-1.5 font-mono text-[10px] font-bold uppercase transition-colors chamfered-btn ${
                sortBy === 'rating'
                  ? 'bg-[#00f0ff] text-black font-black'
                  : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              Top Rated
            </button>
            <button
              onClick={() => setSortBy('reviews')}
              className={`flex-1 py-1.5 font-mono text-[10px] font-bold uppercase transition-colors chamfered-btn ${
                sortBy === 'reviews'
                  ? 'bg-[#00f0ff] text-black font-black'
                  : 'bg-[#121212] text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              Reviews
            </button>
          </div>
        </div>

        {/* Campsite List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {isLoading && visibleCampsites.length === 0 ? (
            <div className="text-center py-12 space-y-3 font-mono">
              <div className="w-8 h-8 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="text-xs text-[#00f0ff] tracking-widest uppercase">
                Acquiring Sector Telemetry...
              </div>
              <p className="text-[10px] text-gray-400 max-w-xs mx-auto">
                Querying verified USDA/NPS datasets, Hipcamp retreats & Campspot resorts
              </p>
            </div>
          ) : visibleCampsites.length === 0 ? (
            <div className="text-center py-12 space-y-3 font-mono">
              <span className="material-symbols-outlined text-4xl text-gray-600">
                radar
              </span>
              <div className="text-xs text-gray-400 uppercase tracking-widest">
                No Outposts in Active Viewport
              </div>
              <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                Pan or zoom out across California sectors, national forests, and mountain passes to acquire campgrounds.
              </p>
            </div>
          ) : (
            visibleCampsites.map((site) => {
              const isSelected = activeSite?.id === site.id;
              const isAiTarget = aiTargetIds.includes(site.id);
              const isHipcamp = site.source === 'hipcamp';
              const isCampspot = site.source === 'campspot';
              const sourceBadge = isHipcamp ? 'HIPCAMP' : isCampspot ? 'CAMPSPOT' : 'PUBLIC';
              const badgeColor = isHipcamp ? 'bg-[#ff6b35]' : isCampspot ? 'bg-[#10b981]' : 'bg-[#00f0ff]';
              const priceDisplay = site.priceDisplay || (site.pricePerNight ? `$${site.pricePerNight}/night` : 'See original list');

              return (
                <div
                  key={site.id}
                  onClick={() => handleSelectCampsiteFromList(site)}
                  className={`p-3 bg-[#080c0c] border cursor-pointer transition-all chamfered-card ${
                    isSelected
                      ? 'border-[#fcee0a] bg-[#121a14] shadow-[0_0_15px_rgba(252,238,10,0.3)]'
                      : isAiTarget
                      ? 'border-[#a3e635] bg-[#0c1a10] shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                      : 'border-gray-800/80 hover:border-[#00f0ff]/60 hover:bg-[#0c1414]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`${badgeColor} text-black font-black text-[8px] px-1 py-0.2 rounded font-mono uppercase tracking-wider`}>
                          {sourceBadge}
                        </span>
                        {isAiTarget && (
                          <span className="bg-[#a3e635] text-black font-black text-[8px] px-1 py-0.2 rounded font-mono uppercase tracking-wider">
                            TARGET
                          </span>
                        )}
                        {site.hasWeatherAlert && (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[8px] px-1 py-0.2 rounded font-mono flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[10px]">warning</span>
                            ALERT
                          </span>
                        )}
                      </div>
                      <h4 className="font-['Space_Grotesk'] text-sm font-bold text-white leading-tight">
                        {site.name}
                      </h4>
                      <p className="font-mono text-[10px] text-gray-400">
                        {site.locationName}, {site.state} · {site.elevation}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-[#fcee0a] font-mono flex items-center justify-end gap-0.5">
                        <span className="text-[10px]">★</span>
                        <span>{site.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-mono block">
                        {site.reviewCount} revs
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-mono text-[10px] border-t border-gray-800/60 pt-2 mt-2">
                    <span className="text-[#a3e635] font-bold">
                      {priceDisplay}
                    </span>
                    <span className="text-[#00f0ff] flex items-center gap-1">
                      <span>{site.terrain}</span>
                      {site.weather && <span>· {site.weather.temp}°F</span>}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Control Bar (Top Right: Mason AI + Live Traffic + Gas Stations + Weather Radar) */}
      <div className="absolute top-6 right-6 z-30 flex flex-col gap-2.5 items-end">
        {/* Mason AI Advisor Toggle Button */}
        <button
          onClick={() => setIsMasonDrawerOpen(!isMasonDrawerOpen)}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider chamfered-btn transition-all ${
            isMasonDrawerOpen
              ? 'bg-[#a3e635] text-black shadow-[0_0_15px_#a3e635]'
              : 'bg-[#050505]/95 border-2 border-[#a3e635] text-[#a3e635] hover:bg-[#a3e635]/15 shadow-[0_0_12px_rgba(163,230,53,0.3)]'
          }`}
          title="Ask Mason AI for intelligent campsite recommendations"
        >
          <span className="material-symbols-outlined text-sm">smart_toy</span>
          <span>MASON A.I. ADVISOR</span>
        </button>

        {/* Live Real-Time Traffic & 50-State Transit Alerts Toggle Button */}
        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider chamfered-btn transition-all ${
            showTraffic
              ? 'bg-[#fcee0a] text-black shadow-[0_0_15px_#fcee0a]'
              : 'bg-[#121212] text-gray-400 border border-gray-700 hover:text-white'
          }`}
          title="Toggle live real-time traffic flow & 50-state transit authority highway alerts"
        >
          <span className="material-symbols-outlined text-sm">
            {showTraffic ? 'traffic' : 'traffic_jam'}
          </span>
          <span>{showTraffic ? 'TRAFFIC: ACTIVE' : 'ENABLE TRAFFIC'}</span>
        </button>

        {/* Interactive Highway Fuel & Gas Station Outposts Toggle */}
        <button
          onClick={() => setShowFuelStations(!showFuelStations)}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider chamfered-btn transition-all ${
            showFuelStations
              ? 'bg-[#f59e0b] text-black shadow-[0_0_15px_#f59e0b]'
              : 'bg-[#121212] text-gray-400 border border-gray-700 hover:text-white'
          }`}
          title="Toggle interactive highway gas stations, diesel stops, propane refills & EV plazas"
        >
          <span className="material-symbols-outlined text-sm">local_gas_station</span>
          <span>{showFuelStations ? 'FUEL: ACTIVE' : 'GAS STATIONS'}</span>
        </button>

        {/* Live Weather Radar Overlay Toggle Button */}
        <button
          onClick={() => setShowRadar(!showRadar)}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider chamfered-btn transition-all ${
            showRadar
              ? 'bg-[#00f0ff] text-black shadow-[0_0_15px_#00f0ff]'
              : 'bg-[#121212] text-gray-400 border border-gray-700 hover:text-white'
          }`}
          title="Toggle live precipitation radar (works at any zoom level)"
        >
          <span className="material-symbols-outlined text-sm">
            {showRadar ? 'radar' : 'grain'}
          </span>
          <span>{showRadar ? radarTimeLabel : 'ENABLE RADAR'}</span>
        </button>
      </div>

      {/* Mason AI Advisor Drawer */}
      <MasonAIAdvisorDrawer
        isOpen={isMasonDrawerOpen}
        onClose={() => setIsMasonDrawerOpen(false)}
        visibleCampsites={visibleCampsites}
        visibleFuelStations={visibleFuelStations}
        activeTransitAlerts={activeTransitAlerts}
        onSelectCampsite={handleSelectCampsiteFromList}
        onSelectFuelStation={(st) => {
          setSelectedFuelStation(st);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo({ center: [st.lng, st.lat], zoom: 14, speed: 1.2 });
          }
        }}
        onApplyMapActions={handleApplyMapActions}
      />

      {/* Map Zoom & Navigation Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-2 font-mono text-xs">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-[#050505] hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 flex items-center justify-center shadow-lg font-bold text-lg chamfered-btn"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-[#050505] hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 flex items-center justify-center shadow-lg font-bold text-lg chamfered-btn"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={handleCenterMap}
          className="w-10 h-10 bg-[#050505] hover:bg-[#a3e635]/20 text-[#a3e635] border border-[#a3e635]/50 flex items-center justify-center shadow-lg chamfered-btn"
          title="Center on Active Outpost"
        >
          <span className="material-symbols-outlined text-base">center_focus_strong</span>
        </button>
      </div>

      {/* Active Selected Fuel Station Intelligence Modal */}
      {selectedFuelStation && (
        <div className="absolute top-20 right-6 z-35 w-80 sm:w-96 bg-[#050505]/95 border-2 border-[#f59e0b] shadow-[0_0_25px_rgba(245,158,11,0.35)] backdrop-blur-md p-4 chamfered-card animate-in fade-in duration-200">
          <div className="flex justify-between items-start border-b border-gray-800 pb-2 mb-2.5">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="bg-[#f59e0b] text-black font-black text-[9px] px-1.5 py-0.2 rounded font-mono uppercase tracking-wider">
                  {selectedFuelStation.brand}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {selectedFuelStation.highwayRef}
                </span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-white leading-tight">
                {selectedFuelStation.name}
              </h3>
              <p className="text-[11px] text-gray-400 font-sans mt-0.5">
                {selectedFuelStation.address}
              </p>
            </div>
            <button
              onClick={() => setSelectedFuelStation(null)}
              className="text-gray-400 hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] my-3">
            <div className={`p-2 border rounded ${selectedFuelStation.hasDiesel ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300' : 'border-gray-800 bg-[#121212] text-gray-500'}`}>
              <div className="text-[9px] uppercase">Diesel Fuel</div>
              <div className="font-bold">{selectedFuelStation.hasDiesel ? '✓ AVAILABLE' : '✕ NO DIESEL'}</div>
            </div>
            <div className={`p-2 border rounded ${selectedFuelStation.hasPropane ? 'border-amber-500/50 bg-amber-950/30 text-amber-300' : 'border-gray-800 bg-[#121212] text-gray-500'}`}>
              <div className="text-[9px] uppercase">Propane Refill</div>
              <div className="font-bold">{selectedFuelStation.hasPropane ? '✓ BULK REFILL' : '✕ NO PROPANE'}</div>
            </div>
            <div className={`p-2 border rounded ${selectedFuelStation.hasEVCharging ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300' : 'border-gray-800 bg-[#121212] text-gray-500'}`}>
              <div className="text-[9px] uppercase">EV Charging</div>
              <div className="font-bold">{selectedFuelStation.hasEVCharging ? '✓ FAST CHARGERS' : '✕ NO EV'}</div>
            </div>
            <div className={`p-2 border rounded ${selectedFuelStation.isOpen24Hours ? 'border-blue-500/50 bg-blue-950/30 text-blue-300' : 'border-gray-800 bg-[#121212] text-gray-500'}`}>
              <div className="text-[9px] uppercase">Operating Hours</div>
              <div className="font-bold">{selectedFuelStation.isOpen24Hours ? '✓ 24/7 OPEN' : 'HOURS VARY'}</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFuelStation.lat},${selectedFuelStation.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-mono text-xs font-bold py-2 px-3 chamfered-btn uppercase flex items-center justify-center gap-1.5 transition-colors text-center"
            >
              <span>NAVIGATE IN GOOGLE MAPS</span>
              <span className="material-symbols-outlined text-sm">directions_car</span>
            </a>
          </div>
        </div>
      )}

      {/* Active Selected Transit Alert Modal */}
      {selectedTransitAlert && (
        <div className="absolute top-20 right-6 z-35 w-80 sm:w-96 bg-[#050505]/95 border-2 border-[#ef4444] shadow-[0_0_25px_rgba(239,68,68,0.35)] backdrop-blur-md p-4 chamfered-card animate-in fade-in duration-200">
          <div className="flex justify-between items-start border-b border-gray-800 pb-2 mb-2">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="bg-[#ef4444] text-black font-black text-[9px] px-1.5 py-0.2 rounded font-mono uppercase">
                  {selectedTransitAlert.agency}
                </span>
                <span className="text-[10px] text-[#fcee0a] font-mono font-bold">
                  {selectedTransitAlert.alertType.replace('_', ' ')}
                </span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-white leading-tight">
                {selectedTransitAlert.highway}
              </h3>
            </div>
            <button
              onClick={() => setSelectedTransitAlert(null)}
              className="text-gray-400 hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="bg-[#141d1d] border-l-2 border-[#ef4444] p-2 text-xs font-mono text-[#fcee0a] font-bold mb-2">
            ⏱️ {selectedTransitAlert.delayText}
          </div>

          <p className="text-xs text-gray-300 font-sans leading-relaxed mb-3">
            {selectedTransitAlert.description}
          </p>

          {selectedTransitAlert.recommendedDetour && (
            <div className="bg-[#101414] border border-[#a3e635]/40 p-2.5 text-xs font-mono text-[#a3e635] mb-2 rounded">
              <span className="font-bold text-white">RECOMMENDED DETOUR:</span> {selectedTransitAlert.recommendedDetour}
            </div>
          )}

          <div className="text-[10px] font-mono text-gray-500 text-right">
            Source: {selectedTransitAlert.lastUpdated}
          </div>
        </div>
      )}

      {/* Selected Outpost Bottom Detail Card on Map */}
      {activeSite && (
        <div className="absolute bottom-6 left-6 z-30 max-w-sm sm:max-w-md w-full bg-[#050505]/95 border-2 border-[#fcee0a] p-4 chamfered-card shadow-[0_0_25px_rgba(252,238,10,0.25)] backdrop-blur-md animate-in slide-in-from-bottom duration-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`text-[9px] font-black px-1.5 py-0.2 uppercase font-mono ${
                  activeSite.source === 'hipcamp' ? 'bg-[#ff6b35] text-black' : activeSite.source === 'campspot' ? 'bg-[#10b981] text-black' : 'bg-[#00f0ff] text-black'
                }`}>
                  {activeSite.source === 'hipcamp' ? 'HIPCAMP RETREAT' : activeSite.source === 'campspot' ? 'CAMPSPOT RESORT' : 'PUBLIC LANDS'}
                </span>
                <span className="font-mono text-[10px] text-gray-400">
                  {activeSite.locationName}, {activeSite.state} · {activeSite.elevation}
                </span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white leading-tight">
                {activeSite.name}
              </h3>
            </div>
            <button
              onClick={() => setActiveSite(null)}
              className="text-gray-400 hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <p className="text-xs text-gray-300 font-sans line-clamp-2 mt-2">
            {activeSite.summary || 'Verified wilderness outpost with GPS weather telemetry.'}
          </p>

          <div className="flex items-center justify-between font-mono text-xs border-t border-gray-800 pt-2.5 mt-3">
            <span className="text-[#fcee0a] font-bold">
              {activeSite.weather ? `🌡️ ${activeSite.weather.temp}°F · ${activeSite.weather.windSpeed} mph wind` : '⚡ Live Telemetry'}
            </span>
            <span className="text-[#a3e635] font-bold">
              {activeSite.priceDisplay || (activeSite.pricePerNight ? `$${activeSite.pricePerNight}/night` : 'See original list')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-xs">
            <button
              onClick={() => navigate(`/listings/${activeSite.id}`)}
              className="bg-[#267865] hover:bg-[#349882] text-white font-bold py-2 chamfered-btn uppercase flex items-center justify-center gap-1 transition-colors text-center"
            >
              <span>FULL BRIEFING</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeSite.lat},${activeSite.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#121212] border border-[#00f0ff]/50 hover:border-[#fcee0a] text-[#00f0ff] hover:text-[#fcee0a] font-bold py-2 chamfered-btn uppercase flex items-center justify-center gap-1 transition-colors text-center"
            >
              <span>NAVIGATE</span>
              <span className="material-symbols-outlined text-xs">directions_car</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
