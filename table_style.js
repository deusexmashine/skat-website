/* ==========================================================
   table_style.js
   Логика рендеринга таблицы и карточек технических характеристик.
   Поддерживает единый JSON с выборкой по ключу продукта.
   ========================================================== */

// Функция для загрузки JSON и инициализации
async function initSpecsTable(containerId, productKey, jsonPath) {
    try {
        const response = await fetch(jsonPath);
        const data = await response.json();
        
        // Проверяем, есть ли данные для указанного продукта
        if (!data[productKey]) {
            console.error('Ошибка: данные для продукта "' + productKey + '" не найдены в table_style.json.');
            document.getElementById(containerId).innerHTML = '<p>Error: No specification data available for this product.</p>';
            return;
        }

        // Сохраняем данные в глобальную переменную для доступа из других функций
        window.__specsData = data[productKey];
        window.__containerId = containerId;

        // Выполняем рендеринг
        renderSpecs(containerId, window.__specsData);
        
        // Добавляем слушатель изменения размера окна
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                renderSpecs(containerId, window.__specsData);
            }, 250); // Дебаунс, чтобы не перерисовывать слишком часто
        });
    } catch (error) {
        console.error('Ошибка загрузки данных для таблицы характеристик:', error);
        document.getElementById(containerId).innerHTML = '<p>Error loading specifications data.</p>';
    }
}

// Основная функция, которая выбирает, что рендерить
function renderSpecs(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Проверяем ширину экрана
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // На мобильных — карточки
        container.innerHTML = renderCards(data);
    } else {
        // На десктопе — таблица
        container.innerHTML = renderTable(data);
    }
}

// ===== ГЕНЕРАЦИЯ ТАБЛИЦЫ =====
function renderTable(data) {
    const models = data.models;
    const isSingleModel = models.length === 1; // Проверяем, одна ли модель

    let html = '<table class="specs-table">';
    
    // Заголовок: Имена моделей
    html += '<thead>';
    html += '<tr class="model-header">';
    
    // Название параметра
    if (isSingleModel) {
        // Для одной модели даём больше ширины параметру
        html += `<th style="width: 40%; text-align: left; padding-left: 20px;">Parameter</th>`;
        // Одна колонка для значения, центрированная
        html += `<th style="width: 60%; text-align: center;">${models[0].name}</th>`;
    } else {
        // Для нескольких моделей — стандартная логика
        html += `<th style="width: 30%; text-align: left; padding-left: 20px;">Parameter</th>`;
        models.forEach(m => {
            html += `<th style="width: 16%; text-align: center;">${m.name}</th>`;
        });
    }
    html += '</tr>';
    html += '</thead>';
    
    // Тело таблицы
    html += '<tbody>';
    let rowCount = 0;
    
    data.groups.forEach(group => {
        // Заголовок группы
        const colspan = models.length + 1;
        html += `<tr class="group-header"><th colspan="${colspan}" style="text-align: left; padding: 12px 15px; background-color: var(--bg-secondary); border-bottom: 2px solid var(--accent-yellow); font-weight: 700; font-size: 13px; text-transform: uppercase; color: var(--text-light);">${group.title}</th></tr>`;
        
        group.parameters.forEach(param => {
            rowCount++;
            const isEven = rowCount % 2 === 0;
            html += `<tr${isEven ? ' style="background-color: #fafafa;"' : ''}>`;
            
            // Первая колонка: название параметра
            html += `<td><strong>${param.label}</strong></td>`;
            
            const shouldMerge = param.merge === true;
            
            if (shouldMerge && !isSingleModel) {
                // Только для нескольких моделей, если есть merge
                html += `<td colspan="${models.length}" style="text-align: center;">${param.values[0]}</td>`;
            } else {
                // Выводим значения для каждой модели
                models.forEach((model, index) => {
                    let val = param.values[index] || '—';
                    let additionalClass = '';
                    let tooltip = '';
                    
                    if (val === '—') {
                        additionalClass = 'value-empty';
                        if (param.notes && param.notes[model.id]) {
                            tooltip = ` title="${param.notes[model.id]}"`;
                        }
                    }
                    
                    // ЕСЛИ МОДЕЛЬ ОДНА: центрируем значение относительно всей ширины
                    if (isSingleModel) {
                        html += `<td style="text-align: center;${additionalClass ? ' class="' + additionalClass + '"' : ''}"${tooltip}>${val}</td>`;
                    } else {
                        html += `<td${additionalClass ? ' class="' + additionalClass + '"' : ''}${tooltip}>${val}</td>`;
                    }
                });
            }
            
            html += '</tr>';
        });
    });
    
    html += '</tbody></table>';
    return html;
}

// ===== ГЕНЕРАЦИЯ КАРТОЧЕК =====
function renderCards(data) {
    const models = data.models;
    let html = '';
    
    models.forEach((model, modelIndex) => {
        html += `<div class="specs-card">`;
        html += `<h3>${model.name}</h3>`;
        
        data.groups.forEach(group => {
            html += `<div class="card-group-title">${group.title}</div>`;
            
            group.parameters.forEach(param => {
                let val = param.values[modelIndex] || '—';
                let additionalClass = '';
                let tooltip = '';
                
                if (val === '—') {
                    additionalClass = 'value-empty';
                    if (param.notes && param.notes[model.id]) {
                        tooltip = ` title="${param.notes[model.id]}"`;
                    }
                }
                
                html += `<div class="card-param">
                    <span class="label">${param.label}</span>
                    <span class="value${additionalClass ? ' ' + additionalClass : ''}"${tooltip}>${val}</span>
                </div>`;
            });
        });
        
        html += `</div>`;
    });
    return html;
}