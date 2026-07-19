document.addEventListener('DOMContentLoaded', function() {
  var selected = localStorage.getItem('crate-selected-case') || 'AURORA';
  var price = parseInt(localStorage.getItem('crate-selected-case-price')) || 99;

  var pools = {
    PULSE: [
      ['Glock · Tint', 'fa-gun', 'cyan', '22'],
      ['MP9 · Spark', 'fa-burst', 'blue', '30'],
      ['AK-47 · Flash', 'fa-burst', 'red', '37'],
      ['AWP · Glint', 'fa-crosshairs', 'violet', '44'],
      ['★ Butterfly · Glow', 'fa-wind', 'gold', '58'],
      ['M4A1 · Flicker', 'fa-gun', 'cyan', '64'],
      ['USP-S · Pulse', 'fa-ghost', 'cyan', '28'],
      ['Desert Eagle · Static', 'fa-burst', 'blue', '41'],
      ['MAC-10 · Lumen', 'fa-gun', 'red', '49'],
      ['Five-SeveN · Flashpoint', 'fa-burst', 'cyan', '55']
    ],
    AURORA: [
      ['Glock · Frost', 'fa-gun', 'cyan', '48'],
      ['MP9 · Hail', 'fa-burst', 'blue', '67'],
      ['AK-47 · Whiteout', 'fa-burst', 'red', '84'],
      ['AWP · Icebound', 'fa-crosshairs', 'violet', '111'],
      ['M4A1 · Arctic', 'fa-gun', 'cyan', '142'],
      ['★ Karambit · Aurora', 'fa-wind', 'gold', '198'],
      ['USP-S · Snowline', 'fa-ghost', 'cyan', '56'],
      ['Desert Eagle · Northstar', 'fa-burst', 'blue', '73'],
      ['MAC-10 · Polar', 'fa-gun', 'red', '89'],
      ['Five-SeveN · Winter', 'fa-burst', 'cyan', '97']
    ],
    EMBER: [
      ['Glock · Cinder', 'fa-gun', 'red', '72'],
      ['MP9 · Scorch', 'fa-burst', 'cyan', '95'],
      ['AK-47 · Ember', 'fa-burst', 'red', '125'],
      ['AWP · Ash', 'fa-crosshairs', 'violet', '164'],
      ['M4A1 · Inferno', 'fa-fire-flame-curved', 'gold', '218'],
      ['★ Bayonet · Heat', 'fa-wind', 'gold', '285'],
      ['USP-S · Smolder', 'fa-ghost', 'cyan', '83'],
      ['Desert Eagle · Blaze', 'fa-burst', 'blue', '108'],
      ['MAC-10 · Cinder', 'fa-gun', 'red', '118'],
      ['Five-SeveN · Furnace', 'fa-burst', 'cyan', '132']
    ],
    VOID: [
      ['Glock · Obsidian', 'fa-gun', 'blue', '112'],
      ['USP-S · Phantom', 'fa-ghost', 'cyan', '166'],
      ['AK-47 · Blackstar', 'fa-burst', 'violet', '209'],
      ['AWP · Singularity', 'fa-crosshairs', 'blue', '285'],
      ['M4A1 · Eclipse', 'fa-moon', 'violet', '368'],
      ['★ Karambit · Void', 'fa-wind', 'gold', '512'],
      ['Desert Eagle · Eclipse', 'fa-burst', 'blue', '155'],
      ['MAC-10 · Abyss', 'fa-gun', 'red', '182'],
      ['Five-SeveN · Null', 'fa-burst', 'cyan', '198'],
      ['P250 · Darkmatter', 'fa-gun', 'violet', '224']
    ],
    APEX: [
      ['Glock · Emberline', 'fa-gun', 'cyan', '180'],
      ['MP9 · Zenith', 'fa-burst', 'blue', '245'],
      ['AK-47 · Apex', 'fa-burst', 'red', '320'],
      ['AWP · Crownfall', 'fa-crosshairs', 'violet', '428'],
      ['M4A1 · Dominion', 'fa-gun', 'gold', '650'],
      ['★ Karambit · Sovereign', 'fa-wind', 'gold', '980'],
      ['USP-S · Ascendant', 'fa-ghost', 'cyan', '210'],
      ['Desert Eagle · Vantage', 'fa-burst', 'blue', '275'],
      ['MAC-10 · Prime', 'fa-gun', 'red', '340'],
      ['Five-SeveN · Elite', 'fa-burst', 'cyan', '390']
    ]
  };

  var fallback = [
    ['USP-S · Prism', 'fa-gem', 'violet', '210'],
    ['M4A1 · Flux', 'fa-gun', 'blue', '244'],
    ['★ Bayonet · Apex', 'fa-wind', 'gold', '670'],
    ['AK-47 · Spectrum', 'fa-burst', 'cyan', '315'],
    ['AWP · Nova', 'fa-crosshairs', 'violet', '350'],
    ['Glock · Pulse', 'fa-gun', 'cyan', '76']
  ];

  var skins = pools[selected] || fallback;
  var money = window.money || function(n) { return Number(n).toLocaleString('ru-RU'); };

  // Обновляем заголовки
  var caseNameDisplay = selected.charAt(0).toUpperCase() + selected.slice(1).toLowerCase();
  document.querySelector('[data-case-name]').textContent = caseNameDisplay;
  document.querySelector('[data-case-title]').textContent = caseNameDisplay;
  document.querySelector('[data-case-name-btn]').textContent = caseNameDisplay;
  document.querySelector('[data-case-price]').textContent = money(price);
  document.title = 'Crate — ' + caseNameDisplay;

  // Кнопки количества
  var countButtons = document.querySelectorAll('.count-btn');
  var currentCount = 1;
  var totalPriceEl = document.querySelector('[data-total-price]');

  function refreshTotalPrice() {
    if (totalPriceEl) totalPriceEl.textContent = money(currentCount * price);
  }
  // Инициализация — раньше цена под кнопками количества оставалась
  // от дефолтного значения в разметке и не совпадала с реальной ценой кейса.
  refreshTotalPrice();

  countButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      countButtons.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      currentCount = parseInt(this.dataset.count);
      refreshTotalPrice();
      initRoulettes(currentCount);
    });
  });

  var spinBtn = document.querySelector('.spin');
  var fastOpenBtn = document.getElementById('fastOpenBtn');
  var isFastOpen = false;
  if (spinBtn) {
    spinBtn.innerHTML = '<i class="fa-solid fa-play"></i> Открыть ' + caseNameDisplay;
  }
  if (fastOpenBtn) {
    fastOpenBtn.addEventListener('click', function() {
      isFastOpen = true;
      fastOpenBtn.classList.add('is-active');
      var wrapper = fastOpenBtn.closest('.fast-open-wrapper');
      if (wrapper) {
        wrapper.classList.add('is-active');
      }
      if (spinBtn) {
        spinBtn.classList.add('fast-open');
        spinBtn.innerHTML = '<i class="fa-solid fa-play"></i> Быстрое открытие';
        spinBtn.click();
      }
    });
  }

  var roulettesContainer = document.querySelector('[data-roulettes]');
  var itemsContainer = document.querySelector('[data-items]');

  var ITEM_WIDTH = 130;
  var ITEM_GAP = 10;
  var CYCLES = 8;
  var LAND_CYCLE_START = 5;
  var STRIP_LENGTH = skins.length * (CYCLES + LAND_CYCLE_START + 4);

  function buildLane(index) {
    var lane = document.createElement('div');
    lane.className = 'roulette-lane';
    if (currentCount > 1) {
      lane.innerHTML = '<span class="lane-badge">Кейс ' + (index + 1) + '</span>';
    }
    var strip = document.createElement('div');
    strip.className = 'roulette';
    strip.dataset.index = index;
    for (var i = 0; i < STRIP_LENGTH; i++) {
      var s = skins[i % skins.length];
      var item = document.createElement('article');
      item.className = 'roulette-item ' + s[2];
      item.innerHTML = '<i class="fa-solid ' + s[1] + '"></i><small>' + s[0] + '</small>';
      strip.appendChild(item);
    }
    lane.appendChild(strip);
    return lane;
  }

  function initRoulettes(count) {
    roulettesContainer.innerHTML = '';
    roulettesContainer.classList.toggle('multi', count > 1);
    for (var i = 0; i < count; i++) {
      roulettesContainer.appendChild(buildLane(i));
    }
  }
  initRoulettes(currentCount);

  // Заполняем список предметов (вероятности)
  itemsContainer.innerHTML = '';
  var uniqueItems = [];
  skins.forEach(function(item) {
    if (!uniqueItems.some(function(existing) { return existing[0] === item[0]; })) {
      uniqueItems.push(item);
    }
  });
  for (var j = 0; j < uniqueItems.length; j++) {
    var item = uniqueItems[j];
    var chance = (j % 5 === 0) ? '1.2%' : '8.6%';
    itemsContainer.innerHTML += '<article class="item ' + item[2] + '">' +
      '<i class="fa-solid ' + item[1] + '"></i>' +
      '<b>' + item[0] + '</b>' +
      '<small>' + chance + '</small>' +
      '</article>';
  }

  function confettiBurst(container) {
    var colors = ['#f5c156', '#58e2ff', '#8b5cf6', '#ff4d5b', '#fff'];
    for (var i = 0; i < 26; i++) {
      var p = document.createElement('span');
      p.className = 'confetti-bit';
      p.style.setProperty('--x', (Math.random() * 2 - 1).toFixed(2));
      p.style.setProperty('--r', (Math.random() * 720 - 360).toFixed(0) + 'deg');
      p.style.setProperty('--d', (0.7 + Math.random() * 0.7).toFixed(2) + 's');
      p.style.background = colors[i % colors.length];
      p.style.left = (45 + Math.random() * 10) + '%';
      container.appendChild(p);
      (function(el) { setTimeout(function() { el.remove(); }, 1500); })(p);
    }
  }

  // Открытие
  if (spinBtn) {
    spinBtn.addEventListener('click', function(e) {
      var btn = e.currentTarget;
      if (btn.disabled) return;

      var totalPrice = currentCount * price;
      if (window.balance < totalPrice) {
        toast('Недостаточно кристаллов');
        return;
      }

      isFastOpen = !!(fastOpenBtn && fastOpenBtn.classList.contains('is-active'));

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner ' + (isFastOpen ? '' : 'fa-spin') + '"></i> ' + (isFastOpen ? 'Выдаем...' : 'Открываем...');
      btn.classList.toggle('is-fast', isFastOpen);

      window.balance -= totalPrice;
      window.updateBalance();

      var results = [];
      var chosenIndices = [];
      for (var i = 0; i < currentCount; i++) {
        var winIndex = Math.floor(Math.random() * skins.length);
        chosenIndices.push(winIndex);
        results.push(skins[winIndex]);
      }

      var inventory = JSON.parse(sessionStorage.getItem('crate-inventory') || '[]');
      var sessionIds = results.map(function(win) {
        var id = Date.now().toString() + Math.random().toString();
        inventory.push({ id: id, name: win[0], icon: win[1], rarity: win[2], value: win[3] });
        return id;
      });
      sessionStorage.setItem('crate-inventory', JSON.stringify(inventory));

      var currentUnsold = results.map(function(r, i) {
        return { name: r[0], icon: r[1], rarity: r[2], value: r[3], id: sessionIds[i], sold: false };
      });

      function getLandingOffset(index) {
        var lane = roulettesContainer.querySelectorAll('.roulette')[index];
        var laneWidth = lane && lane.parentElement ? lane.parentElement.clientWidth : 760;
        var landingIndex = (CYCLES + LAND_CYCLE_START + 1) * skins.length + (chosenIndices[index] || 0);
        var base = landingIndex * (ITEM_WIDTH + ITEM_GAP);
        return base - (laneWidth / 2 - ITEM_WIDTH / 2) + 10;
      }

      function renderResults() {
        spinBtn.style.display = 'none';
        roulettesContainer.innerHTML = '';
        var grid = document.createElement('div');
        grid.className = 'results-grid';

        var totalSellValue = 0;
        var unsoldCnt = 0;

        currentUnsold.forEach(function(win) {
          if (win.sold) return;
          totalSellValue += Number(win.value);
          unsoldCnt++;
          var resDiv = document.createElement('div');
          resDiv.className = 'result-item-card ' + win.rarity;
          resDiv.innerHTML = '<i class="fa-solid ' + win.icon + '"></i>' +
            '<h4>' + win.name + '</h4>' +
            '<p><b><i class="fa-solid fa-gem"></i> ' + money(win.value) + '</b></p>' +
            '<button class="button ghost sell-single" data-id="' + win.id + '" data-val="' + win.value + '">Продать</button>';
          grid.appendChild(resDiv);
        });

        if (unsoldCnt > 0) {
          roulettesContainer.appendChild(grid);
          var actionsDiv = document.createElement('div');
          actionsDiv.className = 'results-actions';
          actionsDiv.innerHTML = '<button class="button primary sell-all">Продать все за <i class="fa-solid fa-gem" style="margin-left: 5px;"></i> ' + money(totalSellValue) + '</button>' +
            '<button class="button ghost keep-all">Забрать</button>' +
            '<button class="button primary spin-again"><i class="fa-solid fa-rotate-right"></i> Открыть еще раз</button>';
          roulettesContainer.appendChild(actionsDiv);

          actionsDiv.querySelector('.sell-all').addEventListener('click', function() {
            var soldIds = [];
            var soldTotal = 0;
            currentUnsold.forEach(function(u) {
              if (!u.sold) {
                u.sold = true;
                soldIds.push(u.id);
                soldTotal += Number(u.value);
              }
            });
            if (soldIds.length) {
              window.balance += soldTotal;
              window.updateBalance();
              var inv = JSON.parse(sessionStorage.getItem('crate-inventory') || '[]');
              inv = inv.filter(function(item) { return soldIds.indexOf(item.id) === -1; });
              sessionStorage.setItem('crate-inventory', JSON.stringify(inv));
              toast('Продано за ' + money(soldTotal) + ' кристаллов');
            }
            resetToNormal();
          });
          actionsDiv.querySelector('.keep-all').addEventListener('click', resetToNormal);
          actionsDiv.querySelector('.spin-again').addEventListener('click', function() {
            resetToNormal();
            spinBtn.click();
          });
          grid.querySelectorAll('.sell-single').forEach(function(button) {
            button.addEventListener('click', function() {
              var target = currentUnsold.find(function(item) { return item.id == this.dataset.id; }.bind(this));
              if (!target || target.sold) return;
              target.sold = true;
              sellItem(target.id, target.value);
              resetToNormal();
            }.bind(button));
          });
        } else {
          resetToNormal();
        }
      }

      function sellItem(id, val) {
        window.balance += Number(val);
        window.updateBalance();
        var inv = JSON.parse(sessionStorage.getItem('crate-inventory') || '[]');
        inv = inv.filter(function(item) { return item.id != id; });
        sessionStorage.setItem('crate-inventory', JSON.stringify(inv));
        var soldItem = currentUnsold.find(function(item) { return item.id == id; });
        if (soldItem) {
          soldItem.sold = true;
        }
        toast('Продано за ' + money(val) + ' кристаллов');
      }

      function resetToNormal() {
        spinBtn.style.display = '';
        spinBtn.disabled = false;
        spinBtn.classList.remove('is-fast');
        spinBtn.classList.remove('fast-open');
        spinBtn.innerHTML = '<i class="fa-solid fa-play"></i> Открыть ' + caseNameDisplay;
        if (fastOpenBtn) {
          fastOpenBtn.classList.remove('is-active');
          fastOpenBtn.closest('.fast-open-wrapper').classList.remove('is-active');
        }
        isFastOpen = false;
        initRoulettes(currentCount);
      }

      if (isFastOpen) {
        renderResults();
        if (results.some(function(w) { return w[2] === 'gold' || w[2] === 'violet'; })) {
          confettiBurst(roulettesContainer);
        }
      } else {
        initRoulettes(currentCount);
        var strips = roulettesContainer.querySelectorAll('.roulette');
        strips.forEach(function(strip, index) {
          var targetOffset = getLandingOffset(index);
          strip.style.transition = 'none';
          strip.style.transform = 'translateX(0)';
          requestAnimationFrame(function() {
            strip.style.transition = 'transform 5.2s cubic-bezier(0.2, 0, 0.3, 1)';
            strip.style.transform = 'translateX(-' + Math.max(0, targetOffset) + 'px)';
          });
        });

        setTimeout(function() {
          renderResults();
          if (results.some(function(w) { return w[2] === 'gold' || w[2] === 'violet'; })) {
            confettiBurst(roulettesContainer);
          }
        }, 5200);
      }
    });
  }
});
