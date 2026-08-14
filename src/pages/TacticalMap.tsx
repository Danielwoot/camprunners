import React from 'react';
import { GoogleMapTracker } from '../components/GoogleMapTracker';

export default function TacticalMap() {
  return (
    <main className="relative z-10 pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      {/* Page Title Header */}
      <div className="border-b-2 border-[#a3e635] pb-4">
        <h1 className="font-['Orbitron'] font-black text-white text-3xl md:text-5xl uppercase tracking-widest" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.8)" }}>
          MAPS
        </h1>
      </div>

      {/* Main Map Component */}
      <GoogleMapTracker heightClass="h-[calc(100vh-220px)] min-h-[600px]" />
    </main>
  );
}
