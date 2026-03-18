(function () {
  'use strict';

  /* ── Theme Toggle ─────────────────────────────────────────── */
  var THEME_KEY = 'sl-docs-theme';

  function getPreferred() {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
  }

  applyTheme(getPreferred());

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.docs-theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    }

    /* ── Mobile Sidebar Toggle ──────────────────────────────── */
    var menuBtn = document.querySelector('.docs-mobile-menu-btn');
    var sidebar = document.querySelector('.docs-sidebar');
    var overlay = document.querySelector('.docs-sidebar-overlay');

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        var open = sidebar && sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('visible', open);
      });
    }
    if (overlay) overlay.addEventListener('click', closeSidebar);

    /* ── Code Tab Switching ─────────────────────────────────── */
    var TAB_KEY = 'sl-docs-lang';
    var storedLang = localStorage.getItem(TAB_KEY);

    function activateTab(group, lang) {
      var tabs = group.querySelectorAll('.code-tab');
      var panels = group.querySelectorAll('.code-panel');
      var found = false;

      tabs.forEach(function (t) {
        var match = t.getAttribute('data-lang') === lang;
        t.classList.toggle('active', match);
        if (match) found = true;
      });

      panels.forEach(function (p) {
        p.classList.toggle('active', p.getAttribute('data-lang') === lang);
      });

      if (!found) {
        if (tabs[0]) tabs[0].classList.add('active');
        if (panels[0]) panels[0].classList.add('active');
      }
    }

    function syncAllTabs(lang) {
      localStorage.setItem(TAB_KEY, lang);
      document.querySelectorAll('.code-group').forEach(function (g) {
        activateTab(g, lang);
      });
    }

    if (storedLang) syncAllTabs(storedLang);

    document.querySelectorAll('.code-group').forEach(function (group) {
      group.querySelectorAll('.code-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          var lang = this.getAttribute('data-lang');
          syncAllTabs(lang);
        });
      });
    });

    /* ── Copy to Clipboard ──────────────────────────────────── */
    var COPY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    var CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.innerHTML = COPY_ICON;

      btn.addEventListener('click', function () {
        var container = btn.closest('.code-panel') || btn.closest('.code-block');
        if (!container) return;
        var code = container.querySelector('code');
        if (!code) return;

        var text = code.textContent;
        navigator.clipboard.writeText(text).then(function () {
          btn.innerHTML = CHECK_ICON;
          btn.classList.add('copied');
          setTimeout(function () {
            btn.innerHTML = COPY_ICON;
            btn.classList.remove('copied');
          }, 2000);
        });
      });
    });

    /* ── Active Sidebar Link ────────────────────────────────── */
    var path = window.location.pathname.replace(/\/$/, '') || '/docs';
    document.querySelectorAll('.docs-sidebar-link').forEach(function (link) {
      var href = link.getAttribute('href').replace(/\/$/, '');
      if (href === path) link.classList.add('active');
    });
  });
})();
