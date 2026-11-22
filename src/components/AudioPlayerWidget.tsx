import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Mic, AlertCircle, Radio } from 'lucide-react';
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
    <div className="w-full bg-[#121c16] border-2 border-brass/50 rounded-lg shadow-dossier p-5 sm:p-7 space-y-6 font-mono text-xs text-investigation-text">
      
      {/* Top Deck Bar */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-investigation-border gap-2">
        <div className="flex items-center space-x-2 text-brass">
          <Radio className="w-4 h-4 animate-pulse" />
          <span className="font-bold tracking-widest uppercase">
            VINTAGE EVIDENCE TAPE RECORDER // MODEL 012-VOX
          </span>
        </div>

        <div className="px-2.5 py-1 rounded bg-investigation-surface border border-brass/30 text-[10px] text-brass-light flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>ANALOG SURVEILLANCE DECK</span>
        </div>
      </div>

      {/* Cassette Mechanical Window */}
      <div className="relative bg-[#090f0c] border border-investigation-border/80 rounded-md p-4 sm:p-6 shadow-inner-dark">
        {/* Cassette Label Header */}
        <div className="bg-[#e8dcbe] text-[#1d1a16] px-3 py-1.5 rounded-t font-serif font-bold text-xs flex justify-between items-center shadow-sm">
          <span>{currentTrack.cassetteLabel}</span>
          <span className="font-mono text-[10px] text-[#715c32]">{currentTrack.witnessIdentifier}</span>
        </div>

        {/* Cassette Window with Spools */}
        <div className="bg-[#18231c] p-6 rounded-b border border-t-0 border-[#baa77e]/40 flex items-center justify-around relative overflow-hidden">
          {/* Left Spool */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-brass/40 bg-charcoal-900 flex items-center justify-center relative shadow-md">
            <div
              className="w-12 h-12 rounded-full border-2 border-dashed border-brass/60 flex items-center justify-center"
              style={{ transform: `rotate(${reelAngle}deg)`, transition: isPlaying ? 'transform 0.1s linear' : 'none' }}
            >
              <div className="w-4 h-4 rounded-full bg-brass/80" />
            </div>
          </div>

          {/* Center Tape Window & Timecode */}
          <div className="text-center px-4 py-2 bg-black/60 rounded border border-investigation-border">
            <div className="text-lg sm:text-2xl font-mono font-bold text-brass-light tracking-wider">
              {formatTime(elapsedSeconds)} / {currentTrack.durationString}
            </div>
            <div className="text-[10px] text-investigation-muted mt-0.5">
              {isPlaying ? 'PLAYING TAPE AUDIO...' : 'TAPE PAUSED'}
            </div>
          </div>

          {/* Right Spool */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-brass/40 bg-charcoal-900 flex items-center justify-center relative shadow-md">
            <div
              className="w-12 h-12 rounded-full border-2 border-dashed border-brass/60 flex items-center justify-center"
              style={{ transform: `rotate(${reelAngle}deg)`, transition: isPlaying ? 'transform 0.1s linear' : 'none' }}
            >
              <div className="w-4 h-4 rounded-full bg-brass/80" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-charcoal-900 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="bg-brass h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Mechanical Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePlayToggle}
            className={`px-5 py-2.5 rounded font-mono font-bold text-xs uppercase transition-all flex items-center space-x-2 shadow-brass-sm ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-brass hover:bg-brass-light text-charcoal-900'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>PAUSE TAPE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>PLAY DISPATCH</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded bg-investigation-surface border border-investigation-border hover:border-brass/40 text-investigation-muted hover:text-parchment"
            title="Rewind Tape"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Track Selector Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {AUDIO_EVIDENCE_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectTrack(idx)}
              className={`px-3 py-1.5 rounded text-[11px] font-mono transition-colors ${
                selectedTrackIndex === idx
                  ? 'bg-investigation-highlight text-brass-light border border-brass/50 font-bold'
                  : 'bg-investigation-surface border border-investigation-border text-investigation-muted hover:text-parchment'
              }`}
            >
              TAPE 0{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Tape Transcript & Forensic Observation */}
      <div className="space-y-3 pt-3 border-t border-investigation-border/60">
        <div>
          <span className="text-[10px] text-brass uppercase tracking-wider block mb-1">
            VERBATIM AUDIO TRANSCRIPT:
          </span>
          <p className="font-serif italic text-sm text-parchment bg-investigation-card/60 p-3.5 rounded border border-investigation-border leading-relaxed">
            "{currentTrack.transcript}"
          </p>
        </div>

        <div className="flex items-start space-x-2 text-[11px] text-investigation-muted">
          <Mic className="w-3.5 h-3.5 text-brass shrink-0 mt-0.5" />
          <span>{currentTrack.forensicObservation}</span>
        </div>

        {/* Honest Placeholder Audio State Notice */}
        <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/40 text-[10px] text-amber-200/80 flex items-start space-x-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>AUDIO PLACEHOLDER ACTIVE:</strong> Actual voice note files can be supplied into <code className="text-amber-300">src/data/findHerData.ts</code>. The player currently demonstrates mechanical playback and transcription.
          </span>
        </div>
      </div>

    </div>
  );
};
