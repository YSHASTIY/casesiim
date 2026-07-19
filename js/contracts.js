document.addEventListener('DOMContentLoaded', function() {
  function inv() {
    return JSON.parse(window.store.ssGet('crate-inventory') || '[]');
  }

  function saveInv(items) {
    window.store.ssSet('crate-inventory', JSON.stringify(items));
  }

  function money(n) {
    return Number(n).toLocaleString('ru-RU');
  }

  var container = document.querySelector('[data-contract-inventory]');
  var selectedContainer = document.querySelector('[data-selected-items]');
  var button = document.querySelector('.create-contract');
  var modal = document.querySelector('.contract-modal');
  var resultName = modal ? modal.querySelector('.result-name') : null;
  var resultValue = modal ? modal.querySelector('.result-value') : null;
  var closeModal = modal ? modal.querySelector('.close-modal') : null;

  var selected = [];

  function renderInventory() {
    var items = inv();
    if (!container) return;
    if (items.length === 0) {
      container.innerHTML = '<div class="empty-inventory">' +
        '<i class="fa-solid fa-box-open"></i>' +
        '<h2>Инвентарь пуст</h2>' +
        '<p>Откройте кейсы, чтобы получить предметы для контракта.</p>' +
        '</div>';
      return;
    }
    container.innerHTML = items.map(function(item, idx) {
      var selectedClass = selected.indexOf(idx) !== -1 ? 'selected' : '';
      return '<div class="contract-item ' + selectedClass + '" data-index="' + idx + '">' +
        '<i class="fa-solid ' + item.icon + '"></i>' +
        '<span>' + item.name + '</span>' +
        '<b>' + money(item.value) + '</b>' +
        '</div>';
    }).join('');
    updateSelectedUI();
  }

  function updateSelectedUI() {
    if (!selectedContainer) return;
    var items = inv();
    var sel = selected.map(function(i) { return items[i]; }).filter(Boolean);
    if (sel.length) {
      selectedContainer.innerHTML = sel.map(function(item) {
        return '<span>' + item.name + ' (' + money(item.value) + ')</span>';
      }).join(' + ');
    } else {
      selectedContainer.innerHTML = '<span class="placeholder">Выберите минимум 3 предмета</span>';
    }
    button.disabled = selected.length < 3;
  }

  container.addEventListener('click', function(e) {
    var card = e.target.closest('.contract-item');
    if (!card) return;
    var idx = Number(card.dataset.index);
    var pos = selected.indexOf(idx);
    if (pos !== -1) {
      selected.splice(pos, 1);
    } else {
      if (selected.length >= 5) {
        toast('Можно выбрать не более 5 предметов');
        return;
      }
      selected.push(idx);
    }
    renderInventory();
  });

  button.addEventListener('click', function() {
    if (selected.length < 3) return;
    var items = inv();
    var chosen = selected.map(function(i) { return items[i]; });
    var totalValue = chosen.reduce(function(sum, item) {
      return sum + Number(item.value);
    }, 0);
    var newValue = Math.ceil(totalValue / 2);

    var remaining = items.filter(function(_, i) {
      return selected.indexOf(i) === -1;
    });
    saveInv(remaining);
    selected = [];

    var pool = [
      ['USP-S · Phantom', 'fa-ghost', 'epic'],
      ['M4A1 · Eclipse', 'fa-moon', 'epic'],
      ['AK-47 · Blackstar', 'fa-burst', 'legend'],
      ['AWP · Nova', 'fa-crosshairs', 'legend'],
      ['★ Bayonet · Apex', 'fa-wind', 'legend'],
      ['★ Karambit · Void', 'fa-wind', 'legend']
    ];
    var randomItem = pool[Math.floor(Math.random() * pool.length)];
    var newItem = {
      name: randomItem[0],
      icon: randomItem[1],
      rarity: randomItem[2],
      value: newValue
    };
    remaining.push(newItem);
    saveInv(remaining);

    if (modal) {
      resultName.textContent = newItem.name;
      resultValue.textContent = money(newItem.value);
      modal.classList.add('show');
    } else {
      toast('Контракт выполнен! Получен ' + newItem.name + ' (' + money(newItem.value) + ')');
    }

    renderInventory();
    updateSelectedUI();
  });

  if (closeModal) {
    closeModal.addEventListener('click', function() {
      modal.classList.remove('show');
    });
  }

  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.classList.remove('show');
    });
  }

  renderInventory();
  updateSelectedUI();
});