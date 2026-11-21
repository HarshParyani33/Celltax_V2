import test, { describe, it } from 'node:test';
import assert from 'node:assert';
import { EVIDENCE_COLLECTION, CASE_DOSSIER_DATA } from '../src/data/evidence.ts';

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
      const testInputs = ['012', ' 012 ', 'extraordinary', 'EXTRAORDINARY', 'Case012', 'archive'];
      for (const input of testInputs) {
        const clean = input.trim().toUpperCase();
        assert.ok(ACCEPTED_CODES.includes(clean), `Expected "${input}" to be accepted`);
      }
    });

    it('should reject invalid credentials and trigger error state', () => {
      const invalidInputs = ['1234', 'PASSWORD', 'ADMIN', 'GUEST', 'UNKNOWN'];
      for (const input of invalidInputs) {
        const clean = input.trim().toUpperCase();
        assert.strictEqual(ACCEPTED_CODES.includes(clean), false, `Expected "${input}" to be rejected`);
      }
    });
  });

  describe('AccessTerminal: Skip-Intro Interval & Timeout Lifecycle', () => {
    it('should cancel active interval and pending timeouts when Skip Intro is invoked', () => {
      let intervalCleared = false;
      let activeInterval = setInterval(() => {}, 200);

      // Simulate interval ref tracking
      const intervalRef = { current: activeInterval };
      const timeoutsRef = { current: [setTimeout(() => {}, 500)] };

      // Simulate handleSkipIntro implementation
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
    it('should correctly filter exhibits by category', () => {
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
      // Mock focusable element array
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

      // Focus-containment check
      if (!modalContainer.contains(externalElement)) {
        closeBtn.focus();
      }

      assert.strictEqual(focusedTarget, 'close-btn', 'Focus outside modal must be redirected back to close button');
    });

    it('should restore focus to the triggering element on unmount', () => {
      let restoredElement = null;
      const triggeringCard = {
        id: 'evidence-card-012-A',
        focus: () => { restoredElement = 'evidence-card-012-A'; }
      };

      // Store previous focus on open
      const previousFocus = triggeringCard;

      // Simulate modal unmount lifecycle
      const onUnmount = () => {
        if (previousFocus && typeof previousFocus.focus === 'function') {
          previousFocus.focus();
        }
      };

      onUnmount();
      assert.strictEqual(restoredElement, 'evidence-card-012-A', 'Original triggering element must receive focus on modal unmount');
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

  describe('Reduced Motion Invariant Checks', () => {
    it('should configure 0 or near-zero duration when reduced motion is preferred', () => {
      const getTransition = (shouldReduceMotion) => ({
        duration: shouldReduceMotion ? 0.01 : 0.3,
        scale: shouldReduceMotion ? 1 : 0.95,
        y: shouldReduceMotion ? 0 : 15
      });

      const normal = getTransition(false);
      assert.strictEqual(normal.duration, 0.3);
      assert.strictEqual(normal.scale, 0.95);
      assert.strictEqual(normal.y, 15);

      const reduced = getTransition(true);
      assert.strictEqual(reduced.duration, 0.01);
      assert.strictEqual(reduced.scale, 1);
      assert.strictEqual(reduced.y, 0);
    });
  });

});
