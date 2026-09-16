/* ==========================================================
   category.js (ИСПРАВЛЕННАЯ ВЕРСИЯ)
   ========================================================== */

function ensureContainer(id) {
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement('div');
        el.id = id;
        document.body.appendChild(el);
    }
    return el;
}

function whenDomReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

function setCategoryHeroBackground(categoryKey) {
    if (typeof categoryImages === 'undefined') {
        console.error('❌ categoryImages не найдена. Проверьте assets.js.');
        return;
    }
    const imagePath = categoryImages[categoryKey];
    if (!imagePath) {
        console.warn('Картинка для категории "' + categoryKey + '" не найдена.');
        return;
    }
    const hero = document.querySelector('.category-hero');
    if (hero) {
        hero.style.backgroundImage = 'url(' + imagePath + ')';
    }
}

function initCategoryPage(categoryKey) {
    whenDomReady(function() {
        document.body.classList.add('category-page');

        fetch('prod_head.html')
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

                const script = document.createElement('script');
                script.src = 'main.js';
                document.body.appendChild(script);
            })
            .catch(error => {
                console.error('Ошибка загрузки шапки категории:', error);
                ensureContainer('header-container').classList.add('ready');
            });

        fetch('main_footer.html')
            .then(response => {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.text();
            })
            .then(data => {
                const fc = ensureContainer('footer-container');
                fc.innerHTML = data;
                fc.classList.add('ready');
            })
            .catch(error => console.error('Ошибка загрузки футера:', error));

        setCategoryHeroBackground(categoryKey);

        setTimeout(() => {
            if (typeof initScrollToTop === 'function') {
                initScrollToTop();
            }
            if (typeof initCategoryHero === 'function') {
                initCategoryHero();
            }
        }, 200);
    });
}