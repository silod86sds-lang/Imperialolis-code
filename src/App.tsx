/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useAppContext } from './lib/AppContext';
import Login from './components/Login';
import MainLayout from './components/MainLayout';

function AppContent() {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Login />;
  }

  return <MainLayout />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

