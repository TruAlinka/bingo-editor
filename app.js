const texts = {
  'ru': {
    mainTitle: "Ввод слов для игры",
    placeholder: "Введите слова, по одному на строке",
    start: "Начать игру",
    gameTitle: "Случайное слово:",
    next: "Следующее слово",
    restart: "Рестарт (те же слова)",
    back: "Назад к меню",
    finish: "Все слова отгаданы! 🎉🎉🎉",
    listTitle: "Ваш список слов:"
  },
  'en': {
    mainTitle: "Enter words for the game",
    placeholder: "Enter words, one per line",
    start: "Start game",
    gameTitle: "Random word:",
    next: "Next word",
    restart: "Restart (same words)",
    back: "Back to menu",
    finish: "All words done! 🎉🎉🎉",
    listTitle: "Your word list:"
  },
  'es': {
    mainTitle: "Introduce las palabras para el juego",
    placeholder: "Introduce palabras, una por línea",
    start: "Comenzar el juego",
    gameTitle: "Palabra aleatoria:",
    next: "Siguiente palabra",
    restart: "Reiniciar (mismas palabras)",
    back: "Volver al menú",
    finish: "¡Todas las palabras usadas! 🎉🎉🎉",
    listTitle: "Tu lista de palabras:"
  },
  'de': {
    mainTitle: "Wörter für das Spiel eingeben",
    placeholder: "Wörter eingeben, eins pro Zeile",
    start: "Spiel starten",
    gameTitle: "Zufälliges Wort:",
    next: "Nächstes Wort",
    restart: "Nochmal (gleiche Wörter)",
    back: "Zurück zum Menü",
    finish: "Alle Wörter benutzt! 🎉🎉🎉",
    listTitle: "Deine Wörterliste:"
  }
};

let allWords = [];
let originalWords = [];
let words = [];
let used = [];
let currentLang = 'ru';
let currentWord = null;
let animating = false;

window.onload = function() {
  document.body.classList.add('theme-blue');
  document.documentElement.style.setProperty('--gameFont', `'Patrick Hand', Arial, sans-serif`);
  showWordsListOnMain();
};

document.getElementById('themeSelect').addEventListener('change', function() {
  document.body.classList.remove(
    'theme-blue', 'theme-dark', 'theme-pink', 'theme-green', 'theme-yellow',
    'theme-orange', 'theme-purple');
  document.body.classList.add('theme-' + this.value);
});

document.getElementById('fontSelect').addEventListener('change', function() {
  document.documentElement.style.setProperty('--gameFont', `'${this.value}', Arial, sans-serif`);
});

function updateLangUI() {
  document.getElementById('title').textContent = texts[currentLang].mainTitle;
  document.getElementById('wordsInput').placeholder = texts[currentLang].placeholder;
  document.getElementById('startBtn').textContent = texts[currentLang].start;
  document.getElementById('gameTitle').textContent = texts[currentLang].gameTitle;
  document.getElementById('nextWordBtn').textContent = texts[currentLang].next;
  document.getElementById('restartGameBtn').textContent = texts[currentLang].restart;
  document.getElementById('backBtn').textContent = texts[currentLang].back;
  document.getElementById('restartBtn').textContent = texts[currentLang].restart;
  document.getElementById('listTitle').textContent = texts[currentLang].listTitle;
}

document.getElementById('langSelect').addEventListener('change', function() {
  currentLang = this.value;
  updateLangUI();
  showWordsListOnMain();
});

document.getElementById('wordsInput').addEventListener('input', function() {
  showWordsListOnMain();
});

document.getElementById('startBtn').onclick = function() {
  allWords = document.getElementById('wordsInput').value.split('\n').map(w => w.trim()).filter(w => w);
  if (allWords.length === 0) return;
  originalWords = allWords.slice();
  words = allWords.slice();
  used = [];
  document.getElementById('main').style.display = 'none';
  document.getElementById('game').style.display = '';
  document.getElementById('nextWordBtn').disabled = false;
  hideWordsListOnGame();
  showRandomWord();
};

function renderWordsList(current, arr) {
  const list = document.getElementById('wordsList');
  list.innerHTML = '';
  (arr || allWords).forEach(word => {
    const li = document.createElement('li');
    li.textContent = word;
    if (word === current) li.classList.add('current');
    list.appendChild(li);
  });
}

function showWordsListOnMain() {
  const wordsArr = document.getElementById('wordsInput').value
    .split('\n').map(w => w.trim()).filter(w => w);
  if (wordsArr.length) {
    document.getElementById('listTitle').style.display = '';
    document.getElementById('listTitle').textContent = texts[currentLang].listTitle;
    document.getElementById('wordsList').style.display = '';
  } else {
    document.getElementById('listTitle').style.display = 'none';
    document.getElementById('wordsList').style.display = 'none';
  }
  renderWordsList(null, wordsArr);
}
function hideWordsListOnGame() {
  document.getElementById('listTitle').style.display = 'none';
  document.getElementById('wordsList').style.display = 'none';
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯabcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя';

function animateSlotsWord(word, callback) {
  const display = document.getElementById('wordDisplay');
  display.innerHTML = '';
  animating = true;
  let finishedSlots = 0;
  let slots = [];
  for (let i = 0; i < word.length; i++) {
    let span = document.createElement('span');
    span.className = 'slot';
    span.textContent = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    display.appendChild(span);
    slots.push(span);
  }
  slots.forEach((slot, i) => {
    let cycles = 8 + Math.floor(Math.random() * 5);
    let counter = 0;
    let interval = setInterval(() => {
      if (counter < cycles) {
        slot.textContent = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        counter++;
      } else {
        clearInterval(interval);
        slot.textContent = word[i];
        finishedSlots++;
        if (finishedSlots === slots.length) {
          animating = false;
          if (callback) callback();
        }
      }
    }, 50);
  });
}

function showRandomWord() {
  const display = document.getElementById('wordDisplay');
  if (words.length === 0) {
    display.innerHTML = `<div class="finish-phrase">${texts[currentLang].finish}</div>`;
    document.getElementById('nextWordBtn').disabled = true;
    hideWordsListOnGame();
    return;
  }
  const index = Math.floor(Math.random() * words.length);
  const word = words.splice(index, 1)[0];
  used.push(word);
  currentWord = word;
  document.getElementById('nextWordBtn').disabled = true;
  hideWordsListOnGame();
  animateSlotsWord(word, () => {
    document.getElementById('nextWordBtn').disabled = false;
  });
}

document.getElementById('nextWordBtn').onclick = function() {
  if (animating) return;
  showRandomWord();
};
document.getElementById('restartGameBtn').onclick = function() {
  if (animating) return;
  words = originalWords.slice();
  used = [];
  document.getElementById('nextWordBtn').disabled = false;
  showRandomWord();
};
document.getElementById('backBtn').onclick = function() {
  if (animating) return;
  document.getElementById('game').style.display = 'none';
  document.getElementById('main').style.display = '';
  showWordsListOnMain();
  animating = false;
};
document.getElementById('restartBtn').onclick = function() {
  document.getElementById('game').style.display = 'none';
  document.getElementById('main').style.display = '';
  document.getElementById('wordsInput').value = '';
  document.getElementById('wordDisplay').textContent = '';
  words = [];
  allWords = [];
  originalWords = [];
  used = [];
  currentWord = null;
  showWordsListOnMain();
  updateLangUI();
  animating = false;
};

showWordsListOnMain();
updateLangUI();
