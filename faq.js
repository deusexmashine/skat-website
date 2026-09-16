/* ==========================================================
   faq.js — раскрытие/скрытие вопросов на странице FAQ.
   Логика идентична аккордеону на продуктовых страницах
   (см. "АККОРДЕОН" в prod_common.js), вынесена в отдельный
   файл, чтобы не подключать на faq.html весь prod_common.js
   (он сам загружает шапку/футер продуктовых страниц —
   на faq.html это уже делает main.js, и они бы конфликтовали).
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.accordion-header').forEach(function (button) {
        button.addEventListener('click', function () {
            const body = button.nextElementSibling;
            const isActive = button.classList.contains('active');

            const parentContainer = button.closest('.accordion-container');
            if (parentContainer) {
                parentContainer.querySelectorAll('.accordion-header').forEach(function (b) { b.classList.remove('active'); });
                parentContainer.querySelectorAll('.accordion-body').forEach(function (b) { b.style.maxHeight = null; });
            }

            if (!isActive) {
                button.classList.add('active');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });
});
