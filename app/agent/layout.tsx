'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute';
import React from 'react';
import { AgentModeProvider } from '@/components/Agent/AgentModeContext';

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['agent']}>
      <AgentModeProvider>
        {children}
      </AgentModeProvider>
    </ProtectedRoute>
  );
}