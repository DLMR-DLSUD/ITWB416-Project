/* Secret theme switch.
   Click the diamond at the top of the side rail to cycle:
   normal (silver) -> dark -> green (DLSU-D green & white) -> normal.
   Loaded in <head> so the saved theme applies before the page paints. */
(function () {
  var THEMES = ['normal', 'dark', 'green'];
  var LABELS = { normal: 'Normal mode', dark: 'Dark mode', green: 'Green mode' };
  var KEY = 'cics-theme';
  var root = document.documentElement;

  function apply(theme) {
    if (theme === 'dark' || theme === 'green') root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
  }

  function current() {
    return root.getAttribute('data-theme') || 'normal';
  }

  // Restore the saved theme right away (storage can be blocked, so guard it).
  try { apply(localStorage.getItem(KEY)); } catch (e) {}

  var toast, timer;
  function announce(theme) {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'theme-toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = LABELS[theme];
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove('show'); }, 1400);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var mark = document.querySelector('.rail .mark');
    if (!mark) return;
    mark.addEventListener('click', function () {
      var next = THEMES[(THEMES.indexOf(current()) + 1) % THEMES.length];
      apply(next);
      try {
        if (next === 'normal') localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, next);
      } catch (e) {}
      mark.classList.toggle('spin');
      announce(next);
    });
  });
})();
