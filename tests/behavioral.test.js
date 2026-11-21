import test, { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { EVIDENCE_COLLECTION, CASE_DOSSIER_DATA } from '../src/data/evidence.ts';
import { validateClearanceCode } from '../src/utils/credentials.ts';
import { createTimerTracker } from '../src/utils/timers.ts';
import {
  isElementFocusable,
  handleTabFocusWrap,
  restoreFocusSafely,
} from '../src/utils/focus.ts';
import {
  getPageTransition,
  getDocumentReveal,
  getTerminalLineReveal,
  getEvidenceCardHover,
} from '../src/utils/animations.ts';
import { soundFx } from '../src/utils/audio.ts';

describe('Phase 1 Core Behavioral Logic Tests', () => {

  describe('AccessTerminal: Credential Validation (Shared Implementation)', () => {
    it('should accept valid clearance codes regardless of case or outer whitespace', () => {
      const validCases = [
        '012',
        ' 012 ',
        'extraordinary',
        'EXTRAORDINARY',
        'Case012',
        'CASE 012',
        'archive',
        'ARCHIVE',
        'agent',
        'directive12',
        'investigator',
        'open',
        'start',
      ];

      for (const code of validCases) {
        assert.strictEqual(
          validateClearanceCode(code),
          true,
          `validateClearanceCode("${code}") should return true`
        );
      }
    });

    it('should reject invalid or malformed credentials', () => {
      const invalidCases = [
        '1234',
        'PASSWORD',
        'ADMIN',
        'GUEST',
        'UNKNOWN',
        'CASE013',
        '',
        '   ',
        null,
        undefined,
      ];

      for (const code of invalidCases) {
        assert.strictEqual(
          validateClearanceCode(code),
          false,
          `validateClearanceCode("${code}") should return false`
        );
      }
    });
  });

  describe('TimerTracker: Interval & Timeout Teardown Lifecycle', () => {
    it('should track active intervals and timeouts and drain them completely on clearAll', () => {
      const tracker = createTimerTracker();

      assert.strictEqual(tracker.hasActiveInterval(), false);
      assert.strictEqual(tracker.getActiveTimeoutCount(), 0);

      // Start an interval
      tracker.setInterval(() => {}, 500);
      assert.strictEqual(tracker.hasActiveInterval(), true);

      // Add timeouts
      tracker.addTimeout(() => {}, 1000);
      tracker.addTimeout(() => {}, 2000);
      assert.strictEqual(tracker.getActiveTimeoutCount(), 2);

      // Clear all timers
      tracker.clearAll();
      assert.strictEqual(tracker.hasActiveInterval(), false);
      assert.strictEqual(tracker.getActiveTimeoutCount(), 0);
    });
  });

  describe('EvidenceModal: Focus Management Utilities', () => {
    it('isElementFocusable should correctly identify focusable vs inert elements, including hidden ancestors', () => {
      // Helper to create a minimal DOM element mock with optional parent hierarchy
      const makeEl = (attrs = {}, style = {}, parent = null) => ({
        getAttribute: (k) => attrs[k] ?? null,
        hasAttribute: (k) => k in attrs,
        style,
        tabIndex: attrs.tabindex ? parseInt(attrs.tabindex, 10) : 0,
        parentElement: parent,
      });

      // 1. Standard active button
      assert.strictEqual(isElementFocusable(makeEl()), true);

      // 2. Disabled element
      assert.strictEqual(isElementFocusable(makeEl({ disabled: '' })), false);

      // 3. Hidden attribute
      assert.strictEqual(isElementFocusable(makeEl({ hidden: '' })), false);

      // 4. aria-hidden element
      assert.strictEqual(isElementFocusable(makeEl({ 'aria-hidden': 'true' })), false);

      // 5. Negative tabindex
      assert.strictEqual(isElementFocusable(makeEl({ tabindex: '-1' })), false);

      // 6. Inline style display: none
      assert.strictEqual(isElementFocusable(makeEl({}, { display: 'none' })), false);

      // 7. Inline style visibility: hidden
      assert.strictEqual(isElementFocusable(makeEl({}, { visibility: 'hidden' })), false);

      // 8. Element inside an aria-hidden ancestor
      const ariaHiddenParent = makeEl({ 'aria-hidden': 'true' });
      assert.strictEqual(isElementFocusable(makeEl({}, {}, ariaHiddenParent)), false);

      // 9. Element inside a hidden-attribute ancestor
      const hiddenAttrParent = makeEl({ hidden: '' });
      assert.strictEqual(isElementFocusable(makeEl({}, {}, hiddenAttrParent)), false);

      // 10. Element inside a display:none ancestor
      const displayNoneParent = makeEl({}, { display: 'none' });
      assert.strictEqual(isElementFocusable(makeEl({}, {}, displayNoneParent)), false);

      // 11. Element inside a visibility:hidden ancestor
      const visibilityHiddenParent = makeEl({}, { visibility: 'hidden' });
      assert.strictEqual(isElementFocusable(makeEl({}, {}, visibilityHiddenParent)), false);
    });

    it('handleTabFocusWrap should correctly trap focus between boundary elements', () => {
      let focused = null;
      const el1 = {
        getAttribute: () => null,
        hasAttribute: () => false,
        style: {},
        tabIndex: 0,
        parentElement: null,
        focus: () => { focused = 'el1'; },
      };
      const el2 = {
        getAttribute: () => null,
        hasAttribute: () => false,
        style: {},
        tabIndex: 0,
        parentElement: null,
        focus: () => { focused = 'el2'; },
      };

      const container = {
        querySelectorAll: () => [el1, el2],
        contains: (el) => el === el1 || el === el2,
        focus: () => { focused = 'container'; },
      };

      // Test Tab on last element -> wraps to first
      let prevented = false;
      const tabEvent = {
        key: 'Tab',
        shiftKey: false,
        defaultPrevented: false,
        preventDefault: () => { prevented = true; },
      };

      // Mock activeElement as last element
      globalThis.document = { activeElement: el2, body: { contains: () => true } };
      const wrappedForward = handleTabFocusWrap(tabEvent, container);
      assert.strictEqual(wrappedForward, true);
      assert.strictEqual(prevented, true);
      assert.strictEqual(focused, 'el1', 'Tab on last element should wrap to first element');

      // Test Shift+Tab on first element -> wraps to last
      prevented = false;
      const shiftTabEvent = {
        key: 'Tab',
        shiftKey: true,
        defaultPrevented: false,
        preventDefault: () => { prevented = true; },
      };

      globalThis.document.activeElement = el1;
      const wrappedBackward = handleTabFocusWrap(shiftTabEvent, container);
      assert.strictEqual(wrappedBackward, true);
      assert.strictEqual(prevented, true);
      assert.strictEqual(focused, 'el2', 'Shift+Tab on first element should wrap to last element');

      // Non-Tab key returns false
      assert.strictEqual(handleTabFocusWrap({ key: 'Enter' }, container), false);
    });

    it('restoreFocusSafely should only focus valid, attached elements', () => {
      let focusedTarget = null;
      const attachedEl = {
        focus: () => { focusedTarget = 'attached'; },
      };
      const detachedEl = {
        focus: () => { focusedTarget = 'detached'; },
      };

      globalThis.document = {
        body: {
          contains: (el) => el === attachedEl,
        },
      };

      // Case 1: Null target
      assert.strictEqual(restoreFocusSafely(null), false);

      // Case 2: Attached target
      const restored = restoreFocusSafely(attachedEl);
      assert.strictEqual(restored, true);
      assert.strictEqual(focusedTarget, 'attached');

      // Case 3: Detached target
      focusedTarget = null;
      const restoredDetached = restoreFocusSafely(detachedEl);
      assert.strictEqual(restoredDetached, false);
      assert.strictEqual(focusedTarget, null, 'Detached element must not be focused');
    });
  });

  describe('EvidenceArchive: Category Filtering & Exhibits', () => {
    it('should correctly filter exhibits by category with real data', () => {
      const allItems = EVIDENCE_COLLECTION;
      assert.strictEqual(allItems.length, 3, 'Total items should be 3');

      const photos = allItems.filter((item) => item.type === 'photograph');
      assert.strictEqual(photos.length, 1, 'Photographs should filter to 1 item');
      assert.strictEqual(photos[0].id, 'ITEM-012-A');

      const docs = allItems.filter((item) => item.type === 'document');
      assert.strictEqual(docs.length, 1, 'Documents should filter to 1 item');
      assert.strictEqual(docs[0].id, 'ITEM-012-B');

      const artefacts = allItems.filter((item) => item.type === 'artefact');
      assert.strictEqual(artefacts.length, 1, 'Artefacts should filter to 1 item');
      assert.strictEqual(artefacts[0].id, 'ITEM-012-C');
    });

    it('should maintain inspected items set immutably', () => {
      let inspectedIds = new Set();
      const inspectItem = (id) => {
        inspectedIds = new Set([...inspectedIds, id]);
      };

      inspectItem('ITEM-012-A');
      assert.strictEqual(inspectedIds.has('ITEM-012-A'), true);
      assert.strictEqual(inspectedIds.size, 1);

      inspectItem('ITEM-012-C');
      assert.strictEqual(inspectedIds.has('ITEM-012-C'), true);
      assert.strictEqual(inspectedIds.size, 2);
    });
  });

  describe('Real Animation Variants: Normal vs Reduced Motion', () => {
    it('getPageTransition should zero out spatial movement and delays under reduced motion', () => {
      const normal = getPageTransition(false);
      assert.strictEqual(normal.initial.y, 12, 'Normal initial y should be 12');
      assert.strictEqual(normal.animate.transition.duration, 0.5, 'Normal duration should be 0.5');
      assert.strictEqual(normal.animate.transition.staggerChildren, 0.06, 'Normal stagger should be 0.06');

      const reduced = getPageTransition(true);
      assert.strictEqual(reduced.initial.y, 0, 'Reduced initial y must be 0');
      assert.strictEqual(reduced.animate.transition.duration, 0.01, 'Reduced duration must be 0.01');
      assert.strictEqual(reduced.animate.transition.staggerChildren, 0, 'Reduced stagger must be 0');
      assert.strictEqual(reduced.exit.y, 0, 'Reduced exit y must be 0');
      assert.strictEqual(reduced.exit.transition.duration, 0.01, 'Reduced exit duration must be 0.01');
    });

    it('getTerminalLineReveal should strictly enforce x: 0 under reduced motion', () => {
      const normal = getTerminalLineReveal(false);
      assert.strictEqual(normal.initial.x, -8, 'Normal terminalLineReveal should have horizontal offset x: -8');
      assert.strictEqual(normal.animate.transition.duration, 0.22);

      const reduced = getTerminalLineReveal(true);
      assert.strictEqual(reduced.initial.x, 0, 'Reduced terminalLineReveal MUST have horizontal offset x: 0');
      assert.strictEqual(reduced.animate.transition.duration, 0.01);
    });

    it('getDocumentReveal should eliminate scaling and translation under reduced motion', () => {
      const normal = getDocumentReveal(false);
      assert.strictEqual(normal.initial.scale, 0.98);
      assert.strictEqual(normal.initial.y, 20);
      assert.strictEqual(normal.animate.transition.duration, 0.6);

      const reduced = getDocumentReveal(true);
      assert.strictEqual(reduced.initial.scale, 1, 'Reduced scale must be 1');
      assert.strictEqual(reduced.initial.y, 0, 'Reduced y must be 0');
      assert.strictEqual(reduced.animate.transition.duration, 0.01, 'Reduced duration must be 0.01');
    });

    it('getEvidenceCardHover should suppress vertical translation under reduced motion', () => {
      const normal = getEvidenceCardHover(false);
      assert.strictEqual(normal.hover.y, -6);

      const reduced = getEvidenceCardHover(true);
      assert.strictEqual(reduced.hover.y, 0, 'Reduced card hover y must be 0');
    });
  });

  describe('Audio Engine Singleton Invariants', () => {
    it('soundFx should be muted by default to satisfy browser autoplay policy', () => {
      const initialMute = soundFx.getMuted();
      assert.strictEqual(typeof initialMute, 'boolean');
      assert.strictEqual(initialMute, true, 'Audio must default to muted');

      const unmuted = soundFx.toggleMute();
      assert.strictEqual(unmuted, false, 'Toggling mute should return false (unmuted)');
      assert.strictEqual(soundFx.getMuted(), false);

      const remuted = soundFx.toggleMute();
      assert.strictEqual(remuted, true, 'Toggling mute again should return true (muted)');
      assert.strictEqual(soundFx.getMuted(), true);
    });
  });

  describe('Data Matrix Integrity Checks', () => {
    it('CASE_DOSSIER_DATA should contain required classification fields', () => {
      assert.strictEqual(CASE_DOSSIER_DATA.caseNumber, 'CASE NO. 012');
      assert.strictEqual(CASE_DOSSIER_DATA.securityClassification, 'RESTRICTED // ULTRA-CLASSIFIED');
      assert.ok(Array.isArray(CASE_DOSSIER_DATA.specialInstructions));
      assert.ok(CASE_DOSSIER_DATA.specialInstructions.length >= 3);
    });

    it('EVIDENCE_COLLECTION should contain 3 valid exhibits with webp and jpg paths', () => {
      assert.strictEqual(EVIDENCE_COLLECTION.length, 3);
      for (const item of EVIDENCE_COLLECTION) {
        assert.ok(item.id.startsWith('ITEM-012-'));
        assert.ok(item.title.length > 0);
        assert.ok(['photograph', 'document', 'artefact'].includes(item.type));
        assert.ok(item.imageUrl.startsWith('/images/'));
        assert.ok(item.webpUrl.startsWith('/images/'));
        assert.ok(Array.isArray(item.anomalies));
        assert.ok(item.anomalies.length > 0);
      }
    });
  });

  describe('Phase 2 Progression & Investigation Journey Logic', () => {
    let mockStorage = {};

    beforeEach(() => {
      mockStorage = {};
      globalThis.window = {
        localStorage: {
          getItem: (key) => mockStorage[key] ?? null,
          setItem: (key, val) => { mockStorage[key] = String(val); },
          removeItem: (key) => { delete mockStorage[key]; },
        },
        dispatchEvent: () => true,
      };
    });

    it('should save and load progression correctly from storage', async () => {
      const { saveInspectedIds, loadInspectedIds, PROGRESSION_STORAGE_KEY } = await import('../src/utils/progression.ts');
      
      saveInspectedIds(['ITEM-012-A', 'ITEM-012-B']);
      assert.ok(mockStorage[PROGRESSION_STORAGE_KEY]);
      assert.deepStrictEqual(loadInspectedIds(), ['ITEM-012-A', 'ITEM-012-B']);
    });

    it('should prevent duplicate inspection entries', async () => {
      const { recordExhibitInspected, resetProgression, loadInspectedIds } = await import('../src/utils/progression.ts');
      resetProgression();

      recordExhibitInspected('ITEM-012-A');
      recordExhibitInspected('ITEM-012-A');
      recordExhibitInspected('ITEM-012-A');

      const items = loadInspectedIds();
      assert.strictEqual(items.length, 1);
      assert.strictEqual(items[0], 'ITEM-012-A');
    });

    it('should correctly determine all-exhibits completion and percentage', async () => {
      const { isGalleryUnlocked, calculateProgressionPercentage } = await import('../src/utils/progression.ts');

      assert.strictEqual(isGalleryUnlocked([]), false);
      assert.strictEqual(calculateProgressionPercentage([]), 0);

      assert.strictEqual(isGalleryUnlocked(['ITEM-012-A']), false);
      assert.strictEqual(calculateProgressionPercentage(['ITEM-012-A']), 33);

      assert.strictEqual(isGalleryUnlocked(['ITEM-012-A', 'ITEM-012-B']), false);
      assert.strictEqual(calculateProgressionPercentage(['ITEM-012-A', 'ITEM-012-B']), 67);

      assert.strictEqual(isGalleryUnlocked(['ITEM-012-A', 'ITEM-012-B', 'ITEM-012-C']), true);
      assert.strictEqual(calculateProgressionPercentage(['ITEM-012-A', 'ITEM-012-B', 'ITEM-012-C']), 100);
    });

    it('should identify remaining exhibits when gallery is locked', async () => {
      const { getRemainingExhibitIds } = await import('../src/utils/progression.ts');

      const remaining = getRemainingExhibitIds(['ITEM-012-A']);
      assert.strictEqual(remaining.length, 2);
      assert.strictEqual(remaining[0], 'ITEM-012-B');
      assert.strictEqual(remaining[1], 'ITEM-012-C');

      const noneRemaining = getRemainingExhibitIds(['ITEM-012-A', 'ITEM-012-B', 'ITEM-012-C']);
      assert.strictEqual(noneRemaining.length, 0);
    });

    it('should calculate progressive timeline connections based on inspected exhibits', async () => {
      const { getActiveTimelineConnections } = await import('../src/utils/progression.ts');

      const conn0 = getActiveTimelineConnections([]);
      assert.strictEqual(conn0.tier1Provenance, false);
      assert.strictEqual(conn0.tier2Correspondence, false);
      assert.strictEqual(conn0.tier3UnifiedSynthesis, false);
      assert.strictEqual(conn0.totalInspected, 0);

      const conn1 = getActiveTimelineConnections(['ITEM-012-A']);
      assert.strictEqual(conn1.tier1Provenance, true);
      assert.strictEqual(conn1.tier2Correspondence, false);
      assert.strictEqual(conn1.tier3UnifiedSynthesis, false);
      assert.strictEqual(conn1.totalInspected, 1);

      const conn2 = getActiveTimelineConnections(['ITEM-012-A', 'ITEM-012-B']);
      assert.strictEqual(conn2.tier1Provenance, true);
      assert.strictEqual(conn2.tier2Correspondence, true);
      assert.strictEqual(conn2.tier3UnifiedSynthesis, false);
      assert.strictEqual(conn2.totalInspected, 2);

      const conn3 = getActiveTimelineConnections(['ITEM-012-A', 'ITEM-012-B', 'ITEM-012-C']);
      assert.strictEqual(conn3.tier1Provenance, true);
      assert.strictEqual(conn3.tier2Correspondence, true);
      assert.strictEqual(conn3.tier3UnifiedSynthesis, true);
      assert.strictEqual(conn3.totalInspected, 3);
    });

    it('should handle reset progression properly', async () => {
      const { saveInspectedIds, resetProgression, loadInspectedIds } = await import('../src/utils/progression.ts');

      saveInspectedIds(['ITEM-012-A', 'ITEM-012-B', 'ITEM-012-C']);
      assert.strictEqual(loadInspectedIds().length, 3);

      resetProgression();
      assert.strictEqual(loadInspectedIds().length, 0);
    });

    it('should safely handle malformed or corrupted localStorage data', async () => {
      const { loadInspectedIds, PROGRESSION_STORAGE_KEY } = await import('../src/utils/progression.ts');

      // Case 1: Corrupted non-JSON string
      mockStorage[PROGRESSION_STORAGE_KEY] = 'INVALID_MALFORMED_JSON{{{';
      assert.deepStrictEqual(loadInspectedIds(), []);

      // Case 2: Valid JSON but not an array
      mockStorage[PROGRESSION_STORAGE_KEY] = JSON.stringify({ count: 5 });
      assert.deepStrictEqual(loadInspectedIds(), []);

      // Case 3: Array containing invalid IDs and non-string types
      mockStorage[PROGRESSION_STORAGE_KEY] = JSON.stringify(['UNKNOWN-999', 'ITEM-012-A', 42, null, true]);
      assert.deepStrictEqual(loadInspectedIds(), ['ITEM-012-A']);
    });

    it('should synchronize state when another tab resets progression (StorageEvent with newValue === null)', async () => {
      const { saveInspectedIds, loadInspectedIds, PROGRESSION_STORAGE_KEY, sanitizeExhibitIds } = await import('../src/utils/progression.ts');

      saveInspectedIds(['ITEM-012-A', 'ITEM-012-B']);
      assert.strictEqual(loadInspectedIds().length, 2);

      // Simulate another tab removing the key (e.g. reset in another tab)
      delete mockStorage[PROGRESSION_STORAGE_KEY];
      const storageEvent = { key: PROGRESSION_STORAGE_KEY, newValue: null };

      // In response to newValue === null, sanitizeExhibitIds returns [] and loadInspectedIds returns []
      const sanitized = sanitizeExhibitIds(storageEvent.newValue);
      assert.deepStrictEqual(sanitized, []);
      assert.deepStrictEqual(loadInspectedIds(), []);
    });

    it('should synchronize state when another tab adds an exhibit (StorageEvent with new array)', async () => {
      const { saveInspectedIds, loadInspectedIds, PROGRESSION_STORAGE_KEY, sanitizeExhibitIds } = await import('../src/utils/progression.ts');

      saveInspectedIds(['ITEM-012-A']);
      assert.deepStrictEqual(loadInspectedIds(), ['ITEM-012-A']);

      // Simulate another tab saving ['ITEM-012-A', 'ITEM-012-B']
      const updatedJson = JSON.stringify(['ITEM-012-A', 'ITEM-012-B']);
      mockStorage[PROGRESSION_STORAGE_KEY] = updatedJson;

      const storageEvent = { key: PROGRESSION_STORAGE_KEY, newValue: updatedJson };
      const synced = sanitizeExhibitIds(storageEvent.newValue);
      assert.deepStrictEqual(synced, ['ITEM-012-A', 'ITEM-012-B']);
      assert.deepStrictEqual(loadInspectedIds(), ['ITEM-012-A', 'ITEM-012-B']);
    });

    it('should synchronize state when another tab clears all storage (StorageEvent with key === null)', async () => {
      const { saveInspectedIds, loadInspectedIds, sanitizeExhibitIds } = await import('../src/utils/progression.ts');

      saveInspectedIds(['ITEM-012-A', 'ITEM-012-B', 'ITEM-012-C']);
      assert.strictEqual(loadInspectedIds().length, 3);

      // Clear storage
      mockStorage = {};
      const clearEvent = { key: null, newValue: null };

      const sanitized = sanitizeExhibitIds(clearEvent.newValue);
      assert.deepStrictEqual(sanitized, []);
      assert.deepStrictEqual(loadInspectedIds(), []);
    });

    it('should support repeated reset calls idempotently', async () => {
      const { resetProgression, loadInspectedIds, saveInspectedIds } = await import('../src/utils/progression.ts');

      saveInspectedIds(['ITEM-012-A']);
      assert.strictEqual(loadInspectedIds().length, 1);

      // Call resetProgression multiple times consecutively
      resetProgression();
      resetProgression();
      resetProgression();

      assert.deepStrictEqual(loadInspectedIds(), []);
    });

    it('should preserve in-memory progression when localStorage throws or is unavailable', async () => {
      const { saveInspectedIds, loadInspectedIds } = await import('../src/utils/progression.ts');

      // Save initial state
      saveInspectedIds(['ITEM-012-A']);

      // Simulate storage becoming unavailable / throwing SecurityError
      globalThis.window.localStorage.getItem = () => {
        throw new Error('SecurityError: The operation is insecure.');
      };

      // Should safely return in-memory fallback without throwing
      const recovered = loadInspectedIds();
      assert.deepStrictEqual(recovered, ['ITEM-012-A']);
    });

    it('should enforce sequential discovery rules on timeline connections', async () => {
      const { getActiveTimelineConnections } = await import('../src/utils/progression.ts');

      // Out-of-order: Exhibit B inspected before Exhibit A
      const outOfOrderB = getActiveTimelineConnections(['ITEM-012-B']);
      assert.strictEqual(outOfOrderB.tier1Provenance, false);
      assert.strictEqual(outOfOrderB.tier2Correspondence, false);
      assert.strictEqual(outOfOrderB.tier3UnifiedSynthesis, false);
      assert.strictEqual(outOfOrderB.link1Active, false);
      assert.strictEqual(outOfOrderB.link2Active, false);
      assert.strictEqual(outOfOrderB.link3Active, false);

      // Only Exhibit A inspected: activates Link 1 only
      const sequentialA = getActiveTimelineConnections(['ITEM-012-A']);
      assert.strictEqual(sequentialA.tier1Provenance, true);
      assert.strictEqual(sequentialA.link1Active, true);
      assert.strictEqual(sequentialA.tier2Correspondence, false);
      assert.strictEqual(sequentialA.link2Active, false);

      // Exhibit A and B inspected sequentially: activates Link 1 and Link 2
      const sequentialAB = getActiveTimelineConnections(['ITEM-012-A', 'ITEM-012-B']);
      assert.strictEqual(sequentialAB.tier1Provenance, true);
      assert.strictEqual(sequentialAB.tier2Correspondence, true);
      assert.strictEqual(sequentialAB.tier3UnifiedSynthesis, false);

      // All three inspected: activates all three
      const sequentialABC = getActiveTimelineConnections(['ITEM-012-A', 'ITEM-012-B', 'ITEM-012-C']);
      assert.strictEqual(sequentialABC.tier1Provenance, true);
      assert.strictEqual(sequentialABC.tier2Correspondence, true);
      assert.strictEqual(sequentialABC.tier3UnifiedSynthesis, true);
      assert.strictEqual(sequentialABC.link3Active, true);
    });

    it('sanitizeExhibitIds should correctly sanitize and deduplicate storage strings', async () => {
      const { sanitizeExhibitIds } = await import('../src/utils/progression.ts');

      assert.deepStrictEqual(sanitizeExhibitIds(null), []);
      assert.deepStrictEqual(sanitizeExhibitIds(undefined), []);
      assert.deepStrictEqual(sanitizeExhibitIds(''), []);
      assert.deepStrictEqual(sanitizeExhibitIds('not json'), []);
      assert.deepStrictEqual(sanitizeExhibitIds(JSON.stringify(['ITEM-012-A', 'ITEM-012-A', 'UNKNOWN'])), ['ITEM-012-A']);
      assert.deepStrictEqual(sanitizeExhibitIds(JSON.stringify(['ITEM-012-A', 'ITEM-012-B'])), ['ITEM-012-A', 'ITEM-012-B']);
    });
  });

  describe('Phase 3 Personal Memory Foundation Logic Tests', () => {
    it('sortMemoriesChronologically should order memories by timeline position and display order', async () => {
      const { sortMemoriesChronologically } = await import('../src/data/memories.ts');

      const mockMemories = [
        { id: 'M3', title: 'Three', shortDescription: '', fullNarrative: '', date: '2026-01-01', category: 'milestone', timelinePosition: 2026, displayOrder: 1, visibility: 'revealed', image: '' },
        { id: 'M1', title: 'One', shortDescription: '', fullNarrative: '', date: '1978-06-21', category: 'voyage', timelinePosition: 1978, displayOrder: 1, visibility: 'revealed', image: '' },
        { id: 'M2', title: 'Two', shortDescription: '', fullNarrative: '', date: '1978-06-21', category: 'curiosity', timelinePosition: 1978, displayOrder: 2, visibility: 'revealed', image: '' },
      ];

      const sorted = sortMemoriesChronologically(mockMemories);
      assert.strictEqual(sorted[0].id, 'M1');
      assert.strictEqual(sorted[1].id, 'M2');
      assert.strictEqual(sorted[2].id, 'M3');
    });

    it('should support multiple memories on the exact same date', async () => {
      const { PLACEHOLDER_MEMORIES } = await import('../src/data/memories.ts');

      const solsticeMemories = PLACEHOLDER_MEMORIES.filter((m) => m.date === '1978-06-21');
      assert.strictEqual(solsticeMemories.length >= 2, true, 'Expected multiple memories sharing the 1978-06-21 date');
      assert.notStrictEqual(solsticeMemories[0].id, solsticeMemories[1].id);
      assert.notStrictEqual(solsticeMemories[0].title, solsticeMemories[1].title);
    });

    it('groupMemoriesByPeriod should organize memories into period-based groups', async () => {
      const { groupMemoriesByPeriod, PLACEHOLDER_MEMORIES } = await import('../src/data/memories.ts');

      const groups = groupMemoriesByPeriod(PLACEHOLDER_MEMORIES);
      assert.ok(groups['1978']);
      assert.strictEqual(groups['1978'].length >= 2, true);
    });

    it('evidenceToMemoryItem should properly convert EvidenceItem to MemoryItem structure', async () => {
      const { evidenceToMemoryItem } = await import('../src/data/memories.ts');
      const { EVIDENCE_COLLECTION } = await import('../src/data/evidence.ts');

      const evidence = EVIDENCE_COLLECTION[0];
      const memory = evidenceToMemoryItem(evidence, 1978);

      assert.strictEqual(memory.id, `MEM-${evidence.id}`);
      assert.strictEqual(memory.title, evidence.title);
      assert.strictEqual(memory.shortDescription, evidence.summary);
      assert.ok(memory.fullNarrative.length > 0);
      assert.strictEqual(memory.image, evidence.imageUrl);
      assert.strictEqual(memory.location, evidence.origin);
      assert.strictEqual(memory.timelinePosition, 1978);
      assert.strictEqual(memory.visibility, 'revealed');
      assert.strictEqual(memory.evidenceIdRef, evidence.id);
    });

    it('PLACEHOLDER_GALLERY_COLLECTIONS should contain valid structured collections with photos', async () => {
      const { PLACEHOLDER_GALLERY_COLLECTIONS } = await import('../src/data/memories.ts');

      assert.strictEqual(PLACEHOLDER_GALLERY_COLLECTIONS.length, 3);
      for (const col of PLACEHOLDER_GALLERY_COLLECTIONS) {
        assert.ok(col.id);
        assert.ok(col.title);
        assert.ok(col.description);
        assert.ok(Array.isArray(col.photos));
        assert.strictEqual(col.photos.length >= 1, true);
        for (const photo of col.photos) {
          assert.ok(photo.id);
          assert.ok(photo.title);
          assert.ok(photo.imageUrl);
          assert.ok(photo.collectionId);
        }
      }
    });
  });

});
