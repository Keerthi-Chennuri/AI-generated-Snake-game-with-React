import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RefreshCw, Gamepad2 } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving UP
const SPEED = 120; // ms per tick

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: -1, y: -1 }); // Will initialize on mount
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Use refs to prevent state staleness bugs during rapid directional inputs
  const directionRef = useRef(direction);
  const lastRenderedDirectionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: typeof snake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Make sure food doesn't appear on the snake
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    setFood(newFood);
  }, []);

  // Initialize food visually off-screen until started, or randomly
  useEffect(() => {
    generateFood(INITIAL_SNAKE);
  }, [generateFood]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    lastRenderedDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    generateFood(INITIAL_SNAKE);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent screen scrolling when using game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!gameStarted) {
        if (e.key === 'Enter' || e.key === ' ') {
          setGameStarted(true);
        }
        return;
      }

      if (e.key === ' ') {
        if (gameOver) {
          resetGame();
        } else {
          setIsPaused((p) => !p);
        }
        return;
      }

      if (isPaused || gameOver) return;

      const lastDir = lastRenderedDirectionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver, gameStarted, resetGame]);

  useEffect(() => {
    if (gameOver || isPaused || !gameStarted) return;

    const moveSnake = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        lastRenderedDirectionRef.current = currentDir;
        
        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          // Play a sound or visual effect here if we had one
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          generateFood(newSnake);
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    }, SPEED);

    return () => clearInterval(moveSnake);
  }, [food, gameOver, isPaused, gameStarted, highScore, generateFood]);

  return (
    <div className="bg-black border-2 border-magenta-500 p-6 shadow-[4px_4px_0_cyan] relative">
      <div className="flex justify-between items-center mb-6 border-b-2 border-magenta-500/50 pb-4">
        <div className="text-cyan-400 font-black text-xl md:text-2xl flex flex-col drop-shadow-[0_0_5px_cyan]">
          <span className="text-xs text-magenta-500 uppercase tracking-[0.2em] leading-none mb-1 font-bold flex items-center gap-1">
            <Gamepad2 className="w-4 h-4" /> SYS_SCORE
          </span>
          {score.toString().padStart(4, '0')}
        </div>
        <div className="text-magenta-500 font-black text-xl md:text-2xl flex flex-col items-end drop-shadow-[0_0_5px_magenta]">
          <span className="text-xs text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-1 leading-none mb-1 font-bold">
             <Trophy className="w-4 h-4" /> PEAK_MEM
          </span>
          {highScore.toString().padStart(4, '0')}
        </div>
      </div>

      {/* Game Board container */}
      <div className="relative mx-auto max-w-full">
        <div
          className="bg-black border-2 border-cyan-500 relative shadow-[inset_0_0_15px_rgba(0,255,255,0.3)]"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            aspectRatio: '1 / 1',
            width: '100%',
          }}
        >
          {/* Subtle grid lines background using pseudo-element or CSS background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{
               backgroundImage: `linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)`,
               backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
             }}
          />

          {/* Render Snake */}
          {snake.map((segment, i) => {
            const isHead = i === 0;
            return (
              <div
                key={i}
                className={`transition-all duration-75 ${
                  isHead 
                    ? 'bg-magenta-500 z-10' 
                    : 'bg-cyan-400'
                }`}
                style={{
                  gridColumn: segment.x + 1,
                  gridRow: segment.y + 1,
                  boxShadow: isHead 
                    ? '0 0 10px magenta' 
                    : '0 0 5px cyan',
                  transform: isHead ? 'scale(1.05)' : 'scale(0.95)',
                }}
              />
            );
          })}

          {/* Render Food */}
          {food.x >= 0 && (
            <div
              className="bg-[#00ffcc] animate-pulse z-0"
              style={{
                gridColumn: food.x + 1,
                gridRow: food.y + 1,
                boxShadow: '0 0 10px #00ffcc',
                transform: 'scale(0.8)',
              }}
            />
          )}
        </div>

        {/* Status Overlays */}
        {(!gameStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center border-2 border-magenta-500/50">
              {!gameStarted ? (
                <>
                    <h3 
                      className="text-4xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-magenta-500 mb-2 glitch"
                      data-text="SNAKE.EXE"
                    >
                      SNAKE.EXE
                    </h3>
                    <p className="text-cyan-400 text-sm mb-8 font-bold tracking-widest border border-cyan-500/50 p-2 bg-black/50">INPUT: WASD / ARROWS<br/>INTERRUPT: SPACE</p>
                    <button 
                      onClick={() => setGameStarted(true)} 
                      className="px-8 py-3 border-2 border-magenta-500 bg-black hover:bg-magenta-500 text-magenta-500 hover:text-black font-black tracking-[0.3em] shadow-[4px_4px_0_cyan] transition-all transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_cyan]"
                    >
                      EXECUTE
                    </button>
                </>
              ) : gameOver ? (
                <>
                    <h3 className="text-3xl md:text-4xl font-black text-red-500 mb-2 drop-shadow-[0_0_10px_red] tracking-widest uppercase glitch" data-text="FATAL ERROR">FATAL ERROR</h3>
                    <p className="text-xl text-magenta-500 font-bold mb-8 uppercase tracking-widest">TRACE_LOG: <span className="text-cyan-400">{score}</span></p>
                    <button 
                      onClick={resetGame} 
                      className="flex items-center gap-2 px-8 py-3 border-2 border-cyan-400 bg-black hover:bg-cyan-400 text-cyan-400 hover:text-black font-black tracking-[0.2em] shadow-[4px_4px_0_magenta] transition-all transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_magenta]"
                    >
                      <RefreshCw className="w-5 h-5 -ml-1" /> REBOOT
                    </button>
                </>
              ) : isPaused ? (
                <>
                    <h3 className="text-3xl font-black text-yellow-400 mb-8 drop-shadow-[0_0_10px_yellow] tracking-[0.3em] uppercase glitch" data-text="SYSHALT">SYSHALT</h3>
                    <button 
                      onClick={() => setIsPaused(false)} 
                      className="px-8 py-3 border-2 border-yellow-400 bg-black hover:bg-yellow-400 text-yellow-400 hover:text-black font-black tracking-[0.3em] shadow-[4px_4px_0_yellow] transition-all transform hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                      RESUME
                    </button>
                </>
              ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
