import React, { useState } from 'react';
import { useCamprunner } from '../context/CamprunnerContext';

export const UplinkModal: React.FC = () => {
  const { isUplinkModalOpen, setIsUplinkModalOpen, modalCampsite, addReservation } = useCamprunner();

  const [nights, setNights] = useState(3);
  const [guests, setGuests] = useState(2);
  const [startDate, setStartDate] = useState('2026-08-15');
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservationCode, setReservationCode] = useState('');

  if (!isUplinkModalOpen || !modalCampsite) return null;

  const totalCost = (modalCampsite.pricePerNight * nights * (1 + (guests - 1) * 0.25)).toFixed(2);

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedCode = `RES-${Math.floor(100000 + Math.random() * 900000)}`;

    addReservation({
      campsiteId: modalCampsite.id,
      campsiteName: modalCampsite.name,
      startDate,
      nights,
      guests,
      totalCost: parseFloat(totalCost)
    });

    setReservationCode(generatedCode);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsUplinkModalOpen(false);
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0c1212] border-2 border-[#00f0ff] p-6 chamfered-card shadow-[0_0_40px_rgba(0,240,255,0.2)] relative text-[#e5e2e1] font-mono">
        {/* Top Header */}
        <div className="flex justify-between items-center border-b border-[#00f0ff]/30 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#a3e635] shadow-[0_0_10px_#a3e635]"></span>
            <span className="font-['Orbitron'] text-base font-bold text-[#a3e635] uppercase tracking-wider">
              CAMPSITE RESERVATION // BOOKING
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-[#ff003c] transition-colors p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleConfirmReservation} className="space-y-5">
            {/* Site Summary Banner */}
            <div className="bg-[#121212] border border-[#00f0ff]/30 p-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#00f0ff] uppercase block font-bold">{modalCampsite.locationName}</span>
                <span className="font-['Space_Grotesk'] text-lg text-white font-bold">{modalCampsite.name}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block">NIGHTLY RATE</span>
                <span className="text-[#a3e635] font-bold text-sm">{modalCampsite.priceDisplay}</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#ccc7ab] uppercase font-bold block mb-1">RESERVATION START DATE</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full bg-[#050505] border border-[#00f0ff]/40 p-2.5 text-xs text-white focus:border-[#fcee0a] outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-[#ccc7ab] uppercase font-bold block mb-1">DURATION (NIGHTS)</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={nights}
                  onChange={(e) => setNights(parseInt(e.target.value) || 1)}
                  required
                  className="w-full bg-[#050505] border border-[#00f0ff]/40 p-2.5 text-xs text-white focus:border-[#fcee0a] outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#ccc7ab] uppercase font-bold block mb-1">CAMPER / GUEST COUNT</label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full bg-[#050505] border border-[#00f0ff]/40 p-2.5 text-xs text-white focus:border-[#fcee0a] outline-none font-mono"
              >
                <option value={1}>1 Camper (Solo Tent Site)</option>
                <option value={2}>2 Campers (Standard Tent Site)</option>
                <option value={3}>3 Campers (Group Site)</option>
                <option value={4}>4 Campers (Family Site)</option>
              </select>
            </div>

            {/* Price Total Summary */}
            <div className="bg-[#050505] border-t-2 border-[#a3e635] p-4 flex justify-between items-center mt-6">
              <div>
                <span className="text-xs text-gray-400 block uppercase">TOTAL RESERVATION FEE</span>
                <span className="text-[10px] text-[#00f0ff]">INCLUDES APPLICABLE PARK FEES</span>
              </div>
              <span className="font-['Orbitron'] text-2xl font-bold text-[#a3e635]">${totalCost}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-[#121212] border border-gray-700 text-gray-300 hover:text-white font-mono text-xs font-bold py-3 uppercase tracking-wider chamfered-btn"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-2 bg-[#267865] hover:bg-[#349882] text-white font-mono text-xs font-bold py-3 uppercase tracking-wider chamfered-btn transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
                CONFIRM RESERVATION
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-[#00ff41]/20 border-2 border-[#00ff41] flex items-center justify-center mx-auto rounded-full shadow-[0_0_20px_#00ff41]">
              <span className="material-symbols-outlined text-3xl text-[#00ff41]">check_circle</span>
            </div>

            <div>
              <h4 className="font-['Orbitron'] text-xl font-bold text-[#00ff41] uppercase tracking-wider">
                RESERVATION CONFIRMED
              </h4>
              <p className="text-xs text-gray-300 mt-1">Campsite reservation confirmed in park system.</p>
            </div>

            <div className="bg-[#050505] border border-[#00f0ff]/40 p-4 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-gray-800 pb-1">
                <span className="text-gray-400">RESERVATION CODE:</span>
                <span className="text-[#fcee0a] font-bold">{reservationCode}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-1">
                <span className="text-gray-400">CAMPSITE:</span>
                <span className="text-white font-bold">{modalCampsite.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-1">
                <span className="text-gray-400">CHECK-IN DATE:</span>
                <span className="text-[#00f0ff] font-bold">{startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">TOTAL COST:</span>
                <span className="text-[#a3e635] font-bold">${totalCost}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-[#00f0ff] text-black font-mono text-xs font-bold py-3 uppercase tracking-wider chamfered-btn hover:bg-white transition-colors"
            >
              RETURN TO MAP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
