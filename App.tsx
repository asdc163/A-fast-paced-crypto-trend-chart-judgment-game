import React, { useState } from 'react';
import { TrendingUp, Lock, Cloud, Trees, Zap } from 'lucide-react';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import { GameState, PlayerStats } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [finalStats, setFinalStats] = useState<PlayerStats | null>(null);
  
  // Group Link
  const GROUP_LINK = "https://line.me/ti/g2/AN4zNkMc_Vp9ruHDF84aU4VEJnacHn7ITufMZg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default";

  const startGame = () => {
    setGameState(GameState.PLAYING);
  };

  const handleGameOver = (stats: PlayerStats) => {
    setFinalStats(stats);
    setGameState(GameState.GAME_OVER);
  };

  const restartGame = () => {
    setGameState(GameState.MENU);
    setFinalStats(null);
  };

  return (
    <div className="min-h-screen bg-[#87CEEB] text-slate-900 selection:bg-yellow-400 font-sans overflow-hidden relative">
      
      {/* --- South Park Style Background --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
         {/* Sky Gradient Overlay for texture */}
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')]"></div>

         {/* Sun */}
         <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-300 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"></div>

         {/* Clouds - Simple Cutouts */}
         <div className="absolute top-20 right-20 text-white opacity-90 transform scale-150 drop-shadow-lg">
            <Cloud size={64} fill="white" stroke="black" strokeWidth={2} />
         </div>
         <div className="absolute top-40 left-1/3 text-white opacity-90 transform scale-125 drop-shadow-lg">
            <Cloud size={48} fill="white" stroke="black" strokeWidth={2} />
         </div>

         {/* Mountains - Construction Paper Style */}
         <div className="absolute bottom-1/4 left-0 right-0 h-1/2 flex items-end justify-center">
             {/* Mountain 1 */}
             <div className="w-[600px] h-[400px] bg-purple-300 transform rotate-45 translate-y-1/2 -translate-x-1/2 border-l-4 border-t-4 border-black"></div>
             {/* Mountain 2 (Center) */}
             <div className="w-[700px] h-[500px] bg-purple-400 transform rotate-45 translate-y-1/3 border-l-4 border-t-4 border-black z-10">
                 {/* Snow Cap */}
                 <div className="absolute top-0 left-0 w-32 h-32 bg-white border-b-4 border-r-4 border-black"></div>
             </div>
             {/* Mountain 3 */}
             <div className="w-[600px] h-[450px] bg-purple-300 transform rotate-45 translate-y-1/2 translate-x-1/2 border-l-4 border-t-4 border-black"></div>
         </div>

         {/* Ground - The Snow */}
         <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-white border-t-4 border-black z-20"></div>

         {/* Road */}
         <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-600 border-t-4 border-black z-30">
             <div className="w-full h-full flex items-center justify-around">
                 <div className="w-20 h-2 bg-yellow-400"></div>
                 <div className="w-20 h-2 bg-yellow-400"></div>
                 <div className="w-20 h-2 bg-yellow-400"></div>
                 <div className="w-20 h-2 bg-yellow-400"></div>
                 <div className="w-20 h-2 bg-yellow-400"></div>
             </div>
         </div>

         {/* Simple Trees (Triangles) */}
         <div className="absolute bottom-1/3 left-10 z-20">
             <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[80px] border-b-green-700 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"></div>
             <div className="w-4 h-10 bg-amber-800 mx-auto border-l-2 border-r-2 border-black"></div>
         </div>
         <div className="absolute bottom-1/3 right-20 z-20">
             <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[100px] border-b-green-800 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"></div>
             <div className="w-6 h-12 bg-amber-800 mx-auto border-l-2 border-r-2 border-black"></div>
         </div>
      </div>

      <div className="relative z-40 h-screen flex flex-col">
        {/* Nav */}
        <nav className="w-full p-4 border-b-4 border-black bg-white/95 backdrop-blur flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-2">
            <div className="bg-black p-1.5 rounded-lg transform -rotate-3">
              <TrendingUp size={24} className="text-yellow-400" />
            </div>
            <h1 className="font-black tracking-tighter text-2xl italic transform skew-x-[-10deg]">
              <span className="text-green-600">多空</span>
              <span className="text-black mx-1">快手</span>
              <span className="text-red-500 text-sm block -mt-1 text-right">Crypto Edition</span>
            </h1>
          </div>
          <button 
             className="px-3 py-1 bg-red-500 text-white font-black text-xs rounded border-2 border-black hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_#000]"
             onClick={() => window.open(GROUP_LINK, '_blank')}
          >
            每日挑戰 🔒
          </button>
        </nav>

        {/* Content */}
        <main className="flex-grow flex flex-col overflow-hidden">
          {gameState === GameState.MENU && (
             <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8 animate-fade-in relative">
                
                {/* Title Card */}
                <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-2 max-w-sm relative">
                  {/* Pin */}
                  <div className="absolute -top-3 left-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-black z-50"></div>
                  
                  <h2 className="text-5xl font-black text-black mb-2 drop-shadow-sm">
                    Bull or Bear?
                  </h2>
                  <p className="text-slate-600 font-bold text-lg bg-yellow-200 inline-block px-2 transform -skew-x-12">
                     Crypto Trading Sim
                  </p>
                </div>

                <div className="relative group z-10">
                  <button 
                    onClick={startGame}
                    className="relative w-64 py-5 bg-green-500 text-white rounded-xl font-black text-2xl uppercase tracking-wider hover:scale-105 hover:bg-green-400 active:translate-y-1 active:shadow-none transition-all border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    開始賭博 🚀
                  </button>
                  {/* Funny tooltip */}
                  <div className="absolute -right-20 -top-8 bg-white border-2 border-black p-2 rounded-lg text-xs font-bold transform rotate-12 animate-bounce">
                      All In 100x!
                  </div>
                </div>

                {/* Crypto Trivia CTA - Replaces the hidden level box */}
                <a 
                   href={GROUP_LINK}
                   target="_blank"
                   rel="noreferrer"
                   className="block bg-white/90 p-4 rounded-xl border-4 border-black max-w-xs mx-auto shadow-lg transform -rotate-1 mt-8 hover:scale-105 transition-transform cursor-pointer group"
                >
                   <div className="flex items-center justify-center gap-2 text-blue-600 font-black mb-2 text-lg group-hover:underline">
                      <Zap size={20} fill="currentColor" />
                      <span>幣圈冷知識</span>
                   </div>
                   <p className="text-sm font-bold text-slate-800 text-left">
                     你知道比特幣曾在 2021/5/19 一天內腰斬 50% 嗎？
                   </p>
                   <div className="mt-2 text-xs font-black text-red-500 bg-yellow-100 border border-black inline-block px-2 py-0.5 transform rotate-1">
                      👉 點此進群獲取逃頂訊號
                   </div>
                </a>
             </div>
          )}

          {gameState === GameState.PLAYING && (
            <GameScreen onGameOver={handleGameOver} />
          )}

          {gameState === GameState.GAME_OVER && finalStats && (
            <ResultScreen stats={finalStats} onRestart={restartGame} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;