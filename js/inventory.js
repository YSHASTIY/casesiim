document.addEventListener('DOMContentLoaded', function() {
  var grid = document.querySelector('[data-inventory]');
  if (!grid) return;

  function read() {
    return JSON.parse(sessionStorage.getItem('crate-inventory') || '[]');
  }

  function save(items) {
    sessionStorage.setItem('crate-inventory', JSON.stringify(items));
  }

  function render() {
    var items = read();
    var total = items.reduce(function(sum, item) {
      return sum + Number(item.value);
    }, 0);

    var sellAllBtn = document.querySelector('.sell-all-inventory');
    if (sellAllBtn) {
      sellAllBtn.disabled = !items.length;
      sellAllBtn.classList.toggle('is-disabled', !items.length);
    }

    var countEl = document.querySelector('[data-inventory-count]');
    var valueEl = document.querySelector('[data-inventory-value]');
    if (countEl) {
      countEl.textContent = items.length + ' ' + (items.length === 1 ? 'предмет' : 'предметов');
    }
    if (valueEl) {
      valueEl.textContent = money(total);
    }

    if (!items.length) {
      grid.innerHTML = '<div class="empty-inventory">' +
        '<i class="fa-solid fa-box-open"></i>' +
        '<h2>Инвентарь пока пуст</h2>' +
        '<p>Открой кейс, чтобы первый скин появился здесь.</p>' +
        '<a class="button primary" href="cases.html">Перейти к кейсам</a>' +
        '</div>';
      return;
    }

    grid.innerHTML = items.map(function(item, index) {
      return '<article class="inv-card ' + item.rarity + '" data-item="' + index + '">' +
        '<i class="fa-solid ' + item.icon + '"></i>' +
        '<small>' + item.rarity + '</small>' +
        '<h3>' + item.name + '</h3>' +
        '<div><b><i class="fa-solid fa-gem"></i> ' + money(Number(item.value)) + '</b>' +
        '<button class="sell-skin" data-index="' + index + '">Продать</button></div>' +
        '</article>';
    }).join('');
  }

  render();

  var sellAllBtn = document.querySelector('.sell-all-inventory');
  if (sellAllBtn) {
    sellAllBtn.addEventListener('click', function() {
      var items = read();
      if (!items.length) return;
      var total = items.reduce(function(sum, item) {
        return sum + Number(item.value);
      }, 0);
      window.balance += total;
      window.updateBalance();
      save([]);
      render();
      toast('Все предметы проданы за ' + money(total) + ' кристаллов');
    });
  }

  grid.addEventListener('click', function(e) {
    var sell = e.target.closest('.sell-skin');
    if (!sell) return;
    var items = read();
    var index = Number(sell.dataset.index);
    var item = items[index];
    if (!item) return;
    window.balance += Number(item.value);
    window.updateBalance();
    items.splice(index, 1);
    save(items);
    var card = sell.closest('.inv-card');
    card.classList.add('sold');
    setTimeout(render, 260);
    toast('Предмет продан за ' + money(Number(item.value)) + ' кристаллов');
  });
});