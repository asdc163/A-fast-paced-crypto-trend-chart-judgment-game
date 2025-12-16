import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp, ArrowDown, Eye, Zap, Skull, Trophy, Clock } from 'lucide-react';
import CandleChart from './CandleChart';
import { Candle, GameState, Prediction, PlayerStats, LevelData } from '../types';
import { generateLevel } from '../services/marketGenerator';

interface GameScreenProps {
  onGameOver: (stats: PlayerStats) => void;
}

const TOTAL_CANDLES = 40;
const VISIBLE_CANDLES = 25;
const TIME_LIMIT_MS = 3000;
const MAX_LEVELS = 10;

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_MS);
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const [lastResult, setLastResult] = useState<'WIN' | 'LOSS' | null>(null);
  
  // Game Stats
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<boolean[]>([]);
  const [godsEyeUsed, setGodsEyeUsed] = useState(0);
  const [totalDecisionTime, setTotalDecisionTime] = useState(0);

  // Track used pattern IDs to prevent duplicates
  const [usedPatternIds, setUsedPatternIds] = useState<string[]>([]);

  // Cheat Mode
  const [cheatAvailable, setCheatAvailable] = useState(true);
  const [cheatActive, setCheatActive] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  // Initialize Round
  const startNewRound = useCallback(() => {
    // Generate level excluding already used IDs
    const data = generateLevel(TOTAL_CANDLES, VISIBLE_CANDLES, usedPatternIds);
    
    setLevelData(data);
    // Add new ID to used list (functional update to ensure latest state)
    setUsedPatternIds(prev => [...prev, data.id]);
    
    setGameState(GameState.PLAYING);
    setTimeLeft(TIME_LIMIT_MS);
    setCheatActive(false);
    setLastResult(null);
    startTimeRef.current = Date.now();
  }, [usedPatternIds]); // Depend on usedPatternIds

  // Initial load
  useEffect(() => {
    if (currentLevel === 1 && usedPatternIds.length === 0) {
        startNewRound();
    }
    return () => stopTimer();
  }, []); // Only run once on mount, let startNewRound handle subsequent logic

  // Timer Logic
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 100) {
            handleTimeout();
            return 0;
          }
          return prev - 100;
        });
      }, 100);
    }
    return () => stopTimer();
  }, [gameState]);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTimeout = () => {
    stopTimer();
    handleGuess(Prediction.NONE);
  };

  const handleGuess = (guess: Prediction) => {
    stopTimer();
    if (!levelData) return;

    const decisionTime = Date.now() - startTimeRef.current;
    setTotalDecisionTime(prev => prev + decisionTime);

    const isWin = guess === levelData.outcome;
    const isTimeout = guess === Prediction.NONE;

    if (isWin) {
      setLastResult('WIN');
      setScore(prev => prev + 1);
      setHistory(prev => [...prev, true]);
    } else {
      setLastResult('LOSS');
      setHistory(prev => [...prev, false]);
    }
    
    setGameState(GameState.REVEAL);
  };

  const handleNext = () => {
    if (currentLevel < MAX_LEVELS) {
      setCurrentLevel(prev => prev + 1);
      startNewRound();
    } else {
      // Game Over - Finished 10 levels
      onGameOver({
        score,
        totalLevels: MAX_LEVELS,
        history,
        godsEyeUsed,
        currentStreak: 0, // Legacy prop
        maxStreak: score, // Legacy prop mapping
        totalCorrect: score,
        totalGames: MAX_LEVELS,
        averageDecisionTimeMs: totalDecisionTime / MAX_LEVELS || 0
      });
    }
  };

  const activateGodsEye = () => {
    if (cheatAvailable && gameState === GameState.PLAYING) {
      setCheatActive(true);
      setCheatAvailable(false);
      setGodsEyeUsed(prev => prev + 1);
    }
  };

  const timerPercentage = (timeLeft / TIME_LIMIT_MS) * 100;
  
  // Cutout style helper
  const cutoutStyle = "border-4 border-black border-dashed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

  if (!levelData) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto p-4 relative font-sans">
      
      {/* Header / Stats */}
      <div className="flex justify-between items-end mb-4 bg-yellow-200 p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 relative z-50">
        <div className="flex flex-col">
          <span className="text-xs text-black font-black uppercase tracking-widest">ROUND</span>
          <span className="text-2xl font-black text-black">
            {currentLevel} <span className="text-sm text-slate-700">/ {MAX_LEVELS}</span>
          </span>
        </div>
        
        {/* Score Board */}
        <div className="flex gap-1">
            {Array.from({length: MAX_LEVELS}).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full border border-black ${
                    i < history.length 
                        ? (history[i] ? 'bg-green-500' : 'bg-red-500') 
                        : 'bg-slate-300'
                }`} />
            ))}
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs text-black font-black uppercase tracking-widest">SCORE</span>
          <span className="text-2xl font-black text-black">{score}</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className={`flex-grow bg-[#131722] rounded-xl overflow-hidden relative mb-4 ${cutoutStyle}`}>
        {/* Timeframe Label */}
        <div className="absolute top-2 left-2 z-30 bg-[#2A2E39] border border-slate-600 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono flex items-center gap-1 shadow-sm">
             <Clock size={10} /> 4H
             <span className="text-green-500">●</span>
        </div>

        <CandleChart 
          data={levelData.candles} 
          hiddenStartIndex={gameState === GameState.REVEAL ? -1 : VISIBLE_CANDLES}
          showPredictionLine={cheatActive ? levelData.outcome : null}
        />
        
        {/* Result Overlay & Explanation */}
        {gameState === GameState.REVEAL && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-20 animate-fade-in">
            
            {/* Outcome Title */}
            <div className={`text-4xl font-black transform rotate-[-5deg] border-4 p-4 rounded-lg shadow-[8px_8px_0px_0px_#fff] mb-6 bg-white 
                ${lastResult === 'WIN' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}`}>
              {lastResult === 'WIN' ? '發財啦! 🤑' : '被割了! 💀'}
            </div>

            {/* Technical Analysis Card */}
            <div className="bg-white border-2 border-black p-4 rounded-lg w-full max-w-xs shadow-[4px_4px_0px_0px_#888]">
                <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-1">
                    <span className="text-2xl">🧠</span>
                    <h3 className="font-black text-black text-lg">{levelData.patternName}</h3>
                </div>
                <p className="text-slate-800 font-bold text-sm leading-relaxed">
                    {levelData.explanation}
                </p>
            </div>

            <button 
              onClick={handleNext}
              className="mt-8 w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
               {currentLevel < MAX_LEVELS ? "下一關 ⏭️" : "看成績 🏆"}
            </button>
          </div>
        )}
      </div>

      {/* Timer Bar */}
      <div className="h-4 w-full bg-slate-300 rounded-full mb-6 overflow-hidden border-2 border-black relative">
        <div 
          className={`h-full ${timeLeft < 1000 ? 'bg-red-500' : 'bg-orange-400'} transition-all duration-100 ease-linear`} 
          style={{ width: `${timerPercentage}%` }}
        />
        {/* Spark effect */}
        <div className="absolute top-0 bottom-0 w-1 bg-white" style={{ left: `${timerPercentage}%` }}></div>
      </div>

      {/* Controls */}
      {gameState === GameState.PLAYING && (
        <div className="grid grid-cols-2 gap-4 relative">
          
          {/* God's Eye */}
          <button 
            onClick={activateGodsEye}
            disabled={!cheatAvailable}
            className={`absolute -top-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center transition-all z-10
              ${cheatAvailable 
                ? 'hover:scale-110 cursor-pointer' 
                : 'opacity-50 grayscale cursor-not-allowed'
              }
            `}
          >
            <div className={`p-3 rounded-full border-4 border-black bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] ${cheatActive ? 'animate-ping' : ''}`}>
                <Eye size={24} className="text-purple-600" />
            </div>
            <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded mt-1 border border-white">
                {cheatActive ? "天眼開啟" : "天眼通 (1次)"}
            </span>
          </button>

          {/* Buttons */}
          <button 
            onClick={() => handleGuess(Prediction.LONG)}
            className="h-28 rounded-xl bg-green-500 hover:bg-green-400 active:translate-y-2 active:shadow-none transition-all flex flex-col items-center justify-center border-b-8 border-r-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] group relative overflow-hidden"
          >
            <span className="text-4xl absolute top-2 right-2 opacity-20 rotate-12">🚀</span>
            <ArrowUp size={48} className="text-black stroke-[3px] group-hover:-translate-y-1 transition-transform" />
            <span className="font-black text-2xl text-black mt-1 stroke-white paint-order-stroke">漲 (Long)</span>
          </button>
          
          <button 
            onClick={() => handleGuess(Prediction.SHORT)}
            className="h-28 rounded-xl bg-red-500 hover:bg-red-400 active:translate-y-2 active:shadow-none transition-all flex flex-col items-center justify-center border-b-8 border-r-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] group relative overflow-hidden"
          >
             <span className="text-4xl absolute top-2 right-2 opacity-20 -rotate-12">💩</span>
            <ArrowDown size={48} className="text-black stroke-[3px] group-hover:translate-y-1 transition-transform" />
            <span className="font-black text-2xl text-black mt-1">跌 (Short)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GameScreen;