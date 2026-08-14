import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DYRT_CAMPSITES_DATA, DyrtCampsite } from '../data/dyrtCampsites';

export interface DyrtReservation {
  id: string;
  campsiteId: string;
  campsiteName: string;
  startDate: string;
  nights: number;
  guests: number;
  totalCost: number;
  timestamp: string;
  status: 'CONFIRMED';
}

interface CamprunnerContextType {
  campsites: DyrtCampsite[];
  registerCampsites: (newSites: DyrtCampsite[]) => void;
  selectedCampsite: DyrtCampsite | null;
  setSelectedCampsite: (campsite: DyrtCampsite | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTerrain: string;
  setSelectedTerrain: (terrain: string) => void;
  dismissedAlerts: Set<string>;
  dismissAlert: (campsiteId: string) => void;
  reservations: DyrtReservation[];
  addReservation: (res: Omit<DyrtReservation, 'id' | 'timestamp' | 'status'>) => void;
  isUplinkModalOpen: boolean;
  setIsUplinkModalOpen: (open: boolean) => void;
  modalCampsite: DyrtCampsite | null;
  openUplinkModal: (campsite: DyrtCampsite) => void;
}

const CamprunnerContext = createContext<CamprunnerContextType | undefined>(undefined);

export const CamprunnerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campsites, setCampsites] = useState<DyrtCampsite[]>([]);
  const [selectedCampsite, setSelectedCampsiteState] = useState<DyrtCampsite | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerrain, setSelectedTerrain] = useState('ALL');
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [reservations, setReservations] = useState<DyrtReservation[]>([]);
  const [isUplinkModalOpen, setIsUplinkModalOpen] = useState(false);
  const [modalCampsite, setModalCampsite] = useState<DyrtCampsite | null>(null);

  const registerCampsites = (newSites: DyrtCampsite[]) => {
    setCampsites((prev) => {
      const existingIds = new Set(prev.map((s) => s.id));
      const additions = newSites.filter((s) => !existingIds.has(s.id));
      return additions.length > 0 ? [...prev, ...additions] : prev;
    });
  };

  const setSelectedCampsite = (campsite: DyrtCampsite | null) => {
    setSelectedCampsiteState(campsite);
    if (campsite) {
      setCampsites((prev) => {
        if (!prev.some((s) => s.id === campsite.id)) {
          return [campsite, ...prev];
        }
        return prev;
      });
    }
  };

  const dismissAlert = (campsiteId: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(campsiteId));
  };

  const addReservation = (res: Omit<DyrtReservation, 'id' | 'timestamp' | 'status'>) => {
    const newRes: DyrtReservation = {
      ...res,
      id: `RES-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      status: 'CONFIRMED'
    };
    setReservations((prev) => [newRes, ...prev]);
  };

  const openUplinkModal = (campsite: DyrtCampsite) => {
    setModalCampsite(campsite);
    setIsUplinkModalOpen(true);
  };

  return (
    <CamprunnerContext.Provider
      value={{
        campsites,
        registerCampsites,
        selectedCampsite,
        setSelectedCampsite,
        searchQuery,
        setSearchQuery,
        selectedTerrain,
        setSelectedTerrain,
        dismissedAlerts,
        dismissAlert,
        reservations,
        addReservation,
        isUplinkModalOpen,
        setIsUplinkModalOpen,
        modalCampsite,
        openUplinkModal
      }}
    >
      {children}
    </CamprunnerContext.Provider>
  );
};

export const useCamprunner = () => {
  const context = useContext(CamprunnerContext);
  if (!context) {
    throw new Error('useCamprunner must be used within a CamprunnerProvider');
  }
  return context;
};
