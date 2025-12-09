import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FleetTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const FleetTabs: React.FC<FleetTabsProps> = ({ activeTab, setActiveTab, children }) => (
  <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
    <TabsList>
      <TabsTrigger value="all">All Vehicles</TabsTrigger>
      <TabsTrigger value="available">Available</TabsTrigger>
      <TabsTrigger value="rented">Rented</TabsTrigger>
      <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
    </TabsList>
    {children}
  </Tabs>
);

export default FleetTabs;
