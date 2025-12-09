// Components for the agent dashboard
import { createContext, useContext, useState, ReactNode } from 'react';

type AgentModeContextType = {
  mode: 'user' | 'vendor';
  setMode: (mode: 'user' | 'vendor') => void;
};

const AgentModeContext = createContext<AgentModeContextType | undefined>(undefined);

export function AgentModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'user' | 'vendor'>('user');
  
  return (
    <AgentModeContext.Provider value={{ mode, setMode }}>
      {children}
    </AgentModeContext.Provider>
  );
}

export function useAgentMode() {
  const context = useContext(AgentModeContext);
  if (context === undefined) {
    throw new Error('useAgentMode must be used within an AgentModeProvider');
  }
  return context;
}