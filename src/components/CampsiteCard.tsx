import React from 'react';
import { Link } from 'react-router-dom';
import { DyrtCampsite } from '../data/dyrtCampsites';

interface CampsiteCardProps {
  campsite: DyrtCampsite;
}

export const CampsiteCard: React.FC<CampsiteCardProps> = ({ campsite }) => {
  const dyrtUrl = campsite.contactUrl || `https://thedyrt.com/search?q=${encodeURIComponent(campsite.name)}`;

  return (
    <div className="group border border-[#00f0ff]/30 bg-[#121212]/90 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-[#267865] hover:shadow-[0_0_20px_rgba(38,120,101,0.25)] chamfered-card flex flex-col">
      {/* Card Header Bar */}
      <div className="bg-[#050505] border-b border-[#00f0ff]/20 px-4 py-2 flex justify-between items-center z-10 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-[#00f0ff] font-bold tracking-widest">{campsite.locationName}, {campsite.state}</span>
          <span className={`text-[9px] font-black px-1.5 py-0.2 uppercase ${
            campsite.source === 'hipcamp'
              ? 'bg-[#ff6b35] text-black'
              : campsite.source === 'campspot'
              ? 'bg-[#10b981] text-black'
              : 'bg-[#00f0ff] text-black'
          }`}>
            {campsite.source === 'hipcamp' ? 'HIPCAMP' : campsite.source === 'campspot' ? 'CAMPSPOT' : 'PUBLIC'}
          </span>
        </div>
        <span className="text-[#a3e635] font-bold uppercase text-[10px]">{campsite.terrain}</span>
      </div>

      {/* Image Preview Container */}
      <div className="relative h-48 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-[#00f0ff]/10 mix-blend-overlay z-10 pointer-events-none"></div>
        <img
          src={campsite.image}
          alt={campsite.name}
          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
        />

        {/* Severe Weather Alert Overlay Badge */}
        {campsite.hasWeatherAlert && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[#ff003c]/90 text-white font-mono text-[10px] font-bold px-2 py-1 border border-[#ff003c] shadow-md">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span>WEATHER ADVISORY</span>
          </div>
        )}

        <div className="absolute bottom-2 right-2 z-20 bg-[#050505]/90 border border-[#00f0ff]/40 px-2 py-1 font-mono text-[11px] text-[#a3e635] font-bold">
          ELEV: {campsite.elevation}
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4 font-sans">
        <div>
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white group-hover:text-[#fcee0a] transition-colors leading-tight mb-1">
            {campsite.name}
          </h3>
          <p className="font-mono text-xs text-[#ccc7ab] line-clamp-2 leading-relaxed">
            {campsite.summary}
          </p>
        </div>

        {/* Site Types Badges */}
        <div className="space-y-1">
          <span className="font-mono text-[10px] text-gray-400 block uppercase">Site Types:</span>
          <p className="font-mono text-xs text-[#00f0ff] font-bold">
            {campsite.siteTypes.join(', ')}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="flex justify-between items-end pt-2 border-t border-[#00f0ff]/20">
          <div>
            <span className="font-mono text-[10px] text-gray-400 block uppercase">Rate</span>
            <span className="font-['Space_Grotesk'] text-base font-bold text-[#a3e635]">
              {!campsite.priceDisplay || campsite.priceDisplay.includes('$0') || campsite.priceDisplay.toLowerCase().includes('free') || campsite.pricePerNight === 0
                ? 'See original list'
                : campsite.priceDisplay}
            </span>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/listings/${campsite.id}`}
              className="bg-[#050505] border border-[#00f0ff]/50 hover:border-[#fcee0a] text-[#00f0ff] hover:text-[#fcee0a] font-mono text-xs font-bold px-3 py-2.5 chamfered-btn transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              DETAILS
            </Link>
            <a
              href={dyrtUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#267865] hover:bg-[#349882] text-white font-mono text-xs font-bold px-3 py-2.5 chamfered-btn transition-colors uppercase tracking-wider shadow-md flex items-center gap-1"
            >
              <span>Show original listing</span>
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
