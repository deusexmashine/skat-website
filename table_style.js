/* ==========================================================
   table_style.js — Логика рендеринга таблиц характеристик
   Многоязычная версия: загружает данные из locales/specs/{lang}.json
   ========================================================== */

// Глобальная переменная для текущих данных
let currentSpecsData = null;
let currentSpecsLang = 'en';

// Загрузка данных для конкретного языка
async function loadSpecsData(lang) {
    try {
        const response = await fetch(`locales/specs/${lang}.json`);
        if (!response.ok) throw new Error('Failed to load specs');
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки спецификаций:', error);
        return null;
    }
}

// Инициализация таблицы
async function initSpecsTable(containerId, productKey, jsonPath) {
    // Определяем текущий язык
    const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'en';
    currentSpecsLang = currentLang;

    // Загружаем данные для текущего языка
    const data = await loadSpecsData(currentLang);
    if (!data) return;

    // Проверяем наличие данных для продукта
    if (!data[productKey]) {
        console.error('Ошибка: данные для продукта "' + productKey + '" не найдены.');
        document.getElementById(containerId).innerHTML = '<p>Error: No specification data available for this product.</p>';
        return;
    }

    // Сохраняем данные
    currentSpecsData = data[productKey];
    window.__specsData = currentSpecsData;
    window.__containerId = containerId;

    // Рендерим
    renderSpecs(containerId, currentSpecsData);

    // Слушаем смену языка
    document.addEventListener('languageChanged', async function(e) {
        const newLang = e.detail.lang;
        if (newLang === currentSpecsLang) return;

        currentSpecsLang = newLang;
        const newData = await loadSpecsData(newLang);
        if (!newData || !newData[productKey]) return;

        currentSpecsData = newData[productKey];
        window.__specsData = currentSpecsData;
        renderSpecs(containerId, currentSpecsData);
    });

    // Слушаем изменение размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            renderSpecs(containerId, currentSpecsData);
        }, 250);
    });
}

// Основная функция рендеринга
function renderSpecs(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        container.innerHTML = renderCards(data);
    } else {
        container.innerHTML = renderTable(data);
    }
}

// Рендер таблицы
function renderTable(data) {
    const models = data.models;
    const isSingleModel = models.length === 1;

    let html = '<table class="specs-table">';

    html += '<thead>';
    html += '<tr class="model-header">';

    if (isSingleModel) {
        html += '<th style="width: 40%; text-align: left; padding-left: 20px;">Parameter</th>';
        html += '<th style="width: 60%; text-align: center;">' + models[0].name + '</th>';
    } else {
        html += '<th style="width: 30%; text-align: left; padding-left: 20px;">Parameter</th>';
        models.forEach(m => {
            html += '<th style="width: 16%; text-align: center;">' + m.name + '</th>';
        });
    }
    html += '</tr>';
    html += '</thead>';

    html += '<tbody>';
    let rowCount = 0;

    data.groups.forEach(group => {
        const colspan = models.length + 1;
        html += '<tr class="group-header"><th colspan="' + colspan + '" style="text-align: left; padding: 12px 15px; background-color: var(--bg-secondary); border-bottom: 2px solid var(--accent-yellow); font-weight: 700; font-size: 13px; text-transform: uppercase; color: var(--text-light);">' + group.title + '</th></tr>';

        group.parameters.forEach(param => {
            rowCount++;
            const isEven = rowCount % 2 === 0;
            html += '<tr' + (isEven ? ' style="background-color: #fafafa;"' : '') + '>';

            html += '<td><strong>' + param.label + '</strong></td>';

            const shouldMerge = param.merge === true;

            if (shouldMerge && !isSingleModel) {
                html += '<td colspan="' + models.length + '" style="text-align: center;">' + param.values[0] + '</td>';
            } else {
                models.forEach((model, index) => {
                    let val = param.values[index] || '—';
                    let additionalClass = '';
                    let tooltip = '';

                    if (val === '—') {
                        additionalClass = 'value-empty';
                        if (param.notes && param.notes[model.id]) {
                            tooltip = ' title="' + param.notes[model.id] + '"';
                        }
                    }

                    if (isSingleModel) {
                        html += '<td style="text-align: center;' + (additionalClass ? ' class="' + additionalClass + '"' : '') + '"' + tooltip + '>' + val + '</td>';
                    } else {
                        html += '<td' + (additionalClass ? ' class="' + additionalClass + '"' : '') + tooltip + '>' + val + '</td>';
                    }
                });
            }

            html += '</tr>';
        });
    });

    html += '</tbody></table>';
    return html;
}

// Рендер карточек
function renderCards(data) {
    const models = data.models;
    let html = '';

    models.forEach((model, modelIndex) => {
        html += '<div class="specs-card">';
        html += '<h3>' + model.name + '</h3>';

        data.groups.forEach(group => {
            html += '<div class="card-group-title">' + group.title + '</div>';

            group.parameters.forEach(param => {
                let val = param.values[modelIndex] || '—';
                let additionalClass = '';
                let tooltip = '';

                if (val === '—') {
                    additionalClass = 'value-empty';
                    if (param.notes && param.notes[model.id]) {
                        tooltip = ' title="' + param.notes[model.id] + '"';
                    }
                }

                html += '<div class="card-param">';
                html += '<span class="label">' + param.label + '</span>';
                html += '<span class="value' + (additionalClass ? ' ' + additionalClass : '') + '"' + tooltip + '>' + val + '</span>';
                html += '</div>';
            });
        });

        html += '</div>';
    });
    return html;
}