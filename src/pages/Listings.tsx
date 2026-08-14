import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCamprunner } from '../context/CamprunnerContext';
import { CampsiteCard } from '../components/CampsiteCard';

export default function Listings() {
  const { campsites } = useCamprunner();
  const [selectedTerrain, setSelectedTerrain] = useState<string>('ALL');
  const [selectedProvider, setSelectedProvider] = useState<'ALL' | 'PUBLIC' | 'HIPCAMP'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'elevation' | 'price' | 'name'>('relevance');

  const terrains = ['ALL', 'Alpine', 'Forest', 'Desert', 'Rocky', 'Canyon'];

  // Helper: calculate matching score for relevance sorting
  const getRelevanceScore = (name: string, query: string, loc: string, state: string, terrain: string) => {
    if (!query) return 0;
    const q = query.toLowerCase().trim();
    const n = name.toLowerCase();
    const l = loc.toLowerCase();
    const s = state.toLowerCase();
    const t = terrain.toLowerCase();

    let score = 0;
    if (n.startsWith(q)) score += 100;
    else if (n.includes(' ' + q)) score += 75;
    else if (n.includes(q)) score += 50;

    if (l.includes(q)) score += 40;
    if (s.includes(q)) score += 20;
    if (t.includes(q)) score += 10;

    return score;
  };

  // Filter and sort the dynamically accumulated campsites
  const filteredCampsites = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    return campsites
      .filter((site) => {
        // Provider filter
        if (selectedProvider === 'PUBLIC' && site.source === 'hipcamp') return false;
        if (selectedProvider === 'HIPCAMP' && site.source !== 'hipcamp') return false;

        // Terrain filter
        if (selectedTerrain !== 'ALL' && site.terrain !== selectedTerrain) return false;

        // Instant letter-by-letter search filter
        if (trimmedQuery) {
          const matchName = site.name.toLowerCase().includes(trimmedQuery);
          const matchLocation = site.locationName.toLowerCase().includes(trimmedQuery);
          const matchState = site.state.toLowerCase().includes(trimmedQuery);
          const matchTerrain = site.terrain.toLowerCase().includes(trimmedQuery);
          const matchTypes = site.siteTypes.some((t) => t.toLowerCase().includes(trimmedQuery));
          if (!matchName && !matchLocation && !matchState && !matchTerrain && !matchTypes) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'relevance' && trimmedQuery) {
          const scoreA = getRelevanceScore(a.name, trimmedQuery, a.locationName, a.state, a.terrain);
          const scoreB = getRelevanceScore(b.name, trimmedQuery, b.locationName, b.state, b.terrain);
          if (scoreB !== scoreA) return scoreB - scoreA;
        }
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'elevation') return b.elevationNum - a.elevationNum;
        if (sortBy === 'price') return a.pricePerNight - b.pricePerNight;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [campsites, selectedTerrain, selectedProvider, searchQuery, sortBy]);

  return (
    <main className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-[#a3e635] pb-4 gap-4">
        <div>
          <span className="font-mono text-xs text-[#00f0ff] font-bold tracking-widest uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></span>
            DYNAMIC SECTOR REGISTRY
          </span>
          <h1 className="font-['Orbitron'] font-black text-white text-3xl md:text-5xl uppercase tracking-widest" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.8)" }}>
            DISCOVERED OUTPOSTS
          </h1>
        </div>
        <div className="font-mono text-xs text-gray-400">
          SHOWING <span className="text-[#a3e635] font-bold">{filteredCampsites.length}</span> OF <span className="text-[#00f0ff] font-bold">{campsites.length}</span> DISCOVERED SITES
        </div>
      </div>

      {/* Filter Control Console (Only shown if at least 1 campsite is discovered) */}
      {campsites.length > 0 && (
        <section className="bg-[#121212] border border-[#00f0ff]/30 p-5 chamfered-card space-y-4 shadow-lg">
          {/* Provider Selection Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3 font-mono text-xs">
            <span className="text-gray-400 uppercase text-[10px] font-bold mr-1">DATA PROVIDER:</span>
            <button
              onClick={() => setSelectedProvider('ALL')}
              className={`px-3 py-1.5 font-bold uppercase tracking-wider chamfered-btn transition-colors ${
                selectedProvider === 'ALL'
                  ? 'bg-[#00f0ff] text-black font-black shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'bg-[#050505] border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              ALL SOURCES ({campsites.length})
            </button>
            <button
              onClick={() => setSelectedProvider('PUBLIC')}
              className={`px-3 py-1.5 font-bold uppercase tracking-wider chamfered-btn transition-colors ${
                selectedProvider === 'PUBLIC'
                  ? 'bg-[#a3e635] text-black font-black shadow-[0_0_10px_rgba(163,230,53,0.4)]'
                  : 'bg-[#050505] border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              PUBLIC CAMPGROUNDS
            </button>
            <button
              onClick={() => setSelectedProvider('HIPCAMP')}
              className={`px-3 py-1.5 font-bold uppercase tracking-wider chamfered-btn transition-colors ${
                selectedProvider === 'HIPCAMP'
                  ? 'bg-[#ff6b35] text-black font-black shadow-[0_0_10px_rgba(255,107,53,0.4)]'
                  : 'bg-[#050505] border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              HIPCAMP EXCLUSIVE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar with instant keystroke filtering */}
            <div className="relative">
              <label className="font-mono text-[10px] text-gray-400 uppercase font-bold block mb-1">
                SEARCH CAMPSITE OR REGION (LIVE RELEVANCE)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Type letter to filter by campsite, park, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#050505] border border-[#00f0ff]/40 focus:border-[#fcee0a] pl-10 pr-9 py-2 text-xs text-white placeholder-gray-500 outline-none font-mono transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white font-mono text-xs"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Sort By Select */}
            <div>
              <label className="font-mono text-[10px] text-gray-400 uppercase font-bold block mb-1">SORT BY</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#050505] border border-[#00f0ff]/40 px-3 py-2 text-xs text-white focus:border-[#fcee0a] outline-none font-mono"
              >
                <option value="relevance">Search Relevance (Best Match)</option>
                <option value="rating">Camper Rating (High to Low)</option>
                <option value="elevation">Elevation (High to Low)</option>
                <option value="price">Nightly Rate (Low to High)</option>
                <option value="name">Campsite Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Terrain Filter Pills */}
          <div className="pt-2 border-t border-gray-800 flex items-center gap-2 flex-wrap font-mono text-xs">
            <span className="text-gray-500 font-bold uppercase text-[10px] mr-2">TERRAIN TYPE:</span>
            {terrains.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTerrain(t)}
                className={`px-3 py-1 font-bold uppercase tracking-wider chamfered-btn transition-colors ${
                  selectedTerrain === t
                    ? 'bg-[#00f0ff] text-black font-black'
                    : 'bg-[#050505] border border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Grid of Campsite Cards or Empty State Prompts */}
      {campsites.length === 0 ? (
        /* Empty State 1: User has not explored map yet */
        <div className="bg-[#0c1212] border-2 border-[#00f0ff]/40 p-12 md:p-16 text-center chamfered-card space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-[#00f0ff]/10 border-2 border-[#00f0ff] flex items-center justify-center mx-auto text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <span className="material-symbols-outlined text-4xl animate-pulse">radar</span>
          </div>

          <div className="space-y-2 font-mono max-w-xl mx-auto">
            <span className="text-[#a3e635] text-xs font-bold uppercase tracking-widest block">
              SECTOR RECONNAISSANCE REQUIRED
            </span>
            <h3 className="font-['Orbitron'] text-2xl md:text-3xl text-white uppercase font-black tracking-wider">
              NO CAMPSITES IN DIRECTORY
            </h3>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              Your directory is currently empty. Explore the tactical map to pan across national parks, mountain passes, and desert sectors — every campsite in your viewport will automatically be logged and added here!
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/map"
              className="bg-[#267865] hover:bg-[#349882] text-white font-mono text-xs font-bold px-8 py-4 chamfered-btn uppercase tracking-widest inline-flex items-center gap-2.5 shadow-[0_0_20px_rgba(38,120,101,0.5)] border-2 border-[#267865] transition-all hover:scale-102"
            >
              <span className="material-symbols-outlined text-lg">explore</span>
              <span>MAP EXPLORER</span>
            </Link>
          </div>
        </div>
      ) : filteredCampsites.length > 0 ? (
        /* Grid of Discovered Campsites */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampsites.map((site) => (
            <CampsiteCard key={site.id} campsite={site} />
          ))}
        </div>
      ) : (
        /* Empty State 2: Active filter matches 0 results */
        <div className="bg-[#121212] border border-[#ff003c]/40 p-12 text-center chamfered-card space-y-4 shadow-xl">
          <span className="material-symbols-outlined text-5xl text-[#ff003c]">search_off</span>
          <h3 className="font-['Orbitron'] text-xl text-white uppercase font-bold">NO OUTPOSTS MATCH FILTER CRITERIA</h3>
          <p className="font-mono text-xs text-gray-400">No discovered campsites match the search query, terrain, or provider filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTerrain('ALL');
              setSelectedProvider('ALL');
            }}
            className="bg-[#00f0ff] text-black font-mono text-xs font-bold px-6 py-2.5 uppercase tracking-wider chamfered-btn hover:bg-white transition-colors"
          >
            RESET SEARCH & FILTERS
          </button>
        </div>
      )}
    </main>
  );
}
