import React, { useMemo } from 'react';
import { Candle } from '../types';

interface CandleChartProps {
  data: Candle[];
  width?: number;
  height?: number;
  hiddenStartIndex?: number; 
  showPredictionLine?: 'LONG' | 'SHORT' | null;
  className?: string;
}

const CandleChart: React.FC<CandleChartProps> = ({ 
  data, 
  hiddenStartIndex = -1,
  showPredictionLine = null,
  className = "" 
}) => {
  // TradingView Colors
  const TV_GREEN = '#089981';
  const TV_RED = '#F23645';
  const TV_BG = '#131722';
  const TV_GRID = '#2A2E39';
  const TV_TEXT = '#B2B5BE';

  const { minPrice, maxPrice, candlesToRender } = useMemo(() => {
    if (data.length === 0) return { minPrice: 0, maxPrice: 100, candlesToRender: [] };
    
    // Scale mostly based on visible data to keep the game fair and readable
    const visibleLimit = hiddenStartIndex > -1 ? hiddenStartIndex + 1 : data.length;
    const visibleData = data.slice(0, visibleLimit);
    
    let min = Infinity;
    let max = -Infinity;
    
    visibleData.forEach(c => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
    });

    // If revealing, ensure we don't clip the new candles if they went wild
    if (hiddenStartIndex === -1) {
         data.forEach(c => {
            if (c.low < min) min = c.low;
            if (c.high > max) max = c.high;
        });
    }

    const padding = (max - min) * 0.15; // Standard padding
    return {
      minPrice: min - padding,
      maxPrice: max + padding,
      candlesToRender: data
    };
  }, [data, hiddenStartIndex]);

  const getY = (price: number) => {
    const range = maxPrice - minPrice;
    if (range === 0) return 50;
    const percentage = (price - minPrice) / range;
    return 100 - (percentage * 100); 
  };

  const candleWidthPercent = 100 / data.length;
  const candleGap = 0.3; // Standard TV gap

  // Generate Grid Lines
  const gridLines = [20, 40, 60, 80];

  return (
    <div className={`w-full h-full relative ${className}`} style={{ backgroundColor: TV_BG }}>
      
      {/* TradingView Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        {gridLines.map((y, i) => (
           <line key={i} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke={TV_GRID} strokeWidth="1" />
        ))}
        {gridLines.map((x, i) => (
           <line key={i} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke={TV_GRID} strokeWidth="1" />
        ))}
      </svg>

      {/* Price Labels (Fake) for Pro feel */}
      <div className="absolute right-0 top-0 bottom-0 w-12 border-l border-slate-700 flex flex-col justify-between py-4 text-[10px] font-mono text-slate-400 px-1 pointer-events-none select-none">
          <span>{maxPrice.toFixed(0)}</span>
          <span>{((maxPrice+minPrice)/2).toFixed(0)}</span>
          <span>{minPrice.toFixed(0)}</span>
      </div>

      <svg className="w-full h-full relative z-10 pr-12" preserveAspectRatio="none" viewBox="0 0 100 100">
        {candlesToRender.map((candle, index) => {
          const isHidden = hiddenStartIndex > -1 && index >= hiddenStartIndex;
          const isBullish = candle.close >= candle.open;
          
          const fillColor = isBullish ? TV_GREEN : TV_RED;
          const strokeColor = fillColor; // Wicks match body color in TV usually
          
          const x = index * candleWidthPercent + (candleWidthPercent * candleGap / 2);
          const w = candleWidthPercent * (1 - candleGap);
          
          const yOpen = getY(candle.open);
          const yClose = getY(candle.close);
          const yHigh = getY(candle.high);
          const yLow = getY(candle.low);

          const bodyTop = Math.min(yOpen, yClose);
          const bodyHeight = Math.max(0.5, Math.abs(yOpen - yClose)); 

          return (
            <g key={index} opacity={isHidden ? 0 : 1}>
              {/* Wick - Fine line */}
              <line 
                x1={x + w/2} 
                y1={yHigh} 
                x2={x + w/2} 
                y2={yLow} 
                stroke={strokeColor} 
                strokeWidth="0.4" 
              />
              {/* Body */}
              <rect 
                x={x} 
                y={bodyTop} 
                width={w} 
                height={bodyHeight} 
                fill={fillColor} 
              />
            </g>
          );
        })}
        
        {/* Prediction Line / Last Price Line */}
        {hiddenStartIndex > -1 && (
           <line 
             x1={0} 
             y1={getY(data[hiddenStartIndex-1].close)}
             x2={100}
             y2={getY(data[hiddenStartIndex-1].close)}
             stroke="#FFFFFF"
             strokeWidth="0.5"
             strokeDasharray="2"
             opacity="0.5"
           />
        )}

        {/* Outcome Prediction Visual */}
        {showPredictionLine && hiddenStartIndex > -1 && (
           <line 
             x1={(hiddenStartIndex - 1) * candleWidthPercent} 
             y1={getY(data[hiddenStartIndex-1].close)}
             x2={100}
             y2={showPredictionLine === 'LONG' ? 10 : 90}
             stroke={showPredictionLine === 'LONG' ? TV_GREEN : TV_RED}
             strokeWidth="1.5"
             strokeDasharray="4"
             className="animate-pulse"
           />
        )}
      </svg>
      
      {/* Hidden Curtain - "Live" Status */}
      {hiddenStartIndex > -1 && (
        <div 
          className="absolute top-0 bottom-0 right-12 bg-[#131722]/95 border-l border-slate-600 flex flex-col items-center justify-center backdrop-blur-sm"
          style={{ width: `${100 - (hiddenStartIndex * candleWidthPercent)}%` }}
        >
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
             <span className="text-slate-400 font-mono text-xs">LIVE MARKET</span>
          </div>
          <div className="text-4xl animate-bounce">🙈</div>
        </div>
      )}
    </div>
  );
};

export default CandleChart;