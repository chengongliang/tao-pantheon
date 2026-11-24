import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  ArrowRight,
  BookOpen,
  Maximize2,
  RotateCcw,
  Search,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  CATEGORY_FILTERS,
  RELATION_FILTERS,
  RELATIONSHIPS,
  TAOIST_FIGURES,
  type FigureCategory,
  type RelationType,
} from '../data/taoismData';
import {
  GRAPH_CANVAS_HEIGHT,
  GRAPH_CANVAS_WIDTH,
  computeGraphSubnetwork,
  computeNodeLayout,
  type GraphLayoutMode,
  type NodePosition,
} from '../utils/taoismLogic';
import { ResilientImage } from './ResilientImage';

interface RelationshipGraphSectionProps {
  selectedFigureId: string;
  onSelectGraphFigure: (figureId: string) => void;
  onOpenFigureDossier: (figureId: string) => void;
}

const CATEGORY_COLOR_MAP: Record<string, string> = {
  'sanqing-liuyu': '#9A2B1F',
  'wulao-sanguan': '#6D4C7D',
  'sages-patriarchs': '#24574A',
  'guardians-immortals': '#3B526B',
};

const RELATION_STYLE_MAP: Record<
  string,
  { color: string; dash?: string; label: string }
> = {
  'master-disciple': { color: '#9A2B1F', label: '师承传道' },
  pantheon: { color: '#8C6239', label: '神系尊奉' },
  lineage: { color: '#24574A', label: '宗派承续' },
  companions: { color: '#3B526B', dash: '6 4', label: '同门共修' },
  scripture: { color: '#6D4C7D', dash: '2 4', label: '典籍承传' },
};

const TIER_LABELS = [
  { y: 64, text: '三清至圣' },
  { y: 198, text: '上古创世' },
  { y: 332, text: '六御二祖' },
  { y: 466, text: '五老星冥' },
  { y: 600, text: '上古先秦' },
  { y: 734, text: '天师祖师' },
  { y: 870, text: '护法民俗' },
  { y: 1006, text: '民间八仙' },
];

export function RelationshipGraphSection({
  selectedFigureId,
  onSelectGraphFigure,
  onOpenFigureDossier,
}: RelationshipGraphSectionProps) {
  const [layoutMode, setLayoutMode] = useState<GraphLayoutMode>('hierarchy');
  const [relationFilter, setRelationFilter] = useState<RelationType>('all');
  const [categoryFilter, setCategoryFilter] = useState<FigureCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Interactive viewport pan / zoom + manual node drag offsets
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [customOffsets, setCustomOffsets] = useState<
    Record<string, { dx: number; dy: number }>
  >({});

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragStateRef = useRef<
    | { kind: 'pan'; startX: number; startY: number; origPanX: number; origPanY: number }
    | {
        kind: 'node';
        nodeId: string;
        startX: number;
        startY: number;
        origDx: number;
        origDy: number;
        moved: boolean;
      }
    | null
  >(null);

  // Reset manual node offsets when switching layout mode
  useEffect(() => {
    setCustomOffsets({});
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }, [layoutMode]);

  const basePositions = useMemo(
    () => computeNodeLayout(TAOIST_FIGURES, layoutMode),
    [layoutMode],
  );

  const positions = useMemo(() => {
    const merged: Record<string, NodePosition> = {};
    for (const [id, pos] of Object.entries(basePositions)) {
      const offset = customOffsets[id];
      merged[id] = {
        id,
        x: pos.x + (offset?.dx ?? 0),
        y: pos.y + (offset?.dy ?? 0),
      };
    }
    return merged;
  }, [basePositions, customOffsets]);

  const subnetwork = useMemo(
    () =>
      computeGraphSubnetwork(TAOIST_FIGURES, RELATIONSHIPS, {
        selectedId: selectedFigureId,
        relationFilter,
        categoryFilter,
        searchQuery,
      }),
    [selectedFigureId, relationFilter, categoryFilter, searchQuery],
  );

  const activeFocusId =
    hoveredNodeId && subnetwork.visibleNodes.some((n) => n.id === hoveredNodeId)
      ? hoveredNodeId
      : subnetwork.selectedFigure?.id ?? null;

  const activeConnectedIds = useMemo(() => {
    if (!activeFocusId) return new Set<string>();
    const set = new Set<string>([activeFocusId]);
    for (const edge of subnetwork.visibleEdges) {
      if (edge.source === activeFocusId) set.add(edge.target);
      if (edge.target === activeFocusId) set.add(edge.source);
    }
    return set;
  }, [activeFocusId, subnetwork.visibleEdges]);

  const clientToSvgDelta = (dxClient: number, dyClient: number) => {
    const svg = svgRef.current;
    if (!svg) return { dx: dxClient, dy: dyClient };
    const rect = svg.getBoundingClientRect();
    const scaleX = GRAPH_CANVAS_WIDTH / Math.max(rect.width, 1);
    const scaleY = GRAPH_CANVAS_HEIGHT / Math.max(rect.height, 1);
    return {
      dx: (dxClient * scaleX) / zoom,
      dy: (dyClient * scaleY) / zoom,
    };
  };

  const handleCanvasPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    // Only pan when dragging background
    if ((e.target as Element).closest('[data-graph-node="true"]')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      kind: 'pan',
      startX: e.clientX,
      startY: e.clientY,
      origPanX: pan.x,
      origPanY: pan.y,
    };
  };

  const handleNodePointerDown = (
    e: ReactPointerEvent<SVGGElement>,
    nodeId: string,
  ) => {
    e.stopPropagation();
    svgRef.current?.setPointerCapture(e.pointerId);
    const existing = customOffsets[nodeId] ?? { dx: 0, dy: 0 };
    dragStateRef.current = {
      kind: 'node',
      nodeId,
      startX: e.clientX,
      startY: e.clientY,
      origDx: existing.dx,
      origDy: existing.dy,
      moved: false,
    };
  };

  const handlePointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const state = dragStateRef.current;
    if (!state) return;

    const rawDx = e.clientX - state.startX;
    const rawDy = e.clientY - state.startY;
    const { dx, dy } = clientToSvgDelta(rawDx, rawDy);

    if (state.kind === 'pan') {
      setPan({
        x: state.origPanX + dx,
        y: state.origPanY + dy,
      });
    } else if (state.kind === 'node') {
      if (Math.hypot(rawDx, rawDy) > 4) {
        state.moved = true;
      }
      setCustomOffsets((prev) => ({
        ...prev,
        [state.nodeId]: {
          dx: state.origDx + dx,
          dy: state.origDy + dy,
        },
      }));
    }
  };

  const handlePointerUp = () => {
    const state = dragStateRef.current;
    if (state?.kind === 'node' && !state.moved) {
      onSelectGraphFigure(state.nodeId);
    }
    dragStateRef.current = null;
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setCustomOffsets({});
    setRelationFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
  };

  const selectedFigure =
    subnetwork.selectedFigure ?? subnetwork.visibleNodes[0] ?? TAOIST_FIGURES[0];

  return (
    <section
      id="graph"
      className="py-16 lg:py-24 border-b border-stone-300/80 xuan-surface"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-300/80">
          <div>
            <p className="text-xs tracking-[0.18em] text-[#9A2B1F] font-medium mb-2">
              第四卷 · 互动法脉图谱
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
              仙真与历代祖师互动人物关系图谱
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#57534E] max-w-xl leading-relaxed">
            六十位仙真与历代祖师依八重正统神阶与朝代先后（三清至圣 → 上古创世 → 六御二祖 → 五老星冥 → 上古先秦 → 天师祖师 → 护法民俗 → 民间八仙）严密排布。点击任意节点高亮师承与神系脉络，支持拖拽节点、缩放漫游及双视图切换。
          </p>
        </div>

        {/* Interactive Graph Toolbar */}
        <div className="mt-7 bg-[#FDFBF7] border border-stone-300/90 p-4 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Relation Filter Buttons */}
            <div
              role="group"
              aria-label="按关系类型筛选图谱连线"
              className="flex flex-wrap items-center gap-1.5"
            >
              {RELATION_FILTERS.map((rel) => {
                const isActive = relationFilter === rel.id;
                return (
                  <button
                    key={rel.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setRelationFilter(rel.id)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#9A2B1F] text-[#FDFBF7] border-[#9A2B1F]'
                        : 'bg-[#F8F5EF] text-[#44403C] border-stone-300 hover:border-[#1C1917]'
                    }`}
                  >
                    {rel.label}
                  </button>
                );
              })}
            </div>

            {/* Layout Mode & Search Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                role="group"
                aria-label="图谱布局切换"
                className="inline-flex border border-stone-300 bg-[#F8F5EF] p-0.5"
              >
                <button
                  type="button"
                  aria-pressed={layoutMode === 'hierarchy'}
                  onClick={() => setLayoutMode('hierarchy')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    layoutMode === 'hierarchy'
                      ? 'bg-[#1C1917] text-[#FDFBF7]'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  谱系分层
                </button>
                <button
                  type="button"
                  aria-pressed={layoutMode === 'constellation'}
                  onClick={() => setLayoutMode('constellation')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    layoutMode === 'constellation'
                      ? 'bg-[#1C1917] text-[#FDFBF7]'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  星图放射
                </button>
              </div>

              <div className="relative w-48 sm:w-56">
                <label htmlFor="graph-search" className="sr-only">
                  在图谱中检索人物
                </label>
                <Search
                  className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="graph-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="检索图谱人物…"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8F5EF] border border-stone-300 text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#9A2B1F]"
                />
              </div>
            </div>
          </div>

          {/* Secondary Realm Filter & Explicit Color+Text Legend */}
          <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-[#57534E]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[#78716C]">神系分层：</span>
              {CATEGORY_FILTERS.map((cat) => {
                const isSelected = categoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`inline-flex items-center gap-1.5 py-0.5 cursor-pointer transition-colors whitespace-nowrap ${
                      isSelected
                        ? 'text-[#1C1917] font-semibold underline underline-offset-4'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block w-3 h-3 rounded-full border-2 bg-[#FDFBF7]"
                      style={{ borderColor: cat.color }}
                    />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 font-mono tabular-nums text-[#78716C]">
              <span data-testid="graph-stats">
                节点 {subnetwork.visibleNodes.length} · 脉络{' '}
                {subnetwork.visibleEdges.length}
              </span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Workspace: Interactive SVG Canvas (8 cols) + Synchronized Inspector (4 cols) */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Interactive SVG Graph Canvas */}
          <div className="lg:col-span-8 border border-stone-300/90 bg-[#FDFBF7] overflow-hidden flex flex-col">
            <div className="relative flex-1">
              {/* Floating Zoom / Reset Controls */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-[#F8F5EF]/95 border border-stone-300 p-1">
                <button
                  type="button"
                  aria-label="放大图谱"
                  onClick={() => setZoom((z) => Math.min(1.65, +(z + 0.15).toFixed(2)))}
                  className="w-8 h-8 inline-flex items-center justify-center text-[#1C1917] hover:bg-[#EFEAE0] transition-colors cursor-pointer"
                  title="放大"
                >
                  <ZoomIn className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="缩小图谱"
                  onClick={() => setZoom((z) => Math.max(0.65, +(z - 0.15).toFixed(2)))}
                  className="w-8 h-8 inline-flex items-center justify-center text-[#1C1917] hover:bg-[#EFEAE0] transition-colors cursor-pointer"
                  title="缩小"
                >
                  <ZoomOut className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="重置图谱视图与筛选"
                  onClick={handleResetView}
                  className="w-8 h-8 inline-flex items-center justify-center text-[#1C1917] hover:bg-[#EFEAE0] transition-colors cursor-pointer"
                  title="重置视图"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Canvas Hint — pinned strictly to SVG canvas corner, never overlapping strip below */}
              <div className="absolute bottom-3 left-3 z-10 pointer-events-none text-[11px] text-[#78716C] bg-[#FDFBF7]/92 px-2.5 py-1 border border-stone-200/80">
                点击节点聚焦脉络 · 拖拽节点调整位置 · 拖拽空白处平移
              </div>

              <svg
                ref={svgRef}
                data-testid="relationship-graph-svg"
                viewBox={`0 0 ${GRAPH_CANVAS_WIDTH} ${GRAPH_CANVAS_HEIGHT}`}
                role="region"
                aria-label="道家仙真与祖师互动人物关系图谱画布"
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="w-full h-[560px] sm:h-[640px] lg:h-[700px] select-none touch-none cursor-grab active:cursor-grabbing bg-[#FDFBF7]"
              >
              <defs>
                {/* Clip paths for circular portrait medallions */}
                {TAOIST_FIGURES.map((fig) => (
                  <clipPath key={`clip-${fig.id}`} id={`node-clip-${fig.id}`}>
                    <circle cx="0" cy="0" r="24" />
                  </clipPath>
                ))}

                {/* Arrowheads for each relationship color */}
                {Object.entries(RELATION_STYLE_MAP).map(([type, style]) => (
                  <marker
                    key={`arrow-${type}`}
                    id={`arrow-${type}`}
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill={style.color} />
                  </marker>
                ))}
              </defs>

              <g
                transform={`translate(${GRAPH_CANVAS_WIDTH / 2 + pan.x * zoom}, ${
                  GRAPH_CANVAS_HEIGHT / 2 + pan.y * zoom
                }) scale(${zoom}) translate(-${GRAPH_CANVAS_WIDTH / 2}, -${
                  GRAPH_CANVAS_HEIGHT / 2
                })`}
              >
                {/* Architectural Background Guide Lines */}
                {layoutMode === 'hierarchy' ? (
                  <g aria-hidden="true">
                    {TIER_LABELS.map((tier) => (
                      <g key={tier.text}>
                        <line
                          x1="24"
                          y1={tier.y}
                          x2={GRAPH_CANVAS_WIDTH - 24}
                          y2={tier.y}
                          stroke="#E7E0D5"
                          strokeWidth="1"
                          strokeDasharray="3 5"
                        />
                        <text
                          x="26"
                          y={tier.y - 8}
                          fill="#8C857B"
                          fontSize="13"
                          fontFamily="var(--font-serif)"
                        >
                          {tier.text}
                        </text>
                      </g>
                    ))}
                  </g>
                ) : (
                  <g aria-hidden="true">
                    <ellipse
                      cx={GRAPH_CANVAS_WIDTH / 2}
                      cy={GRAPH_CANVAS_HEIGHT / 2}
                      rx="110"
                      ry="76"
                      fill="none"
                      stroke="#E7E0D5"
                      strokeDasharray="3 5"
                    />
                    <ellipse
                      cx={GRAPH_CANVAS_WIDTH / 2}
                      cy={GRAPH_CANVAS_HEIGHT / 2}
                      rx="265"
                      ry="174"
                      fill="none"
                      stroke="#E7E0D5"
                      strokeDasharray="3 5"
                    />
                    <ellipse
                      cx={GRAPH_CANVAS_WIDTH / 2}
                      cy={GRAPH_CANVAS_HEIGHT / 2}
                      rx="415"
                      ry="272"
                      fill="none"
                      stroke="#E7E0D5"
                      strokeDasharray="3 5"
                    />
                    <ellipse
                      cx={GRAPH_CANVAS_WIDTH / 2}
                      cy={GRAPH_CANVAS_HEIGHT / 2}
                      rx="575"
                      ry="376"
                      fill="none"
                      stroke="#E7E0D5"
                      strokeDasharray="3 5"
                    />
                    <ellipse
                      cx={GRAPH_CANVAS_WIDTH / 2}
                      cy={GRAPH_CANVAS_HEIGHT / 2}
                      rx="735"
                      ry="476"
                      fill="none"
                      stroke="#E7E0D5"
                      strokeDasharray="3 5"
                    />
                  </g>
                )}

                {/* Directed Curved Edges */}
                <g>
                  {subnetwork.visibleEdges.map((edge) => {
                    const p1 = positions[edge.source];
                    const p2 = positions[edge.target];
                    if (!p1 || !p2) return null;

                    const isHighlighted =
                      !activeFocusId ||
                      edge.source === activeFocusId ||
                      edge.target === activeFocusId;

                    const style =
                      RELATION_STYLE_MAP[edge.type] ??
                      RELATION_STYLE_MAP.lineage;

                    // Trim line endpoints so arrowheads meet node ring cleanly
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const dist = Math.hypot(dx, dy) || 1;
                    const padStart = 29;
                    const padEnd = 32;
                    const sx = p1.x + (dx / dist) * padStart;
                    const sy = p1.y + (dy / dist) * padStart;
                    const ex = p2.x - (dx / dist) * padEnd;
                    const ey = p2.y - (dy / dist) * padEnd;

                    // Gentle perpendicular quadratic curve
                    const mx = (sx + ex) / 2;
                    const my = (sy + ey) / 2;
                    const bend = Math.min(28, dist * 0.11);
                    const cx = mx - (dy / dist) * bend;
                    const cy = my + (dx / dist) * bend;

                    // Midpoint on quadratic Bezier for label
                    const lx = 0.25 * sx + 0.5 * cx + 0.25 * ex;
                    const ly = 0.25 * sy + 0.5 * cy + 0.25 * ey;

                    const showEdgeLabel =
                      activeFocusId !== null &&
                      (edge.source === activeFocusId ||
                        edge.target === activeFocusId);

                    return (
                      <g
                        key={edge.id}
                        opacity={isHighlighted ? 1 : 0.22}
                        className="transition-opacity duration-200"
                      >
                        <path
                          d={`M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`}
                          fill="none"
                          stroke={style.color}
                          strokeWidth={showEdgeLabel ? 2.1 : 1.3}
                          strokeDasharray={style.dash}
                          markerEnd={`url(#arrow-${edge.type})`}
                        />
                        {showEdgeLabel && (
                          <g transform={`translate(${lx}, ${ly})`}>
                            <rect
                              x="-28"
                              y="-10"
                              width="56"
                              height="18"
                              rx="2"
                              fill="#FDFBF7"
                              stroke={style.color}
                              strokeWidth="0.8"
                            />
                            <text
                              textAnchor="middle"
                              dominantBaseline="central"
                              y="-1"
                              fill={style.color}
                              fontSize="10"
                              fontWeight="600"
                            >
                              {edge.label}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* Portrait Medallion Nodes */}
                <g>
                  {subnetwork.visibleNodes.map((fig) => {
                    const pos = positions[fig.id];
                    if (!pos) return null;

                    const isSelected = fig.id === selectedFigure?.id;
                    const isConnected =
                      !activeFocusId || activeConnectedIds.has(fig.id);
                    const ringColor =
                      CATEGORY_COLOR_MAP[fig.category] ?? '#1C1917';

                    return (
                      <g
                        key={fig.id}
                        data-graph-node="true"
                        role="button"
                        tabIndex={0}
                        aria-label={`选择图谱人物：${fig.name}（${fig.categoryLabel}）`}
                        aria-pressed={isSelected}
                        transform={`translate(${pos.x}, ${pos.y})`}
                        opacity={isConnected ? 1 : 0.45}
                        onPointerDown={(e) => handleNodePointerDown(e, fig.id)}
                        onMouseEnter={() => setHoveredNodeId(fig.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectGraphFigure(fig.id);
                          }
                        }}
                        className="cursor-pointer focus:outline-none transition-opacity duration-200"
                      >
                        {/* Outer active halo ring */}
                        {isSelected && (
                          <circle
                            r="33"
                            fill="none"
                            stroke="#9A2B1F"
                            strokeWidth="2"
                            strokeDasharray="4 3"
                          />
                        )}

                        {/* Paper medallion backing */}
                        <circle
                          r="27"
                          fill="#FDFBF7"
                          stroke={isSelected ? '#9A2B1F' : ringColor}
                          strokeWidth={isSelected ? 3 : 2}
                        />

                        {/* Portrait Image inside Circular Clip */}
                        <image
                          href={fig.image}
                          x="-24"
                          y="-24"
                          width="48"
                          height="48"
                          preserveAspectRatio="xMidYMin slice"
                          clipPath={`url(#node-clip-${fig.id})`}
                        />

                        {/* Name Labelplate beneath node */}
                        <g transform="translate(0, 39)">
                          {(() => {
                            const plateWidth = Math.max(
                              68,
                              Math.min(118, Math.round(fig.name.length * 12.5 + 16)),
                            );
                            return (
                              <>
                                <rect
                                  x={-plateWidth / 2}
                                  y="-10"
                                  width={plateWidth}
                                  height="21"
                                  rx="2"
                                  fill={isSelected ? '#1C1917' : '#FDFBF7'}
                                  stroke={isSelected ? '#1C1917' : '#D6CEBE'}
                                  strokeWidth="1"
                                />
                                <text
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  fill={isSelected ? '#FDFBF7' : '#1C1917'}
                                  fontSize="11.5"
                                  fontWeight={isSelected ? '600' : '500'}
                                  fontFamily="var(--font-serif)"
                                >
                                  {fig.name}
                                </text>
                              </>
                            );
                          })()}
                        </g>
                      </g>
                    );
                  })}
                </g>
              </g>
            </svg>
            </div>

            {/* Quick Accessible Node Selection Strip for Keyboard / Mobile Users */}
            <div className="border-t border-stone-200 bg-[#F8F5EF] px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] text-[#78716C] shrink-0">
                快速聚焦：
              </span>
              {subnetwork.visibleNodes.map((fig) => {
                const isSel = fig.id === selectedFigure?.id;
                return (
                  <button
                    key={fig.id}
                    type="button"
                    onClick={() => onSelectGraphFigure(fig.id)}
                    className={`px-2.5 py-1 text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 border ${
                      isSel
                        ? 'bg-[#1C1917] text-[#FDFBF7] border-[#1C1917]'
                        : 'bg-[#FDFBF7] text-[#44403C] border-stone-300/80 hover:border-[#9A2B1F]'
                    }`}
                  >
                    {fig.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Synchronized Inspector Sidebar (4 cols) */}
          <aside
            data-testid="graph-inspector"
            className="lg:col-span-4 border border-stone-300/90 bg-[#FDFBF7] p-6 flex flex-col justify-between"
          >
            {selectedFigure ? (
              <div className="space-y-5">
                {/* Selected Figure Portrait Header */}
                <div className="flex items-start gap-4 pb-5 border-b border-stone-200">
                  <div className="w-20 h-24 shrink-0 border border-stone-300 bg-[#EFEAE0] overflow-hidden">
                    <ResilientImage
                      src={selectedFigure.image}
                      alt={selectedFigure.name}
                      fallbackTitle={selectedFigure.name}
                      className={`w-full h-full object-cover ${
                        selectedFigure.imageFocus ?? 'object-center'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#9A2B1F] font-medium">
                      {selectedFigure.categoryLabel} · {selectedFigure.accessionNo}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl font-bold text-[#1C1917]">
                      {selectedFigure.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#57534E]">
                      {selectedFigure.honorific}
                    </p>
                    <p className="mt-1 text-xs text-[#78716C]">
                      {selectedFigure.era}
                    </p>
                  </div>
                </div>

                {/* Concise Summary */}
                <p className="text-sm leading-relaxed text-[#44403C]">
                  {selectedFigure.shortBio}
                </p>

                {/* Direct Relationships List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs tracking-[0.14em] font-semibold text-[#1C1917]">
                      当前可见关联脉络
                    </h4>
                    <span className="text-xs font-mono tabular-nums text-[#78716C]">
                      {subnetwork.selectedRelations.length} 项
                    </span>
                  </div>

                  {subnetwork.selectedRelations.length === 0 ? (
                    <p className="text-xs text-[#78716C] py-4 border-y border-stone-200">
                      当前筛选条件下无直接关联脉络，可切换至“全部脉络”查看完整关系。
                    </p>
                  ) : (
                    <ul className="divide-y divide-stone-200 border-y border-stone-200 max-h-[260px] overflow-y-auto pr-1">
                      {subnetwork.selectedRelations.map(
                        ({ relationship, otherFigure, direction }) => {
                          const style =
                            RELATION_STYLE_MAP[relationship.type] ??
                            RELATION_STYLE_MAP.lineage;
                          return (
                            <li key={relationship.id} className="py-3">
                              <button
                                type="button"
                                onClick={() =>
                                  onSelectGraphFigure(otherFigure.id)
                                }
                                className="w-full text-left group cursor-pointer"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-serif text-sm font-semibold text-[#1C1917] group-hover:text-[#9A2B1F] transition-colors">
                                    {direction === 'outgoing'
                                      ? `${selectedFigure.name} → ${otherFigure.name}`
                                      : `${otherFigure.name} → ${selectedFigure.name}`}
                                  </span>
                                  <span
                                    className="text-[11px] font-medium shrink-0"
                                    style={{ color: style.color }}
                                  >
                                    {relationship.label}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-[#57534E] leading-relaxed">
                                  {relationship.description}
                                </p>
                              </button>
                            </li>
                          );
                        },
                      )}
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-[#78716C]">
                未找到符合检索条件的图谱人物。
              </div>
            )}

            {/* Inspector Footer CTA */}
            {selectedFigure && (
              <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpenFigureDossier(selectedFigure.id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#FDFBF7] bg-[#1C1917] hover:bg-[#9A2B1F] transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  查阅{selectedFigure.name}完整真灵档案
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </aside>
        </div>

        {/* Edge Type Visual Legend Footer */}
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#57534E]">
          <span className="text-[#78716C] inline-flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            脉络连线图例：
          </span>
          {Object.entries(RELATION_STYLE_MAP).map(([key, item]) => (
            <span key={key} className="inline-flex items-center gap-2">
              <svg width="24" height="8" aria-hidden="true">
                <line
                  x1="0"
                  y1="4"
                  x2="24"
                  y2="4"
                  stroke={item.color}
                  strokeWidth="2"
                  strokeDasharray={item.dash}
                />
              </svg>
              <span>{item.label}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
