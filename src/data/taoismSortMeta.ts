export type CatalogSortMode = 'importance' | 'chronology' | 'hierarchy';

export interface FigureSortMeta {
  importanceRank: number; // 1..60 (1 = highest cultural & canonical importance)
  chronologyOrder: number; // 1..60 (1 = earliest mythological/historical origin -> 60 = Ming-Qing culmination)
  chronologyPeriod: string; // concise period tag shown when sorted chronologically
}

export interface GallerySortMeta {
  importanceRank: number; // 1..64
  chronologyOrder: number; // 1..64
  chronologyPeriod: string;
}

export const SORT_MODE_OPTIONS: {
  id: CatalogSortMode;
  label: string;
  description: string;
}[] = [
  {
    id: 'importance',
    label: '按重要顺序',
    description: '依道教至高尊位与历史文化核心影响力排序',
  },
  {
    id: 'chronology',
    label: '按时间顺序',
    description: '依太初神话、先秦诸子至秦汉唐宋明清历史年代排序',
  },
  {
    id: 'hierarchy',
    label: '按正统神阶',
    description: '依八重真灵位业（三清→上古→六御→星冥→先秦→祖师→护法→八仙）排序',
  },
];

/**
 * 60 Taoist figures' verified Importance Rank (1..60) & Historical Chronology Order (1..60).
 * Every figure ID in TAOIST_FIGURES has a unique importanceRank and unique chronologyOrder.
 */
export const FIGURE_SORT_META: Record<string, FigureSortMeta> = {
  // === 三清至圣 ===
  'yuanshi-tianzun': {
    importanceRank: 1,
    chronologyOrder: 27,
    chronologyPeriod: '南北朝定型 · 《真灵位业图》尊首',
  },
  'lingbao-tianzun': {
    importanceRank: 2,
    chronologyOrder: 28,
    chronologyPeriod: '南北朝定型 · 上清灵宝三洞',
  },
  'daode-tianzun': {
    importanceRank: 3,
    chronologyOrder: 29,
    chronologyPeriod: '东汉南北朝 · 太上老君神格化',
  },

  // === 核心始祖与最高天帝 ===
  laozi: {
    importanceRank: 4,
    chronologyOrder: 12,
    chronologyPeriod: '春秋晚期 · 约前571—前471',
  },
  'yuhuang-dadi': {
    importanceRank: 5,
    chronologyOrder: 42,
    chronologyPeriod: '北宋盛封 · 1116年敕封玉皇',
  },
  pangu: {
    importanceRank: 6,
    chronologyOrder: 1,
    chronologyPeriod: '太初创世 · 盘古开天辟地',
  },
  'fuxi-nuwa': {
    importanceRank: 7,
    chronologyOrder: 2,
    chronologyPeriod: '上古三皇 · 八卦与补天造人',
  },
  'xuanyuan-huangdi': {
    importanceRank: 8,
    chronologyOrder: 4,
    chronologyPeriod: '上古五帝 · 轩辕黄帝问道',
  },
  'zhang-daoling': {
    importanceRank: 9,
    chronologyOrder: 21,
    chronologyPeriod: '东汉 · 34—156（142年立教）',
  },

  // === 先秦巨擘、先天二祖与六御核心 ===
  zhuangzi: {
    importanceRank: 10,
    chronologyOrder: 16,
    chronologyPeriod: '战国中期 · 约前369—前286',
  },
  xiwangmu: {
    importanceRank: 11,
    chronologyOrder: 8,
    chronologyPeriod: '先秦上古 · 《山海经》瑶池金母',
  },
  dongwanggong: {
    importanceRank: 12,
    chronologyOrder: 18,
    chronologyPeriod: '秦汉定型 · 东华木公',
  },
  'ziwei-dadi': {
    importanceRank: 13,
    chronologyOrder: 43,
    chronologyPeriod: '唐宋定型 · 四御北极紫微',
  },
  'houtu-huangdiqi': {
    importanceRank: 14,
    chronologyOrder: 7,
    chronologyPeriod: '上古三代 · 皇天后土祭典',
  },
  'taiyi-jiuku': {
    importanceRank: 15,
    chronologyOrder: 46,
    chronologyPeriod: '唐宋盛行 · 东极青华济度',
  },

  // === 其余六御、护国尊神与各大宗派宗师 ===
  'nanji-changsheng': {
    importanceRank: 16,
    chronologyOrder: 45,
    chronologyPeriod: '北宋定型 · 神霄长生大帝',
  },
  'gouchen-tianhuang': {
    importanceRank: 17,
    chronologyOrder: 44,
    chronologyPeriod: '唐宋定型 · 四御勾陈天皇',
  },
  'zhenwu-dadi': {
    importanceRank: 18,
    chronologyOrder: 56,
    chronologyPeriod: '明代极盛 · 永乐大建武当',
  },
  'wang-chongyang': {
    importanceRank: 19,
    chronologyOrder: 51,
    chronologyPeriod: '金代 · 1113—1170（全真创教）',
  },
  'lu-dongbin': {
    importanceRank: 20,
    chronologyOrder: 38,
    chronologyPeriod: '唐末 · 约796—？（纯阳吕祖）',
  },
  'ge-hong': {
    importanceRank: 21,
    chronologyOrder: 26,
    chronologyPeriod: '东晋 · 283—363（《抱朴子》）',
  },
  'tao-hongjing': {
    importanceRank: 22,
    chronologyOrder: 31,
    chronologyPeriod: '南朝齐梁 · 456—536（茅山宗）',
  },
  'qiu-chuji': {
    importanceRank: 23,
    chronologyOrder: 52,
    chronologyPeriod: '金元 · 1148—1227（西行止杀）',
  },
  'zhang-sanfeng': {
    importanceRank: 24,
    chronologyOrder: 55,
    chronologyPeriod: '元末明初 · 约1247—1458',
  },

  // === 五老、星官雷部与上古先秦关键人物 ===
  'wufang-wulao': {
    importanceRank: 25,
    chronologyOrder: 30,
    chronologyPeriod: '魏晋南北朝 · 灵宝五老真文',
  },
  'doumu-yuanjun': {
    importanceRank: 26,
    chronologyOrder: 48,
    chronologyPeriod: '宋元盛行 · 众星之母斗姆',
  },
  'sanguan-dadi': {
    importanceRank: 27,
    chronologyOrder: 22,
    chronologyPeriod: '东汉定型 · 三官手书',
  },
  'leizu-puhua': {
    importanceRank: 28,
    chronologyOrder: 47,
    chronologyPeriod: '北宋定型 · 神霄雷部主宰',
  },
  'donghuang-taiyi': {
    importanceRank: 29,
    chronologyOrder: 17,
    chronologyPeriod: '战国秦汉 · 《九歌》甘泉太一',
  },
  'jiang-ziya': {
    importanceRank: 30,
    chronologyOrder: 11,
    chronologyPeriod: '商末周初 · 约前1156—前1017',
  },
  'yin-xi': {
    importanceRank: 31,
    chronologyOrder: 13,
    chronologyPeriod: '春秋末期 · 函谷迎老子',
  },
  liezi: {
    importanceRank: 32,
    chronologyOrder: 14,
    chronologyPeriod: '战国前期 · 约前450—前375',
  },

  // === 天师药王、易学南宗与重要正神 ===
  'sida-tianshi-san': {
    importanceRank: 33,
    chronologyOrder: 25,
    chronologyPeriod: '三国东晋 · 葛玄许逊与萨祖',
  },
  'sun-simiao': {
    importanceRank: 34,
    chronologyOrder: 32,
    chronologyPeriod: '隋唐 · 约541—682（药王）',
  },
  'zhang-boduan': {
    importanceRank: 35,
    chronologyOrder: 41,
    chronologyPeriod: '北宋 · 984—1082（南宗初祖）',
  },
  'chen-tuan': {
    importanceRank: 36,
    chronologyOrder: 39,
    chronologyPeriod: '五代宋初 · 871—989（华山希夷）',
  },
  guiguzi: {
    importanceRank: 37,
    chronologyOrder: 15,
    chronologyPeriod: '战国中期 · 云梦鬼谷授徒',
  },
  'dongyue-fengdu': {
    importanceRank: 38,
    chronologyOrder: 23,
    chronologyPeriod: '汉魏定型 · 泰山与罗酆冥司',
  },
  'jiutian-xuannv': {
    importanceRank: 39,
    chronologyOrder: 6,
    chronologyPeriod: '上古五帝 · 涿鹿降授兵法',
  },
  'guansheng-dijun': {
    importanceRank: 40,
    chronologyOrder: 59,
    chronologyPeriod: '宋明累封 · 三界伏魔大帝',
  },
  'wenchang-dijun': {
    importanceRank: 41,
    chronologyOrder: 54,
    chronologyPeriod: '元代敕封 · 梓潼文昌司禄',
  },
  'zhao-gongming': {
    importanceRank: 42,
    chronologyOrder: 24,
    chronologyPeriod: '魏晋著录 · 玄坛武财神',
  },

  // === 上古高仙、南五祖、护法战神与海岳慈母 ===
  guangchengzi: {
    importanceRank: 43,
    chronologyOrder: 5,
    chronologyPeriod: '上古五帝 · 崆峒山古仙',
  },
  'bai-yuchan': {
    importanceRank: 44,
    chronologyOrder: 53,
    chronologyPeriod: '南宋 · 1194—1229（南五祖）',
  },
  'wang-lingguan': {
    importanceRank: 45,
    chronologyOrder: 50,
    chronologyPeriod: '北宋明初 · 山门第一护法',
  },
  'erlang-shen': {
    importanceRank: 46,
    chronologyOrder: 19,
    chronologyPeriod: '秦汉溯源 · 灌口显圣真君',
  },
  'nezha-taizi': {
    importanceRank: 47,
    chronologyOrder: 58,
    chronologyPeriod: '宋明定型 · 中坛元帅',
  },
  'li-jing': {
    importanceRank: 48,
    chronologyOrder: 37,
    chronologyPeriod: '唐宋融合 · 托塔李天王',
  },
  mazu: {
    importanceRank: 49,
    chronologyOrder: 40,
    chronologyPeriod: '北宋 · 960—987（湄洲妈祖）',
  },
  'bixia-yuanjun': {
    importanceRank: 50,
    chronologyOrder: 57,
    chronologyPeriod: '宋明鼎盛 · 泰山碧霞元君',
  },
  'han-zhongli': {
    importanceRank: 51,
    chronologyOrder: 34,
    chronologyPeriod: '唐代传说 · 北五祖正阳祖师',
  },
  'tieguai-li': {
    importanceRank: 52,
    chronologyOrder: 33,
    chronologyPeriod: '唐代传说 · 八仙之首',
  },

  // === 上古养生、星官月府、民俗福寿与八仙群真 ===
  chisongzi: {
    importanceRank: 53,
    chronologyOrder: 3,
    chronologyPeriod: '上古神农 · 雨师赤松子',
  },
  pengzu: {
    importanceRank: 54,
    chronologyOrder: 10,
    chronologyPeriod: '商周之际 · 养生鼻祖彭祖',
  },
  'taibai-jinxing': {
    importanceRank: 55,
    chronologyOrder: 20,
    chronologyPeriod: '秦汉星官 · 长庚太白星君',
  },
  'taiyin-change': {
    importanceRank: 56,
    chronologyOrder: 9,
    chronologyPeriod: '上古神话 · 广寒太阴嫦娥',
  },
  'fulushou-stars': {
    importanceRank: 57,
    chronologyOrder: 60,
    chronologyPeriod: '明清鼎盛 · 民俗三星高照',
  },
  yuelao: {
    importanceRank: 58,
    chronologyOrder: 36,
    chronologyPeriod: '唐代定型 · 《续玄怪录》月老',
  },
  'he-xiangu': {
    importanceRank: 59,
    chronologyOrder: 35,
    chronologyPeriod: '唐代传说 · 增城八仙女仙',
  },
  'eight-immortals-four': {
    importanceRank: 60,
    chronologyOrder: 49,
    chronologyPeriod: '唐宋元定型 · 上洞八仙合流',
  },
};

/**
 * Maps each of the 60 portrait plates (plate-05..plate-64) to its corresponding TaoistFigure ID,
 * ensuring Gallery sorting mirrors Pantheon sorting 1-to-1 while slotting the 4 landmark plates
 * (plate-01..plate-04) into their exact historical & importance positions.
 */
const PLATE_TO_FIGURE_ID: Record<string, string> = {
  'plate-05': 'yuanshi-tianzun',
  'plate-06': 'lingbao-tianzun',
  'plate-07': 'daode-tianzun',
  'plate-08': 'pangu',
  'plate-09': 'fuxi-nuwa',
  'plate-10': 'xuanyuan-huangdi',
  'plate-11': 'donghuang-taiyi',
  'plate-12': 'yuhuang-dadi',
  'plate-13': 'ziwei-dadi',
  'plate-14': 'gouchen-tianhuang',
  'plate-15': 'houtu-huangdiqi',
  'plate-16': 'nanji-changsheng',
  'plate-17': 'taiyi-jiuku',
  'plate-18': 'dongwanggong',
  'plate-19': 'xiwangmu',
  'plate-20': 'wufang-wulao',
  'plate-21': 'doumu-yuanjun',
  'plate-22': 'sanguan-dadi',
  'plate-23': 'leizu-puhua',
  'plate-24': 'taibai-jinxing',
  'plate-25': 'taiyin-change',
  'plate-26': 'dongyue-fengdu',
  'plate-27': 'guangchengzi',
  'plate-28': 'chisongzi',
  'plate-29': 'pengzu',
  'plate-30': 'jiang-ziya',
  'plate-31': 'laozi',
  'plate-32': 'yin-xi',
  'plate-33': 'guiguzi',
  'plate-34': 'liezi',
  'plate-35': 'zhuangzi',
  'plate-36': 'zhang-daoling',
  'plate-37': 'sida-tianshi-san',
  'plate-38': 'ge-hong',
  'plate-39': 'tao-hongjing',
  'plate-40': 'sun-simiao',
  'plate-41': 'chen-tuan',
  'plate-42': 'zhang-boduan',
  'plate-43': 'wang-chongyang',
  'plate-44': 'qiu-chuji',
  'plate-45': 'bai-yuchan',
  'plate-46': 'zhang-sanfeng',
  'plate-47': 'zhenwu-dadi',
  'plate-48': 'jiutian-xuannv',
  'plate-49': 'li-jing',
  'plate-50': 'erlang-shen',
  'plate-51': 'nezha-taizi',
  'plate-52': 'wang-lingguan',
  'plate-53': 'zhao-gongming',
  'plate-54': 'wenchang-dijun',
  'plate-55': 'guansheng-dijun',
  'plate-56': 'fulushou-stars',
  'plate-57': 'yuelao',
  'plate-58': 'bixia-yuanjun',
  'plate-59': 'mazu',
  'plate-60': 'tieguai-li',
  'plate-61': 'han-zhongli',
  'plate-62': 'lu-dongbin',
  'plate-63': 'he-xiangu',
  'plate-64': 'eight-immortals-four',
};

const LANDMARK_PLATE_SLOTS: Record<
  string,
  { importanceKey: number; chronologyKey: number; chronologyPeriod: string }
> = {
  'plate-01': {
    importanceKey: 4.5, // Right beside 老子 (#4) & 玉皇 (#5)
    chronologyKey: 12.5, // 春秋晚期《道德经》
    chronologyPeriod: '春秋晚期 · 五千言《道德经》',
  },
  'plate-02': {
    importanceKey: 9.5, // Right beside 张道陵 (#9)
    chronologyKey: 21.5, // 东汉142年鹤鸣山立教
    chronologyPeriod: '东汉 · 142年鹤鸣山立教',
  },
  'plate-03': {
    importanceKey: 20.5, // Tang golden age beside 吕洞宾/葛洪
    chronologyKey: 32.5, // 盛唐尊道楼观台
    chronologyPeriod: '盛唐 · 666年楼观台尊道',
  },
  'plate-04': {
    importanceKey: 18.5, // Right beside 真武大帝 (#18)
    chronologyKey: 56.5, // 明永乐武当金顶
    chronologyPeriod: '明代 · 1416年武当金顶落成',
  },
};

function buildGallerySortMeta(): Record<string, GallerySortMeta> {
  const raw: {
    id: string;
    importanceKey: number;
    chronologyKey: number;
    chronologyPeriod: string;
  }[] = [];

  for (const [plateId, slot] of Object.entries(LANDMARK_PLATE_SLOTS)) {
    raw.push({
      id: plateId,
      importanceKey: slot.importanceKey,
      chronologyKey: slot.chronologyKey,
      chronologyPeriod: slot.chronologyPeriod,
    });
  }

  for (const [plateId, figId] of Object.entries(PLATE_TO_FIGURE_ID)) {
    const meta = FIGURE_SORT_META[figId];
    raw.push({
      id: plateId,
      importanceKey: meta.importanceRank,
      chronologyKey: meta.chronologyOrder,
      chronologyPeriod: meta.chronologyPeriod,
    });
  }

  const byImportance = [...raw].sort((a, b) => a.importanceKey - b.importanceKey);
  const byChronology = [...raw].sort((a, b) => a.chronologyKey - b.chronologyKey);

  const importanceRankMap = new Map(byImportance.map((item, idx) => [item.id, idx + 1]));
  const chronologyOrderMap = new Map(byChronology.map((item, idx) => [item.id, idx + 1]));

  const result: Record<string, GallerySortMeta> = {};
  for (const item of raw) {
    result[item.id] = {
      importanceRank: importanceRankMap.get(item.id)!,
      chronologyOrder: chronologyOrderMap.get(item.id)!,
      chronologyPeriod: item.chronologyPeriod,
    };
  }
  return result;
}

export const GALLERY_SORT_META: Record<string, GallerySortMeta> = buildGallerySortMeta();
