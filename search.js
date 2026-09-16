/* ==========================================================
   SEARCH.JS v2 — фирменный поиск SKAT
   ========================================================== */
(function () {
    'use strict';

    let index = null, activeIdx = -1, debT = null;
    const RECENT_KEY = 'skat_recent';

    function getLang() {
        if (window.getCurrentLang) return window.getCurrentLang();
        return new URLSearchParams(location.search).get('lang') === 'ru' ? 'ru' : 'en';
    }

    function norm(s) {
        return (s || '').toLowerCase().replace(/ё/g, 'е').trim();
    }

    function esc(s) {
        return (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }

    function highlight(text, q) {
        return esc(text).replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
    }

    /* Индекс: имя файла в нижнем регистре + trim ключей ("en " -> "en") */
    async function loadIndex() {
        if (index) return index;
        try {
            const r = await fetch('search.json');
            if (!r.ok) throw new Error('HTTP ' + r.status);
            const raw = await r.json();
            index = {};
            Object.keys(raw).forEach(k => {
                index[k.trim()] = raw[k];
            });
        } catch (e) {
            console.error('Ошибка загрузки search.json:', e);
            index = {};
        }
        return index;
    }

    /* Модалка создаётся сама, если разметки нет */
    function ensureModal() {
        if (document.getElementById('searchModal')) return;

        const m = document.createElement('div');
        m.id = 'searchModal';
        m.className = 'search-modal';

        m.innerHTML =
            '<div class="search-modal__overlay"></div>' +
            '<div class="search-modal__content" role="dialog" aria-modal="true" aria-label="Search">' +
            '<input id="searchInput" class="search-modal__input" autocomplete="off" aria-label="Search" />' +
            '<button class="search-modal__close" aria-label="Close">&times;</button>' +
            '<div id="searchResults" class="search-modal__results" aria-live="polite"></div>' +
            '</div>';

        document.body.appendChild(m);
    }

    function openSearch() {
        ensureModal();
        document.getElementById('searchModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            document.getElementById('searchInput').focus();
            renderStart();
        }, 60);
    }

    function closeSearch() {
        const m = document.getElementById('searchModal');
        if (!m) return;
        m.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* Скоринг + кросс-языковой фолбэк */
    function scoreItem(p, q, tokens) {
        const t = norm(p.title), k = norm(p.keywords);
        let s = 0;
        if (t.includes(q)) s += 10;
        if (t.indexOf(q) === 0) s += 4;
        tokens.forEach(tok => {
            if (t.includes(tok)) s += 6;
            else if (k.includes(tok)) s += 3;
        });
        return s;
    }

    function searchAll(q) {
        const lang = getLang();
        const other = lang === 'ru' ? 'en' : 'ru';
        const tokens = norm(q).split(/\s+/).filter(t => t.length > 1);
        const pool = ((index[lang] || {}).pages || []).slice();
        ((index[other] || {}).pages || []).forEach(p => {
            if (!pool.some(x => x.url === p.url)) pool.push(p);
        });
        return pool.map(p => ({ p, s: scoreItem(p, norm(q), tokens) }))
            .filter(x => x.s > 0)
            .sort((a, b) => b.s - a.s)
            .slice(0, 12)
            .map(x => x.p);
    }

    /* Рендер */
    function chips() {
        const list = getLang() === 'ru'
            ? ['тангенс', 'пробой масла', 'киловольтметр', 'СИЗ', 'нагрузка']
            : ['tan delta', 'oil breakdown', 'kilovoltmeter', 'PPE', 'load bank'];
        return '<div class="search-chips">' + list.map(c => '<button class="search-chip" data-q="' + esc(c) + '">' + esc(c) + '</button>').join('') + '</div>';
    }

    function recent() {
        try {
            return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    function pushRecent(q) {
        if (!q) return;
        const r = recent().filter(x => x !== q);
        r.unshift(q);
        localStorage.setItem(RECENT_KEY, JSON.stringify(r.slice(0, 5)));
    }

    function renderStart() {
        const box = document.getElementById('searchResults');
        if (!box) return;
        const r = recent();
        box.innerHTML = (r.length
            ? '<div class="search-group-title">' + (getLang() === 'ru' ? 'Недавние запросы' : 'Recent searches') + '</div>' +
              r.map(x => '<a href="#" data-q="' + esc(x) + '"><i class="fa-solid fa-clock-rotate-left"></i> ' + esc(x) + '</a>').join('')
            : '') + chips();
    }

    function performSearch(q) {
        q = norm(q);
        const box = document.getElementById('searchResults');
        if (!box) return;

        if (q.length < 2) {
            renderStart();
            return;
        }

        const res = searchAll(q);
        if (!res.length) {
            box.innerHTML = '<p class="search-modal__empty">' +
                (getLang() === 'ru' ? 'Ничего не найдено по запросу «' + esc(q) + '»' : 'No results for "' + esc(q) + '"') +
                '</p>' + chips();
            return;
        }

        box.innerHTML = '<div class="search-group-title">' + (getLang() === 'ru' ? 'Результаты: ' : 'Results: ') + res.length + '</div>' +
            res.map(p =>
                '<a href="' + p.url + '">' +
                '<i class="fa-solid ' + (p.url.indexOf('product-') === 0 ? 'fa-box' : 'fa-file-lines') + '"></i> ' +
                '<span class="sr-text">' + highlight(p.title, q) + '</span>' +
                '</a>'
            ).join('');
    }

    /* События */
    function bind() {
        document.addEventListener('click', function (e) {
            // Открытие поиска по клику на иконку
            if (e.target.closest('.nav-icon[aria-label="Search"], [data-search-open]')) {
                e.preventDefault();
                openSearch();
                return;
            }

            // Закрытие по клику на оверлей или крестик
            if (e.target.classList.contains('search-modal__overlay') || e.target.closest('.search-modal__close')) {
                closeSearch();
                return;
            }

            // Клик по чипу-подсказке
            const chip = e.target.closest('[data-q]');
            if (chip) {
                e.preventDefault();
                const input = document.getElementById('searchInput');
                input.value = chip.getAttribute('data-q');
                performSearch(input.value);
                input.focus();
                return;
            }

            // Клик по результату — с сохранением языка
            const res = e.target.closest('.search-modal__results a[href$=".html"]');
            if (res) {
                e.preventDefault();
                pushRecent(document.getElementById('searchInput').value.trim());
                const lang = getLang();
                const url = new URL(res.getAttribute('href'), location.origin);
                if (lang !== 'en') url.searchParams.set('lang', lang);
                else url.searchParams.delete('lang');
                location.href = url.toString();
            }
        });

        document.addEventListener('keydown', function (e) {
            // Ctrl+K или Cmd+K — открыть поиск
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                openSearch();
                return;
            }

            // "/" — открыть поиск (если не в поле ввода)
            if (e.key === '/' && !e.target.closest('input,textarea')) {
                e.preventDefault();
                openSearch();
                return;
            }

            // Escape — закрыть
            if (e.key === 'Escape') {
                closeSearch();
                return;
            }

            const m = document.getElementById('searchModal');
            if (!m || !m.classList.contains('active')) return;

            const links = Array.from(m.querySelectorAll('.search-modal__results a[href$=".html"]'));
            if (!links.length) return;

            // Стрелки вверх/вниз
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                activeIdx = e.key === 'ArrowDown'
                    ? Math.min(activeIdx + 1, links.length - 1)
                    : Math.max(activeIdx - 1, 0);
                links.forEach((a, i) => a.classList.toggle('active', i === activeIdx));
                links[activeIdx].scrollIntoView({ block: 'nearest' });
            }

            // Enter — переход с сохранением языка
            if (e.key === 'Enter' && activeIdx >= 0 && links[activeIdx]) {
                e.preventDefault();
                pushRecent(document.getElementById('searchInput').value.trim());
                const lang = getLang();
                const url = new URL(links[activeIdx].getAttribute('href'), location.origin);
                if (lang !== 'en') url.searchParams.set('lang', lang);
                else url.searchParams.delete('lang');
                location.href = url.toString();
            }
        });

        document.addEventListener('input', function (e) {
            if (e.target.id !== 'searchInput') return;
            clearTimeout(debT);
            activeIdx = -1;
            debT = setTimeout(() => performSearch(e.target.value), 180);
        });

        document.addEventListener('languageChanged', function () {
            const input = document.getElementById('searchInput');
            const lang = getLang();
            if (input && index[lang]) {
                input.placeholder = index[lang].search_placeholder || input.placeholder;
            }
            if (input && !input.value.trim()) {
                renderStart();
            }
        });
    }

    async function init() {
        await loadIndex();
        ensureModal();
        bind();

        const lang = getLang();
        const input = document.getElementById('searchInput');
        if (input && index[lang]) {
            input.placeholder = index[lang].search_placeholder || '';
        }

        // Deep-link: ?q=... — открыть поиск с готовым запросом
        const q = new URLSearchParams(location.search).get('q');
        if (q) {
            openSearch();
            input.value = q;
            performSearch(q);
        }
    }

    init();
})();