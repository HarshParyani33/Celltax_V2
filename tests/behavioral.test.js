import test, { describe, it } from 'node:test';
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
    it('isElementFocusable should correctly identify focusable vs inert elements', () => {
      // Helper to create a minimal DOM element mock
      const makeEl = (attrs = {}, style = {}) => ({
        getAttribute: (k) => attrs[k] ?? null,
        hasAttribute: (k) => k in attrs,
        style,
        tabIndex: attrs.tabindex ? parseInt(attrs.tabindex, 10) : 0,
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
    });

    it('handleTabFocusWrap should correctly trap focus between boundary elements', () => {
      let focused = null;
      const el1 = {
        getAttribute: () => null,
        hasAttribute: () => false,
        style: {},
        tabIndex: 0,
        focus: () => { focused = 'el1'; },
      };
      const el2 = {
        getAttribute: () => null,
        hasAttribute: () => false,
        style: {},
        tabIndex: 0,
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

});
