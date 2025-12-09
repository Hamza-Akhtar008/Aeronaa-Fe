'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAgentMode } from '@/components/Agent/AgentModeContext';
import { User, Building, ArrowRight, Car, Package, HomeIcon } from 'lucide-react';
import { useAuth } from '@/store/authContext';

const ModeSelectionPage = () => {
  const { auth } = useAuth();
  const router = useRouter();
  const { setMode } = useAgentMode();

  // Default: assume no permissions
  const permissions: string[] = auth?.Permissions || [];

  const handleModeSelection = (mode: 'user' | 'vendor') => {
    setMode(mode);
    if (mode === 'user') {
      router.push('/user/bookings');
    } else {
      router.push('/Dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Agent Dashboard</h1>
      <p className="text-lg text-gray-600 mb-12 text-center max-w-md">
        As an agent, you can manage multiple services. Select which section you'd like to work in:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        
        {/* User Management (always visible) */}
        <Card className="border border-blue-100 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-blue-700 flex items-center gap-2">
              <User className="h-6 w-6" />
              User Management
            </CardTitle>
            <CardDescription>Manage user accounts, bookings and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Handle user bookings, manage travel itineraries, and provide customer service support.
            </p>
            <Button
              onClick={() => handleModeSelection('user')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Enter User Dashboard <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* HOTEL MANAGEMENT */}
        {permissions.includes('hotel') && (
          <Card className="border border-green-100 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-green-700 flex items-center gap-2">
                <Building className="h-6 w-6" />
                Hotel Management
              </CardTitle>
              <CardDescription>Manage properties, listings and bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                List and manage hotel properties, handle reservations, and update property information.
              </p>
              <Button
                onClick={() => handleModeSelection('vendor')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Enter Hotel Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CAR RENTAL */}
        {permissions.includes('car') && (
          <Card className="border border-yellow-100 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-yellow-700 flex items-center gap-2">
                <Car className="h-6 w-6" />
                Car Rentals
              </CardTitle>
              <CardDescription>Manage car rental bookings and fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Oversee car rental reservations, manage vehicles, and update rental information.
              </p>
              <Button
                onClick={() => router.push('/car-rental-dashboard')}
                className="w-full bg-yellow-500 hover:bg-yellow-600"
              >
                Enter Car Rental Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* UMRAH PACKAGES */}
        {permissions.includes('umrah') && (
          <Card className="border border-purple-100 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-purple-700 flex items-center gap-2">
                <Package className="h-6 w-6" />
                Umrah Packages
              </CardTitle>
              <CardDescription>Manage Umrah travel packages and deals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Create, edit, and manage Umrah packages for users and vendors.
              </p>
              <Button
                onClick={() => router.push('/umarah-pakage/dashboard')}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                Enter Umrah Packages Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* PROPERTY */}
        {permissions.includes('property') && (
          <Card className="border border-emerald-100 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-emerald-700 flex items-center gap-2">
                <HomeIcon className="h-6 w-6" />
                Property Management
              </CardTitle>
              <CardDescription>Manage Properties for Sale or Rent</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Create, edit, and manage property listings for users.
              </p>
              <Button
                onClick={() => router.push('/property-dashboard')}
                className="w-full bg-emerald-500 hover:bg-emerald-600"
              >
                Enter Property Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ModeSelectionPage;
