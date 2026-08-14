import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050505] border-t border-[#00f0ff]/20 py-6 px-4 md:px-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs text-[#ccc7ab]/70">
        <div className="flex items-center gap-4">
          <span className="text-[#00f0ff] font-bold tracking-widest">CAMPRUNNERS // CORE_SYSTEM_V.2.4</span>
          <span className="hidden md:inline text-gray-700">|</span>
          <span className="tracking-wider">TRAIL INTELLIGENCE HUD</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[#a3e635] tracking-wider">LAT: 40.3428° N</span>
          <span className="text-[#00f0ff] tracking-wider">LNG: -105.6836° W</span>
          <span className="text-gray-400">© 2026 DANIEL PALOMERA</span>
        </div>
      </div>
    </footer>
  );
};
