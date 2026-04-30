import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono flex flex-col items-center py-8 px-4 selection:bg-magenta-600 selection:text-white relative overflow-hidden screen-flicker uppercase">
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines z-50"></div>
      
      {/* Screen tearing simulation boxes */}
      <div className="absolute top-[30%] left-[-10px] w-[50px] h-[5px] bg-magenta-500 blur-sm animate-[glitch-anim-1_4s_infinite]"></div>
      <div className="absolute bottom-[20%] right-[-10px] w-[80px] h-[3px] bg-cyan-500 blur-sm animate-[glitch-anim-2_3s_infinite]"></div>

      <header className="mb-8 text-center relative z-10 w-full max-w-6xl">
        <h1 
          className="text-5xl sm:text-6xl md:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-500 drop-shadow-[0_0_10px_magenta] glitch"
          data-text="SYSTEM.CORE_//_"
        >
          SYSTEM.CORE_//_
        </h1>
        <p className="text-magenta-500 mt-2 tracking-[0.3em] text-lg sm:text-xl font-bold bg-black/50 border border-magenta-500 p-2 inline-block shadow-[inset_0_0_10px_magenta]">
          [ AUDIO/SENSORY MODULE: ACTIVE. ]
        </p>
      </header>

      <div className="flex flex-col xl:flex-row gap-8 items-stretch xl:items-start justify-center max-w-7xl w-full relative z-10">
         <div className="flex-grow w-full max-w-3xl mx-auto xl:mx-0 shrink-0">
           <SnakeGame />
         </div>
         <div className="w-full max-w-xl mx-auto xl:mx-0 shrink-0 xl:w-[450px] flex flex-col justify-center">
           <MusicPlayer />
           
           <div className="mt-6 text-left text-cyan-700 text-sm border-l-4 border-cyan-700 pl-4 uppercase">
              <p>{'>> AUDIO STREAM ORIGIN: SOUNDHELIX.COM'}</p>
              <p>{'>> STATUS: ENCRYPTED'}</p>
           </div>
         </div>
      </div>
    </div>
  );
}
