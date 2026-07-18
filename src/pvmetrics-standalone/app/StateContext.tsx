import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, ClientInfoItem, SCADARegister, PreMeetingLockdown, ReportTemplate, Plant } from '../types';
import { INITIAL_COMPANIES, DEFAULT_CLIENT_INFO_CHECKLIST, DEFAULT_SCADA_REGISTERS } from '../data/presets';

interface StateContextType {
  companies: Company[];
  activeCompanyId: string;
  activePlantId: string;
  activeCompany: Company;
  activePlant: Plant;
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  setActiveCompanyId: (id: string) => void;
  setActivePlantId: (id: string) => void;
  noiseLevel: 'low' | 'medium' | 'high';
  setNoiseLevel: (level: 'low' | 'medium' | 'high') => void;
  clientInfoChecklist: ClientInfoItem[];
  setClientInfoChecklist: React.Dispatch<React.SetStateAction<ClientInfoItem[]>>;
  scadaRegisters: SCADARegister[];
  setScadaRegisters: React.Dispatch<React.SetStateAction<SCADARegister[]>>;
  lockdown: PreMeetingLockdown;
  setLockdown: (lockdown: PreMeetingLockdown) => void;
  reportHistory: ReportTemplate[];
  setReportHistory: React.Dispatch<React.SetStateAction<ReportTemplate[]>>;
  updatePlantConfig: (companyId: string, plantId: string, updatedPlant: Plant) => void;
  resetAllToDefault: () => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Core Companies state (multi-company workspace)
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('pvmetrics_companies');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [activeCompanyId, setActiveCompanyId] = useState<string>(() => {
    const saved = localStorage.getItem('pvmetrics_active_company_id');
    return saved || 'orbi-solar-demo';
  });

  const [activePlantId, setActivePlantId] = useState<string>(() => {
    const saved = localStorage.getItem('pvmetrics_active_plant_id');
    return saved || 'andes-solar-ii';
  });

  // 2. Simulation Noise
  const [noiseLevel, setNoiseLevel] = useState<'low' | 'medium' | 'high'>(() => {
    const saved = localStorage.getItem('pvmetrics_noise_level');
    return (saved as 'low' | 'medium' | 'high') || 'medium';
  });

  // 3. Client Information Checklist
  const [clientInfoChecklist, setClientInfoChecklist] = useState<ClientInfoItem[]>(() => {
    const saved = localStorage.getItem('pvmetrics_client_checklist');
    return saved ? JSON.parse(saved) : DEFAULT_CLIENT_INFO_CHECKLIST;
  });

  // 4. SCADA Registers
  const [scadaRegisters, setScadaRegisters] = useState<SCADARegister[]>(() => {
    const saved = localStorage.getItem('pvmetrics_scada_registers');
    return saved ? JSON.parse(saved) : DEFAULT_SCADA_REGISTERS;
  });

  // 5. Pre-Meeting Lockdown
  const [lockdown, setLockdownState] = useState<PreMeetingLockdown>(() => {
    const saved = localStorage.getItem('pvmetrics_lockdown');
    return saved ? JSON.parse(saved) : { enabled: false, passwordHash: '' };
  });

  // 6. Local Reports History
  const [reportHistory, setReportHistory] = useState<ReportTemplate[]>(() => {
    const saved = localStorage.getItem('pvmetrics_report_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Persists
  useEffect(() => {
    localStorage.setItem('pvmetrics_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('pvmetrics_active_company_id', activeCompanyId);
  }, [activeCompanyId]);

  useEffect(() => {
    localStorage.setItem('pvmetrics_active_plant_id', activePlantId);
  }, [activePlantId]);

  useEffect(() => {
    localStorage.setItem('pvmetrics_noise_level', noiseLevel);
  }, [noiseLevel]);

  useEffect(() => {
    localStorage.setItem('pvmetrics_client_checklist', JSON.stringify(clientInfoChecklist));
  }, [clientInfoChecklist]);

  useEffect(() => {
    localStorage.setItem('pvmetrics_scada_registers', JSON.stringify(scadaRegisters));
  }, [scadaRegisters]);

  useEffect(() => {
    localStorage.setItem('pvmetrics_lockdown', JSON.stringify(lockdown));
  }, [lockdown]);

  useEffect(() => {
    localStorage.setItem('pvmetrics_report_history', JSON.stringify(reportHistory));
  }, [reportHistory]);

  const setLockdown = (newLockdown: PreMeetingLockdown) => {
    setLockdownState(newLockdown);
  };

  // Find active company and active plant with fallbacks
  const activeCompany = companies.find(c => c.id === activeCompanyId) || companies[0];
  const activePlant = activeCompany.plants.find(p => p.id === activePlantId) || activeCompany.plants[0] || companies[0].plants[0];

  // Helper to update specific plant configurations dynamically
  const updatePlantConfig = (companyId: string, plantId: string, updatedPlant: Plant) => {
    setCompanies(prev => {
      return prev.map(company => {
        if (company.id === companyId) {
          return {
            ...company,
            plants: company.plants.map(plant => plant.id === plantId ? updatedPlant : plant)
          };
        }
        return company;
      });
    });
  };

  const resetAllToDefault = () => {
    setCompanies(INITIAL_COMPANIES);
    setActiveCompanyId('orbi-solar-demo');
    setActivePlantId('andes-solar-ii');
    setNoiseLevel('medium');
    setClientInfoChecklist(DEFAULT_CLIENT_INFO_CHECKLIST);
    setScadaRegisters(DEFAULT_SCADA_REGISTERS);
    setLockdownState({ enabled: false, passwordHash: '' });
    setReportHistory([]);
    localStorage.removeItem('pvmetrics_companies');
    localStorage.removeItem('pvmetrics_active_company_id');
    localStorage.removeItem('pvmetrics_active_plant_id');
    localStorage.removeItem('pvmetrics_noise_level');
    localStorage.removeItem('pvmetrics_client_checklist');
    localStorage.removeItem('pvmetrics_scada_registers');
    localStorage.removeItem('pvmetrics_lockdown');
    localStorage.removeItem('pvmetrics_report_history');
  };

  return (
    <StateContext.Provider value={{
      companies,
      activeCompanyId,
      activePlantId,
      activeCompany,
      activePlant,
      setCompanies,
      setActiveCompanyId,
      setActivePlantId,
      noiseLevel,
      setNoiseLevel,
      clientInfoChecklist,
      setClientInfoChecklist,
      scadaRegisters,
      setScadaRegisters,
      lockdown,
      setLockdown,
      reportHistory,
      setReportHistory,
      updatePlantConfig,
      resetAllToDefault
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
