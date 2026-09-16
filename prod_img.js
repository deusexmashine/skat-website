/* ==========================================================
   prod_img.js — Логика галереи изображений и лайтбокса
   ========================================================== */

let imagePaths = [];
let currentLightboxIndex = 0;

/* ===== Инициализация галереи изображений ===== */
function initProductGallery(productKey) {
    if (SKAT_ASSETS && SKAT_ASSETS.images && SKAT_ASSETS.images[productKey]) {
        imagePaths = SKAT_ASSETS.images[productKey];
    } else {
        console.error('Ошибка: ключ продукта "' + productKey + '" не найден в SKAT_ASSETS.images.');
        imagePaths = ['images/placeholder.png'];
    }
    currentLightboxIndex = 0;
    updateLightboxCounter();
    updateMainCaption(0);
    
    // Делаем первое изображение видимым
    const container = document.querySelector('.carousel-main');
    if (container) {
        const firstImg = container.querySelector('img#mainImage');
        if (firstImg) firstImg.classList.add('active');
    }
}

/* ===== Плавное замещение изображений (cross-fade) ===== */
function changeImage(src, btn) {
    const container = document.querySelector('.carousel-main');
    if (!container) return;

    const currentImg = container.querySelector('img.active');
    if (currentImg && currentImg.src.includes(src.split('/').pop())) return;

    // Убираем active у старого и принудительно ставим opacity: 0
    if (currentImg) {
        currentImg.classList.remove('active');
        currentImg.style.opacity = '0';
        currentImg.style.zIndex = '1';
    }

    // Создаём новое изображение
    const newImg = document.createElement('img');
    newImg.src = src;
    newImg.alt = 'Product Image';
    newImg.style.opacity = '0';
    newImg.style.transition = 'none';
    newImg.style.zIndex = '1';
    container.appendChild(newImg);

    void newImg.offsetWidth; // Принудительный reflow

    newImg.style.transition = 'opacity 2.5s ease-in-out';
    newImg.style.opacity = '1';
    newImg.style.zIndex = '2';
    newImg.classList.add('active');

    // Синхронизация лайтбокса
    const lightboxImg = document.querySelector('#img-main .lightbox-content');
    if (lightboxImg) lightboxImg.src = src;

    // Обновляем миниатюры
    document.querySelectorAll('.carousel-thumbnails button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Обновляем индекс и подпись
    currentLightboxIndex = imagePaths.indexOf(src);
    updateLightboxCounter();
    updateMainCaption(currentLightboxIndex);

    // Удаляем невидимые изображения через 2.55 с
    setTimeout(() => {
        const allImages = container.querySelectorAll('img');
        allImages.forEach(img => {
            if (img.style.opacity === '0') {
                img.remove();
            }
        });
    }, 2550);
}

/* ===== Навигация в лайтбоксе ===== */
function lightboxNav(event, direction) {
    event.preventDefault();
    let newIndex = currentLightboxIndex + direction;
    if (newIndex < 0) newIndex = imagePaths.length - 1;
    if (newIndex >= imagePaths.length) newIndex = 0;
    
    const newSrc = imagePaths[newIndex];
    const lightboxImg = document.querySelector('#img-main .lightbox-content');
    if (lightboxImg) lightboxImg.src = newSrc;
    
    const container = document.querySelector('.carousel-main');
    const currentImg = container.querySelector('img.active');
    const buttons = document.querySelectorAll('.carousel-thumbnails button');
    
    if (!currentImg || !currentImg.src.includes(newSrc.split('/').pop())) {
        const targetBtn = buttons[newIndex];
        if (targetBtn) {
            changeImage(newSrc, targetBtn);
        }
    } else {
        buttons.forEach((b, index) => {
            if (index === newIndex) b.classList.add('active');
            else b.classList.remove('active');
        });
    }
    
    currentLightboxIndex = newIndex;
    updateLightboxCounter();
    updateMainCaption(currentLightboxIndex);
}

/* ===== Обновление подписи ===== */
function updateMainCaption(index) {
    const captionEl = document.getElementById('mainCaption');
    if (!captionEl) return;
    
    let productKey = '';
    const path = window.location.pathname;
    const match = path.match(/product-(\w+)\.html/);
    if (match) productKey = match[1];
    
    const captions = SKAT_ASSETS?.captions?.[productKey];
    if (captions && captions[index]) {
        captionEl.textContent = captions[index];
        captionEl.style.display = 'block';
    } else {
        captionEl.style.display = 'none';
    }
}

/* ===== Обновление подписи при смене языка =====
   ИСПРАВЛЕНО: раньше SKAT_ASSETS.captions брался только из EN/RU-версии
   assets.js, теперь lang.js подмешивает переводы текущего языка — но
   подпись под фото нужно перерисовать и при переключении языка без
   перезагрузки страницы (см. также prod_vid.js). */
document.addEventListener('languageChanged', function() {
    if (!imagePaths || !imagePaths.length) return;
    updateMainCaption(currentLightboxIndex);
});

/* ===== Счётчик лайтбокса ===== */
function updateLightboxCounter() {
    const counter = document.getElementById('lightboxCounter');
    if (counter) counter.textContent = (currentLightboxIndex + 1) + ' / ' + imagePaths.length;
}

/* ===== Открытие/закрытие лайтбокса ===== */
function toggleLightboxState(isOpen) {
    const body = document.body;
    const header = document.querySelector('header');
    if (isOpen) {
        body.classList.add('lightbox-active');
        if (header) header.style.display = 'none';
    } else {
        body.classList.remove('lightbox-active');
        if (header) header.style.display = 'flex';
    }
}

/* ===== Обработчик клика по главному фото для открытия лайтбокса ===== */
document.addEventListener('DOMContentLoaded', function() {
    const galleryMain = document.querySelector('.gallery-main');
    if (galleryMain) {
        galleryMain.addEventListener('click', function(e) {
            if (e.target.closest('img') || e.target === this) {
                window.location.hash = 'img-main';
            }
        });
    }
});

/* ===== Обработчик изменения хеша для открытия/закрытия лайтбокса ===== */
window.addEventListener('hashchange', function() {
    if (window.location.hash === '#img-main') {
        toggleLightboxState(true);
    } else {
        toggleLightboxState(false);
    }
});

/* ===== Обработчик клика по крестику и фону лайтбокса ===== */
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('img-main');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.hash = '';
                toggleLightboxState(false);
            });
        }
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                window.location.hash = '';
                toggleLightboxState(false);
            }
        });
    }
});

/* ===== Обработчик клавиши Escape для закрытия лайтбокса ===== */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (window.location.hash === '#img-main') {
            window.location.hash = '';
            toggleLightboxState(false);
        }
    }
});