const texts = {
  'ru': {
    mainTitle: "Ввод слов для игры",
    placeholder: "Введите слова, по одному на строке",
    start: "Начать игру",
    gameTitle: "Случайное слово:",
    next: "Следующее слово",
    restart: "Начать заново",
    listTitle: "Ваш список слов:"
  },
  'en': {
    mainTitle: "Enter words for the game",
    placeholder: "Enter words, one per line",
    start: "Start game",
    gameTitle: "Random word:",
    next: "Next word",
    restart: "Restart",
    listTitle: "Your word list:"
  },
  'es': {
    mainTitle: "Introduce las palabras para el juego",
    placeholder: "Introduce palabras, una por línea",
    start: "Comenzar el juego",
    gameTitle: "Palabra aleatoria:",
    next: "Siguiente palabra",
    restart: "Reiniciar",
    listTitle: "Tu lista de palabras:"
  },
  'de': {
    mainTitle: "Wörter für das Spiel eingeben",
    placeholder: "Wörter eingeben, eins pro Zeile",
    start: "Spiel starten",
    gameTitle: "Zufälliges Wort:",
    next: "Nächstes Wort",
    restart: "Neu starten",
    listTitle: "Deine Wörterliste:"
  }
};

let allWords = [];
let words = [];
let used = [];
let currentLang = 'ru';
let currentWord = null;

function updateLangUI() {
  document.getElementById('title').textContent = texts[currentLang].mainTitle;
  document.getElementById('wordsInput').placeholder = texts[currentLang].placeholder;
  document.getElementById('startBtn').textContent = texts[currentLang].start;
  document.getElementById('gameTitle').textContent = texts[currentLang].gameTitle;
  document.getElementById('nextWordBtn').textContent = texts[currentLang].next;
  document.getElementById('restartBtn').textContent = texts[currentLang].restart;
  document.getElementById('listTitle').textContent = texts[currentLang].listTitle;
}

document.getElementById('langSelect').addEventListener('change', function() {
  currentLang = this.value;
  updateLangUI();
});

document.getElementById('startBtn').onclick = function() {
  allWords = document.getElementById('wordsInput').value.split('\n').map(w => w.trim()).filter(w => w);
  if (allWords.length === 0) return;
  words = allWords.slice();
  used = [];
  document.getElementById('main').style.display = 'none';
  document.getElementById('game').style.display = '';
  document.getElementById('nextWordBtn').disabled = false;
  showRandomWord();
};

function renderWordsList(current) {
  const list = document.getElementById('wordsList');
  list.innerHTML = '';
  allWords.forEach(word => {
    const li = document.createElement('li');
    li.textContent = word;
    if (word === current) {
      li.classList.add('current');
    }
    list.appendChild(li);
  });
}

function showRandomWord() {
  if (words.length === 0) {
    document.getElementById('wordDisplay').textContent = currentLang === "ru"
      ? "Конец! Слова закончились." : (
        currentLang === "en" ? "All words done!" :
        currentLang === "es" ? "¡Todas las palabras usadas!" : "Alle Wörter benutzt!"
      );
    document.getElementById('nextWordBtn').disabled = true;
    renderWordsList(null);
    return;
  }
  const index = Math.floor(Math.random() * words.length);
  const word = words.splice(index, 1)[0];
  used.push(word);
  currentWord = word;
  document.getElementById('wordDisplay').textContent = word;
  document.getElementById('nextWordBtn').disabled = false;
  renderWordsList(word);
}

document.getElementById('nextWordBtn').onclick = function() {
  showRandomWord();
};

document.getElementById('restartBtn').onclick = function() {
  document.getElementById('game').style.display = 'none';
  document.getElementById('main').style.display = '';
  document.getElementById('wordsInput').value = '';
  document.getElementById('wordDisplay').textContent = '';
  words = [];
  allWords = [];
  used = [];
  currentWord = null;
  renderWordsList(null);
  updateLangUI();
};

updateLangUI();
