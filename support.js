/* ==========================================================
   SUPPORT.JS — Логика страницы поддержки
   ========================================================== */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('supportContactForm');
    if (!form) return;

    // Текущий язык
    const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'en';

    // Автозаполнение скрытых полей
    form.querySelector('input[name="lang"]').value = currentLang;
    form.querySelector('input[name="page"]').value = window.location.href;
    form.querySelector('input[name="timestamp"]').value = new Date().toISOString();

    // Превью файла
    const fileInput = document.getElementById('supportAttachment');
    const preview = document.getElementById('filePreview');
    fileInput.addEventListener('change', function() {
        if (window.updateFileInputDisplay) window.updateFileInputDisplay(fileInput);
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            preview.innerHTML = '<span><i class="fa-solid fa-file"></i> ' + file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)</span><button type="button" onclick="this.parentElement.innerHTML=\'\';document.getElementById(\'supportAttachment\').value=\'\';if(window.updateFileInputDisplay)window.updateFileInputDisplay(document.getElementById(\'supportAttachment\'))">&times;</button>';
        } else {
            preview.innerHTML = '';
        }
    });

    // Счётчик символов
    const textarea = document.getElementById('supportProblem');
    const counter = document.getElementById('supportCounter');
    textarea.addEventListener('input', function() {
        counter.textContent = textarea.value.length + ' / 2000';
        counter.classList.toggle('form-counter--warning', textarea.value.length > 1800);
    });

    // Валидация и отправка
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Honeypot
        if (form.website.value) {
            console.log('Honeypot сработал — бот отсечён');
            form.reset();
            alert('Спасибо! Ваш запрос отправлен.');
            return;
        }

        // Очистка ошибок
        form.querySelectorAll('.form-error-field').forEach(f => f.classList.remove('form-error-field'));
        form.querySelectorAll('.form-error').forEach(f => f.textContent = '');

        // Данные
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const product = form.product.value;
        const problem = form.problem.value.trim();
        const consent = form.consent.checked;

        // Сообщения об ошибках
        const errors = {
            en: {
                name: 'Enter your name',
                email: 'Enter a valid email',
                product: 'Select a product',
                problem: 'Describe the problem (min. 10 characters)',
                consent: 'Consent is required'
            },
            ru: {
                name: 'Введите имя',
                email: 'Введите корректный email',
                product: 'Выберите продукт',
                problem: 'Опишите проблему (мин. 10 символов)',
                consent: 'Необходимо согласие'
            }
        };

        const L = errors[currentLang] || errors['en'];

        // Валидация
        let ok = true;
        if (name.length < 2) {
            document.querySelector('[data-error-for="name"]').textContent = L.name;
            form.name.classList.add('form-error-field');
            ok = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            document.querySelector('[data-error-for="email"]').textContent = L.email;
            form.email.classList.add('form-error-field');
            ok = false;
        }
        if (!product) {
            document.querySelector('[data-error-for="product"]').textContent = L.product;
            form.product.classList.add('form-error-field');
            ok = false;
        }
        if (problem.length < 10) {
            document.querySelector('[data-error-for="problem"]').textContent = L.problem;
            form.problem.classList.add('form-error-field');
            ok = false;
        }
        if (!consent) {
            document.querySelector('[data-error-for="consent"]').textContent = L.consent;
            form.consent.classList.add('form-error-field');
            ok = false;
        }

        if (!ok) return;

        // Блокируем кнопку
        const submitBtn = document.getElementById('supportContactSubmit');
        submitBtn.disabled = true;
        submitBtn.querySelector('i').style.display = 'inline-block';

        // Сбор данных
        const data = Object.fromEntries(new FormData(form).entries());
        // Код страны — из виджета «телефон с флагом» этой формы (по умолчанию +7)
        const phoneWrap = form.querySelector('.phone-input-wrap');
        const dial = (phoneWrap && phoneWrap.dataset.dial) || '+7';
        data.phone = form.phone.value.trim() ? dial + ' ' + form.phone.value.trim() : '';
        data.company = form.company.value.trim();
        data.country = form.country.value;
        data.newsletter = form.newsletter.checked ? 'yes' : 'no';

        // Отправка через FormSubmit
        try {
            const response = await fetch('https://formsubmit.co/ajax/logist@skat-v.ru', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _subject: 'SKAT Support Request',
                    _captcha: 'false',
                    _template: 'table',
                    ...data
                })
            });

            if (response.ok) {
                form.reset();
                alert('Спасибо! Ваш запрос отправлен.');
            } else {
                throw new Error('HTTP ' + response.status);
            }
        } catch (error) {
            console.error('FormSubmit недоступен:', error);
            // Fallback на mailto
            const body = Object.entries(data)
                .map(([k, v]) => k + ': ' + v)
                .join('\n');
            window.location.href = 'mailto:logist@skat-v.ru?subject=' + encodeURIComponent('SKAT Support Request') + '&body=' + encodeURIComponent(body);
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('i').style.display = 'none';
        }
    });
});