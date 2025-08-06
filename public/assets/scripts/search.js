let currentMode = 'all';

function filterGames() {
  const input = document.getElementById('searchInput').value.toUpperCase();
  const games = document.querySelectorAll('.box .link');

  games.forEach(game => {
    const isExclusive = game.dataset.tag === 'exclusive';
    const text = game.innerText.toUpperCase();
    const matchesSearch = text.includes(input);

    const shouldShow =
      (currentMode === 'all' && matchesSearch) ||
      (currentMode === 'exclusive' && isExclusive && matchesSearch);

    game.style.display = shouldShow ? '' : 'none';
  });
}

function showGames() {
  currentMode = 'all';
  filterGames();
}

function showExclusives() {
  currentMode = 'exclusive';
  filterGames();
}

document.getElementById('searchInput').addEventListener('input', filterGames);