import { PlayerStats, AiAnalysis } from "../types";

// Titles based on score tiers
const TITLES = {
    LOW: ["新鮮韭菜", "慈善家", "反指標", "被割的命", "公園住民"],
    MID: ["普通賭徒", "骰子手", "追高殺低", "震盪愛好者", "有點東西"],
    HIGH: ["華爾街之狼", "鑽石手", "趨勢大師", "少年股神", "鯨魚"],
    GOD: ["時光旅人", "馬斯克本人", "內線交易員", "未來的你", "交易所老闆"]
};

const QUOTES = {
    REKT: [
        "這操作...你是不是把「買入」鍵當成「捐款」鍵了？",
        "看來你很適合去當流動性提供者，專門提供虧損的那種。",
        "你的直覺很準，下次試著跟你的直覺反著做，應該就財富自由了。",
        "別灰心，公園的紙箱我已經幫你預訂好了，是雙層加厚的。",
        "憑實力虧的錢，為什麼要難過？這就是所謂的「無償貢獻」。"
    ],
    MID: [
        "中規中矩，賺的錢剛好夠付手續費，真是交易所的好朋友。",
        "看來你懂一點技術分析，但不多。大概就是剛學會看 K 線的程度。",
        "這勝率跟丟銅板差不多，建議下次直接丟銅板比較省時間。",
        "雖然沒有賠光，但也發不了財，這就是散戶的宿命。",
        "有賺有賠，這就是人生。但你的操作讓我想起了我的自動交易機器人...壞掉的那台。"
    ],
    HIGH: [
        "這勝率有點東西啊！是不是偷看了劇本？",
        "強！主力想割你都找不到下刀的地方，根本是泥鰍轉世。",
        "這操作行雲流水，你是看著 K 線長大的嗎？",
        "可以啊，這波操作比起巴菲特也就差了十萬八千里而已。",
        "交易所風控部門已經盯上你了，建議低調一點。"
    ],
    CHEAT: [
        "開天眼通還能輸？你這是在侮辱外掛嗎？",
        "使用了鈔能力（作弊），結果也就這樣？",
        "雖然你贏了，但你的良心不會痛嗎？喔對，你是幣圈人，沒有良心。",
        "靠作弊拿高分，就像騎腳踏車裝法拉利引擎，雖然快但很丟臉。",
        "天眼通好用嗎？下次記得付費訂閱 VIP 版。"
    ]
};

export const generateTradingPersonality = async (stats: PlayerStats): Promise<AiAnalysis> => {
  // Simulate network delay for effect
  await new Promise(resolve => setTimeout(resolve, 800));

  const score = stats.score;
  const isCheater = stats.godsEyeUsed > 0;
  const isFast = stats.averageDecisionTimeMs < 1500;
  
  // --- NEW DETERMINISTIC POWER LEVEL LOGIC ---
  // Base: Score * 10 (Max 100)
  let basePower = score * 10; 
  
  // Speed Bonus: If fast decision (<1.5s), add up to 5 points
  if (isFast) basePower += 5;

  // Streak/Perfection Bonus: If 9 or 10 score, boost to ensure high 90s
  if (score === 9) basePower = Math.max(basePower, 92);
  if (score === 10) basePower = Math.max(basePower, 98);

  // Cheat Penalty: -15 power (Honesty checks)
  if (isCheater) basePower -= 15;

  // Clamp 0-100
  let powerLevel = Math.min(100, Math.max(0, basePower));

  // Round it
  powerLevel = Math.round(powerLevel);

  // --- ARCHETYPE SELECTION ---
  let type = "韭菜";
  let title = "套牢專家";
  let description = "你這操作，完美詮釋了什麼叫「兩邊都套牢」的藝術！根本是天生的反指標。";

  if (score <= 3) {
      type = "韭菜";
      title = TITLES.LOW[Math.floor(Math.random() * TITLES.LOW.length)];
      description = QUOTES.REKT[Math.floor(Math.random() * QUOTES.REKT.length)];
  } else if (score <= 7) {
      type = "賭徒";
      title = TITLES.MID[Math.floor(Math.random() * TITLES.MID.length)];
      description = QUOTES.MID[Math.floor(Math.random() * QUOTES.MID.length)];
  } else if (score < 10) {
      type = "鯨魚";
      title = TITLES.HIGH[Math.floor(Math.random() * TITLES.HIGH.length)];
      description = QUOTES.HIGH[Math.floor(Math.random() * QUOTES.HIGH.length)];
  } else {
      type = "神";
      title = TITLES.GOD[Math.floor(Math.random() * TITLES.GOD.length)];
      description = "全對！？這不科學！你一定是莊家派來的間諜，或者是未來的時光旅人回來割韭菜的。";
  }

  // Modifiers
  if (isCheater) {
      type = "作弊仔";
      description = QUOTES.CHEAT[Math.floor(Math.random() * QUOTES.CHEAT.length)];
      title = "內線交易員";
      // Ensure cheaters can't get 100 even if perfect
      powerLevel = Math.min(powerLevel, 80); 
  } else if (score === 10) {
      // Perfect legit score = 100
      powerLevel = 100;
  }

  if (isFast && score > 5 && !isCheater) {
      description += " 而且你的手速快到像是在搶 ICO，單身很久了吧？";
  }

  return {
      title,
      description,
      powerLevel,
      archetype: type
  };
};