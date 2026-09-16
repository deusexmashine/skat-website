/* ==========================================================
language-selector.js — селектор языка в стиле Megger.
Панель привязана к триггеру (не к краю экрана), с эффектами появления.
========================================================== */
(function () {
    'use strict';

    const LANGS = [
        { code: 'en', name: 'Global (Intl. English)', flag: 'flags/intl.png' },
        { code: 'ru', name: 'Russian (Русский)',        flag: 'flags/ru.png' },
        { code: 'kz', name: 'Kazakhstan (Қазақша)', flag: 'flags/kz.png' },
        { code: 'uz', name: 'Uzbekistan (O‘zbek)',  flag: 'flags/uz.png' },
        { code: 'az', name: 'Azerbaijan (Azərbaycan)', flag: 'flags/az.png' },
        { code: 'tg', name: 'Tajikistan (Тоҷикӣ)',  flag: 'flags/tj.png' },
        { code: 'tk', name: 'Turkmenistan (Türkmençe)', flag: 'flags/tm.png' },
        { code: 'de', name: 'Germany (Deutsch)',    flag: 'flags/de.png' },
        { code: 'pt', name: 'Brazil (Português)',   flag: 'flags/br.png' },
        { code: 'es', name: 'Latinoamérica (Español)', flag: 'flags/mx.png' },
        { code: 'zh', name: 'China (简体中文)',      flag: 'flags/cn.png' },
        { code: 'fr', name: 'France (Français)',    flag: 'flags/fr.png' },
        { code: 'it', name: 'Italy (Italiano)',     flag: 'flags/it.png' },
        { code: 'tr', name: 'Türkiye (Türkçe)',     flag: 'flags/tr.png' },
        { code: 'pl', name: 'Poland (Polski)',      flag: 'flags/pl.png' },
        { code: 'sv', name: 'Sweden (Svenska)',     flag: 'flags/se.png' },
        { code: 'cs', name: 'Česko (Czechia)',      flag: 'flags/cz.png' },
        { code: 'bg', name: 'Bulgaria (Български)', flag: 'flags/bg.png' },
        { code: 'sr', name: 'Serbia (Српски)',      flag: 'flags/rs.png' },
        { code: 'ar', name: 'Middle East (العربية)', flag: 'flags/ae.png' },
        { code: 'fa', name: 'Iran (فارسی)',         flag: 'flags/ir.png' },
        { code: 'hi', name: 'India (हिन्दी)',        flag: 'flags/in.png' }
    ];

    const AVAILABLE_LANGS = ['en', 'ru', 'kz', 'az', 'uz', 'de', 'pt', 'es', 'zh', 'fr', 'it', 'tr', 'pl', 'sv', 'cs', 'bg', 'sr', 'ar', 'fa', 'hi', 'tg', 'tk'];

    // Полные названия для кнопки-триггера (как в списке)
    const TRIGGER_NAMES = {
        'en': 'Intl. English',
        'ru': 'Русский',
        'kz': 'Қазақша',
        'az': 'Azərbaycan',
        'uz': 'O‘zbek',
        'tg': 'Тоҷикӣ',
        'tk': 'Türkmençe',
        'de': 'Deutsch',
        'pt': 'Português',
        'es': 'Español',
        'zh': '简体中文',
        'fr': 'Français',
        'it': 'Italiano',
        'tr': 'Türkçe',
        'pl': 'Polski',
        'sv': 'Svenska',
        'cs': 'Čeština',
        'bg': 'Български',
        'sr': 'Српски',
        'ar': 'العربية',
        'fa': 'فارسی',
        'hi': 'हिन्दी'
    };

    // Короткие обозначения (флаг + код) — используются в компактном виде
    // на мобильных экранах, где полному названию языка не хватает места
    // в шапке (из-за этого бургер-меню раньше "вылезало" за пределы шапки).
    const TRIGGER_CODES = {
        'en': 'EN',
        'ru': 'RU',
        'kz': 'KZ',
        'az': 'AZ',
        'uz': 'UZ',
        'tg': 'TJ',
        'tk': 'TM',
        'de': 'DE',
        'pt': 'PT',
        'es': 'ES',
        'zh': 'ZH',
        'fr': 'FR',
        'it': 'IT',
        'tr': 'TR',
        'pl': 'PL',
        'sv': 'SV',
        'cs': 'CS',
        'bg': 'BG',
        'sr': 'SR',
        'ar': 'AR',
        'fa': 'FA',
        'hi': 'HI'
    };

    function currentLang() {
        if (window.getCurrentLang) return window.getCurrentLang();
        const p = new URLSearchParams(location.search).get('lang');
        return AVAILABLE_LANGS.includes(p) ? p : 'en';
    }

    function findTrigger() {
        return document.querySelector('#languageSelector, .language-selector, .lang-switcher');
    }

    function findPanel() {
        const trigger = findTrigger();
        if (trigger) {
            const panelInside = trigger.querySelector('.site-selector');
            if (panelInside) return panelInside;
        }
        return document.querySelector('#languagePanel, .site-selector');
    }

    /* Панель создаётся ВНУТРИ триггера — absolute цепляется за кнопку,
       а не за край окна (главное отличие от старой версии) */
    function ensurePanel() {
        let panel = findPanel();
        const trigger = findTrigger();

        if (!panel) {
            panel = document.createElement('div');
            panel.className = 'site-selector site-selector--v2';
            panel.id = 'languagePanel';
            panel.innerHTML =
                '<div class="site-selector__dropdown">' +
                '<div class="site-selector__list site-selector__list--single-column">' +
                '<h2 class="site-selector__title" data-i18n="lang_choose_title">Choose Language</h2>' +
                '</div></div>';

            // ВАЖНО: вешаем панель ВНУТРЬ триггера (он в фиксированной шапке)
            (trigger || document.body).appendChild(panel);
        } else if (trigger && panel.parentElement !== trigger) {
            /* БАГФИКС: если панель была создана раньше, чем шапка успела
               подгрузиться (main.js вставляет её асинхронно через fetch),
               ensurePanel() мог быть вызван, когда триггера ещё не было —
               панель в этом случае цеплялась к <body>. У <body> нет
               position, поэтому position:absolute у панели считался от
               viewport целиком, и панель "улетала" в правый нижний угол
               экрана вместо места под кнопкой языка. Раньше эта ветка кода
               была недостижима (findPanel() всё равно находил "осиротевшую"
               панель через глобальный querySelector и функция считала, что
               всё в порядке). Теперь при каждом вызове ensurePanel() (в том
               числе из MutationObserver, когда шапка наконец появится, и из
               обработчика клика) панель довешивается на своё законное место
               внутри триггера — самоисправление независимо от того, в каком
               порядке успели прогрузиться скрипты.  */
            trigger.appendChild(panel);
        }

        const list = panel.querySelector('.site-selector__list') || panel;
        if (!list.querySelector('[data-lang]')) {
            LANGS.forEach(l => {
                const a = document.createElement('a');
                a.href = '#';
                a.className = 'site-selector__site site-selector__site--v2';
                a.setAttribute('data-lang', l.code);
                a.innerHTML =
                    '<div class="image-container"><img src="' + l.flag + '" alt="' + l.name + '" class="language-flag"></div>' +
                    '<span class="site-selector__site-name">' + l.name + '</span>';
                if (!AVAILABLE_LANGS.includes(l.code)) {
                    a.classList.add('site-selector__site--disabled');
                    a.title = 'Скоро';
                }
                list.appendChild(a);
            });
        }

        // Перевод заголовка панели
        if (window.applyLanguage) {
            window.applyLanguage(window.getCurrentLang());
        }

        return panel;
    }

    function setOpen(open) {
        const panel = findPanel();
        const trigger = findTrigger();
        
        if (panel) panel.classList.toggle('open', open);
        if (trigger) {
            trigger.classList.toggle('open', open);
            trigger.setAttribute('aria-expanded', String(open));
        }
    }

    function isOpen() {
        const trigger = findTrigger();
        return !!trigger && trigger.classList.contains('open');
    }

    // ОБНОВЛЕНИЕ КНОПКИ-ТРИГГЕРА: полное имя + флаг
    function syncUI() {
        const cur = currentLang();
        const active = LANGS.find(function (l) { return l.code === cur; }) || LANGS[0];
        const displayName = TRIGGER_NAMES[cur] || active.name;

        document.querySelectorAll('#languageSelector, .language-selector').forEach(function (t) {
            const txt = t.querySelector('.language-text');
            if (txt) txt.textContent = displayName;
            t.setAttribute('data-language-code', cur);

            // Короткий код (виден только на мобильных — см. style.css)
            const codeEl = t.querySelector('.language-code');
            if (codeEl) codeEl.textContent = TRIGGER_CODES[cur] || cur.toUpperCase();

            // ОБНОВЛЯЕМ ФЛАГ В ТРИГГЕРЕ
            const flagImg = t.querySelector('.language-flag');
            if (flagImg) {
                flagImg.src = active.flag;
                flagImg.alt = displayName;
            }
        });

        const panel = findPanel();
        if (panel) {
            panel.querySelectorAll('[data-lang]').forEach(function (a) {
                a.classList.toggle('active', a.getAttribute('data-lang') === cur);
            });
        }
    }

    /* ВАЖЕН ПОРЯДОК: сначала клики ВНУТРИ панели, потом триггер,
       иначе клик по панели схлопывал бы её */
    document.addEventListener('click', function (e) {
        const panel = findPanel();
        const trigger = findTrigger();

        // 1) клик внутри панели — выбор языка
        if (panel && panel.contains(e.target)) {
            const item = e.target.closest('[data-lang]');
            if (item) {
                e.preventDefault();
                if (item.classList.contains('site-selector__site--disabled')) return;
                setOpen(false);
                const lang = item.getAttribute('data-lang');
                if (lang && lang !== currentLang() && window.switchLang) window.switchLang(lang);
            }
            return;
        }

        // 2) клик по триггеру — открыть/закрыть
        if (trigger && trigger.contains(e.target)) {
            e.preventDefault();
            e.stopPropagation();
            ensurePanel();
            syncUI();
            setOpen(!isOpen());
            return;
        }

        // 3) клик вне — закрыть
        if (isOpen()) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
    });

    document.addEventListener('languageChanged', syncUI);

    // Перепозиционирование при изменении размера окна
    window.addEventListener('resize', function() {
        const panel = findPanel();
        const header = document.querySelector('header');
        if (panel && header && panel.classList.contains('open')) {
            const headerRect = header.getBoundingClientRect();
            panel.style.top = (headerRect.bottom + 8) + 'px';
            panel.style.right = (window.innerWidth - headerRect.right) + 'px';
        }
    });

    function init() {
        ensurePanel();
        syncUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // шапка вставляется через fetch — догоняем
    const mo = new MutationObserver(function () {
        const trigger = findTrigger();
        if (trigger) {
            ensurePanel();
            syncUI();
            mo.disconnect();
        }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
})();