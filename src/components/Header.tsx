import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onJumpToGraph: () => void;
}

const NAV_ITEMS = [
  { id: 'origins', label: '渊源流变' },
  { id: 'timeline', label: '历史时间轴' },
  { id: 'pantheon', label: '仙真谱系' },
  { id: 'graph', label: '人物图谱' },
  { id: 'gallery', label: '丹青画卷' },
];

export function Header({ activeSection, onJumpToGraph }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5EF]/95 backdrop-blur-sm border-b border-stone-300/70">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <a
          href="#top"
          className="font-serif text-xl sm:text-2xl font-bold tracking-[0.14em] text-[#1C1917] hover:text-[#9A2B1F] transition-colors whitespace-nowrap shrink-0"
        >
          道藏通鉴
        </a>

        {/* Zone 2: 5 clean single-line navigation links */}
        <nav
          aria-label="主导航"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'text-[#9A2B1F] font-semibold'
                    : 'hover:text-[#1C1917]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-[#9A2B1F]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA (+ mobile menu button on small viewports) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onJumpToGraph}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-[#FDFBF7] bg-[#9A2B1F] hover:bg-[#7F1D1D] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A2B1F]"
          >
            探索图谱
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-[#1C1917] border border-stone-300 rounded-sm hover:bg-[#EFEAE0] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="移动端导航"
          className="md:hidden border-t border-stone-300/70 bg-[#FDFBF7] px-5 py-3 flex flex-col gap-1"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 px-2 text-sm font-medium border-b border-stone-200/60 last:border-b-0 ${
                activeSection === item.id
                  ? 'text-[#9A2B1F] font-semibold'
                  : 'text-[#1C1917]'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
