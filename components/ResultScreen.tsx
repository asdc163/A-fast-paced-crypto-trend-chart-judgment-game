import React, { useEffect, useState, useRef } from 'react';
import { PlayerStats, AiAnalysis } from '../types';
import { generateTradingPersonality } from '../services/geminiService';
import { Share2, RotateCcw, Users, ArrowRight, Download } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';

interface ResultScreenProps {
  stats: PlayerStats;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ stats, onRestart }) => {
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    generateTradingPersonality(stats).then(setAnalysis);
  }, [stats]);

  // GROUP LINK
  const GROUP_LINK = "https://line.me/ti/g2/AN4zNkMc_Vp9ruHDF84aU4VEJnacHn7ITufMZg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default";

  // Data for the 'Battle Chart' (Radar)
  // Logic: 
  // Accuracy: Pure score %
  // Speed: Fast (<1s avg) = 100, Slow (>3s) = 0
  // Honor (武德): Did you cheat? Yes=0, No=100.
  // Mindset: Based on streak length.
  // Luck: Random.
  const chartData = [
    { subject: '準度', A: Math.round((stats.score / stats.totalLevels) * 100), fullMark: 100 },
    { subject: '手速', A: Math.min(100, Math.max(10, 130 - (stats.averageDecisionTimeMs / 25))), fullMark: 100 },
    { subject: '武德', A: stats.godsEyeUsed === 0 ? 100 : 10, fullMark: 100 }, // Renamed from Faith to Honor
    { subject: '心態', A: Math.min(100, (stats.score * 10) + (stats.score >= 5 ? 20 : 0)), fullMark: 100 },
    { subject: '運勢', A: 50 + Math.floor(Math.random() * 50), fullMark: 100 },
  ];

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);

    try {
        // Create screenshot
        const canvas = await html2canvas(cardRef.current, {
            scale: 2, // High res
            backgroundColor: '#87CEEB', // Match bg
            useCORS: true,
            logging: false
        });

        canvas.toBlob(async (blob) => {
            if (!blob) return;
            
            const file = new File([blob], 'bull-or-bear-stats.png', { type: 'image/png' });

            // Try native share first (Mobile)
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: '多空快手戰績',
                        text: `我在《多空快手》獲得稱號：${analysis?.title}！戰力 ${analysis?.powerLevel}！快來挑戰！`,
                    });
                } catch (err) {
                    console.log("Share failed or cancelled", err);
                }
            } else {
                // Fallback to download (Desktop)
                const link = document.createElement('a');
                link.download = 'bull-or-bear-stats.png';
                link.href = canvas.toDataURL();
                link.click();
                alert("圖片已下載！請手動發送給朋友炫耀！");
            }
        });
    } catch (e) {
        console.error("Screenshot failed", e);
        alert("截圖失敗，請手動截圖分享！");
    } finally {
        setIsSharing(false);
    }
  };

  if (!analysis) return <div className="p-10 text-center font-bold">正在計算你的交易人格...</div>;

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto p-4 overflow-y-auto font-sans bg-[#87CEEB] relative">
      
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(45deg, #000 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="relative z-10 pb-10">
          {/* --- CAPTURE AREA START --- */}
          <div ref={cardRef} className="p-4 bg-[#87CEEB]"> {/* Wrapper with BG for screenshot */}
            <div className="bg-[#fef9c3] p-5 rounded-xl border-4 border-black border-dashed shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4 text-center relative mt-4">
                
                <div className="absolute -top-4 -left-2 bg-red-600 text-white font-black px-3 py-1 border-2 border-black transform -rotate-6 text-sm shadow-sm">
                    AI 毒舌講評
                </div>

                <div className="mt-4 mb-2">
                    <span className="bg-black text-white px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest transform skew-x-[-10deg] inline-block border border-white">
                        TYPE: {analysis.archetype}
                    </span>
                </div>

                <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">
                    {analysis.title}
                </h2>

                <div className="bg-white/80 p-3 rounded border border-slate-300 shadow-inner">
                    <p className="text-slate-900 font-bold text-base leading-relaxed text-justify">
                        {analysis.description}
                    </p>
                </div>

                {/* Power Bar */}
                <div className="mt-4">
                    <div className="flex justify-between items-end mb-1 px-1">
                        <span className="font-black text-xs uppercase text-slate-500">Battle Power</span>
                        <span className="font-black text-xl italic">{analysis.powerLevel}</span>
                    </div>
                    <div className="w-full h-4 bg-slate-200 border-2 border-black rounded-full overflow-hidden">
                        <div 
                            className="h-full border-r-2 border-black"
                            style={{ 
                                width: `${analysis.powerLevel}%`,
                                background: 'linear-gradient(90deg, #ef4444, #eab308, #22c55e)' 
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Radar Chart (Pentagon) */}
            <div className="bg-white/90 border-4 border-black rounded-2xl p-2 mb-4 shadow-[4px_4px_0px_0px_#000] relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-0.5 rounded-full border-2 border-black z-10">
                    五維戰力圖
                </div>
                <div className="h-56 w-full -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#94a3b8" />
                        <PolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fill: '#000', fontSize: 12, fontWeight: 900 }} 
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Stats"
                            dataKey="A"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            fill="#6366f1"
                            fillOpacity={0.5}
                        />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Watermark for screenshot */}
            <div className="text-center text-xs font-bold opacity-50 text-slate-700 mt-2">
                play "Bull or Bear?" now!
            </div>
          </div>
          {/* --- CAPTURE AREA END --- */}

          {/* Strong CTA Button */}
          <div className="mb-4">
             <a 
                href={GROUP_LINK}
                target="_blank"
                rel="noreferrer"
                className="group relative block w-full"
             >
                <div className="absolute inset-0 bg-black rounded-xl translate-y-1.5 translate-x-1.5"></div>
                <div className="relative bg-[#fbbf24] hover:bg-[#fcd34d] border-4 border-black rounded-xl py-4 flex items-center justify-center gap-3 transition-transform active:translate-y-1 active:translate-x-1">
                    <div className="absolute -top-3 -right-3">
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border border-white"></span>
                        </span>
                    </div>
                    <Users size={24} className="text-black" />
                    <div className="text-left leading-none">
                        <div className="text-xs font-black uppercase tracking-wider text-black/70 mb-0.5">Limited Time</div>
                        <div className="text-xl font-black text-black">加入群組領取明牌</div>
                    </div>
                    <ArrowRight size={24} className="text-black group-hover:translate-x-1 transition-transform" />
                </div>
             </a>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={handleShare}
                disabled={isSharing}
                className="py-3 bg-white hover:bg-slate-50 text-black font-bold border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isSharing ? '生成中...' : <><Share2 size={18} /> 分享戰績</>}
            </button>
            <button 
                onClick={onRestart}
                className="py-3 bg-green-500 hover:bg-green-400 text-white font-black border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-2"
            >
                <RotateCcw size={18} />
                再來一局
            </button>
          </div>
      </div>
    </div>
  );
};

export default ResultScreen;