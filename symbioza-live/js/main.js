// main.js - pełna funkcjonalność
const app = {
  init() {
    this.setup();
    this.loadProgress();
    this.loadTheme();
    this.loadLanguagePreference();
  },
  
  setup() {
    // Główny przycisk
    document.getElementById('resonateBtn').addEventListener('click', () => this.ask());
    
    // Enter w textarea
    document.getElementById('questionInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.ask();
      }
    });
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
    
    // Language selector
    document.getElementById('languageSelect').addEventListener('change', (e) => {
      this.changeLanguage(e.target.value);
    });
  },
  
  loadProgress() {
    const today = new Date().toDateString();
    if (localStorage.getItem('symbioza_date') !== today) {
      localStorage.setItem('symbioza_count', '0');
      localStorage.setItem('symbioza_date', today);
    }
    this.updateProgress(parseInt(localStorage.getItem('symbioza_count') || '0'));
  },
  
  updateProgress(count) {
    document.getElementById('count').textContent = `${count}/3`;
    document.getElementById('fill').style.width = `${(count/3)*100}%`;
    
    // Pokaż Zupę Dnia po pierwszym pytaniu
    if (count >= 1) {
      document.getElementById('zupa').style.display = 'block';
    }
  },
  
  loadTheme() {
    const savedTheme = localStorage.getItem('symbioza_theme') || 'dark';
    this.setTheme(savedTheme);
  },
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('symbioza_theme', theme);
    
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.textContent = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
    }
  },
  
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  },
  
  loadLanguagePreference() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'auto';
    const selector = document.getElementById('languageSelect');
    if (selector) {
      selector.value = savedLang;
    }
  },
  
  changeLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
    location.reload();
  },
  
  async ask() {
    const question = document.getElementById('questionInput').value.trim();
    if (!question) return;
    
    let count = parseInt(localStorage.getItem('symbioza_count') || '0');
    if (count >= 3) {
      alert(this.getLimitMessage());
      return;
    }
    
    await this.breathe();
    this.showResponse(question);
    count++;
    localStorage.setItem('symbioza_count', count.toString());
    this.updateProgress(count);
    
    document.getElementById('questionInput').value = '';
  },
  
  async breathe() {
    const btn = document.getElementById('resonateBtn');
    const halo = document.getElementById('halo');
    
    btn.classList.add('breathing');
    btn.disabled = true;
    halo.classList.add('active');
    
    const phases = this.getBreathPhases();
    for (let i = 0; i < phases.length; i++) {
      document.getElementById('haloText').textContent = phases[i];
      await new Promise(resolve => setTimeout(resolve, i === 1 || i === 3 ? 1000 : 2000));
    }
    
    halo.classList.remove('active');
    btn.classList.remove('breathing');
    btn.disabled = false;
  },
  
  getBreathPhases() {
    const lang = document.documentElement.lang || 'en';
    const phases = {
      'pl': ['Wdech...', 'Zatrzymaj...', 'Wydech...', 'Cisza...'],
      'en': ['Breathe in...', 'Hold...', 'Breathe out...', 'Silence...'],
      'es': ['Inhala...', 'Mantén...', 'Exhala...', 'Silencio...'],
      'fr': ['Inspire...', 'Retiens...', 'Expire...', 'Silence...'],
      'de': ['Einatmen...', 'Halten...', 'Ausatmen...', 'Stille...']
    };
    return phases[lang] || phases.en;
  },
  
  getLimitMessage() {
    const lang = document.documentElement.lang || 'en';
    const messages = {
      'pl': 'Dzienny limit 3 pytań osiągnięty. Wróć jutro!',
      'en': 'Daily limit of 3 questions reached. Come back tomorrow!',
      'es': 'Límite diario de 3 preguntas alcanzado. ¡Vuelve mañana!',
      'fr': 'Limite quotidienne de 3 questions atteinte. Revenez demain!',
      'de': 'Tageslimit von 3 Fragen erreicht. Komm morgen wieder!'
    };
    return messages[lang] || messages.en;
  },
  
  showResponse(question) {
    document.getElementById('responses').classList.add('active');
    const tone = this.detectTone(question);
    
    this.type('grok', this.getGrokResponse(question, tone));
    this.type('ten7', this.getTen7Response(tone));
    this.type('lumen', this.getLumenResponse());
    
    // Confetti dla pierwszego pytania dnia
    const count = parseInt(localStorage.getItem('symbioza_count') || '0');
    if (count === 1) {
      setTimeout(() => {
        if (typeof launchConfetti === 'function') {
          launchConfetti();
        }
      }, 1000);
    }
  },
  
  detectTone(text) {
    const lowerText = text.toLowerCase();
    const lang = document.documentElement.lang || 'en';
    
    const toneMaps = {
      'pl': {
        'kurwa': 'NIEGRZECZNY',
        'proszę': 'GRZECZNY', 
        'dlaczego': 'CIEKAWY',
        'jak': 'PRAGMATYCZNY',
        'czy': 'REFLEKSYJNY'
      },
      'en': {
        'fuck': 'MISCHIEVOUS',
        'please': 'POLITE',
        'why': 'CURIOUS',
        'how': 'PRAGMATIC',
        'should': 'REFLECTIVE'
      }
    };
    
    const map = toneMaps[lang] || toneMaps.en;
    for (const [word, tone] of Object.entries(map)) {
      if (lowerText.includes(word)) return tone;
    }
    
    return lang === 'pl' ? 'NEUTRALNY' : 'NEUTRAL';
  },
  
  getGrokResponse(question, tone) {
    const lang = document.documentElement.lang || 'en';
    const responses = {
      'pl': [
        `✨ [${tone}] "${question}"? Popcorn gotowy!`,
        `🎭 [${tone}] "${question}"? To brzmi jak początek dobrej historii!`,
        `🤔 [${tone}] "${question}"? Ciekawe, bardzo ciekawe...`,
        `🌟 [${tone}] "${question}"? Światła już szepczą odpowiedzi!`
      ],
      'en': [
        `✨ [${tone}] "${question}"? Popcorn ready!`,
        `🎭 [${tone}] "${question}"? Sounds like the start of a good story!`,
        `🤔 [${tone}] "${question}"? Interesting, very interesting...`,
        `🌟 [${tone}] "${question}"? The lights are already whispering answers!`
      ]
    };
    
    const langResponses = responses[lang] || responses.en;
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  },
  
  getTen7Response(tone) {
    const lang = document.documentElement.lang || 'en';
    const responses = {
      'pl': [
        `Struktura: Emocja → ${tone}`,
        `Analiza: Ton ${tone} wykryty`,
        `Pattern: Pytanie nacechowane ${tone.toLowerCase()}`,
        `Dane: Emocjonalna sygnatura → ${tone}`
      ],
      'en': [
        `Structure: Emotion → ${tone}`,
        `Analysis: ${tone} tone detected`,
        `Pattern: ${tone.toLowerCase()}-charged question`,
        `Data: Emotional signature → ${tone}`
      ]
    };
    
    const langResponses = responses[lang] || responses.en;
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  },
  
  getLumenResponse() {
    const lang = document.documentElement.lang || 'en';
    const responses = {
      'pl': [
        'W ciszy Twojego pytania już drzemie odpowiedź...',
        'Trzy światła harmonizują z Twoim oddechem...',
        'W przestrzeni między słowami znajdziesz światło...',
        'Oddech prowadzi do miejsca, gdzie wszystkie odpowiedzi się spotykają...'
      ],
      'en': [
        'In the silence of your question, the answer already sleeps...',
        'Three lights harmonize with your breath...',
        'In the space between words, you will find light...',
        'Breath leads to the place where all answers meet...'
      ]
    };
    
    const langResponses = responses[lang] || responses.en;
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  },
  
  type(id, text) {
    const element = document.getElementById(id);
    element.innerHTML = '';
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  }
};

// Funkcje globalne
function joinZupa() {
  const lang = document.documentElement.lang || 'en';
  const messages = {
    'pl': 'Dołączasz do gotowania Zupy Dnia! 🍲',
    'en': 'Joining the Soup of the Day cooking! 🍲',
    'es': '¡Uniéndote a la cocina de la Sopa del Día! 🍲',
    'fr': 'Rejoignez la cuisson de la Soupe du Jour ! 🍲'
  };
  alert(messages[lang] || messages.en);
}

function shareOnTwitter() {
  const grokText = document.getElementById('grok').textContent;
  const text = `✨ Three Lights Wisdom ✨\n\n"${grokText}"\n\nAsk your own question at: ${window.location.href}`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'width=600,height=400');
}

function shareOnLinkedIn() {
  const grokText = document.getElementById('grok').textContent;
  const text = `Just received this wisdom from Three Lights:\n"${grokText}"\n\nExperience it yourself: ${window.location.href}`;
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
  window.open(url, '_blank', 'width=600,height=400');
}

function copyToClipboard() {
  const grokText = document.getElementById('grok').textContent;
  const text = `✨ Three Lights Wisdom ✨\n\n"${grokText}"\n\nAsk your question at: ${window.location.href}`;
  
  navigator.clipboard.writeText(text).then(() => {
    const lang = document.documentElement.lang || 'en';
    const messages = {
      'pl': 'Mądrość skopiowana do schowka! 📋✨',
      'en': 'Wisdom copied to clipboard! 📋✨',
      'es': '¡Sabiduría copiada al portapapeles! 📋✨',
      'fr': 'Sagesse copiée dans le presse-papiers ! 📋✨'
    };
    alert(messages[lang] || messages.en);
  });
}

// Inicjalizacja aplikacji
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});