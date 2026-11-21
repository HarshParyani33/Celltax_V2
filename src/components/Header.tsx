import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Shield, Lock, Unlock, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { useProgression } from '../utils/progression';

interface HeaderProps {
  currentScreen?: 'terminal' | 'briefing' | 'archive' | 'timeline' | 'gallery';
}

export const Header: React.FC<HeaderProps> = ({ currentScreen = 'archive' }) => {
  const [muted, setMuted] = useState(soundFx.getMuted());
  const { inspectedIds, isUnlocked } = useProgression();

  const handleToggleSound = () => {
    const isNowMuted = soundFx.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundFx.playKeypress();
    }
  };

  const isNavigable = currentScreen !== 'terminal' && currentScreen !== 'briefing';

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
          <Link
            to={isNavigable ? '/archive' : '/'}
            className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-1 focus-visible:ring-brass rounded p-1"
          >
            <div className="w-8 h-8 rounded-full border border-brass/40 flex items-center justify-center bg-investigation-surface/80 p-1 group-hover:border-brass transition-colors">
              <img src="/seal.svg" alt="Department Seal" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-xs font-serif tracking-widest text-brass-light font-bold group-hover:text-brass transition-colors">
                THE DEPARTMENT OF EXTRAORDINARY THINGS
              </div>
              <div className="text-[10px] font-mono tracking-wider text-investigation-muted flex items-center space-x-2">
                <span>CASE NO. 012</span>
                <span>•</span>
                <span className="text-brass/80">CONFIDENTIAL COLLECTION</span>
              </div>
            </div>
          </Link>

          {/* Center Navigation for investigation routes */}
          {isNavigable && (
            <nav
              aria-label="Investigation environments"
              className="hidden md:flex items-center space-x-1 p-1 rounded-lg bg-investigation-surface/80 border border-investigation-border/60 text-xs font-mono"
            >
              <Link
                to="/archive"
                onClick={() => soundFx.playKeypress()}
                className={`px-3 py-1.5 rounded transition-all ${
                  currentScreen === 'archive'
                    ? 'bg-brass text-charcoal-900 font-bold shadow-brass-sm'
                    : 'text-investigation-muted hover:text-parchment hover:bg-investigation-card'
                }`}
              >
                ARCHIVE
              </Link>

              <Link
                to="/timeline"
                onClick={() => soundFx.playKeypress()}
                className={`px-3 py-1.5 rounded transition-all ${
                  currentScreen === 'timeline'
                    ? 'bg-brass text-charcoal-900 font-bold shadow-brass-sm'
                    : 'text-investigation-muted hover:text-parchment hover:bg-investigation-card'
                }`}
              >
                TIMELINE
              </Link>

              <Link
                to="/gallery"
                onClick={() => soundFx.playKeypress()}
                className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                  currentScreen === 'gallery'
                    ? 'bg-brass text-charcoal-900 font-bold shadow-brass-sm'
                    : isUnlocked
                    ? 'text-brass-light hover:text-brass hover:bg-investigation-card'
                    : 'text-investigation-muted/70 hover:text-investigation-muted hover:bg-investigation-card'
                }`}
              >
                {isUnlocked ? (
                  <Sparkles className="w-3.5 h-3.5 text-brass" />
                ) : (
                  <Lock className="w-3 h-3 text-investigation-muted" />
                )}
                <span>MASTER GALLERY</span>
              </Link>
            </nav>
          )}

          {/* Right: Security Badge, Progress & Audio Controls */}
          <div className="flex items-center space-x-3">
            {isNavigable && (
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-investigation-surface border border-investigation-border text-[11px] font-mono text-investigation-muted">
                <span className="text-brass font-bold">{inspectedIds.length}/3</span>
                <span>EXHIBITS</span>
              </div>
            )}

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-investigation-surface border border-investigation-border text-[11px] font-mono text-investigation-muted">
              <Shield className="w-3.5 h-3.5 text-brass" />
              <span className="hidden sm:inline">LEVEL {isUnlocked ? '4' : '3'}</span>
              {isUnlocked ? (
                <Unlock className="w-3 h-3 text-brass" />
              ) : (
                <Lock className="w-3 h-3 text-investigation-muted" />
              )}
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
