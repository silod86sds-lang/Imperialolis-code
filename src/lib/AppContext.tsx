import React, { createContext, useContext, useState, useEffect } from 'react';
import { agents, citizens as initialCitizens, vehicles as initialVehicles, infractionTypes, initialInfractions } from './mockData';

type Agent = typeof agents[0];
type Citizen = typeof initialCitizens[0];
type Vehicle = typeof initialVehicles[0];
type InfractionType = typeof infractionTypes[0];
export type Infraction = typeof initialInfractions[0];

interface AppState {
  currentUser: Agent | null;
  citizens: Citizen[];
  vehicles: Vehicle[];
  infractions: Infraction[];
}

interface AppContextType extends AppState {
  login: (nif: string, pass: string) => boolean;
  logout: () => void;
  addInfraction: (infraction: Omit<Infraction, 'id' | 'agentNif'>) => void;
  suspendLicense: (bi: string) => void;
  markAsPaid: (infractionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    citizens: initialCitizens,
    vehicles: initialVehicles,
    infractions: initialInfractions,
  });

  // Auto-update overdue fines on load
  useEffect(() => {
    const now = new Date();
    setState(prev => ({
      ...prev,
      infractions: prev.infractions.map(inf => {
        if (inf.type === 'multa' && inf.status === 'nao_pago' && inf.deadline) {
          if (new Date(inf.deadline) < now) {
            return { ...inf, status: 'em_atraso' };
          }
        }
        return inf;
      })
    }));
  }, []);

  const login = (nif: string, pass: string) => {
    const agent = agents.find(a => a.nif === nif && a.password === pass);
    if (agent) {
      setState(prev => ({ ...prev, currentUser: agent }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const addInfraction = (infractionData: Omit<Infraction, 'id' | 'agentNif'>) => {
    if (!state.currentUser) return;
    
    const newInfraction: Infraction = {
      ...infractionData,
      id: `INF-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      agentNif: state.currentUser.nif,
    };

    setState(prev => ({
      ...prev,
      infractions: [newInfraction, ...prev.infractions]
    }));
  };

  const suspendLicense = (bi: string) => {
    setState(prev => ({
      ...prev,
      citizens: prev.citizens.map(c => c.bi === bi ? { ...c, licenseStatus: 'Suspensa' } : c)
    }));
  };

  const markAsPaid = (infractionId: string) => {
    setState(prev => ({
      ...prev,
      infractions: prev.infractions.map(inf => inf.id === infractionId ? { ...inf, status: 'pago' } : inf)
    }));
  };

  return (
    <AppContext.Provider value={{ ...state, login, logout, addInfraction, suspendLicense, markAsPaid }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
