import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CamprunnerProvider } from './context/CamprunnerContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { UplinkModal } from './components/UplinkModal';

import Home from './pages/Home';
import TacticalMap from './pages/TacticalMap';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import WeatherForecast from './pages/WeatherForecast';

const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] relative overflow-x-hidden flex flex-col justify-between">
      {/* Ambient Cyber Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 240, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      ></div>

      {/* Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 scanline opacity-20"></div>

      <div className="flex-grow">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<TacticalMap />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/weather" element={<WeatherForecast />} />
        </Routes>
      </div>

      <Footer />
      <UplinkModal />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <CamprunnerProvider>
        <AppShell />
      </CamprunnerProvider>
    </BrowserRouter>
  );
}
