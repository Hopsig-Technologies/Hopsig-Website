// Mount: after the engine and the page's scene files are loaded, call HA.boot() once the figures are in the DOM.
// Scroll-scrub wiring used on /ai-transformation (verbatim from the prototype):

    (function () {
      var sec = document.querySelector('.scrub'); if (!sec) return; var stick = sec.querySelector('.stick'); var inst = HA.inst.filter(function (i) { return i.id === 'ai-transformation'; })[0]; if (!inst) return;
      function range() { var top = sec.getBoundingClientRect().top + (window.scrollY || window.pageYOffset); return { top: top, len: sec.offsetHeight - stick.offsetHeight }; }
      function onS() { var r = range(); var y = (window.scrollY || window.pageYOffset) - r.top; HA.scrub(inst, r.len > 0 ? y / r.len : 1); }
      inst.goto = function (t) { var r = range(); var y = r.top + (t / inst.loop) * r.len; try { window.scrollTo({ top: y, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, y); } };
      window.addEventListener('scroll', onS, { passive: true }); window.addEventListener('resize', onS); onS();
      if (HA.prefersReduced) { HA.scrub(inst, 1); window.removeEventListener('scroll', onS); }
    })();
