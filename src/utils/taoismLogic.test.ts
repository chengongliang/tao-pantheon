import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GALLERY_PLATES,
  IMPORTANT_DEITIES_ROSTER,
  ORIGINS_CHAPTERS,
  RELATIONSHIPS,
  TAOIST_FIGURES,
  TIMELINE_EVENTS,
} from '../data/taoismData';
import {
  LIUHE_LIUYU_DIRECTIONS,
  NORTH_DIPPER_STARS,
  PANTHEON_EVOLUTION_STAGES,
  QUANZHEN_SEVEN_MASTERS,
  SIXTY_TAISUI_GENERALS,
  SOUTH_DIPPER_STARS,
  TWENTY_EIGHT_MANSIONS,
} from '../data/pantheonAlmanacData';
import { FIGURE_SORT_META, GALLERY_SORT_META } from '../data/taoismSortMeta';
import {
  GRAPH_CANVAS_HEIGHT,
  GRAPH_CANVAS_WIDTH,
  computeGraphSubnetwork,
  computeNodeLayout,
  filterAndSortGalleryPlates,
  filterDeityRoster,
  filterFigures,
  filterTaiSuiGenerals,
  filterTimelineEvents,
} from './taoismLogic';

test('Pantheon contains exactly 60 figures and every collection has 100% unique non-duplicated images', () => {
  assert.equal(TAOIST_FIGURES.length, 60, 'Expected exactly 60 illustrated Taoist figures');
  assert.equal(GALLERY_PLATES.length, 64, 'Expected exactly 64 gallery plates');

  const figureImages = new Set(TAOIST_FIGURES.map((f) => f.image));
  assert.equal(figureImages.size, 60, 'Every figure in TAOIST_FIGURES must have a unique image');

  const galleryImages = new Set(GALLERY_PLATES.map((p) => p.image));
  assert.equal(galleryImages.size, 64, 'Every plate in GALLERY_PLATES must have a unique image');

  const originImages = new Set(ORIGINS_CHAPTERS.map((c) => c.image));
  assert.equal(originImages.size, ORIGINS_CHAPTERS.length, 'Every origins chapter must have a unique image');

  const timelineImages = new Set(TIMELINE_EVENTS.map((e) => e.image));
  assert.equal(timelineImages.size, TIMELINE_EVENTS.length, 'Every timeline event must have a unique image');
});

test('TAOIST_FIGURES and GALLERY_PLATES follow strict canonical 8-tier & chronological ordering', () => {
  // Strictly ascending rankOrder 1..60 and accessionNo DZ-001..DZ-060
  TAOIST_FIGURES.forEach((fig, idx) => {
    assert.equal(fig.rankOrder, idx + 1, `${fig.name} should have rankOrder ${idx + 1}`);
    const expectedAcc = `DZ-${String(idx + 1).padStart(3, '0')}`;
    assert.equal(fig.accessionNo, expectedAcc, `${fig.name} should have accessionNo ${expectedAcc}`);
    if (idx > 0) {
      assert.ok(
        fig.tier >= TAOIST_FIGURES[idx - 1].tier,
        `Tier should be non-decreasing at ${fig.name}`,
      );
    }
  });

  // Verify 三清 -> 上古创世 -> 六御二祖 ordering
  const names = TAOIST_FIGURES.map((f) => f.name);
  assert.deepEqual(names.slice(0, 7), [
    '元始天尊',
    '灵宝天尊',
    '道德天尊',
    '盘古',
    '伏羲与女娲',
    '轩辕黄帝',
    '东皇太一',
  ]);

  assert.deepEqual(names.slice(7, 15), [
    '玉皇大帝',
    '紫微大帝',
    '勾陈天皇大帝',
    '后土皇地祇',
    '南极长生大帝',
    '太乙救苦天尊',
    '东王公',
    '西王母',
  ]);

  // Verify 先秦圣哲 chronological ordering with 姜子牙, 老子, 尹喜, 鬼谷子, 列子, 庄子
  assert.deepEqual(names.slice(22, 31), [
    '广成子',
    '赤松子',
    '彭祖',
    '姜子牙',
    '老子',
    '尹喜',
    '鬼谷子',
    '列子',
    '庄子',
  ]);

  // Verify 八仙 canonical ordering (铁拐李 first)
  assert.deepEqual(names.slice(55, 60), [
    '铁拐李',
    '汉钟离',
    '吕洞宾',
    '何仙姑',
    '张果老等四仙',
  ]);

  // Verify GALLERY_PLATES: 1..4 landscapes, then 5..64 mirror TAOIST_FIGURES 1..60 1-to-1
  GALLERY_PLATES.forEach((plate, idx) => {
    assert.equal(plate.order, idx + 1);
    assert.equal(plate.plateNo, `藏品 ${String(idx + 1).padStart(2, '0')}`);
    if (idx >= 4) {
      const fig = TAOIST_FIGURES[idx - 4];
      assert.equal(
        plate.image,
        fig.image,
        `Gallery plate ${plate.plateNo} should match figure ${fig.accessionNo} (${fig.name})`,
      );
    }
  });
});

test('Pantheon almanac datasets cover 6 evolution stages, 6 Liuhe directions, 28 Mansions, Dippers, Quanzhen 7, and 60 Tai Sui', () => {
  assert.equal(PANTHEON_EVOLUTION_STAGES.length, 6);
  assert.equal(LIUHE_LIUYU_DIRECTIONS.length, 6);

  const totalMansions = TWENTY_EIGHT_MANSIONS.reduce((sum, g) => sum + g.mansions.length, 0);
  assert.equal(totalMansions, 28);

  assert.equal(NORTH_DIPPER_STARS.length, 7);
  assert.equal(SOUTH_DIPPER_STARS.length, 6);
  assert.equal(QUANZHEN_SEVEN_MASTERS.length, 7);
  assert.equal(SIXTY_TAISUI_GENERALS.length, 60);

  // Verify Tai Sui search helper
  const jiazi = filterTaiSuiGenerals(SIXTY_TAISUI_GENERALS, '甲子');
  assert.equal(jiazi.length, 1);
  assert.equal(jiazi[0].general, '金辨将军');

  const guanzhong = filterTaiSuiGenerals(SIXTY_TAISUI_GENERALS, '管仲');
  assert.equal(guanzhong.length, 1);
  assert.equal(guanzhong[0].ganzhi, '丙申');
});

test('IMPORTANT_DEITIES_ROSTER covers all 9 parts and all linkedFigureId references resolve cleanly', () => {
  assert.equal(IMPORTANT_DEITIES_ROSTER.length, 9);
  const figureIds = new Set(TAOIST_FIGURES.map((f) => f.id));

  let totalEntries = 0;
  for (const group of IMPORTANT_DEITIES_ROSTER) {
    assert.ok(group.entries.length > 0, `Group ${group.id} should not be empty`);
    for (const entry of group.entries) {
      totalEntries += 1;
      if (entry.linkedFigureId) {
        assert.ok(
          figureIds.has(entry.linkedFigureId),
          `Invalid linkedFigureId "${entry.linkedFigureId}" in roster entry "${entry.name}"`,
        );
      }
    }
  }
  assert.ok(totalEntries >= 55, 'Expected rich 9-part encyclopedic roster');

  const rosterSearch = filterDeityRoster(IMPORTANT_DEITIES_ROSTER, 'all', '六十甲子');
  assert.equal(rosterSearch.length, 1);
  assert.equal(rosterSearch[0].id, 'roster-heavenly-guardians');
});

test('filterFigures matches newly added primordial, heavenly, and historical figures accurately', () => {
  const newNames = ['盘古', '伏羲', '轩辕黄帝', '东皇太一', '托塔李天王', '姜子牙', '福禄寿', '月老', '尹喜', '鬼谷子'];
  for (const term of newNames) {
    const res = filterFigures(TAOIST_FIGURES, { category: 'all', query: term });
    assert.ok(res.length >= 1, `Expected search "${term}" to return at least 1 figure`);
  }
});

test('filterTimelineEvents preserves ascending chronological order across eras', () => {
  const allEvents = filterTimelineEvents(TIMELINE_EVENTS, 'all');
  assert.equal(allEvents.length, TIMELINE_EVENTS.length);
  for (let i = 1; i < allEvents.length; i += 1) {
    assert.ok(allEvents[i].yearNumeric >= allEvents[i - 1].yearNumeric);
  }
});

test('computeGraphSubnetwork returns canonically sorted nodes and 90 edges with valid endpoints', () => {
  const figureIds = new Set(TAOIST_FIGURES.map((f) => f.id));
  assert.equal(RELATIONSHIPS.length, 90);
  for (const rel of RELATIONSHIPS) {
    assert.ok(figureIds.has(rel.source), `Invalid edge source ${rel.source}`);
    assert.ok(figureIds.has(rel.target), `Invalid edge target ${rel.target}`);
  }

  const sub = computeGraphSubnetwork(TAOIST_FIGURES, RELATIONSHIPS, {
    selectedId: 'xuanyuan-huangdi',
    relationFilter: 'all',
    categoryFilter: 'all',
    searchQuery: '',
  });
  assert.equal(sub.visibleNodes.length, 60);
  assert.equal(sub.visibleEdges.length, 90);
  assert.ok(sub.selectedRelations.length >= 4, 'Xuanyuan Huangdi should connect to Fuxi/Nuwa, Guangchengzi, Jiutian Xuannv, and Laozi');
});

test('computeNodeLayout generates non-overlapping canonically ordered coordinates for all 60 nodes', () => {
  for (const mode of ['hierarchy', 'constellation'] as const) {
    const coords = computeNodeLayout(TAOIST_FIGURES, mode);
    const list = Object.values(coords);
    assert.equal(list.length, 60);

    for (const pos of list) {
      assert.ok(pos.x >= 20 && pos.x <= GRAPH_CANVAS_WIDTH - 20, `${mode} x out of bounds for ${pos.id}: ${pos.x}`);
      assert.ok(pos.y >= 20 && pos.y <= GRAPH_CANVAS_HEIGHT - 20, `${mode} y out of bounds for ${pos.id}: ${pos.y}`);
    }

    // Ensure no two nodes overlap (minimum distance >= 80px)
    let minDist = Infinity;
    let closestPair = '';
    for (let i = 0; i < list.length; i += 1) {
      for (let j = i + 1; j < list.length; j += 1) {
        const d = Math.hypot(list[i].x - list[j].x, list[i].y - list[j].y);
        if (d < minDist) {
          minDist = d;
          closestPair = `${list[i].id} <-> ${list[j].id}`;
        }
      }
    }
    assert.ok(
      minDist >= 80,
      `Expected >= 80px spacing in ${mode} layout for 60 nodes, got ${minDist.toFixed(1)}px (${closestPair})`,
    );

    if (mode === 'hierarchy') {
      // Within every tier (0..7), X coordinates must increase monotonically in rankOrder
      for (let tier = 0; tier <= 7; tier += 1) {
        const tierFigs = TAOIST_FIGURES.filter((f) => f.tier === tier);
        for (let i = 1; i < tierFigs.length; i += 1) {
          const prevX = coords[tierFigs[i - 1].id].x;
          const currX = coords[tierFigs[i].id].x;
          assert.ok(
            currX > prevX,
            `Hierarchy tier ${tier}: ${tierFigs[i].name} (x=${currX}) must be right of ${tierFigs[i - 1].name} (x=${prevX})`,
          );
        }
      }
    }
  }
});

test('FIGURE_SORT_META and GALLERY_SORT_META provide complete, unique 1..N rankings for importance and chronology sorting', () => {
  // 1. Validate all 60 figures have unique importanceRank 1..60 & chronologyOrder 1..60
  const figImpRanks = new Set<number>();
  const figChronOrders = new Set<number>();
  for (const fig of TAOIST_FIGURES) {
    const meta = FIGURE_SORT_META[fig.id];
    assert.ok(meta, `Missing FIGURE_SORT_META for ${fig.id}`);
    assert.ok(meta.importanceRank >= 1 && meta.importanceRank <= 60);
    assert.ok(meta.chronologyOrder >= 1 && meta.chronologyOrder <= 60);
    assert.ok(meta.chronologyPeriod.length > 0);
    figImpRanks.add(meta.importanceRank);
    figChronOrders.add(meta.chronologyOrder);
  }
  assert.equal(figImpRanks.size, 60, 'All 60 figures must have unique importanceRank values');
  assert.equal(figChronOrders.size, 60, 'All 60 figures must have unique chronologyOrder values');

  // 2. Verify importance sort puts 三清 -> 老子 -> 玉皇大帝 -> 盘古 -> 伏羲与女娲 -> 轩辕黄帝 -> 张道陵 first
  const byImportance = filterFigures(TAOIST_FIGURES, {
    category: 'all',
    query: '',
    sortBy: 'importance',
  });
  assert.deepEqual(
    byImportance.slice(0, 9).map((f) => f.name),
    ['元始天尊', '灵宝天尊', '道德天尊', '老子', '玉皇大帝', '盘古', '伏羲与女娲', '轩辕黄帝', '张道陵'],
  );

  // 3. Verify chronology sort starts from 太初盘古 -> 伏羲女娲 -> 赤松子 -> 轩辕黄帝 -> 广成子 and ends in 明清
  const byChronology = filterFigures(TAOIST_FIGURES, {
    category: 'all',
    query: '',
    sortBy: 'chronology',
  });
  assert.deepEqual(
    byChronology.slice(0, 5).map((f) => f.name),
    ['盘古', '伏羲与女娲', '赤松子', '轩辕黄帝', '广成子'],
  );
  assert.equal(byChronology[byChronology.length - 1].name, '福禄寿三星');

  // 4. Validate all 64 gallery plates have unique importanceRank 1..64 & chronologyOrder 1..64
  const plateImpRanks = new Set<number>();
  const plateChronOrders = new Set<number>();
  for (const plate of GALLERY_PLATES) {
    const meta = GALLERY_SORT_META[plate.id];
    assert.ok(meta, `Missing GALLERY_SORT_META for ${plate.id}`);
    assert.ok(meta.importanceRank >= 1 && meta.importanceRank <= 64);
    assert.ok(meta.chronologyOrder >= 1 && meta.chronologyOrder <= 64);
    plateImpRanks.add(meta.importanceRank);
    plateChronOrders.add(meta.chronologyOrder);
  }
  assert.equal(plateImpRanks.size, 64, 'All 64 gallery plates must have unique importanceRank values');
  assert.equal(plateChronOrders.size, 64, 'All 64 gallery plates must have unique chronologyOrder values');

  // 5. Verify Gallery sorting modes
  const galleryImp = filterAndSortGalleryPlates(GALLERY_PLATES, {
    category: 'all',
    sortBy: 'importance',
  });
  assert.equal(galleryImp.length, 64);
  assert.deepEqual(
    galleryImp.slice(0, 5).map((p) => p.id),
    ['plate-05', 'plate-06', 'plate-07', 'plate-31', 'plate-01'],
  );

  const galleryChron = filterAndSortGalleryPlates(GALLERY_PLATES, {
    category: 'all',
    sortBy: 'chronology',
  });
  assert.equal(galleryChron[0].id, 'plate-08'); // 盘古开天辟地
  assert.equal(galleryChron[1].id, 'plate-09'); // 伏羲女娲

  const galleryHier = filterAndSortGalleryPlates(GALLERY_PLATES, {
    category: 'all',
    sortBy: 'hierarchy',
  });
  assert.equal(galleryHier[0].id, 'plate-01');
  assert.equal(galleryHier[63].id, 'plate-64');
});
