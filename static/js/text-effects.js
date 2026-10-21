/**
 * text-effects.js — High-End Creative Typography & Micro-Interactions
 * ────────────────────────────────────────────────────────────────
 * Non-destructive text enhancements layered cleanly on top of
 * the existing GSAP + ScrollTrigger architecture.
 *
 * Enhancements:
 *   1. Terminal Decode / Scramble on Chapter Labels (scroll-triggered)
 *   2. Kinetic Mechanical Solid-Inversion on Hero Outline Words (zero glow)
 *   3. Luminous Gradient Shimmer Sweep on Section Headlines
 *   4. Smooth Section Number Countup ("00" → "04")
 *   5. Staggered Dossier System Reveal (Tech Stack)
 *   6. Apple-Style Scroll-Driven Reading Scrub (word illumination)
 *   7. Interactive Magnetic Spotlight on Outlined Headings (cursor beam)
 *   8. Magnetic Rolling Character Hover (buttons & badges)
 *
 * Full accessibility & stability:
 *   - Respects prefers-reduced-motion
 *   - Preserves semantic HTML and ARIA labels for screen readers
 *   - Prevents DOM layout shifts (reserves rendered widths)
 * ────────────────────────────────────────────────────────────────
 */

'use strict';

(function initTextEnhancements() {
  function setupRollingText(el, textOverride) {
    if (!el) return;
    const text = (textOverride !== undefined ? textOverride : (el.getAttribute('data-roll-text') || el.textContent)).trim();
    if (!text) return;

    el.setAttribute('data-roll-text', text);
    el.setAttribute('aria-label', text);
    el.innerHTML = '';

    const track = document.createElement('span');
    track.classList.add('roll-track');
    track.setAttribute('aria-hidden', 'true');

    const primary = document.createElement('span');
    primary.classList.add('roll-primary');

    const secondary = document.createElement('span');
    secondary.classList.add('roll-secondary');

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const displayChar = ch === ' ' ? '\u00A0' : ch;

      const pSpan = document.createElement('span');
      pSpan.textContent = displayChar;
      pSpan.classList.add('roll-char');
      pSpan.style.setProperty('--char-idx', i);
      primary.appendChild(pSpan);

      const sSpan = document.createElement('span');
      sSpan.textContent = displayChar;
      sSpan.classList.add('roll-char');
      sSpan.style.setProperty('--char-idx', i);
      secondary.appendChild(sSpan);
    }

    track.appendChild(primary);
    track.appendChild(secondary);
    el.appendChild(track);
  }

  window.setupRollingText = setupRollingText;

  function start() {
    // ── Guard 1: Respect user's motion preferences ──
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    // ── Guard 2: Ensure GSAP and ScrollTrigger are present ──
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    /* ══════════════════════════════════════════════════════════════
       1. TEXT SCRAMBLE / DECODE — Chapter Labels
       ══════════════════════════════════════════════════════════════ */
    (function initScrambleLabels() {
      const GLYPHS = '0123456789ABCDEF!@#$*&%_';
      const labels = document.querySelectorAll('.chapter-label');
      if (!labels.length) return;

      labels.forEach((label) => {
        const originalText = label.textContent.trim();
        if (!originalText) return;

        label.setAttribute('data-original-text', originalText);
        label.setAttribute('aria-label', originalText);

        let hasScrambled = false;

        ScrollTrigger.create({
          trigger: label,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            if (hasScrambled) return;
            hasScrambled = true;
            runScramble(label, originalText);
          },
        });
      });

      function runScramble(el, target) {
        const initialWidth = el.getBoundingClientRect().width;
        if (initialWidth > 0) {
          el.style.minWidth = `${Math.ceil(initialWidth)}px`;
          el.style.display = 'inline-block';
        }
        el.classList.add('scrambling');

        const len = target.length;
        let frame = 0;
        const totalFrames = 30;
        const resolveOrder = [];

        for (let i = 0; i < len; i++) resolveOrder.push(i);
        for (let i = resolveOrder.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [resolveOrder[i], resolveOrder[j]] = [resolveOrder[j], resolveOrder[i]];
        }

        function tick() {
          frame++;
          const progress = frame / totalFrames;
          const resolvedCount = Math.floor(progress * len);

          let display = '';
          for (let i = 0; i < len; i++) {
            const ch = target[i];
            if (ch === ' ' || ch === '/' || ch === '.' || ch === '-') {
              display += ch;
            } else if (resolveOrder.indexOf(i) < resolvedCount) {
              display += ch;
            } else {
              display += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
          }

          el.textContent = display;

          if (frame < totalFrames) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = target;
            el.classList.remove('scrambling');
            el.style.minWidth = '';
          }
        }

        requestAnimationFrame(tick);
      }
    })();


    /* ══════════════════════════════════════════════════════════════
       2. KINETIC MECHANICAL SOLID-INVERSION — Hero Outline Words
       Zero glow. Razor-sharp architectural wireframe that morphs
       into bold solid letters with tactile piano-key physics on hover.
       ══════════════════════════════════════════════════════════════ */
    (function initHeroOutlineLetters() {
      const outlineWords = document.querySelectorAll('.title-word--outline');
      if (!outlineWords.length) return;

      outlineWords.forEach((word) => {
        const text = word.textContent.trim();
        if (!text) return;

        word.setAttribute('aria-label', text);
        word.innerHTML = '';

        const charSpans = [];
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const span = document.createElement('span');
          span.textContent = char;
          span.classList.add('char-span');
          span.setAttribute('aria-hidden', 'true');

          if (char === ' ') {
            span.classList.add('space');
          }

          word.appendChild(span);
          charSpans.push(span);

          // Tactile Mechanical Solid-Morph on Hover (Zero Glow)
          if (char !== ' ') {
            const tilt = (i % 2 === 0 ? 1 : -1) * 3.5;

            span.addEventListener('mouseenter', () => {
              gsap.killTweensOf(span);
              gsap.to(span, {
                y: -10,
                scale: 1.08,
                rotateZ: tilt,
                color: '#ffffff',
                webkitTextFillColor: '#ffffff',
                webkitTextStrokeColor: 'transparent',
                duration: 0.16,
                ease: 'power2.out',
              });
            });

            span.addEventListener('mouseleave', () => {
              gsap.killTweensOf(span);
              gsap.to(span, {
                y: 0,
                scale: 1,
                rotateZ: 0,
                color: 'transparent',
                webkitTextFillColor: 'transparent',
                webkitTextStrokeColor: 'rgba(255, 255, 255, 0.95)',
                duration: 0.6,
                ease: 'elastic.out(1.1, 0.35)',
              });
            });
          }
        }

        // Tactile domino settle ripple on entrance (Zero Glow)
        const delay = sessionStorage.getItem('loaderSeen') ? 1.5 : 2.5;
        gsap.fromTo(
          charSpans,
          { y: -6, scale: 1.03 },
          {
            y: 0,
            scale: 1,
            stagger: 0.025,
            duration: 0.45,
            delay: delay,
            ease: 'back.out(2)',
          }
        );
      });
    })();


    /* ══════════════════════════════════════════════════════════════
       3. LUMINOUS GRADIENT SHIMMER — Section Headlines
       ══════════════════════════════════════════════════════════════ */
    (function initGradientShimmer() {
      const gradientSpans = document.querySelectorAll('.chapter-headline .text-gradient');
      if (!gradientSpans.length) return;

      gradientSpans.forEach((span) => {
        span.classList.add('shimmer-text');

        ScrollTrigger.create({
          trigger: span,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            span.classList.add('shimmer-active');
          },
        });
      });
    })();


    /* ══════════════════════════════════════════════════════════════
       4. SECTION NUMBER COUNTUP — Selected Work Header
       ══════════════════════════════════════════════════════════════ */
    (function initSectionCountup() {
      const projContainer = document.querySelector('#projects');
      if (!projContainer) return;

      const numEl = projContainer.querySelector('.font-display.font-bold.text-white\\/20');
      if (!numEl) return;

      const textNode = Array.from(numEl.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE && /\d+/.test(node.nodeValue)
      );
      if (!textNode) return;

      const match = textNode.nodeValue.match(/(\d+)/);
      if (!match) return;

      const targetNum = parseInt(match[1], 10);
      const originalValue = textNode.nodeValue;

      textNode.nodeValue = originalValue.replace(/\d+/, '00');

      ScrollTrigger.create({
        trigger: projContainer,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const counter = { val: 0 };
          gsap.to(counter, {
            val: targetNum,
            duration: 1.1,
            ease: 'power2.out',
            onUpdate: () => {
              const formatted = String(Math.round(counter.val)).padStart(2, '0');
              textNode.nodeValue = originalValue.replace(/\d+/, formatted);
            },
          });
        },
      });
    })();


    /* ══════════════════════════════════════════════════════════════
       5. DOSSIER ROW STAGGER REVEAL — Tech Stack Dossier
       ══════════════════════════════════════════════════════════════ */
    (function initDossierStagger() {
      const panel = document.querySelector('.tech-dossier-panel');
      if (!panel) return;

      const rows = panel.querySelectorAll('.dossier-row');
      if (!rows.length) return;

      gsap.set(rows, { opacity: 0, x: -16 });

      ScrollTrigger.create({
        trigger: panel,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(rows, {
            opacity: 1,
            x: 0,
            duration: 0.55,
            stagger: 0.07,
            ease: 'power3.out',
          });
        },
      });
    })();


    /* ══════════════════════════════════════════════════════════════
       6. APPLE-STYLE SCROLL-DRIVEN READING SCRUB
       Words illuminate from muted to radiant white as the user
       scrolls through narrative paragraphs.
       ══════════════════════════════════════════════════════════════ */
    (function initReadingScrub() {
      const paragraphs = document.querySelectorAll('.reading-scrub');
      if (!paragraphs.length) return;

      paragraphs.forEach((p) => {
        const rawText = p.textContent.trim();
        if (!rawText) return;

        p.setAttribute('aria-label', rawText);
        const words = rawText.split(/\s+/);
        p.innerHTML = '';

        const wordSpans = [];
        words.forEach((w, idx) => {
          const span = document.createElement('span');
          span.textContent = w;
          span.classList.add('scrub-word');
          span.setAttribute('aria-hidden', 'true');
          p.appendChild(span);
          wordSpans.push(span);

          if (idx < words.length - 1) {
            p.appendChild(document.createTextNode(' '));
          }
        });

        ScrollTrigger.create({
          trigger: p,
          start: 'top 82%',
          end: 'bottom 45%',
          scrub: 0.4,
          onUpdate: (self) => {
            const threshold = Math.floor(self.progress * wordSpans.length);
            wordSpans.forEach((span, i) => {
              if (i <= threshold) {
                span.classList.add('active');
              } else {
                span.classList.remove('active');
              }
            });
          },
        });
      });
    })();


    /* ══════════════════════════════════════════════════════════════
       7. INTERACTIVE MAGNETIC SPOTLIGHT ON OUTLINED HEADINGS
       Luminous radial glow follows cursor coordinates and fills
       the inside of outline letters.
       ══════════════════════════════════════════════════════════════ */
    (function initHeadingSpotlight() {
      const targets = document.querySelectorAll('.spotlight-outline-text');
      if (!targets.length) return;

      targets.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          el.style.setProperty('--spotlight-x', `${x}px`);
          el.style.setProperty('--spotlight-y', `${y}px`);
          el.classList.add('has-spotlight');
        });

        el.addEventListener('mouseleave', () => {
          el.classList.remove('has-spotlight');
        });
      });
    })();


    /* ══════════════════════════════════════════════════════════════
       8. MAGNETIC ROLLING CHARACTER HOVER (Buttons & Badges)
       Dual-layer translateY stagger roll for premium tactile feedback.
       ══════════════════════════════════════════════════════════════ */
    (function initRollingCharacters() {
      const rollElements = document.querySelectorAll('.roll-hover');
      if (!rollElements.length) return;

      rollElements.forEach((el) => {
        setupRollingText(el);
      });
    })();
  }

  // Ensure DOM is ready before initialising
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
