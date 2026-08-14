import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero HUD Section */}
      <section className="relative border border-[#00f0ff]/30 bg-[#121212]/80 backdrop-blur-md p-8 md:p-12 chamfered-card shadow-[0_0_30px_rgba(0,240,255,0.08)]">
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#a3e635] shadow-[0_0_10px_#a3e635] animate-pulse"></span>
            <span className="font-mono text-xs text-[#00ff41] font-bold tracking-widest">
              SYSTEM STATUS: OPERATIONAL
            </span>
          </div>

          <h1 className="font-['Orbitron'] font-black text-white text-4xl sm:text-5xl lg:text-6xl uppercase tracking-widest leading-none">
            ADVANCED TRAIL <br />
            <span className="text-[#a3e635] edgerunner-glitch" data-text="INTELLIGENCE">
              INTELLIGENCE
            </span>
          </h1>

          <p className="text-[#ccc7ab] font-mono text-base md:text-lg border-l-2 border-[#a3e635] pl-4 bg-[#050505]/60 py-3 leading-relaxed">
            Real-time weather telemetry, Map Explorer tracking, and altitude sector analysis engineered for off-grid runners and wilderness outposts.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/map"
              className="bg-[#a3e635] text-black font-mono text-xs font-bold px-8 py-3.5 chamfered-btn hover:bg-white transition-all uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(163,230,53,0.3)]"
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              MAP EXPLORER
            </Link>
            <Link
              to="/listings"
              className="bg-[#050505] border border-[#00f0ff]/50 text-[#00f0ff] hover:text-[#fcee0a] hover:border-[#fcee0a] font-mono text-xs font-bold px-8 py-3.5 chamfered-btn transition-all uppercase tracking-widest flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">cabin</span>
              EXPLORE OUTPOSTS
            </Link>
          </div>
        </div>
      </section>

      {/* Project Origin, Purpose & Future Plans Section */}
      <section className="relative border-2 border-[#00f0ff]/40 bg-[#0c1212]/90 backdrop-blur-xl p-8 md:p-12 chamfered-card shadow-[0_0_35px_rgba(0,240,255,0.12)] space-y-8">
        {/* HUD Corner Accents */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#fcee0a]"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#a3e635]"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-4 gap-2">
          <div>
            <span className="font-mono text-xs text-[#00f0ff] font-bold tracking-widest uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></span>
              PROJECT MISSION & ARCHIVE // CAMPRUNNERS INTELLIGENCE
            </span>
            <h2 className="font-['Orbitron'] font-black text-white text-2xl md:text-4xl uppercase tracking-wider mt-1">
              ABOUT CAMPRUNNERS
            </h2>
          </div>
          <span className="font-mono text-xs text-[#a3e635] bg-[#050505] px-3 py-1 border border-[#a3e635]/40 uppercase">
            ORIGIN LOG // BUILD 2026
          </span>
        </div>

        {/* Story & Purpose Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Narrative Body */}
          <div className="lg:col-span-8 space-y-6 font-mono text-sm leading-relaxed text-[#e5e2e1]">
            {/* The Purpose */}
            <div className="space-y-3">
              <h3 className="font-['Orbitron'] text-base font-bold text-[#fcee0a] uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#fcee0a]">radar</span>
                THE PURPOSE
              </h3>
              <p className="text-gray-300">
                Camprunners was built to deliver uncompromising situational awareness for off-grid runners, backcountry explorers, and wilderness adventurers. By synthesizing live Doppler weather radar mosaics, official National Weather Service active meteorological warnings, and high-precision USGS digital elevation modeling with verified campsite coordinates, Camprunners equips users with essential real-time atmospheric intelligence before setting foot on the trail.
              </p>
            </div>

            {/* The Origin */}
            <div className="space-y-3 pt-2">
              <h3 className="font-['Orbitron'] text-base font-bold text-[#00f0ff] uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#00f0ff]">history_edu</span>
                THE ORIGIN
              </h3>
              <p className="text-gray-300">
                This application originally started as a Senior Capstone Project idea envisioned by my friend Mason. However, along the way our team was offered a much larger and more interesting project to work on, which ultimately led to this concept having to be set aside and abandoned.
              </p>
              <p className="text-gray-300">
                I still strongly believed in the vision and utility of the concept, so I decided to pick up the pieces and construct the entire application myself from the ground up. I reimagined the architecture, engineered the tactical HUD interface, integrated live NOAA NEXRAD Doppler radar streaming, connected real-time National Weather Service hazard advisories, and brought the platform to full realization.
              </p>
            </div>

            {/* Future Plans */}
            <div className="space-y-3 pt-2">
              <h3 className="font-['Orbitron'] text-base font-bold text-[#a3e635] uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#a3e635]">phone_iphone</span>
                FUTURE PLANS
              </h3>
              <p className="text-gray-300">
                Looking ahead, my plans are to take everything built here and transition it into a dedicated mobile application. A native mobile experience will bring live NOAA Doppler radar tracking, localized NWS alerts, offline GPS trail caching, and real-time campsite telemetry directly to your phone for seamless on-the-go navigation in remote wilderness conditions.
              </p>
            </div>

            {/* Sign-off Signature Box */}
            <div className="pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-gray-500 uppercase tracking-widest block font-bold">PROJECT LEAD & ARCHITECT</span>
                <span className="font-['Orbitron'] text-xl font-bold text-[#a3e635] tracking-widest uppercase">
                  Daniel Palomera
                </span>
              </div>
            </div>
          </div>

          {/* Quick Architecture Callout Box */}
          <div className="lg:col-span-4 bg-[#050505] border border-[#00f0ff]/40 p-6 chamfered-card space-y-4">
            <h4 className="font-['Orbitron'] text-xs font-bold text-[#00f0ff] uppercase tracking-wider border-b border-gray-800 pb-2">
              SYSTEM ARCHITECTURE & CAPABILITIES
            </h4>
            <ul className="space-y-3 font-mono text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-[#a3e635]">►</span>
                <span><strong className="text-white">NOAA NEXRAD Doppler:</strong> Real-time precipitation radar with zero zoom level restrictions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#a3e635]">►</span>
                <span><strong className="text-white">NWS Active Alerts:</strong> Real-time official National Weather Service hazard advisories.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#a3e635]">►</span>
                <span><strong className="text-white">USGS DEM Elevation:</strong> Accurate digital elevation models mapped to exact coordinates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#a3e635]">►</span>
                <span><strong className="text-white">Tactical Map HUD:</strong> Dynamic viewport scouting with instant sector intelligence.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#a3e635]">►</span>
                <span><strong className="text-white">Mobile Roadmap:</strong> Dedicated mobile application in active development.</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-gray-800">
              <Link
                to="/map"
                className="w-full bg-[#00f0ff]/10 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black border border-[#00f0ff] font-mono text-xs font-bold py-2.5 text-center uppercase tracking-wider transition-colors chamfered-btn block"
              >
                MAP EXPLORER ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
