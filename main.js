/* ==========================================================
   main.js
   Общий JavaScript-файл для всех страниц.
   ========================================================== */

// ===== АВТОМАТИЧЕСКИЙ ВЫЗОВ ПРИ ЛЮБОМ СОСТОЯНИИ DOM =====
function whenDomReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

// ===== ЗАЩИТА КОНТЕЙНЕРОВ =====
function ensureContainer(id) {
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement('div');
        el.id = id;
        document.body.appendChild(el);
    }
    return el;
}

// ==========================================================
// АВТОМАТИЧЕСКОЕ ПОДКЛЮЧЕНИЕ language-selector.js
// ==========================================================
// Раньше здесь ждали через MutationObserver, пока в DOM появится
// #languageSelector (то есть пока не догрузится main_head.html/prod_head.html),
// и только тогда добавляли <script>. Это добавляло лишний последовательный
// сетевой запрос ПОСЛЕ загрузки шапки, из-за чего языковая панель
// прорисовывалась заметно позже самой шапки.
// language-selector.js сам умеет "догонять" шапку, которая вставляется
// через fetch (см. его собственный MutationObserver внутри), поэтому
// его можно (и нужно) подключать сразу же, параллельно с загрузкой
// шапки — так же, как search.js и modals.js ниже.
(function() {
    if (document.querySelector('script[src="language-selector.js"]')) return;
    const script = document.createElement('script');
    script.src = 'language-selector.js';
    document.body.appendChild(script);
})();

// ==========================================================
// АВТОМАТИЧЕСКОЕ ПОДКЛЮЧЕНИЕ search.css И search.js
// ==========================================================
(function() {
    if (!document.querySelector('link[href="search.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'search.css';
        document.head.appendChild(link);
        console.log('✅ search.css подключен через main.js');
    }

    if (!document.querySelector('script[src="search.js"]')) {
        const script = document.createElement('script');
        script.src = 'search.js';
        document.body.appendChild(script);
        console.log('✅ search.js подключен через main.js');
    }
})();

// ==========================================================
// АВТОМАТИЧЕСКОЕ ПОДКЛЮЧЕНИЕ modals.css, modals.js, modals.html
// ==========================================================
(function() {
    if (!document.querySelector('link[href="modals.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'modals.css';
        document.head.appendChild(link);
        console.log('✅ modals.css подключен через main.js');
    }

    if (!document.querySelector('script[src="modals.js"]')) {
        const script = document.createElement('script');
        script.src = 'modals.js';
        document.body.appendChild(script);
        console.log('✅ modals.js подключен через main.js');
    }

    // Вставляем модалки в body (если их нет)
    if (!document.getElementById('quoteModal')) {
        fetch('modals.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML('beforeend', data);
                // Переводим на текущий язык
                if (window.applyLanguage) {
                    window.applyLanguage(window.getCurrentLang());
                }
                console.log('✅ modals.html вставлен в body');
            })
            .catch(error => console.error('Ошибка загрузки modals.html:', error));
    }
})();

// ==========================================================
// ГЛОБАЛЬНЫЙ ОБРАБОТЧИК БУРГЕРА
// ==========================================================
if (!window.__burgerHandlerAttached) {
    window.__burgerHandlerAttached = true;

    document.addEventListener('click', function(e) {
        const burgerBtn = e.target.closest('.burger-btn');
        if (!burgerBtn) return;

        const mobileNav = document.getElementById('mobileNav') || document.querySelector('.mobile-nav');
        if (!mobileNav) return;

        burgerBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                burgerBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    });
}

// ==========================================================
// 1. КНОПКА "ВВЕРХ"
// ==========================================================
function initScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) btn.classList.add('show');
        else btn.classList.remove('show');
    });

    btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================================
// 3. ЗАГРУЗКА ШАПКИ И ФУТЕРА
// ==========================================================
function loadHeader() {
    return fetch('main_head.html')
        .then(response => {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.text();
        })
        .then(data => {
            const container = ensureContainer('header-container');
            container.innerHTML = data;

            if (window.applyLanguage && window.getCurrentLang) {
                window.applyLanguage(window.getCurrentLang());
            }

            container.classList.add('ready');

            return true;
        })
        .catch(error => {
            console.error('Ошибка загрузки шапки:', error);
            ensureContainer('header-container').classList.add('ready');
            return false;
        });
}

function loadFooter() {
    fetch('main_footer.html')
        .then(response => {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.text();
        })
        .then(data => {
            const fc = ensureContainer('footer-container');
            fc.innerHTML = data;

            if (window.applyLanguage && window.getCurrentLang) {
                window.applyLanguage(window.getCurrentLang());
            }

            fc.classList.add('ready');
        })
        .catch(error => console.error('Ошибка загрузки футера:', error));
}

// ==========================================================
// 4. ГЛАВНЫЙ ЦИКЛ ЗАГРУЗКИ (только для «главных» страниц)
// ==========================================================
// prod_common.js и category.js сами подключают main.js динамически —
// ради общих утилит ниже (бургер, поиск, модалки, language-selector).
// Но у них header-container к этому моменту УЖЕ заполнен prod_head.html
// и помечен классом .ready — значит грузить main_head.html/мега-меню
// поверх и звать initMegaMenu() здесь нельзя, иначе шапка/футер
// перезатираются на «главные», а initMegaMenu() падает, т.к. на этих
// страницах мега-меню нет (см. megamenu.js/megamenu.css).
whenDomReady(function() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer && headerContainer.classList.contains('ready')) {
        return;
    }

    loadHeader().then((headerLoaded) => {
        if (headerLoaded) {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    if (typeof initMegaMenu === 'function') {
                        initMegaMenu();
                    }
                    loadFooter();
                    setTimeout(() => initScrollToTop(), 200);
                }, 50);
            });
        }
    });
});

// ==========================================================
// 5. ФОН HERO ДЛЯ КАТЕГОРИЙ
// ==========================================================
function initCategoryHero() {
    if (typeof categoryImages === 'undefined') {
        console.warn('categoryImages не найдена');
        return;
    }

    const path = window.location.pathname;
    const filename = path.split('/').pop();
    const match = filename.match(/category-(\w+)\.html/);
    if (!match) return;

    const category = match[1];
    const bgPath = categoryImages[category];
    if (!bgPath) return;

    const hero = document.querySelector('.category-hero');
    if (hero) hero.style.backgroundImage = `url('${bgPath}')`;
}

/* ==========================================================
   ПЕРЕХВАТ КЛИКОВ: кнопки открывают модалки вместо contact.html
   ========================================================== */
document.addEventListener('click', function (e) {
    // 1) «Request a Quote» → #quoteModal (href НЕ проверяем — его переписывает rewriteLinks)
    const quoteBtn = e.target.closest('[data-open-quote], a[data-i18n="request_quote"], button[data-i18n="request_quote"]');
    if (quoteBtn) {
        e.preventDefault();
        if (window.openModal) window.openModal('quoteModal');
        return;
    }

    // 2) «Technical support» → #supportModal (работает — не трогаем)
    const techBtn = e.target.closest('[data-open-support], [data-i18n="tech_support"]');
    if (techBtn) {
        e.preventDefault();
        if (window.openModal) window.openModal('supportModal');
        return;
    }

    // 3) Кнопка базы знаний (бывш. Contact Support) → #knowledgeModal
    const kbBtn = e.target.closest('[data-open-knowledge], [data-i18n="contact_support"]');
    if (kbBtn) {
        e.preventDefault();
        if (window.openKnowledgeBase) window.openKnowledgeBase();
        return;
    }
});