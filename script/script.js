const container = document.querySelector('.card-container');
const searchInput = document.querySelector('.search-input');
const langToggle = document.getElementById('lang-toggle');
const langOptions = document.querySelectorAll('.lang-option');
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const footerLine1 = document.getElementById('footer-line-1');
const footerLine2 = document.getElementById('footer-line-2');

const translations = {
    ru: {
        titleLine1: 'ТВОЙ',
        titleLine2: 'MINECRAFT',
        titleLine3: 'ПОМОЩНИК',
        subtitle: 'Хочешь построить автоматическую ферму, но устал искать среди сотен некачественых уроков? Мы собрали только рабочие и актуальные фермы в одном месте!',
        searchPlaceholder: 'Поиск по фермам...',
        authorLabel: 'Автор',
        difficultyLabel: 'Сложность',
        earningLabel: 'Заработок',
        versionLabel: 'Версия',
        buttonText: 'Начать строительство',
        noResults: 'Ничего не найдено',
        footerLine1: 'Minecraft Helper © 2026',
        footerLine2: 'Не является официальным проектом Minecraft или Mojang.'
    },
    en: {
        titleLine1: 'YOUR',
        titleLine2: 'MINECRAFT',
        titleLine3: 'HELPER',
        subtitle: 'Want to build an automatic farm, but tired of searching through hundreds of low-quality tutorials? We collected only working and up-to-date farms in one place!',
        searchPlaceholder: 'Search farms...',
        authorLabel: 'Author',
        difficultyLabel: 'Difficulty',
        earningLabel: 'Earning',
        versionLabel: 'Version',
        buttonText: 'Start building',
        noResults: 'No farms found',
        footerLine1: 'Minecraft Helper © 2026',
        footerLine2: 'This is not an official Minecraft or Mojang project.'
    }
};

let farmsData = [];
let currentLang = localStorage.getItem('lang') || 'ru';

function getLocalizedText(farm, key) {
    return currentLang === 'en' && farm[`${key}En`]
        ? farm[`${key}En`]
        : farm[key];
}

function renderCards() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredFarms = farmsData.filter((farm) => {
        const haystack = [
            farm.title,
            farm.titleEn,
            farm.author,
            farm.difficulty,
            farm.difficultyEn,
            farm.earning,
            farm.earningEn,
            farm.version
        ].filter(Boolean).join(' ').toLowerCase();

        return haystack.includes(searchTerm);
    });

    if (filteredFarms.length === 0) {
        container.innerHTML = `<p class="empty-state">${translations[currentLang].noResults}</p>`;
        return;
    }

    container.innerHTML = filteredFarms.map((farm, index) => {
        const titleText = getLocalizedText(farm, 'title');
        const difficultyText = getLocalizedText(farm, 'difficulty');
        const earningText = getLocalizedText(farm, 'earning');

        return `
            <div class="card" style="--card-delay: ${index * 120}ms;">
                <img class="card-image" src="${farm.image}" alt="${titleText}">

                <p class="card-name">${titleText}</p>

                <p class="card-author">
                    ${translations[currentLang].authorLabel}: <span class="author">${farm.author}</span>
                </p>
                <p class="card-difficulty">
                    ${translations[currentLang].difficultyLabel}: <span class="difficulty">${difficultyText}</span>
                </p>
                <p class="card-earning">
                    ${translations[currentLang].earningLabel}: <span class="earning">${earningText}</span>
                </p>
                <p class="card-version">
                    ${translations[currentLang].versionLabel}: <span class="version">${farm.version}</span>
                </p>
                <button class="card-button" type="button">
                    ${translations[currentLang].buttonText}
                </button>
            </div>
        `;
    }).join('');
}

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    const t = translations[lang];
    title.innerHTML = `${t.titleLine1} <span id="highlight">${t.titleLine2}</span><br><span id="highlight2">${t.titleLine3}</span>`;
    subtitle.textContent = t.subtitle;
    searchInput.placeholder = t.searchPlaceholder;
    footerLine1.textContent = t.footerLine1;
    footerLine2.textContent = t.footerLine2;
    langToggle.setAttribute('aria-label', lang === 'ru' ? 'Switch to English' : 'Переключить на русский');

    langOptions.forEach((option) => {
        option.classList.toggle('active', option.dataset.lang === lang);
    });

    renderCards();
}

searchInput.addEventListener('input', renderCards);
langToggle.addEventListener('click', () => {
    const nextLang = currentLang === 'ru' ? 'en' : 'ru';
    applyLanguage(nextLang);
});

container.addEventListener('click', (event) => {
    if (event.target.closest('.card-button')) {
        window.location.href = 'farm.html';
    }
});

fetch('farms.json')
    .then(response => response.json())
    .then((farms) => {
        farmsData = farms;
        applyLanguage(currentLang);
    });

