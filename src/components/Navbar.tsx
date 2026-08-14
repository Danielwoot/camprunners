import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    return isActive
      ? "text-[var(--color-cyber-yellow)] border-b-2 border-[var(--color-cyber-yellow)] pb-1 font-bold font-mono text-xs uppercase tracking-widest px-3"
      : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-neon-blue)] transition-colors duration-300 font-mono text-xs uppercase tracking-widest px-3 py-1";
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-[#00f0ff]/30 shadow-[0_4px_20px_rgba(0,240,255,0.12)]">
      <div className="flex items-center justify-between h-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-3 h-3 bg-[#a3e635] shadow-[0_0_10px_#a3e635] animate-pulse"></div>
          <div>
            <h1 className="text-xl md:text-2xl font-black font-['Orbitron'] text-[#a3e635] tracking-widest uppercase group-hover:text-white transition-colors" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.8)" }}>
              CAMPRUNNERS
            </h1>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#00f0ff] to-[#a3e635]"></div>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 md:gap-6">
          <Link className={getLinkClass("/")} to="/">HOME</Link>
          <Link className={getLinkClass("/map")} to="/map">MAP</Link>
          <Link className={getLinkClass("/listings")} to="/listings">LISTINGS</Link>
          <Link className={getLinkClass("/weather")} to="/weather">WEATHER</Link>
        </div>

        {/* Right Status Monitor */}
        <div className="hidden lg:flex items-center gap-2 border border-[#00f0ff]/30 bg-[#121212] px-3 py-1 chamfered-btn">
          <span className="w-2 h-2 rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41]"></span>
          <span className="font-mono text-[11px] text-[#00ff41] font-bold tracking-wider">SYS: ONLINE</span>
        </div>
      </div>
    </nav>
  );
};
