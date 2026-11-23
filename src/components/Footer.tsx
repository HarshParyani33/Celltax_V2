import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
        <footer className="w-full border-t border-[#e2d8cb] bg-[#f4ece1]/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6d5b52]">
            <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full border border-[#c8a97e] flex items-center justify-center p-0.5 bg-[#fdfbf7]">
                  <img src="/seal.svg" alt="Seal" className="w-full h-full opacity-80" />
                </div>
                <span className="text-[#8b3a2b] font-semibold tracking-wide">OPERATION: FIND HER // CASE NO. 012</span>
              </div>

              <div className="text-center sm:text-right">
                  <p className="tracking-wide flex items-center justify-center sm:justify-end space-x-1.5 font-serif text-[#38261e]">
                    <span>FOR INVESTIGATOR EYES ONLY</span>
                    <span>•</span>
                    <span className="text-[#8b3a2b] font-bold">SUBJECT IS ENTIRELY TOO ADORABLE</span>
                    <Heart className="w-3.5 h-3.5 text-[#c25e5e] fill-[#c25e5e] inline animate-pulse" />
                  </p>
                    <p className="text-[11px] text-[#8a7667] mt-1 font-sans">
                      A handcrafted digital gift & birthday keepsake — celebrating one extraordinary person.
                    </p>
                  </div>
              </div>
            </footer>
            );
};
