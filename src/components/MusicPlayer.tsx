import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Disc3, Music2, Volume2 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Drive (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
  { id: 2, title: 'Cyber City (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
  { id: 3, title: 'Synthwave Journey', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
];

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="bg-black border-2 border-cyan-500 p-6 shadow-[-4px_4px_0_magenta]">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-cyan-500/50">
        <h2 className="text-2xl font-black text-cyan-400 tracking-widest flex items-center gap-3 drop-shadow-[0_0_8px_cyan] uppercase glitch" data-text="AUDIO_INTERFACE_//">
          <Disc3 className={`w-6 h-6 ${isPlaying ? 'animate-spin text-magenta-500' : ''}`} style={{ animationDuration: '3s' }} />
          AUDIO_INTERFACE_//
        </h2>
        <Music2 className="text-cyan-500/50 w-6 h-6" />
      </div>

      <div className="mb-8 p-5 bg-black border-2 border-magenta-500 shadow-[inset_0_0_15px_rgba(255,0,255,0.2)] relative overflow-hidden">
        {/* Visual equalizer mock */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-12 flex items-end justify-center gap-1 opacity-40 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-1.5 bg-cyan-400 animate-pulse"
                style={{ 
                  height: `${Math.random() * 80 + 20}%`,
                  animationDuration: `${Math.random() * 0.3 + 0.1}s` 
                }}
              />
            ))}
          </div>
        )}

        <p className="text-xs text-magenta-500 uppercase tracking-[0.3em] mb-2 font-bold animate-pulse">{'>> DATA_STREAM_ACTIVE'}</p>
        <p className={`text-2xl font-bold text-cyan-400 truncate uppercase ${isPlaying ? 'drop-shadow-[2px_2px_0_magenta]' : 'opacity-70'}`}>
          {TRACKS[currentTrack].title}
        </p>
      </div>

      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex items-center justify-center gap-6 mb-8">
        <button
          onClick={prevTrack}
          className="p-3 text-cyan-400 bg-black border border-cyan-400 hover:bg-cyan-400 hover:text-black transition-all focus:outline-none shadow-[2px_2px_0_magenta] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          <SkipBack className="w-6 h-6 fill-current" />
        </button>

        <button
          onClick={togglePlay}
          className="p-4 bg-magenta-500 border border-magenta-500 text-black shadow-[4px_4px_0_cyan] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_cyan] transition-all focus:outline-none"
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 ml-1 fill-current" />}
        </button>

        <button
          onClick={nextTrack}
          className="p-3 text-cyan-400 bg-black border border-cyan-400 hover:bg-cyan-400 hover:text-black transition-all focus:outline-none shadow-[2px_2px_0_magenta] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          <SkipForward className="w-6 h-6 fill-current" />
        </button>
      </div>

      <div className="flex items-center gap-3 px-2 border border-magenta-500/30 p-2 bg-magenta-500/5">
        <Volume2 className="text-cyan-500/70 w-5 h-5" />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-black border border-cyan-400 appearance-none cursor-pointer accent-magenta-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
