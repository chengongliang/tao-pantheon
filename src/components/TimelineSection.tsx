import { useMemo, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import {
  ERA_FILTERS,
  TAOIST_FIGURES,
  TIMELINE_EVENTS,
  type EraId,
} from '../data/taoismData';
import { filterTimelineEvents } from '../utils/taoismLogic';
import { ResilientImage } from './ResilientImage';

interface TimelineSectionProps {
  onSelectFigure: (figureId: string) => void;
  onLocateInGraph: (figureId: string) => void;
}

export function TimelineSection({
  onSelectFigure,
  onLocateInGraph,
}: TimelineSectionProps) {
  const [selectedEra, setSelectedEra] = useState<EraId>('all');
  const [selectedEventId, setSelectedEventId] = useState<string>(
    TIMELINE_EVENTS[0].id,
  );

  const filteredEvents = useMemo(
    () => filterTimelineEvents(TIMELINE_EVENTS, selectedEra),
    [selectedEra],
  );

  const activeIndex = useMemo(() => {
    const idx = filteredEvents.findIndex((evt) => evt.id === selectedEventId);
    return idx >= 0 ? idx : 0;
  }, [filteredEvents, selectedEventId]);

  const activeEvent = filteredEvents[activeIndex] ?? TIMELINE_EVENTS[0];

  const figureMap = useMemo(
    () => new Map(TAOIST_FIGURES.map((fig) => [fig.id, fig])),
    [],
  );

  const handleEraChange = (era: EraId) => {
    setSelectedEra(era);
    const nextList = filterTimelineEvents(TIMELINE_EVENTS, era);
    if (nextList.length > 0) {
      setSelectedEventId(nextList[0].id);
    }
  };

  const handleStep = (delta: number) => {
    if (filteredEvents.length === 0) return;
    const nextIdx =
      (activeIndex + delta + filteredEvents.length) % filteredEvents.length;
    setSelectedEventId(filteredEvents[nextIdx].id);
  };

  return (
    <section
      id="timeline"
      className="py-16 lg:py-24 border-b border-stone-300/80 xuan-surface"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-300/80">
          <div>
            <p className="text-xs tracking-[0.18em] text-[#9A2B1F] font-medium mb-2">
              第二卷 · 历代大事编年
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
              道家历史重大事件时间轴
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#57534E] max-w-xl leading-relaxed">
            按朝代脉络筛选十二桩影响深远的道门盛事。点击时间轴节点阅览历史现场与配图，并可直接查阅关联圣哲与仙真档案。
          </p>
        </div>

        {/* Dynasty Era Filter Controls (Functional buttons) */}
        <div
          role="group"
          aria-label="按朝代筛选历史事件"
          className="mt-7 flex flex-wrap items-center gap-2"
        >
          {ERA_FILTERS.map((era) => {
            const isActive = selectedEra === era.id;
            return (
              <button
                key={era.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleEraChange(era.id)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A2B1F] ${
                  isActive
                    ? 'bg-[#9A2B1F] text-[#FDFBF7] border-[#9A2B1F]'
                    : 'bg-[#FDFBF7] text-[#44403C] border-stone-300 hover:border-[#1C1917] hover:text-[#1C1917]'
                }`}
              >
                {era.label}
              </button>
            );
          })}
          <span className="ml-auto text-xs font-mono tabular-nums text-[#78716C]">
            共 {filteredEvents.length} 项编年记录
          </span>
        </div>

        {/* Interactive Horizontal Chronological Rail */}
        <div className="mt-6 relative border border-stone-300/80 bg-[#FDFBF7] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-xs text-[#78716C]">
              点选任意年份节点切换主展台详情
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="上一个历史事件"
                onClick={() => handleStep(-1)}
                className="inline-flex items-center justify-center w-9 h-9 border border-stone-300 bg-[#F8F5EF] hover:border-[#1C1917] text-[#1C1917] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="text-xs font-mono tabular-nums text-[#57534E] min-w-[3.5rem] text-center">
                {activeIndex + 1} / {filteredEvents.length}
              </span>
              <button
                type="button"
                aria-label="下一个历史事件"
                onClick={() => handleStep(1)}
                className="inline-flex items-center justify-center w-9 h-9 border border-stone-300 bg-[#F8F5EF] hover:border-[#1C1917] text-[#1C1917] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative overflow-x-auto pb-2">
            {/* Horizontal connecting axis line */}
            <div
              aria-hidden="true"
              className="hidden sm:block absolute left-4 right-4 top-[22px] h-[1px] bg-stone-300"
            />
            <div className="flex items-stretch gap-3 min-w-max">
              {filteredEvents.map((event) => {
                const isSelected = event.id === activeEvent.id;
                return (
                  <button
                    key={event.id}
                    type="button"
                    aria-current={isSelected ? 'step' : undefined}
                    onClick={() => setSelectedEventId(event.id)}
                    className={`relative w-[205px] text-left pt-8 pb-3.5 px-3.5 border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A2B1F] ${
                      isSelected
                        ? 'bg-[#1C1917] text-[#FDFBF7] border-[#1C1917]'
                        : 'bg-[#F8F5EF] text-[#1C1917] border-stone-300/70 hover:border-[#9A2B1F]'
                    }`}
                  >
                    {/* Axis marker */}
                    <span
                      aria-hidden="true"
                      className={`absolute left-3.5 top-3.5 w-3 h-3 border-2 transition-colors ${
                        isSelected
                          ? 'bg-[#9A2B1F] border-[#FDFBF7]'
                          : 'bg-[#FDFBF7] border-[#9A2B1F]'
                      }`}
                    />
                    <div className="text-[11px] font-mono tabular-nums tracking-tight opacity-85">
                      {event.yearDisplay}
                    </div>
                    <div className="mt-1 font-serif text-sm font-semibold line-clamp-2 leading-snug">
                      {event.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Milestone Featured Exhibition Stage */}
        <article
          data-testid="active-timeline-event"
          className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 bg-[#FDFBF7] border border-stone-300/90 p-6 sm:p-8 items-stretch"
        >
          {/* Artwork Left */}
          <figure className="lg:col-span-6 flex flex-col">
            <div className="flex-1 overflow-hidden border border-stone-300/80 bg-[#EFEAE0] p-2">
              <div className="aspect-[4/3] lg:h-full w-full overflow-hidden">
                <ResilientImage
                  src={activeEvent.image}
                  alt={activeEvent.imageCaption}
                  fallbackTitle={activeEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <figcaption className="mt-2.5 text-xs font-serif text-[#78716C]">
              {activeEvent.imageCaption}
            </figcaption>
          </figure>

          {/* Details Right */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Unboxed quiet metadata line */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#78716C]">
                <span className="font-mono tabular-nums font-medium text-[#9A2B1F]">
                  {activeEvent.yearDisplay}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeEvent.eraLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  {activeEvent.location}
                </span>
              </div>

              <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] leading-snug">
                {activeEvent.title}
              </h3>

              <p className="mt-4 text-sm sm:text-base leading-[1.8] text-[#292524]">
                {activeEvent.summary}
              </p>

              <dl className="mt-6 pt-5 border-t border-stone-200 space-y-4">
                <div>
                  <dt className="text-xs font-semibold tracking-wider text-[#9A2B1F]">
                    历史意义
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-[#44403C]">
                    {activeEvent.significance}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wider text-[#24574A]">
                    时代背景
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-[#57534E]">
                    {activeEvent.historicalContext}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Linked Figures Cross-Navigation */}
            <div className="mt-7 pt-5 border-t border-stone-200">
              <p className="text-xs text-[#78716C] mb-3">
                关联仙真与历史人物（点击查看详档或跳转图谱）：
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                {activeEvent.relatedFigureIds.map((figId) => {
                  const fig = figureMap.get(figId);
                  if (!fig) return null;
                  return (
                    <div
                      key={fig.id}
                      className="inline-flex items-center border border-stone-300 bg-[#F8F5EF]"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectFigure(fig.id)}
                        className="px-3 py-1.5 text-xs sm:text-sm font-medium text-[#1C1917] hover:bg-[#EFEAE0] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {fig.name}
                      </button>
                      <button
                        type="button"
                        aria-label={`在关系图谱中查看${fig.name}`}
                        onClick={() => onLocateInGraph(fig.id)}
                        className="px-2 py-1.5 border-l border-stone-300 text-[#9A2B1F] hover:bg-[#9A2B1F] hover:text-[#FDFBF7] transition-colors cursor-pointer"
                        title="在人物关系图谱中定位"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
