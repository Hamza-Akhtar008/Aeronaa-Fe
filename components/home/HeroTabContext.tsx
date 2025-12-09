import React,{createContext,useContext,useState,useRef} from 'react';
type HeroTab='hotels'|'flights'|'cars'|'umrah'|"property";

const HeroTabContext=createContext<{
    activeTab: HeroTab;
    setActiveTab: (tab: HeroTab) => void;
    heroRef: React.RefObject<HTMLDivElement | null>;
}>(
    {
        activeTab: 'hotels',
        setActiveTab: () => {},
        heroRef: { current: null },
    }
);

export const useHeroTab = () => useContext(HeroTabContext);

export const HeroTabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<HeroTab>('hotels');
    const heroRef = useRef<HTMLDivElement | null>(null);

    return (
        <HeroTabContext.Provider value={{ activeTab, setActiveTab, heroRef }}>
            {children}
        </HeroTabContext.Provider>
    );
};

// interface HeroTabContextType {
//   activeTab: HeroTab;
//   setActiveTab: (tab: HeroTab) => void;
// }
// const HeroTabContext = createContext<HeroTabContextType | undefined>(undefined);
// export const HeroTabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [activeTab, setActiveTab] = useState<HeroTab>('hotels');
//   return (
//     <HeroTabContext.Provider value={{ activeTab, setActiveTab }}>
//       {children}
//     </HeroTabContext.Provider>
//   );
// };
// export const useHeroTab = () => {
//   const context = useContext(HeroTabContext);
//   if (!context) {
//     throw new Error('useHeroTab must be used within a HeroTabProvider');
//   }
//   return context;
// };
