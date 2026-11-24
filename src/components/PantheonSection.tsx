import { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  ArrowUpRight,
  BookOpen,
  LayoutGrid,
  ListOrdered,
  Search,
  X,
} from 'lucide-react';
import {
  CATEGORY_FILTERS,
  IMPORTANT_DEITIES_ROSTER,
  TAOIST_FIGURES,
  type FigureCategory,
} from '../data/taoismData';
import {
  FIGURE_SORT_META,
  SORT_MODE_OPTIONS,
  type CatalogSortMode,
} from '../data/taoismSortMeta';
import { filterDeityRoster, filterFigures } from '../utils/taoismLogic';
import { PantheonAlmanacPanel } from './PantheonAlmanacPanel';
import { ResilientImage } from './ResilientImage';

interface PantheonSectionProps {
  onSelectFigure: (figureId: string) => void;
  onLocateInGraph: (figureId: string) => void;
}

type PantheonViewMode = 'cards' | 'roster';

export function PantheonSection({
  onSelectFigure,
  onLocateInGraph,
}: PantheonSectionProps) {
  const [viewMode, setViewMode] = useState<PantheonViewMode>('cards');
  const [category, setCategory] = useState<FigureCategory>('all');
  const [sortBy, setSortBy] = useState<CatalogSortMode>('importance');
  const [rosterGroup, setRosterGroup] = useState<string>('all');
  const [query, setQuery] = useState('');

  const filteredFigures = useMemo(
    () => filterFigures(TAOIST_FIGURES, { category, query, sortBy }),
    [category, query, sortBy],
  );

  const activeSortOption = useMemo(
    () => SORT_MODE_OPTIONS.find((opt) => opt.id === sortBy) ?? SORT_MODE_OPTIONS[0],
    [sortBy],
  );

  const filteredRoster = useMemo(
    () => filterDeityRoster(IMPORTANT_DEITIES_ROSTER, rosterGroup, query),
    [rosterGroup, query],
  );

  const totalRosterEntries = useMemo(
    () =>
      IMPORTANT_DEITIES_ROSTER.reduce((sum, g) => sum + g.entries.length, 0),
    [],
  );

  const visibleRosterEntries = useMemo(
    () => filteredRoster.reduce((sum, g) => sum + g.entries.length, 0),
    [filteredRoster],
  );

  const handleReset = () => {
    setCategory('all');
    setRosterGroup('all');
    setQuery('');
  };

  return (
    <section
      id="pantheon"
      className="py-16 lg:py-24 border-b border-stone-300/80 bg-[#FDFBF7]"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-300/80">
          <div>
            <p className="text-xs tracking-[0.18em] text-[#9A2B1F] font-medium mb-2">
              第三卷 · 真灵位业录与七十二全神仙谱
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
              道教仙真谱系与《全神仙谱》排位总览
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#57534E] max-w-xl leading-relaxed">
            完整收录上古创世大神、三清、四帝六御、五方五老、星宿斗姆、三官雷部、先秦圣哲、历代祖师、天庭护法、民间八仙与历史封神。六十位核心仙真皆依正统神阶与朝代编年排布，一仙一像零重复，并附九大部类总谱与星宿太岁专录。
          </p>
        </div>

        {/* View Mode Switcher + Search Bar */}
        <div className="mt-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Primary View Mode Tabs */}
          <div
            role="tablist"
            aria-label="仙真谱系浏览视图切换"
            className="inline-flex border border-stone-300 bg-[#F8F5EF] p-1 self-start"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'cards'}
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'cards'
                  ? 'bg-[#9A2B1F] text-[#FDFBF7]'
                  : 'text-[#44403C] hover:text-[#1C1917]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" aria-hidden="true" />
              仙真丹青图鉴（{TAOIST_FIGURES.length}）
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'roster'}
              onClick={() => setViewMode('roster')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'roster'
                  ? 'bg-[#9A2B1F] text-[#FDFBF7]'
                  : 'text-[#44403C] hover:text-[#1C1917]'
              }`}
            >
              <ListOrdered className="w-4 h-4" aria-hidden="true" />
              全神仙谱总录（九部 · 含太岁星宿）
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <label htmlFor="pantheon-search" className="sr-only">
              搜索仙真姓名、尊号、职司、典籍或道场
            </label>
            <Search
              className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="pantheon-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                viewMode === 'cards'
                  ? '搜索尊号、姓名、典籍或道场…'
                  : '检索重要神仙表神名、职司或仙宫…'
              }
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#F8F5EF] border border-stone-300 text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#9A2B1F] transition-colors"
            />
            {query && (
              <button
                type="button"
                aria-label="清除搜索关键词"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-filter Strip + Sort Mode Switcher */}
        {viewMode === 'cards' ? (
          <div className="mt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div
              role="group"
              aria-label="按谱系类别筛选仙真"
              className="flex flex-wrap items-center gap-2"
            >
              {CATEGORY_FILTERS.map((cat) => {
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setCategory(cat.id)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A2B1F] ${
                      isActive
                        ? 'bg-[#1C1917] text-[#FDFBF7] border-[#1C1917]'
                        : 'bg-[#F8F5EF] text-[#44403C] border-stone-300 hover:border-[#1C1917] hover:text-[#1C1917]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Switcher: Importance / Chronology / Canonical Hierarchy */}
            <div
              role="group"
              aria-label="仙真丹青图鉴排序方式"
              className="inline-flex items-center border border-stone-300 bg-[#F8F5EF] p-0.5 self-start lg:self-auto"
            >
              <span className="inline-flex items-center gap-1 px-2.5 text-[11px] text-[#78716C] select-none shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#9A2B1F]" aria-hidden="true" />
                排序
              </span>
              {SORT_MODE_OPTIONS.map((opt) => {
                const isActive = sortBy === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={isActive}
                    title={opt.description}
                    onClick={() => setSortBy(opt.id)}
                    className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#9A2B1F] text-[#FDFBF7]'
                        : 'text-[#44403C] hover:text-[#1C1917]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            role="group"
            aria-label="按神阶筛选重要神仙表"
            className="mt-5 flex flex-wrap items-center gap-2"
          >
            <button
              type="button"
              aria-pressed={rosterGroup === 'all'}
              onClick={() => setRosterGroup('all')}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                rosterGroup === 'all'
                  ? 'bg-[#1C1917] text-[#FDFBF7] border-[#1C1917]'
                  : 'bg-[#F8F5EF] text-[#44403C] border-stone-300 hover:border-[#1C1917]'
              }`}
            >
              全部九部
            </button>
            {IMPORTANT_DEITIES_ROSTER.map((group) => {
              const isActive = rosterGroup === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setRosterGroup(group.id)}
                  className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#1C1917] text-[#FDFBF7] border-[#1C1917]'
                      : 'bg-[#F8F5EF] text-[#44403C] border-stone-300 hover:border-[#1C1917]'
                  }`}
                >
                  {group.index} · {group.title}
                </button>
              );
            })}
          </div>
        )}

        {/* Result Count Bar */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#78716C]">
          {viewMode === 'cards' ? (
            <span className="font-mono tabular-nums" data-testid="pantheon-count">
              当前「{activeSortOption.label}」显示 {filteredFigures.length} / {TAOIST_FIGURES.length} 位仙真 · {activeSortOption.description}
            </span>
          ) : (
            <span className="font-mono tabular-nums" data-testid="roster-count">
              当前显示 {filteredRoster.length} / {IMPORTANT_DEITIES_ROSTER.length} 部 · 共{' '}
              {visibleRosterEntries} / {totalRosterEntries} 项神系条目
            </span>
          )}
          {(category !== 'all' || rosterGroup !== 'all' || query.trim() !== '') && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[#9A2B1F] hover:underline underline-offset-4 cursor-pointer"
            >
              重置筛选条件
            </button>
          )}
        </div>

        {/* === VIEW 1: 35-FIGURE UNIQUE PORTRAIT CARDS === */}
        {viewMode === 'cards' &&
          (filteredFigures.length === 0 ? (
            <div className="mt-8 border border-stone-300/80 bg-[#F8F5EF] py-16 px-6 text-center">
              <p className="font-serif text-lg font-semibold text-[#1C1917]">
                未检索到匹配的仙真或祖师记录
              </p>
              <p className="mt-2 text-sm text-[#57534E]">
                可尝试检索“盘古”“伏羲”“黄帝”“东皇太一”“姜子牙”“尹喜”“鬼谷子”“李天王”“月老”或“铁拐李”等关键词。
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-5 px-5 py-2.5 text-sm font-medium text-[#FDFBF7] bg-[#9A2B1F] hover:bg-[#7F1D1D] transition-colors cursor-pointer"
              >
                显示全部仙真谱系
              </button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFigures.map((fig) => {
                const sortMeta = FIGURE_SORT_META[fig.id];
                const orderTag =
                  sortBy === 'importance'
                    ? `要序 ${String(sortMeta?.importanceRank ?? fig.rankOrder).padStart(2, '0')}`
                    : sortBy === 'chronology'
                      ? `时序 ${String(sortMeta?.chronologyOrder ?? fig.rankOrder).padStart(2, '0')}`
                      : `位业 ${String(fig.rankOrder).padStart(2, '0')}`;
                const displayEra =
                  sortBy === 'chronology' && sortMeta?.chronologyPeriod
                    ? sortMeta.chronologyPeriod
                    : fig.era;

                return (
                <article
                  key={fig.id}
                  data-figure-id={fig.id}
                  className="group flex flex-col bg-[#F8F5EF] border border-stone-300/80 hover:border-[#9A2B1F]/70 transition-colors"
                >
                  {/* Unique Portrait Plate */}
                  <button
                    type="button"
                    onClick={() => onSelectFigure(fig.id)}
                    aria-label={`查看${fig.name}详细档案`}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFEAE0] border-b border-stone-300/70 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9A2B1F]"
                  >
                    <ResilientImage
                      src={fig.image}
                      alt={`${fig.name}（${fig.honorific}）古典道教画卷`}
                      fallbackTitle={fig.name}
                      className={`w-full h-full object-cover ${
                        fig.imageFocus ?? 'object-center'
                      } transition-transform duration-300 group-hover:scale-[1.03]`}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 to-transparent"
                    />
                    <span className="absolute bottom-2.5 left-3.5 text-[11px] font-mono tabular-nums tracking-wider text-stone-100">
                      {orderTag} · {fig.accessionNo}
                    </span>
                  </button>

                  {/* Card Body — Zero Pill Metadata Discipline */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#78716C]">
                        <span className="text-[#9A2B1F] font-medium shrink-0">
                          {fig.categoryLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{displayEra}</span>
                      </div>

                      <div className="mt-2 flex items-baseline justify-between gap-3">
                        <h3 className="font-serif text-xl font-bold text-[#1C1917] shrink-0">
                          {fig.name}
                        </h3>
                        <span className="text-xs text-[#57534E] truncate">
                          {fig.honorific}
                        </span>
                      </div>

                      <p className="mt-2.5 text-sm leading-relaxed text-[#44403C] line-clamp-3">
                        {fig.shortBio}
                      </p>

                      <div className="mt-4 pt-3 border-t border-stone-200/90 text-xs text-[#57534E] space-y-1">
                        <p className="truncate">
                          <span className="text-[#78716C]">道场：</span>
                          {fig.sacredSite}
                        </p>
                        <p className="truncate">
                          <span className="text-[#78716C]">典籍／法器：</span>
                          {fig.scripturesOrArtifacts.join(' · ')}
                        </p>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-5 pt-3 border-t border-stone-200/90 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => onSelectFigure(fig.id)}
                        className="text-xs sm:text-sm font-medium text-[#1C1917] hover:text-[#9A2B1F] underline underline-offset-4 cursor-pointer whitespace-nowrap"
                      >
                        阅览完整档案
                      </button>
                      <button
                        type="button"
                        onClick={() => onLocateInGraph(fig.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#9A2B1F] hover:text-[#7F1D1D] cursor-pointer whitespace-nowrap"
                      >
                        图谱定位
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          ))}

        {/* === VIEW 2: COMPLETE 9-TIER《重要神仙表》ARCHIVAL TABLE === */}
        {viewMode === 'roster' &&
          (filteredRoster.length === 0 ? (
            <div className="mt-8 border border-stone-300/80 bg-[#F8F5EF] py-16 px-6 text-center">
              <p className="font-serif text-lg font-semibold text-[#1C1917]">
                未在《重要神仙表》中检索到匹配条目
              </p>
              <p className="mt-2 text-sm text-[#57534E]">
                可尝试检索“六御”“五老”“北斗”“王灵官”“四大天王”“十殿”等关键词。
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-5 px-5 py-2.5 text-sm font-medium text-[#FDFBF7] bg-[#9A2B1F] hover:bg-[#7F1D1D] transition-colors cursor-pointer"
              >
                重置总谱筛选
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-8" data-testid="important-deities-roster">
              {filteredRoster.map((group) => (
                <div
                  key={group.id}
                  className="border border-stone-300/90 bg-[#F8F5EF]"
                >
                  {/* Group Archival Banner */}
                  <div className="px-5 sm:px-6 py-4 bg-[#EFEAE0]/75 border-b border-stone-300/80 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2.5 text-xs text-[#78716C]">
                        <span className="font-mono text-[#9A2B1F] font-semibold">
                          {group.index}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{group.subtitle}</span>
                      </div>
                      <h3 className="mt-1 font-serif text-xl font-bold text-[#1C1917]">
                        {group.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#57534E] max-w-md leading-relaxed">
                      {group.description}
                    </p>
                  </div>

                  {/* Responsive Archival Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-stone-300/80 text-[11px] tracking-[0.1em] text-[#78716C] bg-[#FDFBF7]/70">
                          <th className="py-3 px-5 font-medium w-[18%] min-w-[130px]">
                            神仙名号
                          </th>
                          <th className="py-3 px-4 font-medium w-[24%] min-w-[180px]">
                            圣号／尊称
                          </th>
                          <th className="py-3 px-4 font-medium w-[30%] min-w-[220px]">
                            职司与神格
                          </th>
                          <th className="py-3 px-4 font-medium w-[16%] min-w-[130px]">
                            居所／道场
                          </th>
                          <th className="py-3 px-5 font-medium text-right w-[12%] min-w-[116px]">
                            关联档案
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200/90 bg-[#FDFBF7] text-xs sm:text-sm">
                        {group.entries.map((entry) => (
                          <tr
                            key={`${group.id}-${entry.name}`}
                            className="hover:bg-[#F8F5EF] transition-colors"
                          >
                            <td className="py-3.5 px-5 font-serif font-bold text-[#1C1917] align-top">
                              {entry.name}
                            </td>
                            <td className="py-3.5 px-4 text-[#44403C] align-top leading-relaxed">
                              {entry.honorific}
                            </td>
                            <td className="py-3.5 px-4 text-[#44403C] align-top leading-relaxed">
                              {entry.domain}
                            </td>
                            <td className="py-3.5 px-4 text-[#57534E] align-top leading-relaxed">
                              {entry.residence}
                            </td>
                            <td className="py-3.5 px-5 text-right align-top whitespace-nowrap">
                              {entry.linkedFigureId ? (
                                <div className="inline-flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onSelectFigure(entry.linkedFigureId!)
                                    }
                                    className="inline-flex items-center gap-1 text-xs font-medium text-[#1C1917] hover:text-[#9A2B1F] underline underline-offset-4 cursor-pointer"
                                  >
                                    <BookOpen
                                      className="w-3.5 h-3.5"
                                      aria-hidden="true"
                                    />
                                    档案
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onLocateInGraph(entry.linkedFigureId!)
                                    }
                                    className="inline-flex items-center gap-0.5 text-xs font-medium text-[#9A2B1F] hover:text-[#7F1D1D] cursor-pointer"
                                  >
                                    图谱
                                    <ArrowUpRight
                                      className="w-3 h-3"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-[#A8A29E]">
                                  总谱收录
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* 附编典藏：六合六御方位、正统考辨、二十八星宿、南北斗、全真七子与六十甲子太岁速查 */}
              <PantheonAlmanacPanel
                onSelectFigure={onSelectFigure}
                onLocateInGraph={onLocateInGraph}
              />
            </div>
          ))}
      </div>
    </section>
  );
}
