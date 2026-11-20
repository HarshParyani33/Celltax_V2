import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-investigation-border/40 bg-investigation-base/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-investigation-muted">
        <div className="flex items-center space-x-3">
          <img src="/seal.svg" alt="Seal" className="w-5 h-5 opacity-40" />
          <span>ARCHIVAL REPOSITORY // RECORD NO. 012-A8</span>
        </div>
        <div className="text-center sm:text-right">
          <p className="tracking-wider">FOR AUTHORISED INVESTIGATIVE EYES ONLY</p>
          <p className="text-[10px] text-investigation-muted/70 mt-0.5">
            ALL EXHIBITS AND RECOVERED ARTEFACTS CLASSIFIED UNDER CURATORIAL DIRECTIVE 12
          </p>
        </div>
      </div>
    </footer>
  );
};
