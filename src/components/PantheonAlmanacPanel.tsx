import { useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Compass, Search, Sparkles, X } from 'lucide-react';
import {
  FIVE_WEALTH_GODS,
  FOUR_TRUE_SAGES,
  LIUHE_LIUYU_DIRECTIONS,
  NORTH_DIPPER_STARS,
  ORTHODOX_CLARIFICATIONS,
  QUANZHEN_SEVEN_MASTERS,
  SIXTY_TAISUI_GENERALS,
  SOUTH_DIPPER_STARS,
  TWENTY_EIGHT_MANSIONS,
} from '../data/pantheonAlmanacData';
import { filterTaiSuiGenerals } from '../utils/taoismLogic';

interface PantheonAlmanacPanelProps {
  onSelectFigure: (figureId: string) => void;
  onLocateInGraph: (figureId: string) => void;
}

type AlmanacTabId = 'liuhe' | 'mansions' | 'dippers' | 'lineages' | 'taisui';

const ALMANAC_TABS: { id: AlmanacTabId; label: string }[] = [
  { id: 'liuhe', label: '六合六御与正统考辨' },
  { id: 'mansions', label: '四灵与二十八星宿' },
  { id: 'dippers', label: '北斗七星 · 南斗六星' },
  { id: 'lineages', label: '全真七子 · 四大真人 · 五路财神' },
  { id: 'taisui', label: '六十甲子太岁速查（60）' },
];

export function PantheonAlmanacPanel({
  onSelectFigure,
  onLocateInGraph,
}: PantheonAlmanacPanelProps) {
  const [activeTab, setActiveTab] = useState<AlmanacTabId>('liuhe');
  const [taisuiQuery, setTaisuiQuery] = useState('');

  const filteredTaiSui = useMemo(
    () => filterTaiSuiGenerals(SIXTY_TAISUI_GENERALS, taisuiQuery),
    [taisuiQuery],
  );

  return (
    <div
      className="mt-8 border border-stone-300/90 bg-[#F8F5EF]"
      data-testid="pantheon-almanac-panel"
    >
      {/* Archival Reference Header */}
      <div className="px-5 sm:px-6 py-4 bg-[#EFEAE0]/80 border-b border-stone-300/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-[#9A2B1F] font-medium">
            附编典藏 · 道教神谱专录查检
          </p>
          <h3 className="mt-0.5 font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
            六合方位、星宿斗姆、全真七子与六十甲子太岁全录
          </h3>
        </div>
        <p className="text-xs text-[#57534E] max-w-md leading-relaxed">
          参酌《真灵位业图》《列宿万灵朝真图》与七十二全神仙谱文献，补录天文星宿、全真七子及完整六十太岁值年将军。
        </p>
      </div>

      {/* Sub-navigation Tabs */}
      <div
        role="tablist"
        aria-label="神谱专录切换"
        className="px-5 sm:px-6 pt-4 pb-3 border-b border-stone-200/90 bg-[#FDFBF7] flex flex-wrap items-center gap-2"
      >
        {ALMANAC_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#1C1917] text-[#FDFBF7] border-[#1C1917]'
                  : 'bg-[#F8F5EF] text-[#44403C] border-stone-300 hover:border-[#9A2B1F] hover:text-[#1C1917]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="p-5 sm:p-6 bg-[#FDFBF7]">
        {/* 1. 六合六御方位图谱 & 正统考辨 */}
        {activeTab === 'liuhe' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {LIUHE_LIUYU_DIRECTIONS.map((item) => (
                <div
                  key={item.direction}
                  className="p-4 bg-[#F8F5EF] border border-stone-300/80 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono font-semibold text-[#9A2B1F]">
                        {item.direction}
                      </span>
                      <span className="text-[#78716C]">{item.axis}</span>
                    </div>
                    <h4 className="mt-1.5 font-serif text-base font-bold text-[#1C1917]">
                      {item.name}
                    </h4>
                    <p className="mt-0.5 text-[11px] text-[#78716C]">
                      {item.honorific}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-[#44403C]">
                      {item.domain}
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-stone-200/80 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => onSelectFigure(item.linkedFigureId)}
                      className="inline-flex items-center gap-1 font-medium text-[#1C1917] hover:text-[#9A2B1F] underline underline-offset-4 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                      查阅档案
                    </button>
                    <button
                      type="button"
                      onClick={() => onLocateInGraph(item.linkedFigureId)}
                      className="inline-flex items-center gap-0.5 font-medium text-[#9A2B1F] hover:text-[#7F1D1D] cursor-pointer"
                    >
                      图谱定位
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 正统神系考辨 */}
            <div className="border-t border-stone-300/80 pt-5">
              <div className="flex items-center gap-2 text-xs tracking-[0.14em] text-[#9A2B1F] font-semibold mb-3">
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                <span>正统神系考辨与常见误读厘清</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ORTHODOX_CLARIFICATIONS.map((note) => (
                  <div
                    key={note.title}
                    className="p-4 bg-[#F8F5EF] border border-stone-200/90"
                  >
                    <h5 className="font-serif text-sm font-bold text-[#1C1917]">
                      {note.title}
                    </h5>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#57534E]">
                      {note.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. 四灵与二十八星宿 */}
        {activeTab === 'mansions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TWENTY_EIGHT_MANSIONS.map((group) => (
              <div
                key={group.id}
                className="p-4 bg-[#F8F5EF] border border-stone-300/80"
              >
                <div className="flex items-baseline justify-between gap-2 pb-2.5 border-b border-stone-200">
                  <div>
                    <span className="text-[11px] font-mono text-[#9A2B1F] mr-2">
                      {group.direction}
                    </span>
                    <span className="font-serif text-base font-bold text-[#1C1917]">
                      {group.title}
                    </span>
                  </div>
                  <span className="text-xs text-[#78716C]">{group.element}</span>
                </div>
                <p className="mt-2 text-xs text-[#57534E]">
                  四灵主宰：<span className="font-medium text-[#1C1917]">{group.guardian}</span>
                </p>
                <ol className="mt-3 grid grid-cols-7 gap-1.5 text-center">
                  {group.mansions.map((star, idx) => (
                    <li
                      key={star}
                      className="py-2 px-1 bg-[#FDFBF7] border border-stone-200/90"
                    >
                      <span className="block text-[10px] font-mono text-[#78716C]">
                        0{idx + 1}
                      </span>
                      <span className="mt-0.5 block font-serif text-xs font-semibold text-[#1C1917]">
                        {star}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}

        {/* 3. 北斗七星君 & 南斗六星君 */}
        {activeTab === 'dippers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="p-4 bg-[#F8F5EF] border border-stone-300/80">
              <div className="flex items-baseline justify-between pb-2.5 border-b border-stone-200">
                <h4 className="font-serif text-base font-bold text-[#1C1917]">
                  北斗七元星君（北斗注死 · 消灾解厄）
                </h4>
                <button
                  type="button"
                  onClick={() => onSelectFigure('doumu-yuanjun')}
                  className="text-xs text-[#9A2B1F] hover:underline underline-offset-4 cursor-pointer"
                >
                  众星之母：斗姆元君
                </button>
              </div>
              <dl className="mt-3 divide-y divide-stone-200/80 text-xs sm:text-sm">
                {NORTH_DIPPER_STARS.map((star) => (
                  <div
                    key={star.order}
                    className="py-2 flex items-center justify-between gap-2"
                  >
                    <dt className="text-[#78716C] font-mono">
                      {star.order} · {star.palace}
                    </dt>
                    <dd className="font-serif font-semibold text-[#1C1917]">
                      {star.title}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="p-4 bg-[#F8F5EF] border border-stone-300/80">
              <div className="flex items-baseline justify-between pb-2.5 border-b border-stone-200">
                <h4 className="font-serif text-base font-bold text-[#1C1917]">
                  南斗六司星君（南斗注生 · 延年益寿）
                </h4>
                <button
                  type="button"
                  onClick={() => onSelectFigure('wenchang-dijun')}
                  className="text-xs text-[#9A2B1F] hover:underline underline-offset-4 cursor-pointer"
                >
                  统管南斗：文昌帝君
                </button>
              </div>
              <dl className="mt-3 divide-y divide-stone-200/80 text-xs sm:text-sm">
                {SOUTH_DIPPER_STARS.map((star) => (
                  <div
                    key={star.order}
                    className="py-2 flex items-center justify-between gap-2"
                  >
                    <dt className="text-[#78716C] font-mono">
                      {star.order} · {star.palace}
                    </dt>
                    <dd className="font-serif font-semibold text-[#1C1917]">
                      {star.title}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* 4. 全真七子 · 四大真人 · 五路财神 */}
        {activeTab === 'lineages' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-serif text-base font-bold text-[#1C1917] pb-2 border-b border-stone-200">
                全真七子完整封号录（王重阳门下七大弟子）
              </h4>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {QUANZHEN_SEVEN_MASTERS.map((master) => (
                  <div
                    key={master.name}
                    className="p-3.5 bg-[#F8F5EF] border border-stone-200/90"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-serif text-sm font-bold text-[#1C1917]">
                        {master.name}
                      </span>
                      <span className="text-[11px] text-[#9A2B1F]">
                        {master.daoName}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#57534E] leading-relaxed">
                      {master.honorific}
                    </p>
                    {master.linkedFigureId && (
                      <button
                        type="button"
                        onClick={() => onSelectFigure(master.linkedFigureId!)}
                        className="mt-2 text-[11px] font-medium text-[#9A2B1F] hover:underline underline-offset-4 cursor-pointer"
                      >
                        查阅丘处机档案 →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="p-4 bg-[#F8F5EF] border border-stone-200/90">
                <h4 className="font-serif text-base font-bold text-[#1C1917] pb-2 border-b border-stone-200">
                  道教四大真人（先秦四子真经）
                </h4>
                <ul className="mt-3 divide-y divide-stone-200/80 text-xs sm:text-sm">
                  {FOUR_TRUE_SAGES.map((sage) => (
                    <li
                      key={sage.title}
                      className="py-2 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-serif font-bold text-[#1C1917]">
                          {sage.title}
                        </span>
                        <span className="mx-2 text-[#78716C]">·</span>
                        <span className="text-[#44403C]">{sage.person}</span>
                      </div>
                      <span className="text-xs text-[#78716C] shrink-0">
                        {sage.classic}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-[#F8F5EF] border border-stone-200/90">
                <h4 className="font-serif text-base font-bold text-[#1C1917] pb-2 border-b border-stone-200">
                  五路财神正谱（中斌 · 东文 · 南文 · 西武 · 北武）
                </h4>
                <ul className="mt-3 divide-y divide-stone-200/80 text-xs sm:text-sm">
                  {FIVE_WEALTH_GODS.map((god) => (
                    <li
                      key={god.position}
                      className="py-2 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono text-xs text-[#9A2B1F] mr-2">
                          {god.position}
                        </span>
                        <span className="font-serif font-bold text-[#1C1917]">
                          {god.name}
                        </span>
                      </div>
                      <span className="text-xs text-[#57534E] shrink-0">
                        {god.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 5. 六十甲子太岁将军速查 */}
        {activeTab === 'taisui' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#57534E]">
                <Sparkles className="w-3.5 h-3.5 text-[#9A2B1F]" aria-hidden="true" />
                <span data-testid="taisui-count">
                  显示 {filteredTaiSui.length} / {SIXTY_TAISUI_GENERALS.length} 位六十甲子值年太岁神
                </span>
              </div>
              <div className="relative w-full sm:w-64">
                <label htmlFor="taisui-search" className="sr-only">
                  检索六十甲子干支或太岁将军名
                </label>
                <Search
                  className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="taisui-search"
                  type="text"
                  value={taisuiQuery}
                  onChange={(e) => setTaisuiQuery(e.target.value)}
                  placeholder="检索干支（如甲子）或将军名…"
                  className="w-full pl-8 pr-8 py-1.5 text-xs bg-[#F8F5EF] border border-stone-300 text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#9A2B1F]"
                />
                {taisuiQuery && (
                  <button
                    type="button"
                    aria-label="清除太岁检索"
                    onClick={() => setTaisuiQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {filteredTaiSui.length === 0 ? (
              <p className="py-8 text-center text-xs text-[#78716C] border border-stone-200 bg-[#F8F5EF]">
                未检索到匹配的干支或太岁将军，可输入“甲子”“乙丑”“金辨”“管仲”或“虞程”等检索。
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {filteredTaiSui.map((item) => (
                  <div
                    key={item.ganzhi}
                    className="px-2.5 py-2 bg-[#F8F5EF] border border-stone-200/90 flex items-center justify-between gap-1.5 text-xs"
                  >
                    <span className="font-mono font-semibold text-[#9A2B1F]">
                      {item.ganzhi}
                    </span>
                    <span className="font-serif text-[#1C1917] truncate">
                      {item.general}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
