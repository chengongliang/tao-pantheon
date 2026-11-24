export interface PantheonEvolutionStage {
  index: string;
  era: string;
  title: string;
  classicTexts: string;
  summary: string;
}

export interface LiuheDirectionItem {
  direction: string;
  axis: string;
  name: string;
  honorific: string;
  domain: string;
  linkedFigureId: string;
}

export interface MansionGroup {
  id: string;
  direction: string;
  guardian: string;
  title: string;
  element: string;
  mansions: string[];
}

export interface DipperStar {
  order: string;
  palace: string;
  title: string;
}

export interface QuanzhenMaster {
  name: string;
  daoName: string;
  honorific: string;
  linkedFigureId?: string;
}

export interface TaiSuiEntry {
  order: number;
  ganzhi: string;
  general: string;
}

/**
 * 中国道教神仙谱系形成与演进六阶简史（参酌历代经录与神谱文献梳理）
 */
export const PANTHEON_EVOLUTION_STAGES: PantheonEvolutionStage[] = [
  {
    index: '01',
    era: '上古时期',
    title: '神话起源与自然崇拜',
    classicTexts: '盘古开天 · 三皇五帝 · 口耳相传',
    summary: '中国神仙体系植根于上古创世神话、天地日月山川自然崇拜与先祖圣王记忆，奠定华夏神圣宇宙观雏形。',
  },
  {
    index: '02',
    era: '春秋战国',
    title: '诸子百家著录仙话',
    classicTexts: '《山海经》 · 《庄子》 · 《楚辞·九歌》',
    summary: '《山海经》详载女娲、西王母、夸父、后羿等上古大神；《庄子》载广成子、彭祖；屈原《九歌》礼赞东皇太一。',
  },
  {
    index: '03',
    era: '秦汉两朝',
    title: '方仙道与列仙谱系初兴',
    classicTexts: '《淮南子》 · 《史记》 · 《列仙传》 · 《神仙传》',
    summary: '秦皇汉武崇奉方仙，刘向《列仙传》与葛洪《神仙传》系统编录赤松子、彭祖等历代仙真事迹，东汉张道陵创教立坛。',
  },
  {
    index: '04',
    era: '南北朝',
    title: '七阶神谱首次系统定型',
    classicTexts: '《元始上真众仙记》 · 陶弘景《真灵位业图》',
    summary: '《元始上真众仙记》述元始天尊、东王公与西王母；陶弘景《真灵位业图》首将神仙排定七个等级，建立严密道教神谱。',
  },
  {
    index: '05',
    era: '盛唐时期',
    title: '尊奉老子与天帝格局演进',
    classicTexts: '敕封老子“大圣祖玄元天皇大帝”',
    summary: '李唐皇室认老子为圣祖，唐代前中期道观多专设元始天尊殿或老君殿，四大真人（庄、列、文、亢仓）亦于天宝间受封。',
  },
  {
    index: '06',
    era: '两宋以后',
    title: '三清四御六御全谱大成',
    classicTexts: '王钦若《列宿万灵朝真图》 · 金允中《上清灵宝大法》',
    summary: '北宋真宗、徽宗大兴斋醮，王钦若编《罗天大醮仪》；南宋金允中编制黄箓大斋醮神名单，三清、四御六御与万神体系最终完备。',
  },
];

/**
 * 六合六御方位图谱（上、下、北、南、东、西）
 */
export const LIUHE_LIUYU_DIRECTIONS: LiuheDirectionItem[] = [
  {
    direction: '上（天极）',
    axis: '统御诸神万天',
    name: '玉皇大帝',
    honorific: '昊天金阙无上至尊自然妙有弥罗至真玉皇上帝',
    domain: '居六合之“上”，总执天道、统御三界十方诸神万天。',
    linkedFigureId: 'yuhuang-dadi',
  },
  {
    direction: '下（坤元）',
    axis: '统御山川万地',
    name: '后土皇地祇',
    honorific: '承天效法厚德光大后土皇地祇',
    domain: '居六合之“下”，掌管大地山川、阴阳生育与社稷万物。',
    linkedFigureId: 'houtu-huangdiqi',
  },
  {
    direction: '北（中天）',
    axis: '统御日月万星',
    name: '中天紫微北极大帝',
    honorific: '北极紫微大帝（四御之一）',
    domain: '居六合之“北”，执掌天经地纬、日月星辰与四时气候。',
    linkedFigureId: 'ziwei-dadi',
  },
  {
    direction: '南（神霄）',
    axis: '统御万灵寿算',
    name: '南极长生大帝',
    honorific: '高上神霄玉清真王长生大帝',
    domain: '居六合之“南”，执掌众神寿算，化身雷声普化天尊统御雷部。',
    linkedFigureId: 'nanji-changsheng',
  },
  {
    direction: '东（青华）',
    axis: '统御万类济度',
    name: '东极青华大帝',
    honorific: '太乙救苦天尊（寻声救苦）',
    domain: '居六合之“东”，大慈大悲寻声赴感、统御万类与超拔幽冥。',
    linkedFigureId: 'taiyi-jiuku',
  },
  {
    direction: '西（太极）',
    axis: '统御兵戈万雷',
    name: '勾陈上宫天皇大帝',
    honorific: '西方太极天皇大帝',
    domain: '居六合之“西”，协理南北极与天地人三才，主宰兵革与万雷。',
    linkedFigureId: 'gouchen-tianhuang',
  },
];

export const ORTHODOX_CLARIFICATIONS: { title: string; detail: string }[] = [
  {
    title: '西王母与玉皇大帝非夫妻关系',
    detail: '在正统道教神系中，西王母乃先天至阴之气凝聚而成的“女仙之首”，与先天阳气所化的“男仙之首”东王公相对，其信仰出现远早于玉皇大帝；民间戏曲常将王母误作玉帝之妻，实为后世演义附会。',
  },
  {
    title: '四帝、四极与六御的体系演进',
    detail: '三清之下传统称“四御”（紫微、南极长生、勾陈天皇、后土）；另有“四极大帝”专司四方（北紫微、南长生、西勾陈、东青华）；合入居中居上之玉皇大帝与居下之后土皇地祇，即成契合“上下四方”宇宙观的“六合六御”。',
  },
  {
    title: '灶君与基层地仙谱系',
    detail: '道教神谱既囊括先天至圣与星斗雷部，也包罗五岳大帝、四海龙王、城隍土地与灶君（灶王爷，传为腊月廿三上天奏报、正月初六归返人间，是神谱中最贴近万户千家烟火的基层地仙）。',
  },
];

/**
 * 四灵与二十八星宿全录
 */
export const TWENTY_EIGHT_MANSIONS: MansionGroup[] = [
  {
    id: 'east-dragon',
    direction: '东方',
    guardian: '青龙孟章神君',
    title: '东方青龙七宿',
    element: '木德 · 春生',
    mansions: ['角木蛟', '亢金龙', '氐土貉', '房日兔', '心月狐', '尾火虎', '箕水豹'],
  },
  {
    id: 'south-bird',
    direction: '南方',
    guardian: '朱雀陵光神君',
    title: '南方朱雀七宿',
    element: '火德 · 夏长',
    mansions: ['井木犴', '鬼金羊', '柳土獐', '星日马', '张月鹿', '翼火蛇', '轸水蚓'],
  },
  {
    id: 'west-tiger',
    direction: '西方',
    guardian: '白虎监兵神君',
    title: '西方白虎七宿',
    element: '金德 · 秋敛',
    mansions: ['奎木狼', '娄金狗', '胃土雉', '昴日鸡', '毕月乌', '觜火猴', '参水猿'],
  },
  {
    id: 'north-tortoise',
    direction: '北方',
    guardian: '玄武执明神君',
    title: '北方玄武七宿',
    element: '水德 · 冬藏',
    mansions: ['斗木獬', '牛金牛', '女土蝠', '虚日鼠', '危月燕', '室火猪', '壁水貐'],
  },
];

/**
 * 北斗七星君与南斗六星君
 */
export const NORTH_DIPPER_STARS: DipperStar[] = [
  { order: '北斗第一', palace: '天枢宫', title: '阳明贪狼星君' },
  { order: '北斗第二', palace: '天璇宫', title: '阴精巨门星君' },
  { order: '北斗第三', palace: '天玑宫', title: '真人禄存星君' },
  { order: '北斗第四', palace: '天权宫', title: '玄冥文曲星君' },
  { order: '北斗第五', palace: '玉衡宫', title: '丹元廉贞星君' },
  { order: '北斗第六', palace: '开阳宫', title: '北极武曲星君' },
  { order: '北斗第七', palace: '摇光宫', title: '天关破军星君' },
];

export const SOUTH_DIPPER_STARS: DipperStar[] = [
  { order: '南斗第一', palace: '天府宫', title: '司命星君' },
  { order: '南斗第二', palace: '天相宫', title: '司禄星君' },
  { order: '南斗第三', palace: '天梁宫', title: '延寿星君' },
  { order: '南斗第四', palace: '天同宫', title: '益算星君' },
  { order: '南斗第五', palace: '天枢宫', title: '度厄星君' },
  { order: '南斗第六', palace: '天机宫', title: '上生星君' },
];

/**
 * 全真七子封号全录
 */
export const QUANZHEN_SEVEN_MASTERS: QuanzhenMaster[] = [
  { name: '马钰', daoName: '丹阳子（遇仙派）', honorific: '丹阳抱一无为普化真君' },
  { name: '谭处端', daoName: '长真子（南无派）', honorific: '长真凝神玄静温德真君' },
  { name: '刘处玄', daoName: '长生子（随山派）', honorific: '长生辅化宗玄明德真君' },
  { name: '丘处机', daoName: '长春子（龙门派）', honorific: '长春全德神化明应主教真君', linkedFigureId: 'qiu-chuji' },
  { name: '王处一', daoName: '玉阳子（嵛山派）', honorific: '玉阳体玄广慈普度真君' },
  { name: '郝大通', daoName: '广宁子（华山派）', honorific: '太古广宁通玄妙极真君' },
  { name: '孙不二', daoName: '清静散人（清静派）', honorific: '清静渊真玄虚顺化元君' },
];

export const FOUR_TRUE_SAGES: { title: string; person: string; classic: string; linkedFigureId?: string }[] = [
  { title: '南华真人', person: '庄周（庄子）', classic: '《南华真经》（《庄子》）', linkedFigureId: 'zhuangzi' },
  { title: '冲虚真人', person: '列御寇（列子）', classic: '《冲虚真经》（《列子》）', linkedFigureId: 'liezi' },
  { title: '通玄真人', person: '辛钘（文子）', classic: '《通玄真经》（《文子》）' },
  { title: '洞灵真人', person: '庚桑楚（亢仓子）', classic: '《洞灵真经》（《亢仓子》）' },
];

export const FIVE_WEALTH_GODS: { position: string; role: string; name: string; linkedFigureId?: string }[] = [
  { position: '中路', role: '中斌财神', name: '王亥（华商始祖）' },
  { position: '东路', role: '文财神', name: '比干（忠正无私）' },
  { position: '南路', role: '文财神', name: '范蠡（陶朱公）' },
  { position: '西路', role: '武财神', name: '关公（关圣帝君）', linkedFigureId: 'guansheng-dijun' },
  { position: '北路', role: '武财神', name: '赵公明（玄坛真君）', linkedFigureId: 'zhao-gongming' },
];

/**
 * 六十甲子太岁神完整名录（1 ~ 60，按天干地支正序排列）
 */
export const SIXTY_TAISUI_GENERALS: TaiSuiEntry[] = [
  { order: 1, ganzhi: '甲子', general: '金辨将军' },
  { order: 2, ganzhi: '乙丑', general: '陈材将军' },
  { order: 3, ganzhi: '丙寅', general: '耿章将军' },
  { order: 4, ganzhi: '丁卯', general: '沈兴将军' },
  { order: 5, ganzhi: '戊辰', general: '赵达将军' },
  { order: 6, ganzhi: '己巳', general: '郭灿将军' },
  { order: 7, ganzhi: '庚午', general: '王济将军' },
  { order: 8, ganzhi: '辛未', general: '李素将军' },
  { order: 9, ganzhi: '壬申', general: '刘旺将军' },
  { order: 10, ganzhi: '癸酉', general: '康志将军' },
  { order: 11, ganzhi: '甲戌', general: '施广将军' },
  { order: 12, ganzhi: '乙亥', general: '任保将军' },
  { order: 13, ganzhi: '丙子', general: '郭嘉将军' },
  { order: 14, ganzhi: '丁丑', general: '汪文将军' },
  { order: 15, ganzhi: '戊寅', general: '鲁先将军' },
  { order: 16, ganzhi: '己卯', general: '龙仲将军' },
  { order: 17, ganzhi: '庚辰', general: '董德将军' },
  { order: 18, ganzhi: '辛巳', general: '郑但将军' },
  { order: 19, ganzhi: '壬午', general: '陆明将军' },
  { order: 20, ganzhi: '癸未', general: '魏仁将军' },
  { order: 21, ganzhi: '甲申', general: '方杰将军' },
  { order: 22, ganzhi: '乙酉', general: '蒋崇将军' },
  { order: 23, ganzhi: '丙戌', general: '白敏将军' },
  { order: 24, ganzhi: '丁亥', general: '封济将军' },
  { order: 25, ganzhi: '戊子', general: '邹铛将军' },
  { order: 26, ganzhi: '己丑', general: '傅佑将军' },
  { order: 27, ganzhi: '庚寅', general: '邬桓将军' },
  { order: 28, ganzhi: '辛卯', general: '范宁将军' },
  { order: 29, ganzhi: '壬辰', general: '彭泰将军' },
  { order: 30, ganzhi: '癸巳', general: '徐单将军' },
  { order: 31, ganzhi: '甲午', general: '章词将军' },
  { order: 32, ganzhi: '乙未', general: '杨仙将军' },
  { order: 33, ganzhi: '丙申', general: '管仲将军' },
  { order: 34, ganzhi: '丁酉', general: '唐杰将军' },
  { order: 35, ganzhi: '戊戌', general: '姜武将军' },
  { order: 36, ganzhi: '己亥', general: '谢太将军' },
  { order: 37, ganzhi: '庚子', general: '卢秘将军' },
  { order: 38, ganzhi: '辛丑', general: '杨信将军' },
  { order: 39, ganzhi: '壬寅', general: '贺谔将军' },
  { order: 40, ganzhi: '癸卯', general: '皮时将军' },
  { order: 41, ganzhi: '甲辰', general: '李诚将军' },
  { order: 42, ganzhi: '乙巳', general: '吴遂将军' },
  { order: 43, ganzhi: '丙午', general: '文哲将军' },
  { order: 44, ganzhi: '丁未', general: '缪丙将军' },
  { order: 45, ganzhi: '戊申', general: '徐浩将军' },
  { order: 46, ganzhi: '己酉', general: '程宝将军' },
  { order: 47, ganzhi: '庚戌', general: '倪秘将军' },
  { order: 48, ganzhi: '辛亥', general: '叶坚将军' },
  { order: 49, ganzhi: '壬子', general: '丘德将军' },
  { order: 50, ganzhi: '癸丑', general: '朱得将军' },
  { order: 51, ganzhi: '甲寅', general: '张朝将军' },
  { order: 52, ganzhi: '乙卯', general: '万清将军' },
  { order: 53, ganzhi: '丙辰', general: '辛亚将军' },
  { order: 54, ganzhi: '丁巳', general: '杨彦将军' },
  { order: 55, ganzhi: '戊午', general: '黎卿将军' },
  { order: 56, ganzhi: '己未', general: '傅党将军' },
  { order: 57, ganzhi: '庚申', general: '毛梓将军' },
  { order: 58, ganzhi: '辛酉', general: '石政将军' },
  { order: 59, ganzhi: '壬戌', general: '洪充将军' },
  { order: 60, ganzhi: '癸亥', general: '虞程将军' },
];
