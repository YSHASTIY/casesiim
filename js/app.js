document.addEventListener('DOMContentLoaded', function() {
  // Данные
  var cases = [
    ['PULSE', 'fa-bolt', 'gold', '#f5c156', '39'],
    ['AURORA', 'fa-snowflake', 'cyan', '#58e2ff', '99'],
    ['EMBER', 'fa-fire', 'red', '#ff6670', '149'],
    ['VOID', 'fa-meteor', 'blue', '#79a5ff', '249'],
    ['APEX', 'fa-crown', 'violet', '#c8adff', '499']
  ];

  var drops = [
    ['NovaWolf', 'fa-crosshairs', 'AWP · Chromatic', '320'],
    ['Mika', 'fa-burst', 'AK-47 · Hyper', '156'],
    ['drev', 'fa-wind', '★ Butterfly', '980'],
    ['kay', 'fa-hand', 'Sport Gloves', '712'],
    ['sly', 'fa-gem', 'Desert Eagle', '198'],
    ['zero', 'fa-crosshairs', 'M4A1-S · Ether', '267']
  ];

  window.balance = Number(localStorage.getItem('crate-balance')) || 2450;

  function money(n) {
    return Number(n).toLocaleString('ru-RU');
  }
  window.money = money;

  function updateBalance() {
    localStorage.setItem('crate-balance', window.balance);
    document.querySelectorAll('[data-balance]').forEach(function(el) {
      el.textContent = money(window.balance);
    });
  }
  window.updateBalance = updateBalance;

  function toast(msg) {
    var t = document.querySelector('.toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function() {
      t.classList.remove('show');
    }, 3000);
  }
  window.toast = toast;

  function renderCases(containerSelector) {
    var container = document.querySelector(containerSelector || '[data-cases]');
    if (!container) return;
    container.innerHTML = cases.map(function(item) {
      var name = item[0];
      var icon = item[1];
      var color = item[3];
      var price = item[4];
      return '<article class="case-card" data-case="' + name + '" tabindex="0" role="link" style="--case-tint:' + color + '22;--case-color:' + color + '">' +
        '<div class="case-symbol"><i class="fa-solid ' + icon + '"></i></div>' +
        '<small>LIMITED SERIES</small>' +
        '<h3>' + name + '</h3>' +
        '<div class="case-bottom"><b><i class="fa-solid fa-gem"></i> ' + price + '</b></div>' +
        '</article>';
    }).join('');
  }

  function renderDrops(containerSelector) {
    var container = document.querySelector(containerSelector || '[data-drops]');
    if (!container) return;
    // Для лайв-ленты порядок: новые слева. Но мы просто рендерим как есть.
    var items = drops.concat(drops).concat(drops);
    container.innerHTML = items.map(function(item) {
      return '<article class="drop">' +
        '<div class="drop-icon"><i class="fa-solid ' + item[1] + '"></i></div>' +
        '<div><b>' + item[2] + '</b><small>' + item[0] + ' только что открыл</small></div>' +
        '<strong>' + item[3] + '</strong>' +
        '</article>';
    }).join('');
  }

  function setup() {
    // Рендерим кейсы на всех страницах, где есть [data-cases]
    renderCases();
    // Рендерим лайв-ленту везде, где есть [data-drops]
    renderDrops();

    updateBalance();

    // Обработчик пополнения
    document.addEventListener('click', function(e) {
      var add = e.target.closest('.topup');
      if (add) {
        window.balance += 500;
        updateBalance();
        toast('+500 игровых кристаллов зачислено');
        add.classList.add('added');
        setTimeout(function() {
          add.classList.remove('added');
        }, 500);
      }

      // Выбор кейса (только на страницах со списком)
      var open = e.target.closest('[data-case]');
      if (open) {
        var name = open.dataset.case;
        var selected = cases.find(function(item) {
          return item[0] === name;
        });
        if (selected) {
          localStorage.setItem('crate-selected-case', name);
          localStorage.setItem('crate-selected-case-price', selected[4]);
          toast('Кейс ' + name + ' готов к открытию');
          setTimeout(function() {
            location.href = 'case.html';
          }, 450);
        }
      }
    });

    // Клавиатурная навигация
    document.addEventListener('keydown', function(e) {
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement.matches && document.activeElement.matches('[data-case]')) {
        document.activeElement.click();
      }
    });

    // Скролл
    window.addEventListener('scroll', function() {
      var topbar = document.querySelector('.topbar');
      if (topbar) {
        topbar.classList.toggle('scrolled', window.scrollY > 12);
      }
    });

    // Мышь
    window.addEventListener('mousemove', function(e) {
      var glow = document.querySelector('.cursor-glow');
      if (glow) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      }
    });

    // GSAP анимации (только на главной)
    if (window.gsap && document.querySelector('.hero')) {
      gsap.from('.hero-copy > *', {
        opacity: 0,
        y: 22,
        stagger: 0.1,
        duration: 0.65,
        ease: 'power3.out'
      });
      gsap.from('.hero-stage', {
        opacity: 0,
        scale: 0.8,
        duration: 0.65,
        ease: 'back.out(1.4)'
      });
    }

    // Intersection Observer
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(function(el) {
      observer.observe(el);
    });
  }

  setup();
});