/* ==========================================================
lang.js — ДВИЖОК перевода (EN / RU / KZ).
ВАЖНО: клики по переключателю здесь НЕ обрабатываются —
единственный владелец UI — language-selector.js.
========================================================== */
(function () {
    'use strict';

    // Языки с готовыми словарями (locales/*.json)
   const SUPPORTED_LANGS = ['en', 'ru', 'kz', 'az', 'uz', 'de', 'pt', 'es', 'zh', 'fr', 'it', 'tr', 'pl', 'sv', 'cs', 'bg', 'sr', 'ar', 'fa', 'hi', 'tg', 'tk'];
    const FALLBACK_LANG = 'en';
    const RTL_LANGS = ['ar', 'fa'];

    // Кука, которую также ставит/читает Cloudflare Worker (гео-роутинг):
    // как только язык выбран (вручную или по геолокации на edge), кука
    // не даёт повторным заходам на сайт "сбрасывать" выбор.
    const LANG_COOKIE = 'skat_lang';

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
    }

    function setLangCookie(lang) {
        document.cookie = LANG_COOKIE + '=' + encodeURIComponent(lang) +
            '; path=/; max-age=31536000; SameSite=Lax';
    }

    function getLang() {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang');
        if (SUPPORTED_LANGS.includes(urlLang)) return urlLang;
        const cookieLang = getCookie(LANG_COOKIE);
        if (SUPPORTED_LANGS.includes(cookieLang)) return cookieLang;
        return FALLBACK_LANG;
    }

    let currentLang = getLang();
    const dictionaries = {};

    async function loadDictionary(lang) {
        if (dictionaries[lang]) return dictionaries[lang];
        try {
            const response = await fetch('locales/' + lang + '.json');
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const text = await response.text();
            if (!text || !text.trim()) throw new Error('Словарь пустой');
            const raw = JSON.parse(text);
            const clean = {};
            // ВАЖНО: некоторые ключи (captions, video_metadata, support) — это
            // вложенные объекты/массивы, а не строки. Раньше они принудительно
            // приводились к String() и превращались в мусор "[object Object]".
            // Теперь строки триммируются как раньше, а объекты/массивы остаются
            // как есть — их использует applyLanguage() для сборки SKAT_ASSETS.
            Object.keys(raw).forEach(k => {
                const v = raw[k];
                clean[k.trim()] = (typeof v === 'string') ? v.trim() : v;
            });
            dictionaries[lang] = clean;
            return dictionaries[lang];
        } catch (error) {
            console.error('Ошибка загрузки словаря (' + lang + '):', error);
            if (lang !== FALLBACK_LANG) return loadDictionary(FALLBACK_LANG);
            dictionaries[lang] = {};
            return dictionaries[lang];
        }
    }

    async function applyLanguage(lang) {
        currentLang = SUPPORTED_LANGS.includes(lang) ? lang : FALLBACK_LANG;
        setLangCookie(currentLang); // запоминаем — и ручной выбор, и то, что пришло из URL/гео-редиректа
        document.documentElement.lang = currentLang;
        // RTL: арабский и персидский читаются справа налево — переключаем
        // направление документа целиком, стили для [dir="rtl"] лежат в style.css
        document.documentElement.dir = RTL_LANGS.includes(currentLang) ? 'rtl' : 'ltr';
        const dict = await loadDictionary(currentLang);
        window.SKAT_DICT = dict; // доступ к словарю текущего языка из других скриптов (напр. prod_vid.js)

        // 1) новая система data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] === undefined) return;
            if (dict[key].indexOf('<') !== -1) el.innerHTML = dict[key];
            else el.textContent = dict[key];
        });

        // 1b) перевод атрибутов placeholder / title / aria-label через data-i18n-*
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (dict[key] !== undefined) el.setAttribute('title', dict[key]);
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria-label');
            if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
        });

        // 2) legacy data-lang-en/ru (на время миграции)
        document.querySelectorAll('[data-lang-en][data-lang-ru]').forEach(el => {
            const val = currentLang === 'ru' ? el.getAttribute('data-lang-ru')
                      : (currentLang === 'kz' ? (el.getAttribute('data-lang-kz') || el.getAttribute('data-lang-ru'))
                      : el.getAttribute('data-lang-en'));
            if (val == null) return;
            if (val.indexOf('<') !== -1) el.innerHTML = val;
            else el.textContent = val;
        });

        // 3) title и meta description
        const titleEl = document.querySelector('title');
        if (titleEl) {
            const key = titleEl.getAttribute('data-i18n');
            if (key && dict[key]) titleEl.textContent = dict[key];
            else if (titleEl.hasAttribute('data-lang-en')) {
                titleEl.textContent = currentLang === 'ru' ? titleEl.getAttribute('data-lang-ru') : titleEl.getAttribute('data-lang-en');
            }
        }
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            const key = metaDesc.getAttribute('data-i18n');
            if (key && dict[key]) metaDesc.content = dict[key];
        }

        rewriteLinks(currentLang);

        // 4) глобальные данные (SKAT_ASSETS)
        // ИСПРАВЛЕНО: раньше SKAT_ASSETS брался ЦЕЛИКОМ из assets.js и мог быть
        // только SKAT_ASSETS_RU (currentLang === 'ru') либо SKAT_ASSETS_EN —
        // для всех остальных 20 языков подписи к фото, метаданные видео и FAQ
        // поддержки молча показывались по-английски. Теперь пути к файлам
        // (images/posters/videos/icons/categoryImages/aboutHeroBg — они не
        // зависят от языка) по-прежнему берутся из SKAT_ASSETS_EN, а
        // captions/video_metadata/support подставляются из словаря ТЕКУЩЕГО
        // языка (dict), если они там есть, иначе — английский запасной вариант.
        if (window.SKAT_ASSETS_EN) {
            const base = window.SKAT_ASSETS_EN;
            const merged = Object.assign({}, base);
            merged.captions = (dict.captions && typeof dict.captions === 'object') ? dict.captions : base.captions;
            merged.video_metadata = (dict.video_metadata && typeof dict.video_metadata === 'object') ? dict.video_metadata : base.video_metadata;
            merged.support = (dict.support && typeof dict.support === 'object') ? dict.support : base.support;
            merged._lang = currentLang;
            window.SKAT_ASSETS = merged;
            window.SKAT_VIDEO_METADATA = merged.video_metadata;
        }

        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
    }

    function rewriteLinks(lang) {
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#') ||
                href.startsWith('javascript:') || href.startsWith('mailto:') ||
                href.startsWith('tel:') || href.endsWith('.pdf')) return;
            try {
                const url = new URL(href, window.location.origin);
                if (lang === 'en') url.searchParams.delete('lang');
                else url.searchParams.set('lang', lang);
                link.setAttribute('href', url.pathname + url.search + url.hash);
            } catch (e) {}
        });
    }

    function switchLang(newLang) {
        newLang = SUPPORTED_LANGS.includes(newLang) ? newLang : FALLBACK_LANG;
        const url = new URL(window.location);
        if (newLang === 'en') url.searchParams.delete('lang');
        else url.searchParams.set('lang', newLang);
        window.history.pushState({}, '', url);
        applyLanguage(newLang);
    }

    // >>> НИКАКИХ обработчиков кликов по .lang-toggle/.lang-option <<<

    async function init() { await applyLanguage(getLang()); }

    window.applyLanguage = applyLanguage;
    window.switchLang = switchLang;
    window.getCurrentLang = getLang;

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();