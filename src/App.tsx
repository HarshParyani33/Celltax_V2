import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AccessTerminal } from './pages/AccessTerminal';
import { CaseBriefing } from './pages/CaseBriefing';
import { EvidenceArchive } from './pages/EvidenceArchive';

export const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-investigation-base text-investigation-text font-sans antialiased">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AccessTerminal />} />
          <Route path="/access" element={<Navigate to="/" replace />} />
          <Route path="/briefing" element={<CaseBriefing />} />
          <Route path="/archive" element={<EvidenceArchive />} />
          <Route path="/evidence" element={<Navigate to="/archive" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
