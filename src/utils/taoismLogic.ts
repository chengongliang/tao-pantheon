import type {
  DeityRosterGroup,
  EraId,
  FigureCategory,
  FigureRelationship,
  GalleryCategory,
  GalleryPlate,
  RelationType,
  TaoistFigure,
  TimelineEvent,
} from '../data/taoismData';

import type { TaiSuiEntry } from '../data/pantheonAlmanacData';
import {
  FIGURE_SORT_META,
  GALLERY_SORT_META,
  type CatalogSortMode,
} from '../data/taoismSortMeta';

export type GraphLayoutMode = 'hierarchy' | 'constellation';

export const GRAPH_CANVAS_WIDTH = 1600;
export const GRAPH_CANVAS_HEIGHT = 1100;

export interface NodePosition {
  id: string;
  x: number;
  y: number;
}

export interface FigureFilterOptions {
  category: FigureCategory;
  query: string;
  sortBy?: CatalogSortMode;
}

export interface GalleryFilterOptions {
  category: GalleryCategory;
  sortBy?: CatalogSortMode;
}

export interface GraphFilterOptions {
  selectedId: string | null;
  relationFilter: RelationType;
  categoryFilter: FigureCategory;
  searchQuery: string;
}

export interface GraphSubnetwork {
  visibleNodes: TaoistFigure[];
  visibleEdges: FigureRelationship[];
  connectedNodeIds: Set<string>;
  selectedFigure: TaoistFigure | null;
  selectedRelations: {
    relationship: FigureRelationship;
    otherFigure: TaoistFigure;
    direction: 'outgoing' | 'incoming';
  }[];
}

/**
 * Canonical comparator: strictly orders Taoist figures by pantheon tier (0 -> 7)
 * and canonical rankOrder (1 -> 60, chronological within historical tiers).
 */
export function compareFiguresCanonically(a: TaoistFigure, b: TaoistFigure): number {
  if (a.tier !== b.tier) return a.tier - b.tier;
  return a.rankOrder - b.rankOrder;
}

/**
 * Compare two Taoist figures according to the selected catalog sort mode:
 * - importance: core cultural & canonical prominence (三清 → 老子 → 玉皇 → 盘古 → 三皇五帝 → 张道陵 → 庄子…)
 * - chronology: historical & mythological timeline (太初盘古 → 三皇五帝 → 商周先秦 → 秦汉 → 魏晋南北朝 → 隋唐 → 宋元 → 明清)
 * - hierarchy: canonical 8-tier pantheon order (三清至圣 → 上古创世 → 六御二祖 → 五老星冥 → 上古先秦 → 天师祖师 → 护法民俗 → 民间八仙)
 */
export function compareFiguresByMode(
  a: TaoistFigure,
  b: TaoistFigure,
  sortBy: CatalogSortMode,
): number {
  if (sortBy === 'importance') {
    const rankA = FIGURE_SORT_META[a.id]?.importanceRank ?? a.rankOrder + 100;
    const rankB = FIGURE_SORT_META[b.id]?.importanceRank ?? b.rankOrder + 100;
    return rankA !== rankB ? rankA - rankB : compareFiguresCanonically(a, b);
  }
  if (sortBy === 'chronology') {
    const timeA = FIGURE_SORT_META[a.id]?.chronologyOrder ?? a.rankOrder + 100;
    const timeB = FIGURE_SORT_META[b.id]?.chronologyOrder ?? b.rankOrder + 100;
    return timeA !== timeB ? timeA - timeB : compareFiguresCanonically(a, b);
  }
  return compareFiguresCanonically(a, b);
}

/**
 * Filter Taoist deities, sages, and patriarchs by realm category and search keyword,
 * sorting by the chosen CatalogSortMode (defaults to canonical hierarchy when omitted).
 */
export function filterFigures(
  figures: TaoistFigure[],
  { category, query, sortBy = 'hierarchy' }: FigureFilterOptions,
): TaoistFigure[] {
  const normalizedQuery = query.trim().toLowerCase();

  return figures
    .filter((fig) => {
      if (category !== 'all' && fig.category !== category) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const period = FIGURE_SORT_META[fig.id]?.chronologyPeriod ?? '';
      const haystack = [
        fig.name,
        fig.honorific,
        fig.alias,
        fig.categoryLabel,
        fig.era,
        period,
        fig.sacredSite,
        fig.shortBio,
        ...fig.scripturesOrArtifacts,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .sort((a, b) => compareFiguresByMode(a, b, sortBy));
}

/**
 * Filter and sort the 64 museum gallery plates by category and CatalogSortMode.
 */
export function filterAndSortGalleryPlates(
  plates: GalleryPlate[],
  { category, sortBy = 'importance' }: GalleryFilterOptions,
): GalleryPlate[] {
  const filtered =
    category === 'all'
      ? [...plates]
      : plates.filter((plate) => plate.category === category);

  return filtered.sort((a, b) => {
    if (sortBy === 'importance') {
      const rankA = GALLERY_SORT_META[a.id]?.importanceRank ?? a.order + 100;
      const rankB = GALLERY_SORT_META[b.id]?.importanceRank ?? b.order + 100;
      return rankA !== rankB ? rankA - rankB : a.order - b.order;
    }
    if (sortBy === 'chronology') {
      const timeA = GALLERY_SORT_META[a.id]?.chronologyOrder ?? a.order + 100;
      const timeB = GALLERY_SORT_META[b.id]?.chronologyOrder ?? b.order + 100;
      return timeA !== timeB ? timeA - timeB : a.order - b.order;
    }
    return a.order - b.order;
  });
}

/**
 * Filter the encyclopedic 重要神仙表 roster groups by group id and free-text query.
 */
export function filterDeityRoster(
  groups: DeityRosterGroup[],
  groupId: string,
  query: string,
): DeityRosterGroup[] {
  const normalizedQuery = query.trim().toLowerCase();

  return groups
    .filter((group) => groupId === 'all' || group.id === groupId)
    .map((group) => {
      if (!normalizedQuery) return group;
      const matchingEntries = group.entries.filter((entry) => {
        const haystack = [
          group.title,
          entry.name,
          entry.honorific,
          entry.domain,
          entry.residence,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      });
      return { ...group, entries: matchingEntries };
    })
    .filter((group) => group.entries.length > 0);
}

/**
 * Filter the 60 Jiazi Tai Sui Generals by Ganzhi cycle, general name, or ordinal number.
 */
export function filterTaiSuiGenerals(
  entries: TaiSuiEntry[],
  query: string,
): TaiSuiEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return entries;
  return entries.filter(
    (entry) =>
      entry.ganzhi.toLowerCase().includes(normalized) ||
      entry.general.toLowerCase().includes(normalized) ||
      String(entry.order) === normalized,
  );
}

/**
 * Filter timeline milestones by dynasty era while preserving strict chronological order.
 */
export function filterTimelineEvents(
  events: TimelineEvent[],
  era: EraId,
): TimelineEvent[] {
  const filtered =
    era === 'all' ? [...events] : events.filter((event) => event.era === era);

  return filtered.sort((a, b) => a.yearNumeric - b.yearNumeric);
}

/**
 * Compute visible graph nodes, filtered edges, 1-hop ego-network neighbors,
 * and canonically ordered relation entries for the currently selected node.
 */
export function computeGraphSubnetwork(
  figures: TaoistFigure[],
  relationships: FigureRelationship[],
  { selectedId, relationFilter, categoryFilter, searchQuery }: GraphFilterOptions,
): GraphSubnetwork {
  const figureMap = new Map(figures.map((f) => [f.id, f]));

  const matchingFigures = filterFigures(figures, {
    category: categoryFilter,
    query: searchQuery,
  });
  const visibleNodeIds = new Set(matchingFigures.map((f) => f.id));

  // Keep edges whose endpoints are both visible and match relationFilter
  const visibleEdges = relationships.filter((rel) => {
    if (relationFilter !== 'all' && rel.type !== relationFilter) {
      return false;
    }
    return visibleNodeIds.has(rel.source) && visibleNodeIds.has(rel.target);
  });

  const activeSelectedId =
    selectedId && visibleNodeIds.has(selectedId) ? selectedId : null;

  const connectedNodeIds = new Set<string>();
  const selectedRelations: GraphSubnetwork['selectedRelations'] = [];

  if (activeSelectedId) {
    connectedNodeIds.add(activeSelectedId);
    for (const rel of visibleEdges) {
      if (rel.source === activeSelectedId) {
        const other = figureMap.get(rel.target);
        if (other) {
          connectedNodeIds.add(other.id);
          selectedRelations.push({
            relationship: rel,
            otherFigure: other,
            direction: 'outgoing',
          });
        }
      } else if (rel.target === activeSelectedId) {
        const other = figureMap.get(rel.source);
        if (other) {
          connectedNodeIds.add(other.id);
          selectedRelations.push({
            relationship: rel,
            otherFigure: other,
            direction: 'incoming',
          });
        }
      }
    }
  }

  selectedRelations.sort((a, b) =>
    compareFiguresCanonically(a.otherFigure, b.otherFigure),
  );

  return {
    visibleNodes: matchingFigures,
    visibleEdges,
    connectedNodeIds,
    selectedFigure: activeSelectedId ? figureMap.get(activeSelectedId) ?? null : null,
    selectedRelations,
  };
}

/**
 * Compute deterministic, non-overlapping 2D SVG coordinates for the interactive relationship graph.
 * Canvas coordinate space: 1600 x 1100 (accommodating 60 Taoist figures across 8 canonical tiers / 5 concentric rings).
 * Every tier and every ring is strictly sorted by canonical rankOrder (top-to-bottom, left-to-right / clockwise from 12 o'clock).
 */
export function computeNodeLayout(
  figures: TaoistFigure[],
  mode: GraphLayoutMode,
): Record<string, NodePosition> {
  const positions: Record<string, NodePosition> = {};
  const sortedFigures = [...figures].sort(compareFiguresCanonically);

  if (mode === 'hierarchy') {
    // 8 canonical tiers corresponding to pantheon hierarchy & historical progression:
    // 0: 三清至圣 (3), 1: 上古创世 (4), 2: 六御二祖 (8), 3: 五老星冥 (7),
    // 4: 上古先秦 (9), 5: 天师祖师 (11), 6: 护法民俗 (13), 7: 民间八仙 (5)
    const tierY: Record<number, number> = {
      0: 64,
      1: 198,
      2: 332,
      3: 466,
      4: 600,
      5: 734,
      6: 870,
      7: 1006,
    };

    const groupedByTier = new Map<number, TaoistFigure[]>();
    for (const fig of sortedFigures) {
      const list = groupedByTier.get(fig.tier) ?? [];
      list.push(fig);
      groupedByTier.set(fig.tier, list);
    }

    for (const [tier, list] of groupedByTier.entries()) {
      const count = list.length;
      // Generous left margin (>= 172px) so left-edge tier labels never touch nodes
      const startX =
        count <= 3
          ? 420
          : count <= 4
            ? 340
            : count <= 5
              ? 300
              : count <= 7
                ? 230
                : count <= 9
                  ? 196
                  : 174;
      const endX =
        count <= 3
          ? 1300
          : count <= 4
            ? 1380
            : count <= 5
              ? 1420
              : count <= 7
                ? 1490
                : count <= 9
                  ? 1524
                  : 1544;
      const usableWidth = endX - startX;
      const step = count > 1 ? usableWidth / (count - 1) : 0;

      list.forEach((fig, idx) => {
        const x = count === 1 ? 860 : startX + idx * step;
        // Alternating gentle vertical stagger on dense rows (>= 8 nodes) so labels breathe cleanly
        const arcOffset =
          count >= 12
            ? idx % 2 === 0
              ? -24
              : 24
            : count >= 9
              ? idx % 2 === 0
                ? -20
                : 20
              : count >= 8
                ? idx % 2 === 0
                  ? -14
                  : 14
                : 0;
        positions[fig.id] = {
          id: fig.id,
          x: Math.round(x),
          y: Math.round((tierY[tier] ?? 550) + arcOffset),
        };
      });
    }

    return positions;
  }

  // Constellation (5-ring radial concentric) layout on 1600 x 1100:
  // Strictly clockwise from 12 o'clock (-90°) in canonical rankOrder:
  // Ring 1: 三清至圣 (tier 0, 3)
  // Ring 2: 上古创世与六御二祖 (tier 1 + 2, 12)
  // Ring 3: 五老星官与冥司 (tier 3, 7)
  // Ring 4: 上古先秦与历代祖师 (tier 4 + 5, 20)
  // Ring 5: 天庭护法与民间八仙 (tier 6 + 7, 18)
  const cx = GRAPH_CANVAS_WIDTH / 2;
  const cy = GRAPH_CANVAS_HEIGHT / 2;

  const ring1 = sortedFigures.filter((f) => f.tier === 0);
  const ring2 = sortedFigures.filter((f) => f.tier === 1 || f.tier === 2);
  const ring3 = sortedFigures.filter((f) => f.tier === 3);
  const ring4 = sortedFigures.filter((f) => f.tier === 4 || f.tier === 5);
  const ring5 = sortedFigures.filter((f) => f.tier === 6 || f.tier === 7);

  const placeRing = (
    list: TaoistFigure[],
    rx: number,
    ry: number,
    startAngleDeg: number,
  ) => {
    const n = list.length;
    if (n === 0) return;
    list.forEach((fig, i) => {
      const angleRad = ((startAngleDeg + (360 / n) * i) * Math.PI) / 180;
      positions[fig.id] = {
        id: fig.id,
        x: Math.round(cx + rx * Math.cos(angleRad)),
        y: Math.round(cy + ry * Math.sin(angleRad)),
      };
    });
  };

  placeRing(ring1, 110, 76, -90);
  placeRing(ring2, 265, 174, -90);
  placeRing(ring3, 415, 272, -90);
  placeRing(ring4, 575, 376, -90);
  placeRing(ring5, 735, 476, -90);

  return positions;
}
