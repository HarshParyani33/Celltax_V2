import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Shield, Lock, Unlock, Sparkles, FolderSearch, BookOpen, Users, Compass, Heart } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { useProgression } from '../utils/progression';

interface HeaderProps {
  currentScreen?: 'terminal' | 'briefing' | 'archive' | 'timeline' | 'gallery' | 'scrapbook' | 'witnesses' | 'found';
}

export const Header: React.FC<HeaderProps> = ({ currentScreen: _currentScreen }) => {
  const location = useLocation();
  const [muted, setMuted] = useState(soundFx.getMuted());
  const { inspectedIds, isUnlocked } = useProgression();

  const handleToggleSound = () => {
    const isNowMuted = soundFx.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundFx.playKeypress();
    }
  };

  const pathname = location.pathname;

  return (
    <>
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-brass text-charcoal-900 font-mono text-xs font-bold rounded shadow-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-light"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-investigation-border/60 bg-investigation-base/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Operation Find Her Identity */}
          <Link
            to="/archive"
            className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-1 focus-visible:ring-brass rounded p-1"
          >
            <div className="w-9 h-9 rounded-full border border-brass/50 flex items-center justify-center bg-investigation-surface/90 p-1 group-hover:border-brass transition-colors shadow-brass-sm">
              <img src="/seal.svg" alt="Investigation Seal" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-serif tracking-widest text-brass-light font-bold group-hover:text-brass transition-colors flex items-center space-x-1.5">
                <span>OPERATION: FIND HER</span>
                <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
              </div>
              <div className="text-[10px] font-mono tracking-wider text-investigation-muted flex items-center space-x-2">
                <span>CASE NO. 012</span>
                <span>•</span>
                <span className="text-brass/80">CONFIDENTIAL DOSSIER</span>
              </div>
            </div>
          </Link>

          {/* Center Navigation: Responsive Tabs for Investigation Hubs */}
          <nav
            aria-label="Investigation Navigation"
            className="hidden lg:flex items-center space-x-1 p-1 rounded-lg bg-investigation-surface/80 border border-investigation-border/60 text-xs font-mono"
          >
            <Link
              to="/archive"
              onClick={() => soundFx.playKeypress()}
              className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                pathname === '/archive' || pathname === '/board'
                  ? 'bg-brass text-charcoal-900 font-bold shadow-brass-sm'
                  : 'text-investigation-muted hover:text-parchment hover:bg-investigation-card'
              }`}
            >
              <FolderSearch className="w-3.5 h-3.5" />
              <span>BOARD</span>
            </Link>

            <Link
              to="/scrapbook"
              onClick={() => soundFx.playKeypress()}
              className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                pathname === '/scrapbook'
                  ? 'bg-brass text-charcoal-900 font-bold shadow-brass-sm'
                  : 'text-investigation-muted hover:text-parchment hover:bg-investigation-card'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>SCRAPBOOK</span>
            </Link>

            <Link
              to="/witnesses"
              onClick={() => soundFx.playKeypress()}
              className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                pathname === '/witnesses'
                  ? 'bg-brass text-charcoal-900 font-bold shadow-brass-sm'
                  : 'text-investigation-muted hover:text-parchment hover:bg-investigation-card'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>WITNESSES & SUSPECTS</span>
            </Link>

            <Link
              to="/timeline"
              onClick={() => soundFx.playKeypress()}
              className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                pathname === '/timeline'
                  ? 'bg-brass text-charcoal-900 font-bold shadow-brass-sm'
                  : 'text-investigation-muted hover:text-parchment hover:bg-investigation-card'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>TIMELINE</span>
            </Link>

            <Link
              to="/gallery"
              onClick={() => soundFx.playKeypress()}
              className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                pathname === '/gallery' || pathname === '/found'
                  ? 'bg-brass text-charcoal-900 font-bold shadow-brass-sm'
                  : isUnlocked
                  ? 'text-brass-light hover:text-brass hover:bg-investigation-card'
                  : 'text-investigation-muted/70 hover:text-investigation-muted hover:bg-investigation-card'
              }`}
            >
              {isUnlocked ? (
                <Sparkles className="w-3.5 h-3.5 text-brass animate-spin-slow" />
              ) : (
                <Lock className="w-3 h-3 text-investigation-muted" />
              )}
              <span>SUBJECT FOUND (MASTER GALLERY)</span>
            </Link>
          </nav>

          {/* Right: Security Badge, Clue Count & Audio Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/archive"
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-investigation-surface border border-brass/40 text-[11px] font-mono text-brass-light hover:border-brass transition-colors"
              title="Clues inspected across investigation"
            >
              <span className="font-bold">{inspectedIds.length}/3</span>
              <span className="hidden sm:inline">CLUES</span>
            </Link>

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

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around px-2 py-2 border-t border-investigation-border/40 bg-investigation-forest/90 overflow-x-auto text-[11px] font-mono">
          <Link
            to="/archive"
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              pathname === '/archive' || pathname === '/board'
                ? 'bg-brass text-charcoal-900 font-bold'
                : 'text-investigation-muted'
            }`}
          >
            BOARD
          </Link>
          <Link
            to="/scrapbook"
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              pathname === '/scrapbook'
                ? 'bg-brass text-charcoal-900 font-bold'
                : 'text-investigation-muted'
            }`}
          >
            SCRAPBOOK
          </Link>
          <Link
            to="/witnesses"
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              pathname === '/witnesses'
                ? 'bg-brass text-charcoal-900 font-bold'
                : 'text-investigation-muted'
            }`}
          >
            WITNESSES
          </Link>
          <Link
            to="/timeline"
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              pathname === '/timeline'
                ? 'bg-brass text-charcoal-900 font-bold'
                : 'text-investigation-muted'
            }`}
          >
            TIMELINE
          </Link>
          <Link
            to="/gallery"
            className={`px-2.5 py-1 rounded whitespace-nowrap flex items-center space-x-1 ${
              pathname === '/gallery' || pathname === '/found'
                ? 'bg-brass text-charcoal-900 font-bold'
                : isUnlocked
                ? 'text-brass-light'
                : 'text-investigation-muted/70'
            }`}
          >
            {isUnlocked ? <Sparkles className="w-3 h-3 text-brass" /> : <Lock className="w-2.5 h-2.5" />}
            <span>FOUND</span>
          </Link>
        </div>
      </header>
    </>
  );
};
