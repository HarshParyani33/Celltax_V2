import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Disc3, Mic, FileText } from 'lucide-react';
import { AUDIO_EVIDENCE_ITEMS } from '../data/findHerData';
import { soundFx } from '../utils/audio';

export const AudioPlayerWidget: React.FC = () => {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const currentTrack = AUDIO_EVIDENCE_ITEMS[selectedTrackIndex];

  // Animated reel rotation angle
  const [reelAngle, setReelAngle] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= currentTrack.durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
        setReelAngle((prev) => (prev + 30) % 360);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentTrack.durationSeconds]);

  const handlePlayToggle = () => {
    soundFx.playKeypress();
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    soundFx.playKeypress();
    setIsPlaying(false);
    setElapsedSeconds(0);
  };

  const handleSelectTrack = (idx: number) => {
    soundFx.playKeypress();
    setIsPlaying(false);
    setElapsedSeconds(0);
    setSelectedTrackIndex(idx);
  };

  const progressPercent = (elapsedSeconds / currentTrack.durationSeconds) * 100;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
      <div className="w-full bg-[#ffffff] border border-[#e8dcce] rounded-3xl shadow-gift p-6 sm:p-8 space-y-6 font-sans text-xs text-[#38261e]">

        {/* Top Deck Bar */}
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#f0e6dc] gap-2">
                <div className="flex items-center space-x-2 text-[#8c5e58]">
                  <Disc3 className={`w-5 h-5 text-[#c5a059] ${isPlaying ? 'animate-spin-slow' : ''}`} />
                  <span className="font-serif font-bold tracking-wider text-sm sm:text-base text-[#38261e]">
                    VINTAGE KEEPSAKE CASSETTE RECORDER
                  </span>
                </div>

                  <div className="px-3 py-1 rounded-full bg-[#fceeeb] border border-[#d99b9b]/40 text-[11px] text-[#8c5e58] flex items-center space-x-1.5 font-mono">
                    <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#9caf88] animate-ping' : 'bg-[#d99b9b]'}`} />
                    <span>{isPlaying ? 'PLAYBACK ACTIVE' : 'AUDIO DECK READY'}</span>
                  </div>
                </div>

                {/* Cassette Mechanical Window */}
                  <div className="relative bg-[#fbf8f4] border border-[#e8dcce] rounded-2xl p-4 sm:p-6 shadow-inner-dark">
                    {/* Cassette Label Header */}
                      <div className="bg-[#fdfbf7] texture-paper border border-[#e8dcce] text-[#38261e] px-4 py-2 rounded-xl font-serif font-bold text-xs flex justify-between items-center shadow-sm">
                        <div className="flex items-center space-x-2">
                          <Mic className="w-3.5 h-3.5 text-[#d99b9b]" />
                          <span>{currentTrack.cassetteLabel}</span>
                        </div>
                        <span className="font-mono text-[10px] text-[#8c5e58] font-normal uppercase">
                          {currentTrack.witnessIdentifier}
                        </span>
                      </div>

                        {/* Cassette Window with Rotating Spools */}
                        <div className="bg-[#ffffff] my-3 p-6 rounded-xl border border-[#e8dcce] flex items-center justify-around relative overflow-hidden shadow-sm">
                          {/* Left Spool */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#c5a059]/40 bg-[#faf6f0] flex items-center justify-center relative shadow-sm">
                              <div
                                className="w-12 h-12 rounded-full border-2 border-dashed border-[#c5a059] flex items-center justify-center"
                                style={{ transform: `rotate(${reelAngle}deg)`, transition: isPlaying ? 'transform 0.1s linear' : 'none' }}
                              >
                                <div className="w-3.5 h-3.5 rounded-full bg-[#8c5e58]" />
                              </div>
                            </div>

                            {/* Center Tape Window & Timecode */}
                                <div className="text-center px-5 py-2.5 bg-[#fdfaf5] rounded-xl border border-[#e8dcce] shadow-sm">
                                  <div className="text-xl sm:text-2xl font-mono font-bold text-[#38261e] tracking-wider">
                                    {formatTime(elapsedSeconds)} / {currentTrack.durationString}
                                  </div>
                                    <div className="text-[10px] font-mono text-[#7a685c] mt-0.5 uppercase tracking-wide">
                                      {isPlaying ? 'PLAYING RECORDING...' : 'PAUSED'}
                                    </div>
                                  </div>

                                  {/* Right Spool */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#c5a059]/40 bg-[#faf6f0] flex items-center justify-center relative shadow-sm">
                                      <div
                                        className="w-12 h-12 rounded-full border-2 border-dashed border-[#c5a059] flex items-center justify-center"
                                        style={{ transform: `rotate(${reelAngle}deg)`, transition: isPlaying ? 'transform 0.1s linear' : 'none' }}
                                      >
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#8c5e58]" />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Progress Bar */}
                                    <div className="w-full bg-[#f0e6dc] h-2 rounded-full overflow-hidden mt-3">
                                      <div
                                        className="bg-gradient-to-r from-[#d99b9b] to-[#9c5460] h-full transition-all duration-300 rounded-full"
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Mechanical Controls Bar */}
                                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                                      <div className="flex items-center space-x-2.5">
                                        <button
                                          type="button"
                                          onClick={handlePlayToggle}
                                          className={`px-5 py-2.5 rounded-full font-serif font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-sm ${
                                            isPlaying
                                              ? 'bg-[#8c5e58] hover:bg-[#724a44] text-white'
                                              : 'bg-gradient-to-r from-[#d99b9b] to-[#9c5460] hover:brightness-105 text-white'
                                          }`}
                                        >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>PLAY VOICE NOTE</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-full bg-[#fbf8f4] hover:bg-[#fceeeb] border border-[#e8dcce] text-[#7a685c] hover:text-[#38261e] transition-colors"
            title="Rewind to start"
            aria-label="Rewind audio to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Track Selection Buttons */}
        <div className="flex items-center space-x-2">
          {AUDIO_EVIDENCE_ITEMS.map((track, idx) => (
            <button
              key={track.id}
              type="button"
              onClick={() => handleSelectTrack(idx)}
                                          className = {`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all ${selectedTrackIndex === idx
                                                ? 'bg-[#c5a059] text-white shadow-sm'
                                                : 'bg-[#fbf8f4] hover:bg-[#fceeeb] text-[#7a685c] border border-[#e8dcce]'
                                            }`}
            >
                                        VOICE NOTE 0{idx + 1}
                                      </button>
          ))}
                                    </div>
                                  </div>

                                      {/* Transcript Card */}
                                      <div className="p-5 rounded-2xl bg-[#fdfbf7] texture-paper border border-[#e8dcce] space-y-2 shadow-sm">
                                        <div className="flex items-center space-x-2 text-[11px] font-mono text-[#8c5e58] font-bold uppercase tracking-wider">
                                          <FileText className="w-3.5 h-3.5 text-[#d99b9b]" />
                                          <span>VERBATIM SPOKEN TRANSCRIPT:</span>
                                        </div>
                                        <p className="font-handwriting text-lg sm:text-xl text-[#38261e] italic leading-relaxed">
                                          "{currentTrack.transcript}"
                                        </p>
                                      </div>

                                      {/* Helper Note for User Customization */}
                                      <div className="text-[11px] font-mono text-[#7a685c] bg-[#fbf8f4] p-3 rounded-xl border border-[#f0e6dc] flex items-center space-x-2">
                                        <Volume2 className="w-4 h-4 text-[#c5a059] shrink-0" />
                                        <span>Keepsake Voice Notes: Audio files can be added to <code className="text-[#8c5e58]">src/data/findHerData.ts</code>. Autoplay is strictly disabled to respect browser policies.</span>
                                      </div>

                                    </div>
                                    );
};
