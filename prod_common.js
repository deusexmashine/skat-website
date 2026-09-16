/* ==========================================================
   prod_common.js — Общая логика для страниц продуктов
   ========================================================== */

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

// ===== АВТОМАТИЧЕСКИЙ ВЫЗОВ ПРИ ЛЮБОМ СОСТОЯНИИ DOM =====
function whenDomReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

// ==========================================================
// ЗАГРУЗКА ШАПКИ И ФУТЕРА
// ==========================================================
whenDomReady(function() {
    document.body.classList.add('product-page');

    // Подключаем общий CSS (если не подключён)
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'prod_common.css';
    document.head.appendChild(link);

    // Загружаем шапку
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

            initHeaderScroll();

            // Подключаем main.js (динамически)
            const script = document.createElement('script');
            script.src = 'main.js';
            document.body.appendChild(script);

            // Обработка якорных ссылок
            if (window.location.hash) {
                setTimeout(function() {
                    const targetId = window.location.hash.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 400);
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки шапки:', error);
            ensureContainer('header-container').classList.add('ready');
        });

    // Загружаем футер
    fetch('prod_foot.html')
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
});

// ==========================================================
// СКРОЛЛ-ЭФФЕКТ ХЕДЕРА
// ==========================================================
function initHeaderScroll() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
}

// ==========================================================
// ВКЛАДКИ
// ==========================================================
function openTab(evt, tabName) {
    const tabContent = document.getElementsByClassName('tab-pane');
    for (let i = 0; i < tabContent.length; i++) tabContent[i].classList.remove('active');

    const tabLinks = document.getElementsByClassName('product-tabs')[0].getElementsByTagName('button');
    for (let i = 0; i < tabLinks.length; i++) tabLinks[i].classList.remove('active');

    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// ==========================================================
// АККОРДЕОН
// ==========================================================
document.querySelectorAll('.accordion-header').forEach(button => {
    button.addEventListener('click', () => {
        const body = button.nextElementSibling;
        const isActive = button.classList.contains('active');

        const parentContainer = button.closest('.accordion-container');
        if (parentContainer) {
            parentContainer.querySelectorAll('.accordion-header').forEach(b => b.classList.remove('active'));
            parentContainer.querySelectorAll('.accordion-body').forEach(b => b.style.maxHeight = null);
        }

        if (!isActive) {
            button.classList.add('active');
            body.style.maxHeight = body.scrollHeight + 'px';
        }
    });
});
