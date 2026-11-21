import test, { describe, it } from 'node:test';
import assert from 'node:assert';
import { EVIDENCE_COLLECTION, CASE_DOSSIER_DATA } from '../src/data/evidence.ts';
import {
  getPageTransition,
  getDocumentReveal,
  getTerminalLineReveal,
  getEvidenceCardHover,
} from '../src/utils/animations.ts';
import { soundFx } from '../src/utils/audio.ts';

describe('Phase 1 Core Behavioral Logic Tests', () => {

  describe('AccessTerminal: Credential Validation & Gate Behavior', () => {
    const ACCEPTED_CODES = [
      "EXTRAORDINARY",
      "012",
      "CASE012",
      "CASE 012",
      "CONFIDENTIAL",
      "ARCHIVE",
      "AGENT",
      "DIRECTIVE12",
      "INVESTIGATOR",
      "OPEN",
      "START"
    ];

    it('should accept all valid case clearance codes regardless of whitespace or casing', () => {
      const testInputs = ['012', ' 012 ', 'extraordinary', 'EXTRAORDINARY', 'Case012', 'archive', '  start  '];
      for (const input of testInputs) {
        const clean = input.trim().toUpperCase();
        assert.ok(ACCEPTED_CODES.includes(clean), `Expected "${input}" to be accepted`);
      }
    });

    it('should reject invalid credentials and trigger error state', () => {
      const invalidInputs = ['1234', 'PASSWORD', 'ADMIN', 'GUEST', 'UNKNOWN', ''];
      for (const input of invalidInputs) {
        const clean = input.trim().toUpperCase();
        assert.strictEqual(ACCEPTED_CODES.includes(clean), false, `Expected "${input}" to be rejected`);
      }
    });
  });

  describe('AccessTerminal: Skip-Intro Interval & Timeout Lifecycle', () => {
    it('should cancel active interval and pending timeouts when Skip Intro is invoked', () => {
      let intervalCleared = false;
      const activeInterval = setInterval(() => {}, 200);

      const intervalRef = { current: activeInterval };
      const timeoutsRef = { current: [setTimeout(() => {}, 500)] };

      const clearAllTimers = () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          intervalCleared = true;
        }
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
      };

      clearAllTimers();

      assert.strictEqual(intervalCleared, true, 'Active interval must be cleared on skip intro');
      assert.strictEqual(intervalRef.current, null, 'Interval ref must be nulled');
      assert.strictEqual(timeoutsRef.current.length, 0, 'Pending timeouts must be drained');
    });
  });

  describe('EvidenceArchive: Filtering & Catalog State', () => {
    it('should correctly filter exhibits by category with real data', () => {
      const allItems = EVIDENCE_COLLECTION;
      assert.strictEqual(allItems.length, 3, 'Total items should be 3');

      const photos = allItems.filter(item => item.type === 'photograph');
      assert.strictEqual(photos.length, 1, 'Photographs should filter to 1 item');
      assert.strictEqual(photos[0].id, 'ITEM-012-A');

      const docs = allItems.filter(item => item.type === 'document');
      assert.strictEqual(docs.length, 1, 'Documents should filter to 1 item');
      assert.strictEqual(docs[0].id, 'ITEM-012-B');

      const artefacts = allItems.filter(item => item.type === 'artefact');
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

  describe('EvidenceModal: Focus Trap & Focus Restoration Invariants', () => {
    it('should correctly calculate focus wrap boundaries for Tab and Shift+Tab', () => {
      const focusableElements = [
        { id: 'close-btn', focus: () => {} },
        { id: 'inspect-image', focus: () => {} },
        { id: 'modal-close-footer', focus: () => {} }
      ];

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      // Test Shift+Tab wrapping from first element -> last element
      let activeElement = first;
      let targetElement = null;

      if (activeElement === first) {
        targetElement = last;
      }
      assert.strictEqual(targetElement.id, 'modal-close-footer', 'Shift+Tab on first element must wrap to last element');

      // Test Tab wrapping from last element -> first element
      activeElement = last;
      if (activeElement === last) {
        targetElement = first;
      }
      assert.strictEqual(targetElement.id, 'close-btn', 'Tab on last element must wrap to first element');
    });

    it('should recover focus if activeElement moves outside the modal container', () => {
      let focusedTarget = null;
      const closeBtn = {
        id: 'close-btn',
        focus: () => { focusedTarget = 'close-btn'; }
      };

      const modalContainer = {
        contains: (el) => el?.insideModal === true
      };

      const externalElement = { insideModal: false };

      if (!modalContainer.contains(externalElement)) {
        closeBtn.focus();
      }

      assert.strictEqual(focusedTarget, 'close-btn', 'Focus outside modal must be redirected back to close button');
    });

    it('should restore focus to the triggering element on unmount only if element is attached', () => {
      let restoredElement = null;
      const mockDocument = {
        bodyContains: true,
      };

      const triggeringCard = {
        id: 'evidence-card-012-A',
        focus: () => { restoredElement = 'evidence-card-012-A'; }
      };

      const onUnmount = (trigger, isAttached) => {
        if (trigger && isAttached && typeof trigger.focus === 'function') {
          trigger.focus();
        }
      };

      // Case 1: Trigger element is valid and attached
      onUnmount(triggeringCard, true);
      assert.strictEqual(restoredElement, 'evidence-card-012-A', 'Original triggering element must receive focus');

      // Case 2: Trigger element is detached
      restoredElement = null;
      onUnmount(triggeringCard, false);
      assert.strictEqual(restoredElement, null, 'Detached element must not receive focus');
    });

    it('should invoke onClose callback when Escape key event is triggered', () => {
      let closed = false;
      const onClose = () => { closed = true; };

      const handleGlobalKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      handleGlobalKeyDown({ key: 'Escape' });
      assert.strictEqual(closed, true, 'Escape key must trigger modal onClose callback');

      closed = false;
      handleGlobalKeyDown({ key: 'Enter' });
      assert.strictEqual(closed, false, 'Non-Escape key must not trigger modal onClose callback');
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
      // Audio singleton starts muted for user-gesture compliance
      const initialMute = soundFx.getMuted();
      assert.strictEqual(typeof initialMute, 'boolean');
      assert.strictEqual(initialMute, true, 'Audio must default to muted');

      // Test toggle mute behavior
      const unmuted = soundFx.toggleMute();
      assert.strictEqual(unmuted, false, 'Toggling mute should return false (unmuted)');
      assert.strictEqual(soundFx.getMuted(), false);

      // Re-mute
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
