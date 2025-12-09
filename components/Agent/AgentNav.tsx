'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAgentMode } from './AgentModeContext';
import { Home, ArrowLeft, User, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/store/authContext';

const AgentNav = () => {
  const { mode, setMode } = useAgentMode();
  const router = useRouter();
  const { auth, logout } = useAuth();
  
  const switchMode = () => {
    const newMode = mode === 'user' ? 'vendor' : 'user';
    setMode(newMode);
    router.push(`/agent/${newMode === 'user' ? 'user-dashboard' : 'vendor-dashboard'}`);
  };
  
  const handleLogout = () => {
    logout();
    router.push('/signin');
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push('/agent')}
          className="text-gray-600 hover:text-blue-600"
        >
          <Home className="h-4 w-4 mr-1" />
          Dashboard
        </Button>
        
        <div className="bg-gray-200 h-5 w-px mx-2"></div>
        
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-500">Current Mode:</span>
          <span className="text-sm font-medium flex items-center">
            {mode === 'user' ? (
              <><User className="h-4 w-4 text-blue-500 mr-1" /> User</>
            ) : (
              <><Building className="h-4 w-4 text-green-500 mr-1" /> Vendor</>
            )}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={switchMode}
          className={`
            ${mode === 'user' ? 'text-green-600 border-green-200 hover:bg-green-50' : 'text-blue-600 border-blue-200 hover:bg-blue-50'}
          `}
        >
          Switch to {mode === 'user' ? 'Vendor' : 'User'} Mode
          {mode === 'user' ? <Building className="h-4 w-4 ml-2" /> : <User className="h-4 w-4 ml-2" />}
        </Button>
        
        <div className="bg-gray-200 h-5 w-px mx-1"></div>
        
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-blue-600 text-white">
              AG
            </AvatarFallback>
          </Avatar>
          <div className="text-sm hidden sm:block">
            <p className="font-medium">{auth?.id ? `Agent-${auth.id}` : 'Agent'}</p>
            <p className="text-gray-500 text-xs">Agent</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-red-600">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentNav;