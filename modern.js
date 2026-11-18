// Modern refresh: gentle scroll reveals. Content is fully visible without JS
// and for people who prefer reduced motion; we only hide-then-reveal when
// IntersectionObserver is available and motion is allowed.
(function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    var groups = [
        '.home-band-item',
        '.home-questions .section-header, .home-question-card',
        '.home-pillar-copy, .home-pillar-visual',
        '.home-deliverable',
        '.home-roles .section-header',
        '[data-reveal]'
    ];

    function setup() {
        var els = [];
        groups.forEach(function (sel) {
            var found = document.querySelectorAll(sel);
            Array.prototype.forEach.call(found, function (el, i) {
                if (el.classList.contains('reveal')) return;
                el.classList.add('reveal');
                // Stagger siblings in a row, capped so long grids don't drag.
                el.style.setProperty('--reveal-delay', Math.min(i % 4, 3) * 0.08 + 's');
                els.push(el);
            });
        });
        if (!els.length) return;
        document.documentElement.classList.add('js-reveal');
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        els.forEach(function (el) {
            // Anything already on screen shows immediately.
            if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible');
            else io.observe(el);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
    else setup();
})();


// Accessible tabs: [data-tabs] contains [role=tab] buttons controlling [role=tabpanel]s.
(function () {
    function init() {
        Array.prototype.forEach.call(document.querySelectorAll('[data-tabs]'), function (list) {
            var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
            function select(tab, focus) {
                tabs.forEach(function (t) {
                    var on = t === tab;
                    t.setAttribute('aria-selected', on ? 'true' : 'false');
                    t.tabIndex = on ? 0 : -1;
                    var panel = document.getElementById(t.getAttribute('aria-controls'));
                    if (panel) panel.hidden = !on;
                });
                if (focus) tab.focus();
            }
            // Deep link: /#team-product opens that tab.
            var m = location.hash.match(/^#team-([a-z-]+)$/);
            if (m) { var t0 = document.getElementById('team-tab-' + m[1]); if (t0) select(t0, false); }
            tabs.forEach(function (tab, i) {
                tab.addEventListener('click', function () { select(tab, false); });
                tab.addEventListener('keydown', function (e) {
                    var k = e.key, n = null;
                    if (k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
                    else if (k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
                    else if (k === 'Home') n = tabs[0];
                    else if (k === 'End') n = tabs[tabs.length - 1];
                    if (n) { e.preventDefault(); select(n, true); }
                });
            });
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();


// Platform page: highlight the feature-menu link for the section in view.
(function () {
    var nav = document.querySelector('.platform-nav');
    if (!nav || !('IntersectionObserver' in window)) return;
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var map = {};
    links.forEach(function (a) { var el = document.getElementById(a.getAttribute('href').slice(1)); if (el) map[el.id] = a; });
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            links.forEach(function (a) { a.classList.remove('is-active'); });
            var a = map[e.target.id];
            if (a) { a.classList.add('is-active'); var strip = a.parentNode; if (strip.scrollWidth > strip.clientWidth) strip.scrollTo({ left: a.offsetLeft - strip.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' }); }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
})();
