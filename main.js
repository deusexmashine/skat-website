/* ==========================================================
   main.js
   Общий JavaScript-файл для всех страниц, кроме продуктовых.
   Содержит:
   - Логику кнопки "Вверх" (Scroll to Top).
   - Функцию инициализации мега-меню (initMegaMenu).
   - Логику загрузки шапки и футера (main_head.html / main_footer.html).
   ========================================================== */

// ==========================================================
// 1. КНОПКА "ВВЕРХ" (SCROLL TO TOP)
// ==========================================================
function initScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================================
// 2. ИНИЦИАЛИЗАЦИЯ МЕГА-МЕНЮ
// ==========================================================
function initMegaMenu() {
    const toggleBtn = document.getElementById('megaMenuToggle');
    const overlay = document.getElementById('megaOverlay');
    const closeBtn = document.querySelector('.mega-close-btn');
    const cards = document.querySelectorAll('.mega-card-item');
    const groups = document.querySelectorAll('.mega-links-group');

    if (!toggleBtn || !overlay) return;

    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            cards.forEach(c => c.classList.remove('active'));
            groups.forEach(g => g.classList.remove('active'));
            return;
        }
        overlay.classList.add('active');
        if (cards.length > 0 && groups.length > 0) {
            cards[0].classList.add('active');
            const firstCategory = cards[0].getAttribute('data-category');
            const targetGroup = document.querySelector(`.mega-links-group[data-category="${firstCategory}"]`);
            if (targetGroup) targetGroup.classList.add('active');
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            overlay.classList.remove('active');
            cards.forEach(c => c.classList.remove('active'));
            groups.forEach(g => g.classList.remove('active'));
        });
    }

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            cards.forEach(c => c.classList.remove('active'));
            groups.forEach(g => g.classList.remove('active'));
        }
    });

    cards.forEach(card => {
        card.addEventListener('click', function() {
            cards.forEach(c => c.classList.remove('active'));
            groups.forEach(g => g.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            const targetGroup = document.querySelector(`.mega-links-group[data-category="${category}"]`);
            if (targetGroup) targetGroup.classList.add('active');
        });
    });
}

// ==========================================================
// 3. ЗАГРУЗКА ШАПКИ И ФУТЕРА
// ==========================================================
function loadHeader() {
    return fetch('main_head.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            return true;
        })
        .catch(error => {
            console.error('Ошибка загрузки шапки:', error);
            return false;
        });
}

function loadFooter() {
    fetch('main_footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Ошибка загрузки футера:', error));
}

// ==========================================================
// 4. ГЛАВНЫЙ ЦИКЛ ЗАГРУЗКИ
// ==========================================================
document.addEventListener('DOMContentLoaded', function() {
    // 1. Загружаем шапку
    loadHeader().then((headerLoaded) => {
        if (headerLoaded) {
            // 2. Инициализируем мега-меню после загрузки шапки
            setTimeout(() => {
                initMegaMenu();
            }, 100);

            // 3. Загружаем футер
            loadFooter();

            // 4. Инициализируем кнопку "Вверх"
            setTimeout(() => {
                initScrollToTop();
            }, 200);
        }
    });
});
// ==========================================================
// 5. ИНИЦИАЛИЗАЦИЯ ДЛЯ СТРАНИЦ КАТЕГОРИЙ
// ==========================================================
function initCategoryPage() {
    // Загружаем шапку (prod_head.html — без мега-меню)
    fetch('prod_head.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => console.error('Ошибка загрузки шапки категории:', error));

    // Загружаем футер (main_footer.html — общий футер)
    fetch('main_footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Ошибка загрузки футера:', error));

    // Инициализируем кнопку "Вверх"
    setTimeout(() => {
        initScrollToTop();
    }, 200);
}