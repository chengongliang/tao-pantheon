import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import {
  GALLERY_CATEGORY_FILTERS,
  GALLERY_PLATES,
  type GalleryCategory,
  type GalleryPlate,
} from '../data/taoismData';
import {
  GALLERY_SORT_META,
  SORT_MODE_OPTIONS,
  type CatalogSortMode,
} from '../data/taoismSortMeta';
import { filterAndSortGalleryPlates } from '../utils/taoismLogic';
import { ResilientImage } from './ResilientImage';

export function GallerySection() {
  const [category, setCategory] = useState<GalleryCategory>('all');
  const [sortBy, setSortBy] = useState<CatalogSortMode>('importance');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visiblePlates = useMemo(
    () => filterAndSortGalleryPlates(GALLERY_PLATES, { category, sortBy }),
    [category, sortBy],
  );

  const activeSortOption = useMemo(
    () => SORT_MODE_OPTIONS.find((opt) => opt.id === sortBy) ?? SORT_MODE_OPTIONS[0],
    [sortBy],
  );

  const activePlate: GalleryPlate | null =
    activeIndex !== null ? visiblePlates[activeIndex] ?? null : null;

  useEffect(() => {
    setActiveIndex(null);
  }, [category, sortBy]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev + 1) % visiblePlates.length,
        );
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + visiblePlates.length) % visiblePlates.length,
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, visiblePlates.length]);

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-[#FDFBF7]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-300/80">
          <div>
            <p className="text-xs tracking-[0.18em] text-[#9A2B1F] font-medium mb-2">
              第五卷 · 丹青图像志
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
              道教山水、壁画与全神谱丹青典藏
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#57534E] max-w-xl leading-relaxed">
            全馆共收录 {GALLERY_PLATES.length} 幅无重复仿宋元青绿山水、永乐宫式壁画与明代仙真立轴画作，支持按「重要顺序」「时间顺序」与「正统神阶」三种脉络自由切换鉴赏。
          </p>
        </div>

        {/* Category Filter Tabs + Sort Mode Switcher */}
        <div className="mt-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div
            role="group"
            aria-label="按题材筛选丹青画卷"
            className="flex flex-wrap items-center gap-2"
          >
            {GALLERY_CATEGORY_FILTERS.map((tab) => {
              const isActive = category === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setCategory(tab.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#1C1917] text-[#FDFBF7] border-[#1C1917]'
                      : 'bg-[#F8F5EF] text-[#44403C] border-stone-300 hover:border-[#1C1917]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Sort Switcher */}
          <div
            role="group"
            aria-label="丹青画卷排序方式"
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

        <div className="mt-4 flex items-center justify-between text-xs text-[#78716C]">
          <span
            className="font-mono tabular-nums"
            data-testid="gallery-count"
          >
            当前「{activeSortOption.label}」显示 {visiblePlates.length} / {GALLERY_PLATES.length} 幅藏品 · {activeSortOption.description}
          </span>
        </div>

        {/* Curatorial Gallery Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {visiblePlates.map((plate, index) => {
            const sortMeta = GALLERY_SORT_META[plate.id];
            const orderTag =
              sortBy === 'importance'
                ? `要序 ${String(sortMeta?.importanceRank ?? plate.order).padStart(2, '0')} · ${plate.plateNo}`
                : sortBy === 'chronology'
                  ? `时序 ${String(sortMeta?.chronologyOrder ?? plate.order).padStart(2, '0')} · ${plate.plateNo}`
                  : plate.plateNo;
            const rightMeta =
              sortBy === 'chronology' && sortMeta?.chronologyPeriod
                ? sortMeta.chronologyPeriod
                : plate.dynastyStyle;

            return (
            <figure
              key={plate.id}
              data-plate-id={plate.id}
              className="group flex flex-col bg-[#F8F5EF] border border-stone-300/80"
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`放大鉴赏：${plate.title}`}
                className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFEAE0] p-2.5 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9A2B1F]"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <ResilientImage
                    src={plate.image}
                    alt={`${plate.title}：${plate.caption}`}
                    fallbackTitle={plate.title}
                    className={`w-full h-full object-cover ${
                      plate.aspect === 'portrait' ? 'object-top' : 'object-center'
                    } transition-transform duration-300 group-hover:scale-[1.04]`}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#FDFBF7] bg-[#1C1917]/85">
                      <Eye className="w-3.5 h-3.5" />
                      大图鉴赏
                    </span>
                  </div>
                </div>
              </button>

              <figcaption className="p-4 flex-1 flex flex-col justify-between border-t border-stone-200/80">
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-[#78716C]">
                    <span className="font-mono tabular-nums text-[#9A2B1F] shrink-0">
                      {orderTag}
                    </span>
                    <span className="truncate">{rightMeta}</span>
                  </div>
                  <h3 className="mt-1.5 font-serif text-base font-bold text-[#1C1917]">
                    {plate.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#57534E]">
                    {plate.caption}
                  </p>
                </div>
                <p className="mt-3 pt-2.5 border-t border-stone-200/70 text-[11px] text-[#78716C]">
                  题材：{plate.subject}
                </p>
              </figcaption>
            </figure>
            );
          })}
        </div>
      </div>

      {/* High-Resolution Lightbox Modal */}
      {activePlate && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`大图鉴赏：${activePlate.title}`}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveIndex(null);
          }}
        >
          <div className="relative w-full max-w-5xl bg-[#1C1917] text-[#FDFBF7] border border-stone-700 overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-stone-800">
              <div className="text-xs text-stone-300 flex items-center gap-2.5">
                <span className="font-mono tabular-nums text-[#E7B5AC]">
                  {activePlate.plateNo}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-serif text-sm font-medium text-white">
                  {activePlate.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="上一幅画卷"
                  onClick={() =>
                    setActiveIndex(
                      (activeIndex - 1 + visiblePlates.length) %
                        visiblePlates.length,
                    )
                  }
                  className="w-8 h-8 inline-flex items-center justify-center border border-stone-700 hover:bg-stone-800 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="下一幅画卷"
                  onClick={() =>
                    setActiveIndex((activeIndex + 1) % visiblePlates.length)
                  }
                  className="w-8 h-8 inline-flex items-center justify-center border border-stone-700 hover:bg-stone-800 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="关闭大图鉴赏"
                  onClick={() => setActiveIndex(null)}
                  className="w-8 h-8 inline-flex items-center justify-center border border-stone-700 hover:bg-stone-800 cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="bg-black flex items-center justify-center max-h-[70vh] overflow-hidden p-4">
              <ResilientImage
                src={activePlate.image}
                alt={activePlate.title}
                fallbackTitle={activePlate.title}
                className="max-h-[64vh] w-auto object-contain"
              />
            </div>

            <div className="px-6 py-4 bg-[#1C1917] border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                {activePlate.caption}
              </p>
              <span className="text-xs text-stone-400 shrink-0">
                {activePlate.dynastyStyle} · {activePlate.subject}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
