import { ArrowDownRight, Compass, ScrollText } from 'lucide-react';
import { ARTWORK } from '../data/taoismData';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onJumpToGraph: () => void;
  onJumpToTimeline: () => void;
}

const ARCHIVE_METRICS = [
  { label: '历史跨度', value: '2,500+ 年', detail: '春秋函谷关至当代流播' },
  { label: '全神仙谱', value: '9 部 · 60 位', detail: '上古三清六御 · 星宿祖师 · 护法八仙' },
  { label: '重大节点', value: '12 事', detail: '互动历史编年时间轴' },
  { label: '专属丹青', value: '64 幅', detail: '一仙一像 · 零重复典藏画卷' },
];

export function HeroSection({
  onJumpToGraph,
  onJumpToTimeline,
}: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative border-b border-stone-300/80 bg-[#F8F5EF]"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 pt-10 pb-12 lg:pt-14 lg:pb-16">
        {/* Curatorial Kicker — quiet unboxed archival line */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-[0.16em] text-[#78716C] mb-6">
          <span>中华道文化数字典藏馆</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span>先秦哲思与历代仙真谱系总览</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span className="font-mono tabular-nums">BCE 516 — PRESENT</span>
        </div>

        {/* 2-column balanced Museum Exhibition Marquee */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Editorial Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[52px] font-bold leading-[1.18] tracking-tight text-[#1C1917]">
                道法自然，
                <br />
                万古源流与仙真谱系
              </h1>

              <p className="mt-5 text-base sm:text-[17px] leading-[1.82] text-[#44403C] max-w-xl">
                从春秋末年老子西出函谷关留下五千言《道德经》，到东汉鹤鸣山立教、魏晋金丹与三洞经成，再到盛唐荣光、全真革新与武当金顶。本馆以青绿丹青画卷、历史编年时间轴与互动式仙真关系图谱，全景呈现道家两千五百余年的思想演进与神仙世界。
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-300/80">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onJumpToGraph}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#FDFBF7] bg-[#9A2B1F] hover:bg-[#7F1D1D] rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A2B1F]"
                >
                  <Compass className="w-4 h-4" aria-hidden="true" />
                  进入人物关系图谱
                </button>

                <button
                  type="button"
                  onClick={onJumpToTimeline}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-[#1C1917] bg-[#FDFBF7] border border-stone-300 hover:border-[#1C1917] hover:bg-[#EFEAE0] rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1917]"
                >
                  <ScrollText className="w-4 h-4" aria-hidden="true" />
                  浏览历史时间轴
                </button>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-[#78716C]">
                “人法地，地法天，天法道，道法自然。” —— 《道德经 · 第二十五章》
              </p>
            </div>
          </div>

          {/* Right Panoramic Museum Plate */}
          <figure className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 overflow-hidden border border-stone-300/90 bg-[#EFEAE0] p-2 sm:p-3">
              <div className="relative w-full h-full min-h-[260px] sm:min-h-[360px] lg:min-h-[420px] overflow-hidden">
                <ResilientImage
                  src={ARTWORK.heroLaozi}
                  alt="宋代青绿山水风格画卷：老子骑青牛西出函谷关，云雾缭绕于苍翠群峰之间"
                  fallbackTitle="老子西出函谷关青绿山水卷"
                  loading="eager"
                  className="w-full h-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-4 text-[#FDFBF7]">
                  <div>
                    <p className="text-[11px] tracking-[0.16em] text-stone-200/90">
                      序卷图版 · PLATE I
                    </p>
                    <p className="font-serif text-base sm:text-lg font-medium mt-0.5">
                      紫气东来 · 老子骑青牛西出函谷关
                    </p>
                  </div>
                  <a
                    href="#origins"
                    className="hidden sm:inline-flex items-center gap-1 text-xs text-stone-100 hover:text-white underline underline-offset-4 whitespace-nowrap shrink-0"
                  >
                    研读源流
                    <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
            <figcaption className="mt-2.5 flex items-center justify-between text-xs text-[#78716C] font-serif">
              <span>图序 · 仿宋青绿设色手卷意象，描绘周室守藏史李耳西出关隘之景</span>
              <span className="font-mono tabular-nums hidden sm:inline">ACC. DZ-000</span>
            </figcaption>
          </figure>
        </div>

        {/* Full-width 4-column archival overview strip below hero split */}
        <dl className="mt-10 pt-8 border-t border-stone-300/80 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {ARCHIVE_METRICS.map((item) => (
            <div key={item.label} className="space-y-1">
              <dt className="text-xs tracking-[0.14em] text-[#78716C]">
                {item.label}
              </dt>
              <dd className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] tabular-nums">
                {item.value}
              </dd>
              <dd className="text-xs text-[#57534E]">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
