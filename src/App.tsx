import { useEffect, useMemo, useState } from 'react';
import { TAOIST_FIGURES } from './data/taoismData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { OriginsSection } from './components/OriginsSection';
import { TimelineSection } from './components/TimelineSection';
import { PantheonSection } from './components/PantheonSection';
import { RelationshipGraphSection } from './components/RelationshipGraphSection';
import { GallerySection } from './components/GallerySection';
import { FigureDetailModal } from './components/FigureDetailModal';

const SECTION_IDS = ['origins', 'timeline', 'pantheon', 'graph', 'gallery'];

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('origins');
  const [selectedGraphFigureId, setSelectedGraphFigureId] =
    useState<string>('laozi');
  const [modalFigureId, setModalFigureId] = useState<string | null>(null);

  const modalFigure = useMemo(
    () => TAOIST_FIGURES.find((f) => f.id === modalFigureId) ?? null,
    [modalFigureId],
  );

  // Subtle scroll-spy for header active underline
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.35] },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLocateInGraph = (figureId: string) => {
    setSelectedGraphFigureId(figureId);
    scrollToSection('graph');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#1C1917]">
      <Header
        activeSection={activeSection}
        onJumpToGraph={() => scrollToSection('graph')}
      />

      <main className="flex-1">
        <HeroSection
          onJumpToGraph={() => scrollToSection('graph')}
          onJumpToTimeline={() => scrollToSection('timeline')}
        />

        <OriginsSection />

        <TimelineSection
          onSelectFigure={(id) => setModalFigureId(id)}
          onLocateInGraph={handleLocateInGraph}
        />

        <PantheonSection
          onSelectFigure={(id) => setModalFigureId(id)}
          onLocateInGraph={handleLocateInGraph}
        />

        <RelationshipGraphSection
          selectedFigureId={selectedGraphFigureId}
          onSelectGraphFigure={setSelectedGraphFigureId}
          onOpenFigureDossier={(id) => setModalFigureId(id)}
        />

        <GallerySection />
      </main>

      {/* Quiet Museum Institutional Footer */}
      <footer className="border-t border-stone-300/90 bg-[#EFEAE0] text-[#57534E]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-serif text-lg font-bold tracking-[0.14em] text-[#1C1917]">
              道藏通鉴
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-[#57534E] max-w-md">
              中华道家思想渊源、历代重大事件编年、仙真谱系与互动关系图谱数字典藏馆。
            </p>
          </div>

          <nav
            aria-label="页脚导览"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#44403C]"
          >
            <a href="#origins" className="hover:text-[#9A2B1F] transition-colors">
              渊源流变
            </a>
            <a href="#timeline" className="hover:text-[#9A2B1F] transition-colors">
              历史时间轴
            </a>
            <a href="#pantheon" className="hover:text-[#9A2B1F] transition-colors">
              仙真谱系
            </a>
            <a href="#graph" className="hover:text-[#9A2B1F] transition-colors">
              人物图谱
            </a>
            <a href="#gallery" className="hover:text-[#9A2B1F] transition-colors">
              丹青画卷
            </a>
          </nav>
        </div>
      </footer>

      {/* Accessible Figure Dossier Modal */}
      <FigureDetailModal
        figure={modalFigure}
        onClose={() => setModalFigureId(null)}
        onSelectFigure={(id) => setModalFigureId(id)}
        onLocateInGraph={handleLocateInGraph}
      />
    </div>
  );
}
