// Оставьте texts, updateLangUI, renderWordsList и обработчики, как они есть выше (index.html и style.css без изменений).

// Новая анимация "перелистывания" букв:
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯabcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя";

let animating = false;

function animateWord(word, callback) {
  const container = document.getElementById('wordDisplay');
  container.textContent = '';
  animating = true;
  let current = Array(word.length).fill("");
  let step = 0;

  function animateLetter(pos) {
    if (pos >= word.length) {
      // Закончить
      animating = false;
      container.textContent = word;
      if (callback) callback();
      return;
    }
    let intervalCount = 0;
    const cycles = 5; // сколько раз "мигать" буквы перед итоговой
    const origLetter = word[pos];
    let interval = setInterval(() => {
      if (intervalCount < cycles) {
        current[pos] = alphabet[Math.floor(Math.random() * alphabet.length)];
        container.textContent = current.join('');
        intervalCount++;
      } else {
        clearInterval(interval);
        current[pos] = origLetter;
        container.textContent = current.join('');
        animateLetter(pos + 1);
      }
    }, 50); // скорость анимации (мс)
  }
  animateLetter(0);
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
  document.getElementById('nextWordBtn').disabled = true;
  renderWordsList(word);
  animateWord(word, () => {
    document.getElementById('nextWordBtn').disabled = false;
  });
}

document.getElementById('nextWordBtn').onclick = function() {
  if (animating) return; // запретить нажатие пока идёт анимация
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
  animating = false;
};

updateLangUI();
