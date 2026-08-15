import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCamprunner } from '../context/CamprunnerContext';
import { DyrtCampsite } from '../data/dyrtCampsites';
import { fetchUnifiedCampsitesInBounds } from '../services/dyrtService';
import { getNOAANexradRadarTileUrl } from '../services/weatherRadarService';
import {
  getRealTimeTrafficTileUrl,
  getTrafficSubdomains,
  fetchTransitAlertsInBounds,
  calculateCampgroundTransitTelemetry,
  StateTransitAlert
} from '../services/trafficService';
import { MasonAIAdvisorDrawer } from './MasonAIAdvisorDrawer';

interface GoogleMapTrackerProps {
  heightClass?: string;
}

export const GoogleMapTracker: React.FC<GoogleMapTrackerProps> = ({ heightClass = 'h-[calc(100vh-64px)]' }) => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const radarLayerRef = useRef<L.TileLayer | null>(null);
  const trafficLayerRef = useRef<L.TileLayer | null>(null);
  const transitMarkersGroupRef = useRef<L.LayerGroup | null>(null);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  const { registerCampsites, setSelectedCampsite } = useCamprunner();

  const [activeSite, setActiveSite] = useState<DyrtCampsite | null>(null);
  const [allVisibleSites, setAllVisibleSites] = useState<DyrtCampsite[]>([]);
  const [showRadar, setShowRadar] = useState<boolean>(true);
  const [radarTimeLabel, setRadarTimeLabel] = useState<string>('LIVE RADAR');
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
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
    actions?: { flyTo?: { lat: number; lng: number; zoom?: number }; enableRadar?: boolean; focusedCampsiteId?: string },
    recommendedIds: string[] = []
  ) => {
    if (recommendedIds.length > 0) {
      setAiTargetIds(recommendedIds);
    }
    if (!actions) return;

    if (actions.enableRadar) {
      setShowRadar(true);
    }

    if (actions.flyTo && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([actions.flyTo.lat, actions.flyTo.lng], actions.flyTo.zoom || 11, {
        duration: 1.8
      });
    }

    if (actions.focusedCampsiteId) {
      const found = allVisibleSites.find(s => s.id === actions.focusedCampsiteId);
      if (found) {
        setActiveSite(found);
        if (mapInstanceRef.current && !actions.flyTo) {
          mapInstanceRef.current.setView([found.lat, found.lng], 13, { animate: true });
        }
      }
    }
  };

  // Debounce ref for map pan/zoom fetching
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Dark HUD Basemap layer
    const darkTileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 19
      }
    );

    // Load persisted map position or default to Yosemite National Park, California
    let initialCenter: [number, number] = [37.7456, -119.5936]; // Yosemite National Park, CA
    let initialZoom = 9;

    try {
      const savedView = sessionStorage.getItem('camprunners_map_view');
      if (savedView) {
        const parsed = JSON.parse(savedView);
        if (Array.isArray(parsed.center) && parsed.center.length === 2 && typeof parsed.zoom === 'number') {
          initialCenter = [parsed.center[0], parsed.center[1]];
          initialZoom = parsed.zoom;
        }
      }
    } catch {}

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      layers: [darkTileLayer]
    });

    mapInstanceRef.current = map;
    markersGroupRef.current = L.layerGroup().addTo(map);
    transitMarkersGroupRef.current = L.layerGroup().addTo(map);

    // Initial fetch when map loads
    fetchCampsitesForCurrentBounds(map);

    // Handle Map Movement (Pan & Zoom) with debounce and persist viewport
    map.on('moveend', () => {
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

    // Close details card on clicking empty map
    map.on('click', () => {
      setActiveSite(null);
    });

    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Fetch unified campgrounds, Hipcamp retreats, Campspot resorts, and 50-State transit authority alerts in bounds
  const fetchCampsitesForCurrentBounds = async (map: L.Map) => {
    try {
      setIsLoading(true);
      const bounds = map.getBounds();
      const mapBounds = {
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLng: bounds.getWest(),
        maxLng: bounds.getEast()
      };

      const [sites, transitAlerts] = await Promise.all([
        fetchUnifiedCampsitesInBounds(mapBounds),
        Promise.resolve(fetchTransitAlertsInBounds(mapBounds))
      ]);

      // Strictly keep only sites whose lat/lng is actually inside the active map bounds
      const inViewSites = sites.filter((s) => bounds.contains([s.lat, s.lng]));
      setAllVisibleSites(inViewSites);
      setActiveTransitAlerts(transitAlerts);
      registerCampsites(inViewSites); // Dynamically accumulates discovered sites into global directory!

    } catch (err) {
      console.error('[Map Tracker] Failed to fetch campsites & transit alerts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter & Sort campsites by provider, viewport bounds, and search query
  const visibleCampsites = useMemo(() => {
    let list = [...allVisibleSites];

    // Filter strictly to current viewport map bounds
    if (mapInstanceRef.current) {
      const b = mapInstanceRef.current.getBounds();
      list = list.filter((s) => b.contains([s.lat, s.lng]));
    }

    // Filter by provider
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

  // Handle Live NOAA Radar Overlay (works at all zoom levels 0-19+)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (showRadar) {
      if (!radarLayerRef.current) {
        const radarTileUrl = getNOAANexradRadarTileUrl();
        const radar = L.tileLayer(radarTileUrl, {
          opacity: 0.75,
          zIndex: 10,
          maxZoom: 19,
          attribution: 'NOAA / Iowa Environmental Mesonet NEXRAD'
        });

        radar.addTo(mapInstanceRef.current);
        radarLayerRef.current = radar;
        setRadarTimeLabel('NOAA NEXRAD (LIVE)');
      }
    } else {
      if (radarLayerRef.current) {
        mapInstanceRef.current.removeLayer(radarLayerRef.current);
        radarLayerRef.current = null;
      }
    }
  }, [showRadar]);

  // Handle Real-Time High-Speed CDN Traffic Flow Layer (Approach 1 - 0ms latency)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (showTraffic) {
      if (!trafficLayerRef.current) {
        const trafficTileUrl = getRealTimeTrafficTileUrl();
        const trafficLayer = L.tileLayer(trafficTileUrl, {
          subdomains: getTrafficSubdomains(),
          opacity: 0.85,
          zIndex: 8,
          maxZoom: 19,
          attribution: 'Real-Time Traffic Flow'
        });

        trafficLayer.addTo(mapInstanceRef.current);
        trafficLayerRef.current = trafficLayer;
      }
    } else {
      if (trafficLayerRef.current) {
        mapInstanceRef.current.removeLayer(trafficLayerRef.current);
        trafficLayerRef.current = null;
      }
    }
  }, [showTraffic]);

  // Render 50-State Transit Authority & Mountain Pass Incident Pins (Option B)
  useEffect(() => {
    if (!mapInstanceRef.current || !transitMarkersGroupRef.current) return;

    transitMarkersGroupRef.current.clearLayers();

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

      const customTransitIcon = L.divIcon({
        className: 'custom-transit-pin',
        html: `
          <div class="group relative flex items-center justify-center cursor-pointer" style="transform: translate(-50%, -50%);">
            <!-- Pulsing Incident Beacon -->
            <div style="
              position: absolute;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: ${alertColor}33;
              border: 1px dashed ${alertColor};
              animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>

            <!-- Central Tactical Hexagon/Diamond Badge -->
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

            <!-- Route Highway Tag -->
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
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const transitMarker = L.marker([alert.lat, alert.lng], { icon: customTransitIcon, zIndexOffset: 500 });

      const transitPopupContent = `
        <div style="background:#0a0e0e; color:#e5e2e1; font-family:sans-serif; padding:14px; border:2px solid ${alertColor}; min-width:260px; max-width:320px; border-radius:6px; box-shadow: 0 6px 20px rgba(0,0,0,0.95);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; border-bottom:1px solid #263333; pb:4px;">
            <span style="color:${alertColor}; font-size:10px; font-weight:bold; font-family:monospace; text-transform:uppercase;">
              ${alert.agency}
            </span>
            <span style="background:${alertColor}; color:#000; font-size:9px; font-weight:900; padding:1px 5px; border-radius:2px; font-family:monospace;">
              ${alert.alertType.replace('_', ' ')}
            </span>
          </div>
          <div style="color:#ffffff; font-size:14px; font-weight:bold; font-family:'Space Grotesk', sans-serif; margin:4px 0 6px 0; line-height:1.2;">
            ${alert.highway}
          </div>
          <div style="background:#141d1d; border-left:3px solid ${alertColor}; padding:6px 8px; margin-bottom:8px; font-family:monospace; font-size:11px; color:#fcee0a; font-weight:bold;">
            ⏱️ ${alert.delayText}
          </div>
          <p style="color:#cbd5e1; font-size:11px; line-height:1.4; margin-bottom:8px;">
            ${alert.description}
          </p>
          ${alert.recommendedDetour ? `
            <div style="font-size:10px; font-family:monospace; color:#a3e635; background:#050505; border:1px solid #334155; padding:6px 8px; border-radius:3px;">
              <span style="color:#fff; font-weight:bold;">RECOMMENDED DETOUR:</span> ${alert.recommendedDetour}
            </div>
          ` : ''}
          <div style="font-family:monospace; font-size:9px; color:#64748b; margin-top:8px; text-align:right;">
            Source: ${alert.lastUpdated}
          </div>
        </div>
      `;

      transitMarker.bindPopup(transitPopupContent);

      transitMarker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedTransitAlert(alert);
      });

      transitMarkersGroupRef.current?.addLayer(transitMarker);
    });
  }, [showTraffic, activeTransitAlerts]);

  // Render markers at exact real-world GPS coordinates with tactical radar pulse pins
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

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
        ? 'rgba(163, 230, 53, 0.3)'
        : isHipcamp
        ? 'rgba(255, 107, 53, 0.25)'
        : isCampspot
        ? 'rgba(16, 185, 129, 0.25)'
        : 'rgba(0, 240, 255, 0.15)';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="group relative flex items-center justify-center cursor-pointer" style="transform: translate(-50%, -50%);">
            ${isAiTarget ? `
              <!-- Glowing AI Target Reticle Ring -->
              <div style="
                position: absolute;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                border: 2px dashed #a3e635;
                animation: spin 8s linear infinite;
                box-shadow: 0 0 15px rgba(163, 230, 53, 0.5);
              "></div>
            ` : ''}

            <!-- Radar Beacon Pulse -->
            <div style="
              position: absolute;
              width: ${isSelected || isAiTarget ? '32px' : '20px'};
              height: ${isSelected || isAiTarget ? '32px' : '20px'};
              border-radius: ${isHipcamp ? '4px' : isCampspot ? '6px' : '50%'};
              background: ${pulseBg};
              border: 1px solid ${mainColor};
              animation: ${isSelected || isAiTarget ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' : 'pulse 2.5s infinite'};
              transform: ${isHipcamp ? 'rotate(45deg)' : isCampspot ? 'rotate(30deg)' : 'none'};
            "></div>

            <!-- Central Tactical Pin Dot -->
            <div style="
              width: ${isSelected || isAiTarget ? '14px' : '10px'};
              height: ${isSelected || isAiTarget ? '14px' : '10px'};
              border-radius: ${isHipcamp ? '2px' : isCampspot ? '3px' : '50%'};
              background: ${mainColor};
              box-shadow: 0 0 ${isSelected ? '12px #fcee0a' : isAiTarget ? '14px #a3e635' : isHipcamp ? '8px #ff6b35' : isCampspot ? '8px #10b981' : '8px #00f0ff'};
              border: 2px solid #050505;
              transform: ${isHipcamp ? 'rotate(45deg)' : isCampspot ? 'rotate(30deg)' : 'none'};
              transition: all 0.2s ease;
            "></div>

            <!-- Hover / Selected / AI Mini Tag -->
            <div style="
              position: absolute;
              bottom: 18px;
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
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([site.lat, site.lng], { icon: customIcon });

      const popupPrice = (!site.priceDisplay || site.priceDisplay.includes('$0') || site.priceDisplay.toLowerCase().includes('free') || site.pricePerNight === 0)
        ? 'See original list'
        : site.priceDisplay;

      const popupColor = isCampspot ? '#10b981' : isHipcamp ? '#ff6b35' : '#00f0ff';
      const popupBadgeText = isCampspot ? 'CAMPSPOT' : isHipcamp ? 'HIPCAMP' : 'PUBLIC';

      const popupContent = `
        <div style="background:#0c1212; color:#e5e2e1; font-family:sans-serif; padding:12px; border:1px solid ${popupColor}; min-width:220px; border-radius:6px; box-shadow: 0 4px 16px rgba(0,0,0,0.8);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="color:${popupColor}; font-size:10px; font-weight:bold; text-transform:uppercase;">${site.locationName}, ${site.state}</span>
            <span style="background:${popupColor}; color:#000; font-size:9px; font-weight:900; padding:1px 4px; border-radius:2px;">${popupBadgeText}</span>
          </div>
          <div style="color:#ffffff; font-size:14px; font-weight:bold; margin:4px 0 6px 0;">${site.name}</div>
          <div style="color:#a3e635; font-size:13px; font-weight:bold; margin-bottom:4px;">${popupPrice}</div>
          <div style="color:#ccc7ab; font-size:10px; margin-top:4px; margin-bottom:8px;">${site.siteTypes.join(', ')}</div>
          <a href="/listings/${site.id}" style="display:inline-block; width:100%; text-align:center; background:#050505; color:${popupColor}; border:1px solid ${popupColor}; font-family:monospace; font-size:11px; font-weight:bold; padding:7px 0; text-transform:uppercase; text-decoration:none; border-radius:4px;">VIEW DETAILS ↗</a>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedCampsite(site);
        setActiveSite(site);
      });

      markersGroupRef.current?.addLayer(marker);
    });
  }, [visibleCampsites, activeSite]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleCenterMap = () => {
    if (mapInstanceRef.current && activeSite) {
      mapInstanceRef.current.setView([activeSite.lat, activeSite.lng], 12);
    }
  };

  const handleSelectCampsiteFromList = (site: DyrtCampsite) => {
    setSelectedCampsite(site);
    setActiveSite(site);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([site.lat, site.lng], 12, { animate: true });
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

          {/* Search Input */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search viewport outposts, parks, cities..."
              className="w-full bg-[#121212] border border-[#00f0ff]/40 focus:border-[#fcee0a] text-white pl-9 pr-8 py-2 font-mono text-xs outline-none transition-colors placeholder:text-gray-500"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Sort Options */}
          <div className="flex items-center justify-between font-mono text-[10px] text-gray-400">
            <span>SORT:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setSortBy('recommended')}
                className={`px-2 py-0.5 border ${
                  sortBy === 'recommended' ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10' : 'border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                RECOMMENDED
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`px-2 py-0.5 border ${
                  sortBy === 'rating' ? 'border-[#fcee0a] text-[#fcee0a] bg-[#fcee0a]/10' : 'border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                ★ RATING
              </button>
              <button
                onClick={() => setSortBy('reviews')}
                className={`px-2 py-0.5 border ${
                  sortBy === 'reviews' ? 'border-[#a3e635] text-[#a3e635] bg-[#a3e635]/10' : 'border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                REVIEWS
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Listings Stream */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {isLoading && (
            <div className="p-6 text-center font-mono text-xs text-[#00f0ff] space-y-2">
              <div className="w-6 h-6 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p>SCANNING SECTOR INTEL...</p>
            </div>
          )}

          {visibleCampsites.length === 0 && !isLoading && (
            <div className="p-8 text-center font-mono space-y-3">
              <span className="material-symbols-outlined text-3xl text-gray-500">travel_explore</span>
              <p className="text-xs text-gray-400">No outposts in current viewport.</p>
              <p className="text-[10px] text-[#a3e635]">Pan or zoom the map to scout new sectors.</p>
            </div>
          )}

          {visibleCampsites.map((site) => {
            const isSelected = activeSite?.id === site.id;
            const isHipcamp = site.source === 'hipcamp';
            const isCampspot = site.source === 'campspot';

            return (
              <div
                key={site.id}
                onClick={() => handleSelectCampsiteFromList(site)}
                className={`group border cursor-pointer transition-all duration-200 bg-[#0e1414] ${
                  isSelected
                    ? 'border-[#fcee0a] shadow-[0_0_15px_rgba(252,238,10,0.3)]'
                    : isHipcamp
                    ? 'border-[#ff6b35]/40 hover:border-[#ff6b35]'
                    : isCampspot
                    ? 'border-[#10b981]/40 hover:border-[#10b981]'
                    : 'border-[#00f0ff]/30 hover:border-[#00f0ff]'
                }`}
              >
                {/* Card Thumbnail */}
                <div className="relative h-28 w-full overflow-hidden bg-gray-900">
                  <img
                    src={site.image}
                    alt={site.name}
                    className="w-full h-full object-cover grayscale opacity-85 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  />

                  {/* Provider Source Tag */}
                  <div className="absolute top-2 right-2 z-20">
                    <span className={`font-mono text-[9px] font-black px-2 py-0.5 uppercase tracking-widest ${
                      isHipcamp ? 'bg-[#ff6b35] text-black' : isCampspot ? 'bg-[#10b981] text-black' : 'bg-[#00f0ff] text-black'
                    }`}>
                      {isHipcamp ? 'HIPCAMP' : isCampspot ? 'CAMPSPOT' : 'PUBLIC'}
                    </span>
                  </div>

                  {site.hasWeatherAlert && (
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 z-20">
                      <span className="bg-[#fcee0a] text-black font-mono text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <span className="material-symbols-outlined text-[11px]">thunderstorm</span>
                        NWS HAZARD
                      </span>
                    </div>
                  )}

                  <span className="absolute bottom-2 right-2 font-mono text-[10px] text-[#a3e635] font-bold bg-[#050505]/90 px-1.5 py-0.5 border border-[#a3e635]/40">
                    {!site.priceDisplay || site.priceDisplay.includes('$0') || site.priceDisplay.toLowerCase().includes('free') || site.pricePerNight === 0
                      ? 'See original list'
                      : site.priceDisplay}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-3 space-y-2">
                  <span className="font-mono text-[10px] text-gray-400 uppercase block">
                    {site.locationName}, {site.state}
                  </span>
                  
                  <h5 className="font-['Space_Grotesk'] text-sm font-bold text-white group-hover:text-[#fcee0a] transition-colors leading-tight">
                    {site.name}
                  </h5>

                  {/* Card Actions */}
                  <div className="pt-2 border-t border-gray-800/80 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCampsite(site);
                        navigate(`/listings/${site.id}`);
                      }}
                      className="flex-1 bg-[#050505] hover:bg-[#00f0ff]/10 border border-[#00f0ff]/60 text-[#00f0ff] hover:text-[#fcee0a] font-mono text-[10px] font-bold py-1.5 uppercase tracking-wider transition-colors text-center"
                    >
                      VIEW DETAILS
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCampsiteFromList(site);
                      }}
                      className="px-2.5 py-1.5 bg-[#121212] hover:bg-[#267865] text-gray-300 hover:text-white font-mono text-xs border border-gray-700 transition-colors flex items-center justify-center"
                      title="Focus on Map"
                    >
                      <span className="material-symbols-outlined text-xs">my_location</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Control Bar (Top Right: Mason AI + Live Traffic + Live Weather Radar) */}
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

        {/* Live Real-Time Traffic & 50-State Transit Alerts Toggle Button (Option A & B Hybrid) */}
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
        onSelectCampsite={handleSelectCampsiteFromList}
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
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>

      {/* Campsite Details Overlay Card (Bottom Left - Disappears on Empty Map Click) */}
      {activeSite && !isSidebarOpen && (
        <div className={`absolute bottom-6 left-6 z-30 bg-[#0c1212]/95 border-2 ${
          activeSite.source === 'campspot'
            ? 'border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            : activeSite.source === 'hipcamp'
            ? 'border-[#ff6b35] shadow-[0_0_20px_rgba(255,107,53,0.3)]'
            : 'border-[#267865] shadow-[0_0_20px_rgba(38,120,101,0.3)]'
        } p-5 max-w-md chamfered-card backdrop-blur-md font-sans text-xs space-y-3`}>
          <div className="flex justify-between items-start border-b border-gray-800 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-[10px] font-bold uppercase block ${
                  activeSite.source === 'campspot'
                    ? 'text-[#10b981]'
                    : activeSite.source === 'hipcamp'
                    ? 'text-[#ff6b35]'
                    : 'text-[#00f0ff]'
                }`}>
                  {activeSite.locationName}, {activeSite.state}
                </span>
                <span className={`font-mono text-[9px] font-black px-1.5 py-0.2 uppercase ${
                  activeSite.source === 'campspot'
                    ? 'bg-[#10b981] text-black'
                    : activeSite.source === 'hipcamp'
                    ? 'bg-[#ff6b35] text-black'
                    : 'bg-[#00f0ff] text-black'
                }`}>
                  {activeSite.source === 'campspot' ? 'CAMPSPOT' : activeSite.source === 'hipcamp' ? 'HIPCAMP' : 'PUBLIC'}
                </span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white leading-tight mt-0.5">{activeSite.name}</h3>
            </div>
            <span className="font-mono text-sm font-bold text-[#a3e635] bg-[#050505] px-2.5 py-1 border border-[#a3e635]/40">
              {!activeSite.priceDisplay || activeSite.priceDisplay.includes('$0') || activeSite.priceDisplay.toLowerCase().includes('free') || activeSite.pricePerNight === 0
                ? 'See original list'
                : activeSite.priceDisplay}
            </span>
          </div>

          <p className="font-mono text-xs text-[#ccc7ab] line-clamp-2 leading-relaxed">
            {activeSite.summary}
          </p>

          {/* Approach Highway & Transit Corridor Telemetry */}
          {(() => {
            const transit = calculateCampgroundTransitTelemetry(activeSite.lat, activeSite.lng, activeSite.state);
            const isAlert = transit.status !== 'CLEAR';
            return (
              <div className={`p-2 font-mono text-[10px] border flex items-center justify-between gap-2 ${
                isAlert
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-300'
                  : 'bg-[#050505] border-emerald-900/60 text-emerald-400'
              }`}>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-xs">
                    {isAlert ? 'warning' : 'check_circle'}
                  </span>
                  <span className="truncate">{transit.corridorNote}</span>
                </div>
                <span className="font-bold whitespace-nowrap bg-black/60 px-1.5 py-0.5 border border-current/30">
                  {transit.estDriveTime}
                </span>
              </div>
            );
          })()}

          <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10px] text-[#00f0ff]">
            <span className="font-bold">SITE TYPES:</span>
            {activeSite.siteTypes.map((st) => (
              <span key={st} className="bg-[#121212] border border-gray-700 text-[#e5e2e1] px-2 py-0.5 rounded-none">{st}</span>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedCampsite(activeSite);
                navigate(`/listings/${activeSite.id}`);
              }}
              className="w-full bg-[#050505] hover:bg-[#00f0ff]/10 border-2 border-[#00f0ff] text-[#00f0ff] hover:text-[#fcee0a] font-mono text-xs font-bold py-3 uppercase tracking-wider chamfered-btn transition-all text-center shadow-[0_0_12px_rgba(0,240,255,0.2)] flex items-center justify-center gap-2"
            >
              <span>VIEW DETAILS</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};
