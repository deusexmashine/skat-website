/* ==========================================================
   map.js
   Логика инициализации карты Leaflet с интерактивными маркерами и карточками.
   ========================================================== */

// Глобальная переменная для хранения маркеров
var markerMap = {};

// Основная функция инициализации карты
function initLeafletMap() {
    // Проверяем, загружена ли библиотека Leaflet
    if (typeof L === 'undefined') {
        console.warn('Leaflet ещё не загружен. Повторная попытка через 500мс...');
        setTimeout(initLeafletMap, 500);
        return;
    }

    const mapContainer = document.getElementById('contactMap');
    if (!mapContainer) {
        // Если контейнера нет — ждём его появления через MutationObserver
        const observer = new MutationObserver(function(mutations, obs) {
            const container = document.getElementById('contactMap');
            if (container && container.offsetHeight > 0) {
                obs.disconnect();
                createMap(container);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return;
    }

    if (mapContainer.offsetHeight === 0) {
        // Если контейнер есть, но высота 0 — ждём, пока CSS отрисует высоту
        const observer = new MutationObserver(function(mutations, obs) {
            if (mapContainer.offsetHeight > 0) {
                obs.disconnect();
                createMap(mapContainer);
            }
        });
        observer.observe(mapContainer, { attributes: true, attributeFilter: ['style', 'class'] });
        return;
    }

    // Если всё готово — создаём карту сразу
    createMap(mapContainer);
}

// Функция создания карты и маркеров
function createMap(container) {
    // 1. Инициализация карты с центром на Волгоград (штаб-квартира)
    var map = L.map('contactMap', {
        zoomControl: false
    }).setView([48.781564, 44.549117], 13);

    // Полностью отключаем атрибуцию и флаг
    map.attributionControl.setPrefix('');
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Золотая капля для штаб-квартиры
    var goldIcon = L.divIcon({
        className: 'custom-div-icon',
        html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 48" width="34" height="48"><defs><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs><path fill="#FFB81C" filter="url(#shadow)" d="M17,2 C9.268,2 3,8.268 3,16 C3,23.6 12.6,34.1 17,44.7 C21.4,34.1 31,23.6 31,16 C31,8.268 24.732,2 17,2 Z M17,20 C14.79,20 13,18.21 13,16 C13,13.79 14.79,12 17,12 C19.21,12 21,13.79 21,16 C21,18.21 19.21,20 17,20 Z"/><circle fill="#1C1D26" cx="17" cy="16" r="4.5"/></svg>',
        iconSize: [34, 48],
        iconAnchor: [17, 48],
        popupAnchor: [0, -48]
    });

    // Белая капля для дилеров
    var whiteIcon = L.divIcon({
        className: 'custom-div-icon',
        html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 48" width="34" height="48"><defs><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs><path fill="#FFFFFF" stroke="#000000" stroke-width="0.2" filter="url(#shadow)" d="M17,2 C9.268,2 3,8.268 3,16 C3,23.6 12.6,34.1 17,44.7 C21.4,34.1 31,23.6 31,16 C31,8.268 24.732,2 17,2 Z M17,20 C14.79,20 13,18.21 13,16 C13,13.79 14.79,12 17,12 C19.21,12 21,13.79 21,16 C21,18.21 19.21,20 17,20 Z"/><circle fill="#000000" cx="17" cy="16" r="4.5"/></svg>',
        iconSize: [34, 48],
        iconAnchor: [17, 48],
        popupAnchor: [0, -48]
    });

    // 2. Создаём маркеры и связываем их с карточками
    document.querySelectorAll('.contact-item').forEach(function(item) {
        var lat = parseFloat(item.getAttribute('data-lat'));
        var lng = parseFloat(item.getAttribute('data-lng'));
        var name = item.getAttribute('data-name');
        var id = item.getAttribute('data-id') || name;

        var icon = (name === 'Headquarters') ? goldIcon : whiteIcon;
        var marker = L.marker([lat, lng], {icon: icon}).addTo(map);
        marker.bindPopup('<b>' + name + '</b>');

        // Сохраняем связь: маркер -> карточка
        markerMap[id] = {
            marker: marker,
            element: item
        };

        // 3. Событие: клик по маркеру -> центровка и подсветка карточки
        marker.on('click', function() {
            // Сбрасываем активный класс у всех карточек
            document.querySelectorAll('.contact-item').forEach(el => el.classList.remove('active-card'));
            // Подсвечиваем текущую карточку
            item.classList.add('active-card');
            // Прокручиваем к карточке в списке
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });

    // 4. Событие: клик по карточке -> центровка на маркер
    document.querySelectorAll('.contact-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
            // Игнорируем клик по кнопке "Contact"
            if (e.target.closest('.btn-outline-dark')) return;

            var lat = parseFloat(item.getAttribute('data-lat'));
            var lng = parseFloat(item.getAttribute('data-lng'));
            var id = item.getAttribute('data-id') || item.getAttribute('data-name');

            // Центрируем карту на маркере
            map.setView([lat, lng], 15, { animate: true });

            // Открываем попап маркера
            if (markerMap[id]) {
                markerMap[id].marker.openPopup();
            }

            // Сбрасываем активный класс у всех карточек и подсвечиваем текущую
            document.querySelectorAll('.contact-item').forEach(el => el.classList.remove('active-card'));
            item.classList.add('active-card');
        });
    });

    // Функция фильтрации (с учетом активной карточки)
    window.filterLocations = function() {
        var input = document.getElementById('searchInput');
        var filter = input.value.toLowerCase();
        var list = document.getElementById('contactList');
        var items = list.getElementsByClassName('contact-item');
        var firstVisible = null;

        for (i = 0; i < items.length; i++) {
            var txtValue = items[i].textContent || items[i].innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                items[i].style.display = "";
                if (!firstVisible) firstVisible = items[i];
            } else {
                items[i].style.display = "none";
                items[i].classList.remove('active-card');
            }
        }

        // Если есть видимая карточка и она не одна, центрируем карту на ней
        if (firstVisible && document.querySelectorAll('.contact-item[style*="display: block;"]').length > 0) {
            var lat = parseFloat(firstVisible.getAttribute('data-lat'));
            var lng = parseFloat(firstVisible.getAttribute('data-lng'));
            map.setView([lat, lng], 13, { animate: true });
        }
    };
}