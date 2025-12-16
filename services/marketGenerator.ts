import { Candle, LevelData } from '../types';

/**
 * Text-Book Crypto Pattern Generator (Expanded Edition)
 * Includes historical events, classic technical patterns, and crypto-native movements.
 */

// Interpolation helper: Linear lerp
const lerp = (start: number, end: number, t: number) => {
    return start * (1 - t) + end * t;
};

// Add random noise to waypoints so the same pattern looks different every time
const perturbWaypoints = (waypoints: number[], intensity: number = 0.03): number[] => {
    return waypoints.map((val, index) => {
        if (index === 0) return val; // Keep start anchored
        const noise = (Math.random() - 0.5) * intensity;
        return val + noise;
    });
};

const generatePathFromWaypoints = (waypoints: number[], steps: number, noiseLevel: number): number[] => {
    const path: number[] = [];
    // Perturb the waypoints slightly for variety
    const variedWaypoints = perturbWaypoints(waypoints);
    
    const segments = variedWaypoints.length - 1;
    const stepsPerSegment = Math.floor(steps / segments);

    for (let i = 0; i < segments; i++) {
        const startVal = variedWaypoints[i];
        const endVal = variedWaypoints[i+1];
        
        for (let j = 0; j < stepsPerSegment; j++) {
            const t = j / stepsPerSegment;
            // Easing function for smoother turns
            const smoothT = t * t * (3 - 2 * t); 
            
            let val = lerp(startVal, endVal, smoothT);
            // Add fractal-like noise
            val += (Math.random() - 0.5) * noiseLevel;
            path.push(val);
        }
    }
    
    while(path.length < steps) {
        path.push(variedWaypoints[variedWaypoints.length-1]);
    }

    return path;
};

const createCandleFromPrice = (time: number, open: number, close: number, volatility: number): Candle => {
    const bodyHigh = Math.max(open, close);
    const bodyLow = Math.min(open, close);
    const wickUp = Math.random() * volatility * 0.8;
    const wickDown = Math.random() * volatility * 0.8;

    return {
        time,
        open,
        close,
        high: bodyHigh + wickUp,
        low: bodyLow - wickDown
    };
};

export const generateLevel = (totalCandles: number = 40, visibleCandles: number = 25, excludeIds: string[] = []): LevelData => {
    const TIMEFRAME = 4 * 60 * 60 * 1000; // 4H
    const basePrice = 20000 + Math.random() * 40000;
    const noiseLevel = 0.01; // Increased slightly for more "organic" feel

    /**
     * EXTENSIVE PATTERN DATABASE
     * Waypoints: 1.0 is start. Visible area ends roughly at index 6-7 if array length is 10.
     */
    const allPatterns = [
        // --- BULLISH (LONG) ---
        { 
            id: 'BULL_1', name: '圓弧底 (Rounding Bottom)', outcome: 'LONG', 
            desc: '主力吸籌完畢，曲線緩慢抬升，這是大行情的起點。🥣',
            waypoints: [1.0, 0.95, 0.92, 0.90, 0.90, 0.92, 0.95, 1.0, 1.08, 1.15]
        },
        { 
            id: 'BULL_2', name: '上升三角 (Ascending Triangle)', outcome: 'LONG', 
            desc: '高點壓力測試多次，低點不斷墊高，突破就在眼前！📐',
            waypoints: [1.0, 1.05, 1.02, 1.05, 1.03, 1.05, 1.04, 1.08, 1.12, 1.20]
        },
        { 
            id: 'BULL_3', name: '牛旗 (Bull Flag)', outcome: 'LONG', 
            desc: '旗桿拉升後的縮量回調，標準的中繼型態。🚩',
            waypoints: [1.0, 1.10, 1.08, 1.06, 1.05, 1.04, 1.12, 1.18, 1.25, 1.30]
        },
        {
            id: 'BULL_4', name: '雙重底 (Double Bottom)', outcome: 'LONG',
            desc: 'W底成型，右腳比左腳高，多頭強勢確認。✌️',
            waypoints: [1.0, 0.90, 1.0, 0.92, 1.05, 1.10, 1.15, 1.20, 1.25]
        },
        {
            id: 'BULL_5', name: 'V型反轉 (V-Shape Recovery)', outcome: 'LONG',
            desc: '312 式的恐慌拋售，隨後主力暴力拉回，空軍直接被爆倉。🚀',
            waypoints: [1.0, 0.9, 0.8, 0.7, 0.75, 0.9, 1.0, 1.1, 1.2, 1.3]
        },
        {
            id: 'BULL_6', name: '黃金坑 (Golden Pit)', outcome: 'LONG',
            desc: '挖坑洗盤！跌破支撐後迅速收回，這是為了甩掉散戶。🕳️',
            waypoints: [1.0, 1.02, 1.0, 0.98, 0.85, 0.95, 1.02, 1.10, 1.15, 1.2]
        },
        {
            id: 'BULL_7', name: '緩漲急跌 (Slow Grind Up)', outcome: 'LONG',
            desc: '趨勢向上，雖然中間有急跌洗盤，但大方向是多頭。📈',
            waypoints: [1.0, 1.02, 1.04, 1.01, 1.05, 1.08, 1.04, 1.10, 1.15, 1.20]
        },
        {
            id: 'BULL_8', name: '突破回踩 (Break & Retest)', outcome: 'LONG',
            desc: '突破關鍵壓力位後回踩確認支撐，這是最安全的買點。✅',
            waypoints: [1.0, 0.98, 1.05, 1.05, 1.05, 1.10, 1.05, 1.15, 1.25, 1.3]
        },
        {
            id: 'BULL_9', name: '杯柄型態 (Cup and Handle)', outcome: 'LONG',
            desc: '完美的杯身加上健康的柄部回調，準備噴出！☕',
            waypoints: [1.0, 0.95, 0.90, 0.90, 0.95, 1.0, 0.98, 0.98, 1.05, 1.15]
        },
        {
            id: 'BULL_10', name: '絕望中的反彈 (Disbelief)', outcome: 'LONG',
            desc: '在長期陰跌後出現的第一根放量陽線，新週期開始了。🌱',
            waypoints: [1.0, 0.9, 0.8, 0.75, 0.72, 0.70, 0.70, 0.85, 0.95, 1.05]
        },
        {
            id: 'BULL_11', name: '馬斯克推特 (Elon Candle)', outcome: 'LONG',
            desc: '毫無技術面可言，一根直線拉升，通常是因為某人換了頭像。🐶',
            waypoints: [1.0, 1.0, 1.01, 1.0, 1.0, 1.0, 1.3, 1.35, 1.4, 1.45]
        },
        {
            id: 'BULL_12', name: 'DeFi Summer', outcome: 'LONG',
            desc: '瘋狂的泡沫期，每天都是綠棒，回調就是買點。🦄',
            waypoints: [1.0, 1.1, 1.15, 1.25, 1.20, 1.35, 1.45, 1.55, 1.6, 1.7]
        },
        {
            id: 'BULL_13', name: '收斂末端 (Squeeze)', outcome: 'LONG',
            desc: '波動率極度壓縮，變盤在即，這次選擇向上！💥',
            waypoints: [1.0, 1.05, 0.98, 1.02, 0.99, 1.01, 1.0, 1.1, 1.2, 1.3]
        },

        // --- BEARISH (SHORT) ---
        { 
            id: 'BEAR_1', name: '頭肩頂 (Head & Shoulders)', outcome: 'SHORT', 
            desc: '右肩無力，頸線跌破，經典的派發型態。📉',
            waypoints: [1.0, 1.05, 1.0, 1.10, 1.0, 1.04, 0.98, 0.90, 0.85, 0.80]
        },
        { 
            id: 'BEAR_2', name: '下降三角 (Descending Triangle)', outcome: 'SHORT', 
            desc: '支撐位測試多次，反彈越來越弱，地版要塌了！🧱',
            waypoints: [1.0, 0.95, 0.98, 0.95, 0.97, 0.95, 0.96, 0.90, 0.85, 0.80]
        },
        { 
            id: 'BEAR_3', name: '熊旗 (Bear Flag)', outcome: 'SHORT', 
            desc: '急跌後的無力反彈，只是為了跌得更深。🏴',
            waypoints: [1.0, 0.90, 0.92, 0.94, 0.95, 0.85, 0.80, 0.75, 0.70, 0.65]
        },
        {
            id: 'BEAR_4', name: '雙重頂 (Double Top)', outcome: 'SHORT',
            desc: 'M頭確認，第二次攻高失敗，多頭力竭。🐻',
            waypoints: [1.0, 1.1, 1.0, 1.08, 0.95, 0.90, 0.85, 0.80, 0.75]
        },
        {
            id: 'BEAR_5', name: '畫門 (Bart Simpson)', outcome: 'SHORT',
            desc: '莊家收割多頭的經典手法，暴拉橫盤後暴跌歸零。🤡',
            waypoints: [1.0, 1.0, 1.2, 1.2, 1.2, 1.2, 1.0, 0.98, 0.95, 0.90]
        },
        {
            id: 'BEAR_6', name: '陰跌 (Slow Bleed)', outcome: 'SHORT',
            desc: '沒有像樣的反彈，鈍刀割肉，這是最折磨人的行情。🩸',
            waypoints: [1.0, 0.98, 0.96, 0.97, 0.95, 0.93, 0.94, 0.90, 0.88, 0.85]
        },
        {
            id: 'BEAR_7', name: '死亡螺旋 (Death Spiral)', outcome: 'SHORT',
            desc: 'LUNA 式的崩盤！信心潰散，價格呈指數級下跌。📉📉',
            waypoints: [1.0, 0.98, 0.95, 0.90, 0.80, 0.60, 0.40, 0.20, 0.10, 0.05]
        },
        {
            id: 'BEAR_8', name: '假突破 (Fakeout)', outcome: 'SHORT',
            desc: '誘多！突破壓力位後迅速跌回，多軍被關門打狗。🐕',
            waypoints: [1.0, 1.02, 1.04, 1.05, 1.15, 1.05, 0.95, 0.90, 0.85, 0.80]
        },
        {
            id: 'BEAR_9', name: '圓弧頂 (Rounding Top)', outcome: 'SHORT',
            desc: '多頭動能耗盡，趨勢緩慢轉向，溫水煮青蛙。🐸',
            waypoints: [1.0, 1.05, 1.08, 1.08, 1.05, 1.0, 0.95, 0.90, 0.85, 0.80]
        },
        {
            id: 'BEAR_10', name: '519 大崩盤', outcome: 'SHORT',
            desc: '恐慌性拋售，單日腰斬，所有支撐都像紙一樣糊。📉',
            waypoints: [1.0, 0.98, 0.95, 0.95, 0.90, 0.85, 0.60, 0.55, 0.50, 0.55]
        },
        {
            id: 'BEAR_11', name: '死貓跳 (Dead Cat Bounce)', outcome: 'SHORT',
            desc: '暴跌後的技術性反彈，別追，這是逃命波！🐈',
            waypoints: [1.0, 0.8, 0.75, 0.85, 0.82, 0.70, 0.60, 0.50, 0.45, 0.40]
        },
        {
            id: 'BEAR_12', name: '流動性枯竭 (Illiquidity)', outcome: 'SHORT',
            desc: '階梯式下跌，每一個台階都是散戶的血淚。🪜',
            waypoints: [1.0, 0.9, 0.9, 0.8, 0.8, 0.7, 0.7, 0.6, 0.6, 0.5]
        },
        {
            id: 'BEAR_13', name: 'FTX 暴雷', outcome: 'SHORT',
            desc: '劇烈震盪後突然斷崖式下跌，交易所跑路了！🏦',
            waypoints: [1.0, 1.05, 0.95, 1.05, 0.98, 1.02, 0.5, 0.4, 0.3, 0.2]
        }
    ];

    // Filter out used patterns
    let available = allPatterns.filter(p => !excludeIds.includes(p.id));
    
    // Safety fallback: if we somehow used all patterns, reset pool
    if (available.length === 0) {
        available = allPatterns;
    }

    const pattern = available[Math.floor(Math.random() * available.length)];

    // Generate path with perturbation
    const pathValues = generatePathFromWaypoints(pattern.waypoints, totalCandles + 1, noiseLevel);

    const candles: Candle[] = [];
    let currentTime = Date.now() - totalCandles * TIMEFRAME;

    for (let i = 0; i < totalCandles; i++) {
        const p1 = pathValues[i] * basePrice;
        const p2 = pathValues[i+1] * basePrice;
        
        const open = i === 0 ? p1 : candles[i-1].close;
        const close = p2;
        
        // Dynamic volatility based on movement
        const moveSize = Math.abs(open - close);
        const candleVol = moveSize * 0.3 + (basePrice * 0.003); 

        candles.push(createCandleFromPrice(currentTime, open, close, candleVol));
        currentTime += TIMEFRAME;
    }

    return {
        id: pattern.id,
        candles,
        outcome: pattern.outcome as 'LONG' | 'SHORT',
        patternName: pattern.name,
        explanation: pattern.desc
    };
};