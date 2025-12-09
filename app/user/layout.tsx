import Sidebar from '@/components/User/components/Sidebar'
import Header from '@/components/User/components/Header'
import React from 'react'
import { SidebarProvider } from '@/components/User/contexts/SidebarContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <ProtectedRoute allowedRoles={[ 'user','agent']}>

    
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-[#023e8a05] to-[#023e8a15]">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <Header />
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
       </ProtectedRoute> 
  )
}
