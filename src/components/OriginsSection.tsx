import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ORIGINS_CHAPTERS } from '../data/taoismData';
import { PANTHEON_EVOLUTION_STAGES } from '../data/pantheonAlmanacData';
import { ResilientImage } from './ResilientImage';

export function OriginsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const chapter = ORIGINS_CHAPTERS[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? ORIGINS_CHAPTERS.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === ORIGINS_CHAPTERS.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <section
      id="origins"
      className="py-16 lg:py-24 border-b border-stone-300/80 bg-[#FDFBF7]"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-300/80">
          <div>
            <p className="text-xs tracking-[0.18em] text-[#9A2B1F] font-medium mb-2">
              第一卷 · 源流考略
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
              道家起源与两千年发展脉络
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#57534E] max-w-xl leading-relaxed">
            由先秦哲学发端，经秦汉方仙与天师立教，至魏晋定型、唐宋鼎盛与明清集大成。择卷点阅，考镜道脉源流。
          </p>
        </div>

        {/* Exhibition Chapter Selector Tabs */}
        <div
          role="tablist"
          aria-label="道家发展五卷章节"
          className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2"
        >
          {ORIGINS_CHAPTERS.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`chapter-panel-${item.id}`}
                onClick={() => setActiveIndex(idx)}
                className={`text-left px-4 py-3.5 border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A2B1F] ${
                  isSelected
                    ? 'bg-[#1C1917] text-[#FDFBF7] border-[#1C1917]'
                    : 'bg-[#F8F5EF] text-[#44403C] border-stone-300/80 hover:border-[#1C1917] hover:bg-[#EFEAE0]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-mono tabular-nums">
                  <span className={isSelected ? 'text-[#E7B5AC]' : 'text-[#9A2B1F]'}>
                    {item.index}.
                  </span>
                  <span className={isSelected ? 'text-stone-300' : 'text-[#78716C]'}>
                    {item.eraLabel}
                  </span>
                </div>
                <p className="mt-1.5 font-serif text-sm font-semibold truncate">
                  {item.title.split('：')[0]}
                </p>
              </button>
            );
          })}
        </div>

        {/* Reading Progress Bar */}
        <div
          aria-hidden="true"
          className="mt-4 h-[2px] w-full bg-stone-200 overflow-hidden"
        >
          <div
            className="h-full bg-[#9A2B1F] transition-transform duration-300 origin-left"
            style={{
              transform: `scaleX(${(activeIndex + 1) / ORIGINS_CHAPTERS.length})`,
            }}
          />
        </div>

        {/* Asymmetric Museum Editorial Reading Canvas (70% essay + artwork / 30% margin notes & concepts) */}
        <article
          id={`chapter-panel-${chapter.id}`}
          role="tabpanel"
          className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start"
        >
          {/* Main Essay Column */}
          <div className="lg:col-span-8 space-y-8">
            <header>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C] tracking-wider">
                <span className="font-mono tabular-nums text-[#9A2B1F] font-medium">
                  第 {chapter.index} 卷
                </span>
                <span aria-hidden="true">·</span>
                <span>{chapter.eraLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{chapter.span}</span>
              </div>
              <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] leading-snug">
                {chapter.title}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#57534E]">
                {chapter.subtitle}
              </p>
            </header>

            {/* Captioned Chapter Artwork */}
            <figure>
              <div className="border border-stone-300/90 bg-[#F8F5EF] p-2.5">
                <div className="aspect-[4/3] max-h-[460px] w-full overflow-hidden bg-[#EFEAE0]">
                  <ResilientImage
                    src={chapter.image}
                    alt={chapter.imageCaption}
                    fallbackTitle={chapter.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#78716C] font-serif">
                <span>{chapter.imageCaption}</span>
                <span className="font-mono tabular-nums">{chapter.figureNumber}</span>
              </figcaption>
            </figure>

            {/* Long-form Editorial Prose with Drop Cap */}
            <div className="max-w-[68ch] space-y-5 text-[15px] sm:text-base leading-[1.88] text-[#292524]">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-[#9A2B1F] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
                {chapter.leadParagraph}
              </p>
              {chapter.bodyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Museum Pull Quote — clean top/bottom hairline rules (no thick border-l-4) */}
            <blockquote className="py-6 border-y border-stone-300/90 max-w-[68ch]">
              <p className="font-serif text-xl sm:text-2xl leading-relaxed text-[#1C1917]">
                “{chapter.pullQuote}”
              </p>
              <footer className="mt-3 text-xs tracking-wider text-[#78716C]">
                —— {chapter.quoteSource}
              </footer>
            </blockquote>

            {/* Prev / Next Chapter Controls */}
            <div className="pt-2 flex items-center justify-between gap-4 border-t border-stone-200">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-2 py-2.5 px-4 text-sm font-medium text-[#1C1917] bg-[#F8F5EF] border border-stone-300 hover:border-[#1C1917] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                上一卷
              </button>
              <span className="text-xs font-mono tabular-nums text-[#78716C]">
                {activeIndex + 1} / {ORIGINS_CHAPTERS.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 py-2.5 px-4 text-sm font-medium text-[#1C1917] bg-[#F8F5EF] border border-stone-300 hover:border-[#1C1917] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                下一卷
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right Curatorial Margin Sidebar (30%) */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            {/* Key Doctrinal Concepts */}
            <div className="bg-[#F8F5EF] border border-stone-300/80 p-6">
              <h4 className="font-serif text-base font-bold text-[#1C1917] pb-3 border-b border-stone-300/80">
                本卷核心名相
              </h4>
              <dl className="mt-4 space-y-4">
                {chapter.keyConcepts.map((concept) => (
                  <div
                    key={concept.term}
                    className="pb-4 border-b border-stone-200/80 last:border-b-0 last:pb-0"
                  >
                    <dt className="font-serif text-sm font-semibold text-[#9A2B1F]">
                      {concept.term}
                    </dt>
                    <dd className="mt-1 text-xs sm:text-sm leading-relaxed text-[#57534E]">
                      {concept.meaning}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Archival Margin Citations */}
            <div className="border-t border-stone-300/80 pt-6">
              <h4 className="text-xs tracking-[0.16em] text-[#78716C] font-medium mb-4">
                边注与史料考据
              </h4>
              <dl className="space-y-4">
                {chapter.marginNotes.map((note) => (
                  <div key={note.label}>
                    <dt className="text-xs font-semibold text-[#1C1917]">
                      {note.label}
                    </dt>
                    <dd className="mt-1 text-xs leading-relaxed text-[#57534E]">
                      {note.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </article>

        {/* 道教神仙谱系演进六阶简史（参酌《真灵位业图》《列宿万灵朝真图》文献脉络） */}
        <div className="mt-14 pt-10 border-t border-stone-300/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs tracking-[0.16em] text-[#9A2B1F] font-medium">
                源流专考 · 神谱定型史
              </p>
              <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
                中国道教神仙谱系六阶演进脉络
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] max-w-lg leading-relaxed">
              从上古创世神话与《山海经》起步，经陶弘景《真灵位业图》初分七阶，至两宋大斋醮神名单完备，全景梳理道教诸神体系的历代层累。
            </p>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PANTHEON_EVOLUTION_STAGES.map((stage) => (
              <li
                key={stage.index}
                className="p-5 bg-[#F8F5EF] border border-stone-300/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-semibold text-[#9A2B1F]">
                      第 {stage.index} 阶
                    </span>
                    <span className="text-[#78716C]">{stage.era}</span>
                  </div>
                  <h4 className="mt-1.5 font-serif text-base font-bold text-[#1C1917]">
                    {stage.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#44403C]">
                    {stage.summary}
                  </p>
                </div>
                <p className="mt-3 pt-2.5 border-t border-stone-200/90 text-[11px] text-[#78716C]">
                  代表典籍：{stage.classicTexts}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
