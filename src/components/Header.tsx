import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, Lock } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  currentScreen?: 'terminal' | 'briefing' | 'archive';
}

export const Header: React.FC<HeaderProps> = ({ currentScreen = 'archive' }) => {
  const [muted, setMuted] = useState(soundFx.getMuted());

  const handleToggleSound = () => {
    const isNowMuted = soundFx.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundFx.playKeypress();
    }
  };

  return (
    <>
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-brass text-charcoal-900 font-mono text-xs font-bold rounded shadow-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-light"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-investigation-border/60 bg-investigation-base/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Department Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-brass/40 flex items-center justify-center bg-investigation-surface/80 p-1">
              <img src="/seal.svg" alt="Department Seal" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-xs font-serif tracking-widest text-brass-light font-bold">
                THE DEPARTMENT OF EXTRAORDINARY THINGS
              </div>
              <div className="text-[10px] font-mono tracking-wider text-investigation-muted flex items-center space-x-2">
                <span>CASE NO. 012</span>
                <span>•</span>
                <span className="text-brass/80">CONFIDENTIAL COLLECTION</span>
              </div>
            </div>
          </div>

          {/* Center: Status Indicator (Desktop only) */}
          <div className="hidden md:flex items-center space-x-3 px-3 py-1 rounded border border-investigation-border/50 bg-investigation-forest/60">
            <div className="w-2 h-2 rounded-full bg-brass animate-pulse-subtle" />
            <span className="text-xs font-mono tracking-wider text-investigation-text/80">
              {currentScreen === 'terminal' && 'CLEARANCE VERIFICATION ACTIVE'}
              {currentScreen === 'briefing' && 'DOSSIER CLEARANCE: GRANTED'}
              {currentScreen === 'archive' && 'EVIDENCE REPOSITORY ACCESSIBLE'}
            </span>
          </div>

          {/* Right: Security Badge & Audio Controls */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-investigation-surface border border-investigation-border text-[11px] font-mono text-investigation-muted">
              <Shield className="w-3.5 h-3.5 text-brass" />
              <span className="hidden sm:inline">LEVEL 3</span>
              <Lock className="w-3 h-3 text-investigation-muted" />
            </div>

            <button
              onClick={handleToggleSound}
              aria-label={muted ? "Atmospheric audio is muted. Click to enable sound." : "Atmospheric audio is active. Click to mute sound."}
              className="p-2 rounded border border-investigation-border hover:border-brass/60 bg-investigation-surface text-investigation-muted hover:text-brass transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              title={muted ? "Sound muted (click to enable)" : "Sound active (click to mute)"}
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-investigation-muted" />
              ) : (
                <Volume2 className="w-4 h-4 text-brass" />
              )}
            </button>
          </div>

        </div>
      </header>
    </>
  );
};
