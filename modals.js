/* ==========================================================
   MODALS.JS — Модальные окна: КП, Техподдержка, База знаний
   ========================================================== */
(function () {
    'use strict';

    // Список продуктов (локальный, для автоопределения)
    const PRODUCTS = {
        'm100v': 'SKAT-M100V',
        'tangens': 'SKAT-TANGENS-M',
        '70c': 'SKAT-70C',
        '70m': 'SKAT-70M',
        '70p': 'SKAT-70P',
        'svs': 'SKAT-SVS',
        'stend50': 'SKAT-STEND-50',
        'ubsvn': 'UBSVN-LM',
        'avn70': 'SKAT-AVN-70',
        'ik100': 'IK 100-0.4',
        'kvc-b': 'KVC-B',
        'kvc-c': 'KVC-C'
    };

    // Стандарты по продуктам (для базы знаний)
    const STANDARDS = {
        'tangens': ['IEC 60247', 'IEC 60296', 'IEC 60422', 'IEEE C57.106'],
        'm100v':  ['IEC 60156', 'ASTM D1816', 'GOST 6581-75'],
        '70c':    ['IEC 60060', 'GOST 22261-94'],
        '70m':    ['IEC 60060', 'GOST 22261-94'],
        'svs':    ['IEC 60903', 'IEC 61112'],
        'stend50':['IEC 60903', 'IEC 61243'],
        'default':['IEC 60060', 'IEC 60247', 'IEC 60156']
    };

    const RECENT_KEY = 'skat_quote_draft';
    const SUP_MAX_FILES = 5;
    const SUP_MAX_SIZE = 10 * 1024 * 1024;
    const SUP_ALLOW = ['image/jpeg', 'image/png', 'image/webp'];

    // Email для FormSubmit
    const FORMSUBMIT_EMAIL = 'logist@skat-v.ru';

    let lastTrigger = null;
    let formTimer = null;
    let supportFiles = [];

    // ===== Телефонные коды =====
    const PHONE_CODES = [
        { flag:'flags/ru.png', dial:'+7',   name:{en:'Russia',ru:'Россия'} },
        { flag:'flags/kz.png', dial:'+7',   name:{en:'Kazakhstan',ru:'Казахстан'} },
        { flag:'flags/by.png', dial:'+375', name:{en:'Belarus',ru:'Беларусь'} },
        { flag:'flags/de.png', dial:'+49',  name:{en:'Germany',ru:'Германия'} },
        { flag:'flags/br.png', dial:'+55',  name:{en:'Brazil',ru:'Бразилия'} },
        { flag:'flags/es.png', dial:'+34',  name:{en:'Spain',ru:'Испания'} },
        { flag:'flags/cn.png', dial:'+86',  name:{en:'China',ru:'Китай'} },
        { flag:'flags/fr.png', dial:'+33',  name:{en:'France',ru:'Франция'} },
        { flag:'flags/it.png', dial:'+39',  name:{en:'Italy',ru:'Италия'} },
        { flag:'flags/tr.png', dial:'+90',  name:{en:'Turkey',ru:'Турция'} },
        { flag:'flags/pl.png', dial:'+48',  name:{en:'Poland',ru:'Польша'} },
        { flag:'flags/se.png', dial:'+46',  name:{en:'Sweden',ru:'Швеция'} },
        { flag:'flags/cz.png', dial:'+420', name:{en:'Czechia',ru:'Чехия'} },
        { flag:'flags/bg.png', dial:'+359', name:{en:'Bulgaria',ru:'Болгария'} },
        { flag:'flags/rs.png', dial:'+381', name:{en:'Serbia',ru:'Сербия'} },
        { flag:'flags/uz.png', dial:'+998', name:{en:'Uzbekistan',ru:'Узбекистан'} },
        { flag:'flags/az.png', dial:'+994', name:{en:'Azerbaijan',ru:'Азербайджан'} },
        { flag:'flags/ae.png', dial:'+971', name:{en:'UAE',ru:'ОАЭ'} }
    ];

    // Код страны выбранный в виджете «телефон с флагом» ВНУТРИ конкретной
    // формы (виджетов на странице теперь несколько — у каждой формы свой).
    function getDialForForm(form) {
        const wrap = form && form.querySelector('.phone-input-wrap');
        return (wrap && wrap.dataset.dial) || '+7';
    }

    // ===== Кастомная кнопка выбора файла =====
    // Нативная <input type="file"> берёт текст кнопки из языка БРАУЗЕРА,
    // а не языка страницы — его нельзя перевести через data-i18n. Поэтому
    // сам input визуально скрыт (.file-input-native), а рядом стоит своя
    // кнопка + текст статуса (.file-input-status, переводится как обычно)
    // и текст с именами выбранных файлов (.file-input-filename, не
    // переводится — это просто имя файла). Здесь только переключаем,
    // какой из двух показан; filesOrList — необязательно, для форм вроде
    // supportPhotos, где реальный input.files всегда пуст (см. ниже).
    function updateFileInputDisplay(input, filesOrList) {
        if (!input || !input.id) return;
        const wrap = document.querySelector('label.file-input-wrap[for="' + input.id + '"]');
        if (!wrap) return;
        const statusEl = wrap.querySelector('.file-input-status');
        const nameEl = wrap.querySelector('.file-input-filename');
        if (!statusEl || !nameEl) return;
        const files = filesOrList !== undefined ? filesOrList : input.files;
        const list = files ? Array.from(files) : [];
        if (list.length > 0) {
            nameEl.textContent = list.map(f => f.name).join(', ');
            nameEl.hidden = false;
            statusEl.hidden = true;
        } else {
            nameEl.hidden = true;
            nameEl.textContent = '';
            statusEl.hidden = false;
        }
    }

    // Получение текущего языка
    function getLang() {
        if (window.getCurrentLang) return window.getCurrentLang();
        return new URLSearchParams(location.search).get('lang') === 'ru' ? 'ru' : 'en';
    }

    // Определение продукта из URL
    function getCurrentProduct() {
        const m = location.pathname.match(/product-(\w+)\.html/);
        return (m && PRODUCTS[m[1]]) ? PRODUCTS[m[1]] : '';
    }

    // Получение кода продукта из URL (для product support)
    function getCurrentProductCode() {
        const m = location.pathname.match(/product-(\w+)\.html/);
        return m ? m[1] : '';
    }

    // Ошибки валидации
    const ERR = {
        en: {
            name: 'Enter your name',
            email: 'Enter a valid email',
            product: 'Select a product',
            model: 'Select a model',
            consent: 'Consent is required',
            problem: 'Describe the problem (min. 10 characters)',
            file: 'File > 10 MB or wrong type',
            photo: 'Photo > 10 MB or wrong type',
            support_serial_err: 'Serial number must be 5 digits'
        },
        ru: {
            name: 'Введите имя',
            email: 'Введите корректный email',
            product: 'Выберите продукт',
            model: 'Выберите модель',
            consent: 'Необходимо согласие',
            problem: 'Опишите проблему (мин. 10 символов)',
            file: 'Файл > 10 МБ или неверный тип',
            photo: 'Фото > 10 МБ или неверный тип',
            support_serial_err: 'Серийный номер — 5 цифр'
        }
    };

    // Показать ошибку
    function showErr(field, message) {
        field.classList.add('form-error-field');
        const errorEl = document.querySelector('[data-error-for="' + field.name + '"]');
        if (errorEl) errorEl.textContent = message;
    }

    // Очистить ошибки
    function clearErrors(form) {
        form.querySelectorAll('.form-error-field').forEach(f => f.classList.remove('form-error-field'));
        form.querySelectorAll('.form-error').forEach(e => e.textContent = '');
    }

    // Валидация формы КП
    function validateQuote(form) {
        let ok = true;
        const L = ERR[getLang()];
        clearErrors(form);

        const name = form.name.value.trim();
        const email = form.email.value.trim();

        if (name.length < 2) {
            showErr(form.name, L.name);
            ok = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            showErr(form.email, L.email);
            ok = false;
        }

        if (!form.product.value) {
            showErr(form.product, L.product);
            ok = false;
        }

        if (!form.consent.checked) {
            showErr(form.consent, L.consent);
            ok = false;
        }

        const f = form.attachment.files[0];
        if (f && (f.size > 10 * 1024 * 1024)) {
            showErr(form.attachment, L.file);
            ok = false;
        }

        return ok;
    }

    // Валидация формы поддержки
    function validateSupport(form) {
        let ok = true;
        const L = ERR[getLang()];
        clearErrors(form);

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const model = form.model.value;
        const problem = form.problem.value.trim();

        if (name.length < 2) {
            showErr(form.name, L.name);
            ok = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            showErr(form.email, L.email);
            ok = false;
        }

        if (!model) {
            showErr(form.model, L.model);
            ok = false;
        }

        if (problem.length < 10) {
            showErr(form.problem, L.problem);
            ok = false;
        }

        if (!form.consent.checked) {
            showErr(form.consent, L.consent);
            ok = false;
        }

        // Серийный номер — 5 цифр (если указан)
        const serial = (form.serial && form.serial.value || '').trim();
        if (serial && !/^\d{5}$/.test(serial)) {
            showErr(form.serial, L.support_serial_err);
            ok = false;
        }

        supportFiles.forEach(f => {
            if (f.size > SUP_MAX_SIZE || !SUP_ALLOW.includes(f.type)) {
                showErr(form.photos, L.photo);
                ok = false;
            }
        });

        return ok;
    }

    // Сбор данных формы КП
    function collectQuoteData(form) {
        const data = Object.fromEntries(new FormData(form).entries());
        data.page = location.href;
        data.lang = getLang();
        data.utm_source = new URLSearchParams(location.search).get('utm_source') || '';
        data.utm_medium = new URLSearchParams(location.search).get('utm_medium') || '';
        data.utm_campaign = new URLSearchParams(location.search).get('utm_campaign') || '';
        data.referrer = document.referrer || '';
        data.timestamp = new Date().toISOString();
        data.phone = (form.phone.value.trim()) ? getDialForForm(form) + ' ' + form.phone.value.trim() : '';
        return data;
    }

    // Сбор данных формы поддержки
    function collectSupportData(form) {
        const data = Object.fromEntries(new FormData(form).entries());
        data.page = location.href;
        data.lang = getLang();
        data.timestamp = new Date().toISOString();
        data.phone = (form.phone.value.trim()) ? getDialForForm(form) + ' ' + form.phone.value.trim() : '';
        return data;
    }

    // ===== ОБУЧЕНИЕ (#trainingModal, academy.html) =====
    // Валидация заявки на обучение — только имя/email/согласие обязательны,
    // курс и комментарий необязательны (в отличие от formы техподдержки).
    function validateTraining(form) {
        let ok = true;
        const L = ERR[getLang()];
        clearErrors(form);

        const name = form.name.value.trim();
        const email = form.email.value.trim();

        if (name.length < 2) {
            showErr(form.name, L.name);
            ok = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            showErr(form.email, L.email);
            ok = false;
        }

        if (!form.consent.checked) {
            showErr(form.consent, L.consent);
            ok = false;
        }

        return ok;
    }

    // Сбор данных формы обучения
    function collectTrainingData(form) {
        const data = Object.fromEntries(new FormData(form).entries());
        data.page = location.href;
        data.lang = getLang();
        data.timestamp = new Date().toISOString();
        data.phone = (form.phone.value.trim()) ? getDialForForm(form) + ' ' + form.phone.value.trim() : '';
        return data;
    }

    // Отправка заявки на обучение — тот же порядок фолбэков, что у КП/поддержки
    async function sendTrainingRequest(data) {
        try {
            const r = await fetch('/api/training', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (r.ok) return { ok: true };
            throw new Error('HTTP ' + r.status);
        } catch (e) { console.warn('API недоступен:', e); }
        try {
            const r = await fetch('https://formsubmit.co/ajax/' + FORMSUBMIT_EMAIL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.assign({ _subject: 'SKAT Academy Training Inquiry', _captcha: 'false', _template: 'table' }, data))
            });
            if (r.ok) return { ok: true };
            throw new Error('HTTP ' + r.status);
        } catch (e) { console.warn('FormSubmit недоступен:', e); }
        const body = Object.entries(data).map(([k, v]) => k + ': ' + v).join('\n');
        window.location.href = 'mailto:' + FORMSUBMIT_EMAIL + '?subject=' + encodeURIComponent('SKAT Academy Training Inquiry') + '&body=' + encodeURIComponent(body);
        return { ok: true, fallback: true };
    }

    // ===== Отправка через FormSubmit =====
    function ensureUploadFrame() {
        let f = document.getElementById('upload-frame');
        if (!f) {
            f = document.createElement('iframe');
            f.name = 'upload-frame'; f.id = 'upload-frame'; f.style.display = 'none';
            document.body.appendChild(f);
        }
        return f;
    }

    function addServiceFields(form, subject) {
        ['_subject','_captcha','_template'].forEach(n => {
            const old = form.querySelector('input[name="'+n+'"]');
            if (old) old.remove();
        });
        const vals = { _subject: subject, _captcha: 'false', _template: 'table' };
        Object.keys(vals).forEach(n => {
            const i = document.createElement('input');
            i.type = 'hidden'; i.name = n; i.value = vals[n];
            form.appendChild(i);
        });
    }

    async function sendQuoteRequest(data) {
        // 1) локальное API (когда появится бэкенд)
        try {
            const r = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (r.ok) return { ok: true };
            throw new Error('HTTP ' + r.status);
        } catch (e) { console.warn('API недоступен:', e); }
        // 2) FormSubmit AJAX (без файлов)
        try {
            const r = await fetch('https://formsubmit.co/ajax/' + FORMSUBMIT_EMAIL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.assign({ _subject: 'SKAT Quote Request', _captcha: 'false', _template: 'table' }, data))
            });
            if (r.ok) return { ok: true };
            throw new Error('HTTP ' + r.status);
        } catch (e) { console.warn('FormSubmit недоступен:', e); }
        // 3) mailto fallback
        const body = Object.entries(data).map(([k, v]) => k + ': ' + v).join('\n');
        window.location.href = 'mailto:' + FORMSUBMIT_EMAIL + '?subject=' + encodeURIComponent('SKAT Quote Request') + '&body=' + encodeURIComponent(body);
        return { ok: true, fallback: true };
    }

    async function sendSupportRequest(form, data) {
        const hasPhotos = form.photos && form.photos.files && form.photos.files.length > 0;
        try {
            const r = await fetch('/api/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (r.ok) return { ok: true };
            throw new Error('HTTP ' + r.status);
        } catch (e) { console.warn('API недоступен:', e); }
        if (hasPhotos) {
            // файлы едут multipart-формой через скрытый iframe (FormSubmit пришлёт их на почту)
            addServiceFields(form, 'SKAT Support Request');
            const iframe = ensureUploadFrame();
            form.target = iframe.name;
            form.action = 'https://formsubmit.co/' + FORMSUBMIT_EMAIL;
            form.method = 'POST';
            form.enctype = 'multipart/form-data';
            form.submit();               // нативный submit — событие 'submit' не стреляет
            return { ok: true };
        }
        try {
            const r = await fetch('https://formsubmit.co/ajax/' + FORMSUBMIT_EMAIL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.assign({ _subject: 'SKAT Support Request', _captcha: 'false', _template: 'table' }, data))
            });
            if (r.ok) return { ok: true };
            throw new Error('HTTP ' + r.status);
        } catch (e) { console.warn('FormSubmit недоступен:', e); }
        const body = Object.entries(data).map(([k, v]) => k + ': ' + v).join('\n');
        window.location.href = 'mailto:' + FORMSUBMIT_EMAIL + '?subject=' + encodeURIComponent('SKAT Support Request') + '&body=' + encodeURIComponent(body);
        return { ok: true, fallback: true };
    }

    // Черновик КП
    function saveDraft(form) {
        const data = Object.fromEntries(new FormData(form).entries());
        localStorage.setItem(RECENT_KEY, JSON.stringify(data));
    }

    function restoreDraft(form) {
        try {
            const data = JSON.parse(localStorage.getItem(RECENT_KEY) || '{}');
            Object.keys(data).forEach(key => {
                if (form[key] && form[key].name) {
                    form[key].value = data[key];
                }
            });
        } catch (e) {
            // Черновик повреждён — игнорируем
        }
    }

    function clearDraft() {
        localStorage.removeItem(RECENT_KEY);
    }

    // Фокус-трап
    function trapFocus(modal) {
        const focusable = modal.querySelectorAll('input, select, textarea, button, a[href]');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }

    // Открытие модалки
    function openModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        closeAllModals();              // ← ДОБАВИТЬ: закрываем все остальные модалки
        lastTrigger = document.activeElement;

        // Сброс состояния
        modal.querySelectorAll('.modal-form').forEach(f => f.style.display = 'block');
        modal.querySelectorAll('.modal-success').forEach(s => s.style.display = 'none');
        modal.querySelectorAll('.modal-error').forEach(e => e.style.display = 'none');

        // Автозаполнение продукта для КП
        if (id === 'quoteModal') {
            const product = getCurrentProduct();
            if (product) {
                const select = modal.querySelector('select[name="product"]');
                Array.from(select.options).forEach(opt => {
                    if (opt.value === product) opt.selected = true;
                });
            }
            restoreDraft(modal.querySelector('#quoteForm'));
        }

        // Автозаполнение модели для поддержки
        if (id === 'supportModal') {
            const product = getCurrentProduct();
            if (product) {
                const select = modal.querySelector('select[name="model"]');
                Array.from(select.options).forEach(opt => {
                    if (opt.value === product) opt.selected = true;
                });
            }
        }

        // Открываем
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Фокус на первое поле
        setTimeout(() => {
            const firstInput = modal.querySelector('input[name="name"]');
            if (firstInput) firstInput.focus();
        }, 100);

        trapFocus(modal);
    }

    // Закрытие модалки
    function closeModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Возврат фокуса на триггер
        if (lastTrigger) {
            lastTrigger.focus();
            lastTrigger = null;
        }

        // Сброс формы
        const form = modal.querySelector('.modal-form');
        if (form) {
            form.reset();
            clearErrors(form);
        }

        // Сброс фото
        if (id === 'supportModal') {
            supportFiles = [];
            const preview = modal.querySelector('.photo-preview');
            if (preview) preview.innerHTML = '';
        }

        // Сброс превью файла
        if (id === 'quoteModal') {
            const preview = modal.querySelector('.file-preview');
            if (preview) preview.innerHTML = '';
        }

        // Сброс счётчиков
        modal.querySelectorAll('.form-counter').forEach(c => {
            const input = modal.querySelector('textarea[maxlength="1000"]');
            if (input) c.textContent = '0 / 1000';
        });
    }

    // Закрыть все модалки
    function closeAllModals() {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
            m.classList.remove('active');
            m.setAttribute('aria-hidden', 'true');
        });
        document.body.style.overflow = '';

        if (lastTrigger) {
            lastTrigger.focus();
            lastTrigger = null;
        }
    }

    // Инициализация поддержки продукта (База знаний)
    function openKnowledgeBase() {
        const code = getCurrentProductCode();
        const name = PRODUCTS[code] || '';
        const lang = getLang();
        const data = (window.SKAT_ASSETS && window.SKAT_ASSETS.support && window.SKAT_ASSETS.support[code]) || {};

        const modal = document.getElementById('knowledgeModal');
        if (!modal) return;

        modal.querySelector('.modal-product-name').textContent = name;

        // Документация (DS/UG) с учётом языка
        modal.querySelectorAll('[data-doc]').forEach(link => {
            const key = link.getAttribute('data-doc');
            const base = data.docs && data.docs[key];
            link.href = base ? base + '_' + lang + '.pdf' : '#';
            link.style.display = base ? 'flex' : 'none';
        });

        // Прикладные заметки (из FAQ продукта)
        modal.querySelector('[data-kb="notes"]').innerHTML = (data.faq || []).map(f =>
            '<div class="kb-item"><i class="fa-solid fa-lightbulb"></i><div><strong>' + f.q + '</strong><p>' + f.a + '</p></div></div>'
        ).join('') || '<p class="kb-text">—</p>';

        // Стандарты
        const std = STANDARDS[code] || STANDARDS['default'];
        modal.querySelector('[data-kb="standards"]').innerHTML = std.map(s =>
            '<span class="kb-std"><i class="fa-solid fa-scale-balanced"></i>' + s + '</span>'
        ).join('');

        openModal('knowledgeModal');
    }

    // Фото: превью + лимиты
    function initSupportPhotos(modal) {
        const input = modal.querySelector('input[type="file"]');
        const preview = modal.querySelector('.photo-preview');
        if (!input || !preview) return;

        input.addEventListener('change', () => {
            Array.from(input.files || []).forEach(f => {
                if (supportFiles.length >= SUP_MAX_FILES) return;
                if (!SUP_ALLOW.includes(f.type) || f.size > SUP_MAX_SIZE) {
                    const L = ERR[getLang()];
                    showErr(input, L.photo);
                    return;
                }
                supportFiles.push(f);
            });
            input.value = '';
            renderPreview(modal);
        });

        preview.addEventListener('click', e => {
            const b = e.target.closest('.photo-remove');
            if (!b) return;
            supportFiles.splice(+b.dataset.i, 1);
            renderPreview(modal);
        });
    }

    function renderPreview(modal) {
        const preview = modal.querySelector('.photo-preview');
        if (!preview) return;
        preview.innerHTML = '';

        supportFiles.forEach((f, i) => {
            const r = new FileReader();
            r.onload = e => {
                const d = document.createElement('div');
                d.className = 'photo-thumb';
                d.innerHTML = '<img src="' + e.target.result + '" alt=""><button type="button" class="photo-remove" data-i="' + i + '" aria-label="Удалить">&times;</button>';
                preview.appendChild(d);
            };
            r.readAsDataURL(f);
        });

        // input.value сбрасывается сразу после каждого выбора (см. выше),
        // поэтому статус кнопки берём не из input.files (он всегда пуст),
        // а из реального списка supportFiles.
        const input = modal.querySelector('input[type="file"]');
        if (input) updateFileInputDisplay(input, supportFiles);
    }

    // ===== Телефон с флагами =====
    // Заполняет ВСЕ виджеты «телефон с флагом» на странице — их может быть
    // несколько (КП, поддержка, обучение, страница support.html). Раньше
    // здесь был document.getElementById('phoneDropdown') в единственном
    // числе, что работало только пока виджет существовал в одном месте.
    function renderPhoneDropdown() {
        const lang = window.getCurrentLang ? window.getCurrentLang() : 'en';
        document.querySelectorAll('.phone-dropdown').forEach(dd => {
            dd.innerHTML = PHONE_CODES.map(c =>
                '<button type="button" class="phone-item" data-dial="' + c.dial + '" data-flag="' + c.flag + '">' +
                '<img src="' + c.flag + '" alt=""><span>' + c.name[lang] + '</span>' +
                '<span class="phone-dial">' + c.dial + '</span></button>').join('');
        });
    }

    // Инициализация
    function init() {
        document.addEventListener('click', function(e) {
            // Открытие КП
            if (e.target.closest('[data-open-quote]')) {
                e.preventDefault();
                openModal('quoteModal');
                return;
            }

            // Открытие поддержки
            if (e.target.closest('[data-open-support]')) {
                e.preventDefault();
                openModal('supportModal');
                return;
            }

            // Открытие заявки на обучение (academy.html)
            const trainingTrigger = e.target.closest('[data-open-training]');
            if (trainingTrigger) {
                e.preventDefault();
                openModal('trainingModal');
                // Если кнопка привязана к конкретному курсу (data-course="oil-diagnostics"
                // и т.п. — см. academy.html), подставляем его в select и меняем подзаголовок
                // модалки на "Вы оставляете заявку на курс: <название>" — без этого модалка
                // выглядела бы одинаково независимо от того, с какой кнопки её открыли.
                const course = trainingTrigger.getAttribute('data-course') || '';
                const select = document.getElementById('trainingCourse');
                const subtitleGeneric = document.getElementById('trainingSubtitleGeneric');
                const subtitleCourse = document.getElementById('trainingSubtitleCourse');
                if (select) select.value = course;
                if (course && select && select.value === course) {
                    const courseLabel = select.options[select.selectedIndex].textContent;
                    document.getElementById('trainingSubtitleCourseName').textContent = courseLabel;
                    if (subtitleGeneric) subtitleGeneric.style.display = 'none';
                    if (subtitleCourse) subtitleCourse.style.display = 'block';
                } else {
                    if (subtitleGeneric) subtitleGeneric.style.display = 'block';
                    if (subtitleCourse) subtitleCourse.style.display = 'none';
                }
                return;
            }

            // Открытие базы знаний
            // ВАЖНО: вкладку [data-i18n="tab_support"] НЕ перехватываем — она переключает табы через openTab()
            if (e.target.closest('[data-open-knowledge]') || e.target.closest('[data-i18n="contact_support"]')) {
                e.preventDefault();
                openKnowledgeBase();
                return;
            }

            // Кросс-переход: из knowledgeModal в quoteModal
            if (e.target.closest('#knowledgeModal [data-open-quote]')) {
                e.preventDefault();
                closeModal('knowledgeModal');
                setTimeout(() => openModal('quoteModal'), 200);
                return;
            }

            // Кросс-переход: из knowledgeModal в supportModal
            if (e.target.closest('#knowledgeModal [data-open-support]')) {
                e.preventDefault();
                closeModal('knowledgeModal');
                setTimeout(() => openModal('supportModal'), 200);
                return;
            }

            // Закрытие по крестику
            const closeBtn = e.target.closest('[data-close]');
            if (closeBtn) {
                e.preventDefault();
                closeModal(closeBtn.getAttribute('data-close'));
                return;
            }

            // Закрытие по клику на оверлей
            if (e.target.classList.contains('modal-overlay')) {
                closeAllModals();
                return;
            }

            // Кнопка "Повторить" в ошибке КП
            if (e.target.closest('#quoteRetryBtn')) {
                e.preventDefault();
                const modal = document.getElementById('quoteModal');
                modal.querySelector('#quoteError').style.display = 'none';
                modal.querySelector('#quoteForm').style.display = 'block';
                return;
            }

            // Кнопка "Повторить" в ошибке поддержки
            if (e.target.closest('#supportRetryBtn')) {
                e.preventDefault();
                const modal = document.getElementById('supportModal');
                modal.querySelector('#supportError').style.display = 'none';
                modal.querySelector('#supportForm').style.display = 'block';
                return;
            }

            // Кнопка "Повторить" в ошибке заявки на обучение
            if (e.target.closest('#trainingRetryBtn')) {
                e.preventDefault();
                const modal = document.getElementById('trainingModal');
                modal.querySelector('#trainingError').style.display = 'none';
                modal.querySelector('#trainingForm').style.display = 'block';
                return;
            }

            // Телефон с флагами
            const phoneBtn = e.target.closest('.phone-code-btn');
            if (phoneBtn) {
                phoneBtn.closest('.phone-input-wrap').classList.toggle('open');
                return;
            }
            const phoneItem = e.target.closest('.phone-item');
            if (phoneItem) {
                const wrap = phoneItem.closest('.phone-input-wrap');
                wrap.querySelector('.phone-flag').src = phoneItem.dataset.flag;
                wrap.querySelector('.phone-code').textContent = phoneItem.dataset.dial;
                // Код хранится на самом виджете (data-dial), а не в общей
                // переменной — на странице их теперь несколько (КП,
                // поддержка, обучение), и у каждого свой выбранный код.
                wrap.dataset.dial = phoneItem.dataset.dial;
                wrap.classList.remove('open');
            } else if (!e.target.closest('.phone-input-wrap')) {
                document.querySelectorAll('.phone-input-wrap.open').forEach(w => w.classList.remove('open'));
            }
        });

        // Закрытие по Esc
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAllModals();
            }
        });

        // Отправка формы КП
        document.addEventListener('submit', async function(e) {
            const form = e.target.closest('#quoteForm');
            if (!form) return;

            e.preventDefault();

            // Honeypot: если скрытое поле заполнено — тихо «успех»
            if (form.website.value) {
                console.log('Honeypot сработал — бот отсечён');
                form.style.display = 'none';
                document.getElementById('quoteSuccess').style.display = 'block';
                return;
            }

            // Валидация
            if (!validateQuote(form)) return;

            // Собираем данные
            const data = collectQuoteData(form);

            // Блокируем кнопку + спиннер
            const submitBtn = document.getElementById('quoteSubmit');
            submitBtn.disabled = true;
            submitBtn.querySelector('i').style.display = 'inline-block';

            // Отправляем
            const result = await sendQuoteRequest(data);

            // Снимаем блокировку
            submitBtn.disabled = false;
            submitBtn.querySelector('i').style.display = 'none';

            if (result.ok) {
                // Успех: показываем номер заявки
                clearDraft();
                const ticketNumber = 'KP-2026-' + Math.floor(1000 + Math.random() * 9000);
                document.getElementById('quoteTicket').textContent = ticketNumber;
                form.style.display = 'none';
                document.getElementById('quoteSuccess').style.display = 'block';

                // Автоскрытие через 6 секунд
                setTimeout(() => closeModal('quoteModal'), 6000);
            } else {
                // Ошибка: показываем плашку
                form.style.display = 'none';
                document.getElementById('quoteError').style.display = 'block';
            }
        });

        // Отправка формы поддержки
        document.addEventListener('submit', async function(e) {
            const form = e.target.closest('#supportForm');
            if (!form) return;

            e.preventDefault();

            // Honeypot
            if (form.website.value) {
                console.log('Honeypot сработал — бот отсечён');
                form.style.display = 'none';
                document.getElementById('supportSuccess').style.display = 'block';
                return;
            }

            // Валидация
            if (!validateSupport(form)) return;

            // Собираем данные
            const data = collectSupportData(form);

            // Блокируем кнопку + спиннер
            const submitBtn = document.getElementById('supportSubmit');
            submitBtn.disabled = true;
            submitBtn.querySelector('i').style.display = 'inline-block';

            // Отправляем
            const result = await sendSupportRequest(form, data);

            // Снимаем блокировку
            submitBtn.disabled = false;
            submitBtn.querySelector('i').style.display = 'none';

            if (result.ok) {
                // Успех: показываем номер тикета
                const ticketNumber = 'SKT-' + Math.floor(100000 + Math.random() * 900000);
                document.getElementById('supportTicket').textContent = ticketNumber;
                form.style.display = 'none';
                document.getElementById('supportSuccess').style.display = 'block';

                // Автоскрытие через 4 секунды
                setTimeout(() => closeModal('supportModal'), 4000);
            } else {
                // Ошибка
                form.style.display = 'none';
                document.getElementById('supportError').style.display = 'block';
            }
        });

        // Отправка заявки на обучение
        document.addEventListener('submit', async function(e) {
            const form = e.target.closest('#trainingForm');
            if (!form) return;

            e.preventDefault();

            // Honeypot
            if (form.website.value) {
                console.log('Honeypot сработал — бот отсечён');
                form.style.display = 'none';
                document.getElementById('trainingSuccess').style.display = 'block';
                return;
            }

            // Валидация
            if (!validateTraining(form)) return;

            // Собираем данные
            const data = collectTrainingData(form);

            // Блокируем кнопку + спиннер
            const submitBtn = document.getElementById('trainingSubmit');
            submitBtn.disabled = true;
            submitBtn.querySelector('i').style.display = 'inline-block';

            // Отправляем
            const result = await sendTrainingRequest(data);

            // Снимаем блокировку
            submitBtn.disabled = false;
            submitBtn.querySelector('i').style.display = 'none';

            if (result.ok) {
                form.style.display = 'none';
                document.getElementById('trainingSuccess').style.display = 'block';

                // Автоскрытие через 5 секунд
                setTimeout(() => closeModal('trainingModal'), 5000);
            } else {
                form.style.display = 'none';
                document.getElementById('trainingError').style.display = 'block';
            }
        });

        // Счётчик символов КП
        document.addEventListener('input', function(e) {
            if (e.target.id === 'quoteMessage') {
                const counter = document.getElementById('messageCounter');
                if (counter) {
                    counter.textContent = e.target.value.length + ' / 1000';
                    counter.classList.toggle('form-counter--warning', e.target.value.length > 900);
                }
            }
        });

        // Счётчик символов поддержки
        document.addEventListener('input', function(e) {
            if (e.target.id === 'supportProblem') {
                const counter = document.getElementById('supportCounter');
                if (counter) {
                    counter.textContent = e.target.value.length + ' / 1000';
                    counter.classList.toggle('form-counter--warning', e.target.value.length > 900);
                }
            }
        });

        // Счётчик символов заявки на обучение
        document.addEventListener('input', function(e) {
            if (e.target.id === 'trainingMessage') {
                const counter = document.getElementById('trainingCounter');
                if (counter) {
                    counter.textContent = e.target.value.length + ' / 1000';
                    counter.classList.toggle('form-counter--warning', e.target.value.length > 900);
                }
            }
        });

        // Черновик КП с debounce
        document.addEventListener('input', function(e) {
            const form = e.target.closest('#quoteForm');
            if (!form) return;
            clearTimeout(formTimer);
            formTimer = setTimeout(() => saveDraft(form), 500);
        });

        // Превью файла КП
        document.addEventListener('change', function(e) {
            if (e.target.id === 'quoteAttachment') {
                updateFileInputDisplay(e.target);
                const preview = document.getElementById('filePreview');
                const file = e.target.files[0];
                if (file) {
                    preview.innerHTML = '<span><i class="fa-solid fa-file"></i> ' + file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)</span><button type="button" onclick="this.parentElement.innerHTML=\'\';document.getElementById(\'quoteAttachment\').value=\'\';updateFileInputDisplay(document.getElementById(\'quoteAttachment\'))">&times;</button>';
                } else {
                    preview.innerHTML = '';
                }
            }
        });

        // Инициализация фото поддержки
        document.addEventListener('change', function(e) {
            if (e.target.id === 'supportPhotos') {
                const modal = document.getElementById('supportModal');
                if (modal) initSupportPhotos(modal);
            }
        });

        // Установка минимальной даты
        const dateInput = document.getElementById('quoteDeliveryDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }

        // Рендер телефонных кодов при загрузке
        renderPhoneDropdown();
    }

    // Инициализация при готовности DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ЭКСПОРТ — ОБЯЗАТЕЛЬНО ВНУТРИ IIFE, иначе ReferenceError
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.closeAllModals = closeAllModals;
    window.openKnowledgeBase = openKnowledgeBase;
    window.openProductSupport = openKnowledgeBase; // совместимость
    window.updateFileInputDisplay = updateFileInputDisplay; // нужен инлайновым onclick "×" у превью файла и support.js

    // Доперевод модалки при смене языка
    document.addEventListener('languageChanged', function () {
        const m = document.getElementById('knowledgeModal');
        if (m && m.classList.contains('active')) openKnowledgeBase();
        renderPhoneDropdown();
    });
})();