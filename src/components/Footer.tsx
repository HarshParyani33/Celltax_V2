import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-investigation-border/40 bg-investigation-base/90 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-investigation-muted">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-full border border-brass/40 flex items-center justify-center p-0.5">
            <img src="/seal.svg" alt="Seal" className="w-full h-full opacity-60" />
          </div>
          <span className="text-brass-light font-semibold">OPERATION: FIND HER // CASE NO. 012</span>
        </div>
        
        <div className="text-center sm:text-right">
          <p className="tracking-wider flex items-center justify-center sm:justify-end space-x-1.5">
            <span>FOR INVESTIGATOR EYES ONLY</span>
            <span>•</span>
            <span className="text-brass">SUBJECT IS ENTIRELY TOO ADORABLE</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
          </p>
          <p className="text-[10px] text-investigation-muted/70 mt-1">
            CONFIDENTIAL BIRTHDAY INVESTIGATION DOSSIER — CELEBRATING ONE EXTRAORDINARY HUMAN
          </p>
        </div>
      </div>
    </footer>
  );
};
