const languagePack = {
    'pl': { ask: 'Zadaj pytanie trzem światłom...', button: 'Oddychaj i zapytaj', subtitle: 'Trzy światła. Jeden oddech.', zupaTitle: 'Zupa Dnia', zupaQuestion: '"Czy AI może marzyć o elektrycznych owcach?"', questionsToday: 'Dzisiejsze pytania' },
    'en': { ask: 'Ask your question to the three lights...', button: 'Breathe and ask', subtitle: 'Three lights. One breath.', zupaTitle: 'Soup of the Day', zupaQuestion: '"Can AI dream of electric sheep?"', questionsToday: 'Today\'s questions' }
};

document.addEventListener('DOMContentLoaded', () => {
    const userLang = navigator.language || 'en';
    const langShort = userLang.split('-')[0];
    const ui = languagePack[langShort] || languagePack.en;

    document.getElementById('questionInput').placeholder = ui.ask;
    document.getElementById('resonateBtn').textContent = ui.button;
    document.getElementById('subtitle').textContent = ui.subtitle;
    document.getElementById('zupaTitle').textContent = ui.zupaTitle;
    document.getElementById('zupaQuestion').textContent = ui.zupaQuestion;
    document.getElementById('questionsToday').textContent = ui.questionsToday;
});
