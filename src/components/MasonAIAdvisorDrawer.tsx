import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DyrtCampsite } from '../data/dyrtCampsites';
import { queryMasonAdvisor, MasonAnalysisResult, MasonMapActions } from '../services/masonAIService';

interface MasonAIAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  visibleCampsites: DyrtCampsite[];
  onSelectCampsite: (site: DyrtCampsite) => void;
  onApplyMapActions?: (actions?: MasonMapActions, recommendedIds?: string[]) => void;
}

export const MasonAIAdvisorDrawer: React.FC<MasonAIAdvisorDrawerProps> = ({
  isOpen,
  onClose,
  visibleCampsites = [],
  onSelectCampsite,
  onApplyMapActions
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MasonAnalysisResult | null>(null);

  const presets = [
    { label: '🌌 Stargazing & Clear Skies', query: 'Dark skies, high altitude, clear weather, stargazing' },
    { label: '🐾 Pet-Friendly & Water', query: 'Pet-friendly with potable water and bathrooms' },
    { label: '🏔️ Alpine High Elevation', query: 'Alpine terrain, mountain views, secluded high altitude' },
    { label: '💰 Budget Dispersed', query: 'Free or low cost dispersed public land camping' },
    { label: '🌤️ Calm Winds & Safe Weather', query: 'Safest weather conditions, low wind, zero rain' }
  ];

  const handleRunAnalysis = async (queryText: string) => {
    setIsAnalyzing(true);
    try {
      const result = await queryMasonAdvisor(visibleCampsites, queryText);
      setAnalysisResult(result);

      if (onApplyMapActions && result) {
        const recIds = (result.recommendations || []).map((r) => r.campsite?.id).filter(Boolean);
        onApplyMapActions(result.mapActions, recIds);
      }
    } catch (err) {
      console.error('Error running Mason analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePresetClick = (presetQuery: string) => {
    setUserQuery(presetQuery);
    handleRunAnalysis(presetQuery);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    handleRunAnalysis(userQuery);
  };

  if (!isOpen) return null;

  return (
    <aside
      className="absolute top-0 right-0 h-full w-full sm:w-[460px] bg-[#0c1212]/95 border-l-2 border-[#00f0ff] z-40 flex flex-col shadow-[-10px_0_30px_rgba(0,240,255,0.2)] backdrop-blur-md animate-in slide-in-from-right duration-300"
      style={{ boxShadow: "-8px 0px 25px rgba(0, 240, 255, 0.25)" }}
    >
      {/* Drawer Header */}
      <div className="bg-[#050505] border-b border-[#00f0ff]/40 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.4)]">
            <span className="material-symbols-outlined text-lg animate-pulse">smart_toy</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Orbitron'] font-black text-sm text-white tracking-widest uppercase">
                MASON A.I. ADVISOR
              </h3>
              <span className="bg-[#a3e635] text-black text-[9px] font-black px-1.5 py-0.2 uppercase tracking-widest">
                ONLINE
              </span>
            </div>
            <span className="font-mono text-[10px] text-gray-400 block">
              TACTICAL EXPEDITION & WEATHER INTELLIGENCE
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white bg-[#121212] border border-gray-700 w-8 h-8 flex items-center justify-center font-mono text-sm hover:border-[#fcee0a] transition-colors"
          title="Close Advisor"
        >
          ✕
        </button>
      </div>

      {/* Drawer Body Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {/* Visible Sector Telemetry Bar */}
        <div className="bg-[#050505] border border-gray-800 p-3 chamfered-card font-mono text-xs flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-ping"></span>
            <span className="text-gray-300">VIEWPORT RADAR:</span>
          </div>
          <span className="text-[#00f0ff] font-bold">
            {(visibleCampsites || []).length} OUTPOSTS DETECTED
          </span>
        </div>

        {/* Mission Objective Input Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="font-mono text-[10px] text-gray-400 uppercase font-bold block">
            MISSION OBJECTIVE / CAMPING GOALS:
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Quiet mountain site with clean toilets and no wind..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="w-full bg-[#050505] border border-[#00f0ff]/50 focus:border-[#fcee0a] px-3 py-2.5 text-xs text-white placeholder-gray-500 font-mono outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isAnalyzing || !userQuery.trim()}
              className="absolute right-1.5 top-1.5 bg-[#267865] hover:bg-[#349882] disabled:opacity-40 text-white font-mono text-[10px] font-bold px-3 py-1.5 chamfered-btn uppercase tracking-wider transition-colors"
            >
              ANALYZE
            </button>
          </div>
        </form>

        {/* Tactical Intel Preset Chips */}
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] text-gray-500 uppercase font-bold block">
            QUICK TACTICAL PRESETS:
          </span>
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetClick(p.query)}
                className="bg-[#050505] border border-gray-800 hover:border-[#00f0ff] text-gray-300 hover:text-white px-2.5 py-1 text-left chamfered-btn transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Scanning State */}
        {isAnalyzing && (
          <div className="bg-[#050505] border-2 border-[#00f0ff]/40 p-6 text-center chamfered-card space-y-3">
            <div className="w-10 h-10 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="font-mono text-xs text-[#00f0ff] font-bold tracking-widest uppercase animate-pulse">
              MASON IS ANALYZING VIEWPORT TELEMETRY...
            </div>
            <p className="font-mono text-[10px] text-gray-400">
              Evaluating GPS weather vectors, DEM elevation, and verified amenities across your active sector.
            </p>
          </div>
        )}

        {/* Mason's Analysis Results */}
        {!isAnalyzing && analysisResult && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Mason's Dispatch Header Note */}
            <div className="bg-[#121818] border-l-4 border-[#a3e635] p-3.5 chamfered-card font-mono text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[#a3e635] font-bold uppercase tracking-wider block">
                  MASON'S FIELD BRIEFING:
                </span>
                <span className="bg-[#a3e635] text-black text-[8px] font-black px-1.5 py-0.2 uppercase">
                  TACTICAL ADVISOR
                </span>
              </div>
              <p className="text-gray-200 leading-relaxed text-[11px] font-sans">
                {analysisResult.summaryIntel || "Here are my tactical findings based on your sector criteria."}
              </p>
            </div>

            {/* Top Recommended Outpost Cards */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-widest block">
                TOP TACTICAL RECOMMENDATIONS:
              </span>

              {Array.isArray(analysisResult.recommendations) && analysisResult.recommendations
                .filter((rec) => rec && rec.campsite && rec.campsite.id)
                .map((rec, idx) => {
                  const site = rec.campsite;
                  const isTopPick = idx === 0;
                  const siteName = site.name || 'Outpost';
                  const locName = site.locationName || 'Sector';
                  const stateName = site.state || 'CA';
                  const elevStr = site.elevation || '1,000 ft';
                  const tempVal = site.weather?.temp ?? 70;
                  const windVal = site.weather?.windSpeed ?? 5;
                  const priceStr = site.priceDisplay || 'See original list';

                  return (
                    <div
                      key={site.id || idx}
                      className={`bg-[#050505] border-2 ${
                        isTopPick ? 'border-[#fcee0a]' : 'border-[#00f0ff]/40'
                      } p-4 chamfered-card space-y-3 transition-all hover:border-[#a3e635]`}
                    >
                      {/* Card Top Banner */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[9px] font-black px-1.5 py-0.2 uppercase ${
                              isTopPick ? 'bg-[#fcee0a] text-black' : 'bg-[#00f0ff] text-black'
                            }`}>
                              RANK #{idx + 1}
                            </span>
                            <span className="font-mono text-[10px] text-[#a3e635] font-bold uppercase">
                              {site.source === 'hipcamp' ? 'HIPCAMP' : 'PUBLIC'}
                            </span>
                          </div>
                          <h4 className="font-['Space_Grotesk'] text-base font-bold text-white leading-tight">
                            {siteName}
                          </h4>
                          <span className="font-mono text-[10px] text-gray-400">
                            {locName}, {stateName} · {elevStr}
                          </span>
                        </div>

                        {/* Tactical Score Badge */}
                        <div className="text-right shrink-0">
                          <span className="font-['Orbitron'] text-lg font-black text-[#a3e635]">
                            {rec.tacticalScore || 95}%
                          </span>
                          <span className="font-mono text-[8px] text-gray-400 block uppercase">
                            MATCH SCORE
                          </span>
                        </div>
                      </div>

                      {/* Mason's Tactical Verdict */}
                      <div className="bg-[#101414] border-l-2 border-[#00f0ff] p-2.5 font-mono text-[11px] text-gray-200">
                        <span className="text-[#00f0ff] font-bold uppercase text-[9px] block mb-0.5">
                          WHY MASON RECOMMENDS THIS:
                        </span>
                        <p className="leading-snug text-gray-300 font-sans text-xs">
                          {rec.masonVerdict || "Optimal sector weather conditions and verified campsite access."}
                        </p>
                      </div>

                      {/* Weather & Amenities Preview */}
                      <div className="flex items-center justify-between font-mono text-[10px] text-gray-400 border-t border-gray-800 pt-2">
                        <span className="text-[#fcee0a]">
                          🌡️ {tempVal}°F · {windVal} mph wind
                        </span>
                        <span className="text-[#a3e635] font-bold">
                          {priceStr}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (site) onSelectCampsite(site);
                          }}
                          className="bg-[#267865] hover:bg-[#349882] text-white font-mono text-xs font-bold py-2 chamfered-btn uppercase tracking-wider flex items-center justify-center gap-1 shadow-md transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">my_location</span>
                          <span>LOCK TARGET</span>
                        </button>

                        <Link
                          to={`/listings/${site.id}`}
                          className="bg-[#121212] border border-[#00f0ff]/40 hover:border-[#fcee0a] text-[#00f0ff] hover:text-[#fcee0a] font-mono text-xs font-bold py-2 chamfered-btn uppercase tracking-wider flex items-center justify-center gap-1 transition-colors text-center"
                        >
                          <span>DETAILS</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Initial Prompt State when first opening */}
        {!isAnalyzing && !analysisResult && (
          <div className="bg-[#050505] border border-gray-800 p-6 text-center chamfered-card space-y-3">
            <span className="material-symbols-outlined text-4xl text-[#a3e635]">explore</span>
            <h4 className="font-['Orbitron'] text-sm text-white uppercase font-bold">
              READY FOR TACTICAL EXPEDITION PLANNING
            </h4>
            <p className="font-mono text-xs text-gray-300 leading-relaxed font-sans text-[13px]">
              Pan and explore the map across mountain passes, valleys, and national parks. When you're ready, select a tactical preset above or type your custom expedition criteria—Mason will scan all {(visibleCampsites || []).length} visible outposts in your current view against real-time weather telemetry and terrain elevations to formulate your ideal deployment.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
