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
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-[#8b3a2b] text-[#faf6f0] font-mono text-xs font-bold rounded shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b3a2b]"
      >
        Skip to main content
      </a>

        <header className="sticky top-0 z-40 w-full border-b border-[#e4d8c8] bg-[#fbf8f3]/95 backdrop-blur-md shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

            {/* Left: Operation Find Her Gift Identity */}
            <Link
              to="/archive"
              className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8b3a2b] rounded p-1"
            >
                <div className="w-9 h-9 rounded-full border border-[#c8a97e] flex items-center justify-center bg-[#fdfbf7] p-1 group-hover:border-[#8b3a2b] transition-colors shadow-xs">
                  <img src="/seal.svg" alt="Investigation Seal" className="w-full h-full object-contain" />
                </div>
                <div>
                    <div className="text-xs sm:text-sm font-editorial tracking-wide text-[#38261e] font-bold group-hover:text-[#8b3a2b] transition-colors flex items-center space-x-1.5">
                      <span>OPERATION: FIND HER</span>
                      <Heart className="w-3 h-3 text-[#c25e5e] fill-[#c25e5e] animate-pulse" />
                    </div>
                      <div className="text-[10px] font-mono tracking-wider text-[#8a7667] flex items-center space-x-2">
                        <span>CASE NO. 012</span>
                        <span>•</span>
                        <span className="text-[#8b3a2b]/90 font-medium">A PERSONAL BIRTHDAY DOSSIER</span>
                      </div>
                    </div>
                  </Link>

                  {/* Center Navigation: Responsive Tabs for Investigation Hubs */}
                  <nav
                    aria-label="Investigation Navigation"
                    className="hidden lg:flex items-center space-x-1 p-1 rounded-xl bg-[#ede3d5]/70 border border-[#dfd2c0] text-xs font-mono"
                  >
                    <Link
                      to="/archive"
                      onClick={() => soundFx.playKeypress()}
                              ? 'bg-[#8b3a2b] text-[#faf6f0] font-bold shadow-xs'
                              : 'text-[#6d5b52] hover:text-[#2d2016] hover:bg-[#fbf8f3]'
                          }`}
            >
              <FolderSearch className="w-3.5 h-3.5" />
              <span>BOARD</span>
            </Link>

            <Link
              to="/scrapbook"
              onClick={() => soundFx.playKeypress()}
                      className = {`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${pathname === '/scrapbook'
                            ? 'bg-[#8b3a2b] text-[#faf6f0] font-bold shadow-xs'
                            : 'text-[#6d5b52] hover:text-[#2d2016] hover:bg-[#fbf8f3]'
                        }`}
            >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>SCRAPBOOK</span>
                  </Link>

                  <Link
                    to="/witnesses"
                    onClick={() => soundFx.playKeypress()}
                            ? 'bg-[#8b3a2b] text-[#faf6f0] font-bold shadow-xs'
                            : 'text-[#6d5b52] hover:text-[#2d2016] hover:bg-[#fbf8f3]'
                        }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>WITNESSES & SUSPECTS</span>
            </Link>

            <Link
              to="/timeline"
              onClick={() => soundFx.playKeypress()}
                    className = {`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${pathname === '/timeline'
                          ? 'bg-[#8b3a2b] text-[#faf6f0] font-bold shadow-xs'
                          : 'text-[#6d5b52] hover:text-[#2d2016] hover:bg-[#fbf8f3]'
                      }`}
            >
                  <Compass className="w-3.5 h-3.5" />
                  <span>TIMELINE</span>
                </Link>

                <Link
                  to="/gallery"
                  onClick={() => soundFx.playKeypress()}
                          ? 'bg-[#8b3a2b] text-[#faf6f0] font-bold shadow-xs'
                          : isUnlocked
                              ? 'text-[#8b3a2b] font-semibold hover:bg-[#fbf8f3]'
                              : 'text-[#8a7667]/80 hover:text-[#2d2016] hover:bg-[#fbf8f3]'
              }`}
            >
              {isUnlocked ? (
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-spin-slow" />
              ) : (
                <Lock className="w-3 h-3 text-[#8a7667]" />
              )}
              <span>SUBJECT FOUND (MASTER GALLERY)</span>
            </Link>
          </nav>

          {/* Right: Security Badge, Clue Count & Audio Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/archive"
              className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#f4ece1] border border-[#d8c8b4] text-[11px] font-mono text-[#8b3a2b] font-bold hover:border-[#8b3a2b] transition-colors shadow-xs"
              title="Clues inspected across investigation"
            >
              <span>{inspectedIds.length}/3</span>
              <span className="hidden sm:inline font-medium">CLUES</span>
            </Link>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#f4ece1] border border-[#d8c8b4] text-[11px] font-mono text-[#6d5b52]">
              <Shield className="w-3.5 h-3.5 text-[#8b3a2b]" />
              <span className="hidden sm:inline">LEVEL {isUnlocked ? '4' : '3'}</span>
              {isUnlocked ? (
                <Unlock className="w-3 h-3 text-[#4f772d]" />
              ) : (
                <Lock className="w-3 h-3 text-[#8a7667]" />
              )}
            </div>

            <button
              onClick={handleToggleSound}
              aria-label={muted ? "Atmospheric audio is muted. Click to enable sound." : "Atmospheric audio is active. Click to mute sound."}
              className="p-2 rounded-full border border-[#d8c8b4] hover:border-[#8b3a2b] bg-[#fdfbf7] text-[#6d5b52] hover:text-[#8b3a2b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b3a2b] shadow-xs"
              title={muted ? "Sound muted (click to enable)" : "Sound active (click to mute)"}
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-[#8a7667]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#8b3a2b]" />
              )}
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around px-2 py-2 border-t border-[#e4d8c8] bg-[#f5ede2] overflow-x-auto text-[11px] font-mono">
          <Link
            to="/archive"
                  className = {`px-2.5 py-1 rounded-lg whitespace-nowrap ${pathname === '/archive' || pathname === '/board'
                        ? 'bg-[#8b3a2b] text-[#faf6f0] font-bold'
                        : 'text-[#6d5b52]'
                    }`}
          >
                BOARD
            </Link>
            <Link
              to="/scrapbook"
                      ? 'bg-[#8b3a2b] text-[#faf6f0] font-bold'
                      : 'text-[#6d5b52]'
                  }`}
          >
            SCRAPBOOK
          </Link>
          <Link
            to="/witnesses"
              className = {`px-2.5 py-1 rounded-lg whitespace-nowrap ${pathname === '/witnesses'
                    ? 'bg-[#8b3a2b] text-[#faf6f0] font-bold'
                    : 'text-[#6d5b52]'
                }`}
          >
            WITNESSES
          </Link>
          <Link
            to="/timeline"
                    ? 'bg-[#8b3a2b] text-[#faf6f0] font-bold'
                    : 'text-[#6d5b52]'
                }`}
          >
            TIMELINE
          </Link>
          <Link
            to="/gallery"
            className = {`px-2.5 py-1 rounded-lg whitespace-nowrap flex items-center space-x-1 ${pathname === '/gallery' || pathname === '/found'
                  ? 'bg-[#8b3a2b] text-[#faf6f0] font-bold'
                  : isUnlocked
                      ? 'text-[#8b3a2b] font-bold'
                      : 'text-[#8a7667]'
            }`}
          >
          {isUnlocked ? <Sparkles className="w-3 h-3 text-[#d4af37]" /> : <Lock className="w-2.5 h-2.5" />}
          <span>FOUND</span>
        </Link>
      </div>
    </header >
    </>
  );
};
