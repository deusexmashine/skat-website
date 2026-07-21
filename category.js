/* ==========================================================
   category.js (ОЧИЩЕННАЯ ВЕРСИЯ)
   - Полностью полагается на глобальный объект categoryImages из assets.js
   - Использует DOMContentLoaded для гарантии загрузки
   ========================================================== */

// Функция установки фона
function setCategoryHeroBackground(categoryKey) {
    // Безопасно проверяем, что categoryImages существует
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

// Инициализация страницы категории
function initCategoryPage(categoryKey) {
    // 1. Загружаем шапку
    fetch('prod_head.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => console.error('Ошибка загрузки шапки:', error));

    // 2. Загружаем футер
    fetch('main_footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Ошибка загрузки футера:', error));

    // 3. Ставим фон
    setCategoryHeroBackground(categoryKey);

    // 4. Кнопка "Вверх"
    setTimeout(() => {
        if (typeof initScrollToTop === 'function') {
            initScrollToTop();
        }
    }, 200);
}