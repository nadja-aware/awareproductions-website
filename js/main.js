(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none)').matches;

  /* Light that follows the cursor (drifts while scrolling on phones) */
  var lights = document.querySelectorAll('.light span');
  var clients = document.getElementById('clients-list');
  function place(x, y) {
    for (var i = 0; i < lights.length; i++) {
      lights[i].style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
    }
  }
  if (!reduce) {
    if (!touch) {
      window.addEventListener('pointermove', function (e) {
        place(e.clientX, e.clientY);
        if (clients) {
          var r = clients.getBoundingClientRect();
          clients.style.setProperty('--mx', Math.round(e.clientX - r.left) + 'px');
          clients.style.setProperty('--my', Math.round(e.clientY - r.top) + 'px');
        }
      }, { passive: true });
    } else {
      var t = Math.random() * 6, last = 0;
      window.addEventListener('scroll', function () {
        var now = Date.now();
        if (now - last < 90) return;
        last = now; t += 0.08;
        var w = window.innerWidth, h = window.innerHeight;
        place(Math.round(w * (0.5 + 0.44 * Math.sin(t * 1.3))), Math.round(h * (0.5 + 0.4 * Math.sin(t * 0.83 + 1.7))));
      }, { passive: true });
    }
  }

  /* Header film: loads on larger screens right away, on phones only when sound is tapped */
  var hero = document.querySelector('.hero');
  var film = document.getElementById('film');
  var sound = document.getElementById('sound');
  var loaded = false;
  function loadFilm() {
    if (loaded || !film) return;
    loaded = true;
    film.src = film.getAttribute('data-src');
    film.load();
  }
  function playFilm() {
    var p = film.play();
    if (p && p.catch) p.catch(function () {});
  }
  if (film && !reduce && window.innerWidth > 760) {
    loadFilm();
    playFilm();
  }
  if (sound && film) {
    sound.addEventListener('click', function () {
      var on = !hero.classList.contains('colour');
      loadFilm();
      film.muted = !on;
      playFilm();
      hero.classList.toggle('colour', on);
      sound.setAttribute('aria-label', on ? 'Sound off' : 'Sound on');
      sound.setAttribute('title', on ? 'Sound off' : 'Sound on');
    });
  }

  /* Phone menu */
  var nav = document.querySelector('.nav');
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.textContent = open ? 'Close' : 'Menu';
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'Menu';
      });
    });
  }

  /* Partial scope: up to three bubbles */
  var picker = document.getElementById('picker');
  if (picker) {
    var order = [];
    picker.querySelectorAll('button.pill').forEach(function (b) {
      if (b.classList.contains('on')) order.push(b);
      b.addEventListener('click', function () {
        var i = order.indexOf(b);
        if (i >= 0) {
          order.splice(i, 1);
        } else {
          order.push(b);
          if (order.length > 3) order.shift();
        }
        picker.querySelectorAll('button.pill').forEach(function (x) {
          var on = order.indexOf(x) >= 0;
          x.classList.toggle('on', on);
          x.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      });
    });
  }

  /* Dropdowns: More projects, Mission (+ second About photo) */
  function toggler(btnId, targetIds) {
    var btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      targetIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.hidden = !open;
      });
    });
  }
  toggler('more-btn', ['more-list']);
  toggler('mission-btn', ['mission-text', 'about-photo-2']);
})();

document.querySelectorAll('.strip-film').forEach(v=>{v.addEventListener('play',()=>v.classList.add('on'));v.addEventListener('pause',()=>v.classList.remove('on'))});
