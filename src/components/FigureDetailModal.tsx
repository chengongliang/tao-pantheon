import { useEffect, useMemo } from 'react';
import { ArrowUpRight, Compass, X } from 'lucide-react';
import {
  RELATIONSHIPS,
  TAOIST_FIGURES,
  type TaoistFigure,
} from '../data/taoismData';
import { ResilientImage } from './ResilientImage';

interface FigureDetailModalProps {
  figure: TaoistFigure | null;
  onClose: () => void;
  onSelectFigure: (figureId: string) => void;
  onLocateInGraph: (figureId: string) => void;
}

export function FigureDetailModal({
  figure,
  onClose,
  onSelectFigure,
  onLocateInGraph,
}: FigureDetailModalProps) {
  useEffect(() => {
    if (!figure) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [figure, onClose]);

  const relatedLinks = useMemo(() => {
    if (!figure) return [];
    const map = new Map(TAOIST_FIGURES.map((f) => [f.id, f]));
    return RELATIONSHIPS.filter(
      (r) => r.source === figure.id || r.target === figure.id,
    )
      .map((rel) => {
        const otherId = rel.source === figure.id ? rel.target : rel.source;
        const other = map.get(otherId);
        if (!other) return null;
        return {
          rel,
          other,
          direction: rel.source === figure.id ? 'outgoing' : 'incoming',
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [figure]);

  if (!figure) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="figure-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FDFBF7] border border-stone-400 shadow-2xl">
        {/* Top Archival Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-[#F8F5EF] border-b border-stone-300">
          <div className="flex items-center gap-2.5 text-xs text-[#78716C]">
            <span className="font-mono tabular-nums text-[#9A2B1F] font-semibold">
              {figure.accessionNo}
            </span>
            <span aria-hidden="true">·</span>
            <span>{figure.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>真灵档案详录</span>
          </div>

          <button
            type="button"
            aria-label="关闭人物档案窗口"
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 text-[#1C1917] border border-stone-300 bg-[#FDFBF7] hover:bg-[#EFEAE0] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Portrait & Accession Definition List */}
          <div className="md:col-span-5 space-y-6">
            <div className="border border-stone-300 bg-[#EFEAE0] p-2">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <ResilientImage
                  src={figure.image}
                  alt={`${figure.name}画像`}
                  fallbackTitle={figure.name}
                  className={`w-full h-full object-cover ${
                    figure.imageFocus ?? 'object-center'
                  }`}
                />
              </div>
            </div>

            <dl className="border-t border-stone-300/80 pt-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between gap-3 pb-2.5 border-b border-stone-200">
                <dt className="text-[#78716C] shrink-0">尊号</dt>
                <dd className="text-right font-medium text-[#1C1917]">
                  {figure.honorific}
                </dd>
              </div>
              <div className="flex justify-between gap-3 pb-2.5 border-b border-stone-200">
                <dt className="text-[#78716C] shrink-0">别称</dt>
                <dd className="text-right text-[#44403C]">{figure.alias}</dd>
              </div>
              <div className="flex justify-between gap-3 pb-2.5 border-b border-stone-200">
                <dt className="text-[#78716C] shrink-0">年代</dt>
                <dd className="text-right text-[#44403C]">{figure.era}</dd>
              </div>
              <div className="flex justify-between gap-3 pb-2.5 border-b border-stone-200">
                <dt className="text-[#78716C] shrink-0">道场圣地</dt>
                <dd className="text-right text-[#44403C]">
                  {figure.sacredSite}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#78716C] shrink-0">典籍法器</dt>
                <dd className="text-right text-[#44403C]">
                  {figure.scripturesOrArtifacts.join(' · ')}
                </dd>
              </div>
            </dl>
          </div>

          {/* Right Biography, Quote, and Relationships */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <h2
                id="figure-modal-title"
                className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]"
              >
                {figure.name}
              </h2>
              <p className="mt-1.5 text-sm text-[#9A2B1F] font-medium">
                {figure.honorific}
              </p>

              <p className="mt-5 text-sm sm:text-base leading-[1.85] text-[#292524]">
                {figure.fullBio}
              </p>

              <blockquote className="mt-6 py-4 border-y border-stone-300/80">
                <p className="font-serif text-base sm:text-lg text-[#1C1917] leading-relaxed">
                  “{figure.famousQuote}”
                </p>
              </blockquote>

              {/* Linked Relationships */}
              {relatedLinks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs tracking-[0.14em] text-[#78716C] font-medium mb-3">
                    师承与关联人物（{relatedLinks.length} 项法脉联系）
                  </h3>
                  <ul className="divide-y divide-stone-200 border-y border-stone-200">
                    {relatedLinks.map(({ rel, other }) => (
                      <li
                        key={rel.id}
                        className="py-2.5 flex items-start justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-sm">
                            <button
                              type="button"
                              onClick={() => onSelectFigure(other.id)}
                              className="font-serif font-semibold text-[#1C1917] hover:text-[#9A2B1F] underline underline-offset-4 cursor-pointer"
                            >
                              {other.name}
                            </button>
                            <span aria-hidden="true" className="text-stone-400">
                              ·
                            </span>
                            <span className="text-xs font-medium text-[#24574A]">
                              {rel.label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-[#57534E] leading-relaxed">
                            {rel.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`切换查看${other.name}`}
                          onClick={() => onSelectFigure(other.id)}
                          className="shrink-0 p-1.5 text-[#78716C] hover:text-[#9A2B1F] cursor-pointer"
                        >
                          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-stone-300/80 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const id = figure.id;
                  onClose();
                  onLocateInGraph(id);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#FDFBF7] bg-[#9A2B1F] hover:bg-[#7F1D1D] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-4 h-4" aria-hidden="true" />
                在关系图谱中查看
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-[#44403C] border border-stone-300 bg-[#F8F5EF] hover:border-[#1C1917] transition-colors cursor-pointer"
              >
                返回谱系目录
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
