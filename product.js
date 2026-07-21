/* ==========================================================
   СКРИПТЫ ДЛЯ СТРАНИЦЫ ПРОДУКТА.
   ========================================================== */

let imagePaths = [];
let currentLightboxIndex = 0;

function initProductGallery(productKey) {
    if (SKAT_ASSETS && SKAT_ASSETS.images && SKAT_ASSETS.images[productKey]) {
        imagePaths = SKAT_ASSETS.images[productKey];
    } else {
        console.error('Ошибка: ключ продукта "' + productKey + '" не найден в SKAT_ASSETS.images.');
        imagePaths = ['images/placeholder.png'];
    }
    currentLightboxIndex = 0;
    updateLightboxCounter();
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('product-page');

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'prod_style.css';
    document.head.appendChild(link);

    // Загружаем шапку
    fetch('prod_head.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            initHeaderScroll();

            // ЛОГИКА ДЛЯ ЯКОРЕЙ (обеспечивает скролл к #products на главной)
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
        .catch(error => console.error('Ошибка загрузки шапки:', error));

    // Загружаем футер
    fetch('prod_foot.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Ошибка загрузки футера:', error));
});

function initHeaderScroll() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ===== КАРУСЕЛЬ И ЛАЙТБОКС ===== */
function changeImage(src, btn) {
    const mainImg = document.getElementById('mainImage');
    mainImg.src = src;
    
    const lightboxImg = document.querySelector('#img-main .lightbox-content');
    if (lightboxImg) lightboxImg.src = src;
    
    document.querySelectorAll('.carousel-thumbnails button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentLightboxIndex = imagePaths.indexOf(src);
    updateLightboxCounter();
}

function lightboxNav(event, direction) {
    event.preventDefault();
    
    let newIndex = currentLightboxIndex + direction;
    if (newIndex < 0) newIndex = imagePaths.length - 1;
    if (newIndex >= imagePaths.length) newIndex = 0;
    
    const newSrc = imagePaths[newIndex];
    
    const mainImg = document.getElementById('mainImage');
    mainImg.src = newSrc;
    
    const lightboxImg = document.querySelector('#img-main .lightbox-content');
    if (lightboxImg) lightboxImg.src = newSrc;
    
    const buttons = document.querySelectorAll('.carousel-thumbnails button');
    buttons.forEach((b, index) => {
        if (index === newIndex) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });
    
    currentLightboxIndex = newIndex;
    updateLightboxCounter();
}

function updateLightboxCounter() {
    const counter = document.getElementById('lightboxCounter');
    if (counter) {
        counter.textContent = `${currentLightboxIndex + 1} / ${imagePaths.length}`;
    }
}

function toggleLightboxState(isOpen) {
    const body = document.body;
    const header = document.querySelector('header');
    if (isOpen) {
        body.classList.add('lightbox-active');
        if(header) header.style.display = 'none';
    } else {
        body.classList.remove('lightbox-active');
        if(header) header.style.display = 'flex';
    }
}

window.addEventListener('hashchange', function() {
    if (window.location.hash === '#img-main') {
        toggleLightboxState(true);
    } else {
        toggleLightboxState(false);
    }
});

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

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-video.active').forEach(m => {
            closeModal(m.id);
        });
        if(window.location.hash === '#img-main') {
            window.location.hash = '';
            toggleLightboxState(false);
        }
    }
});

/* ===== ВИДЕО-ГАЛЕРЕЯ ===== */
document.addEventListener('DOMContentLoaded', function() {
    const mainVideo = document.getElementById('mainVideo');
    const thumbItems = document.querySelectorAll('.thumb-item');

    if (mainVideo && thumbItems.length > 0) {
        thumbItems.forEach(function(thumb) {
            thumb.addEventListener('click', function() {
                thumbItems.forEach(function(item) {
                    item.classList.remove('active');
                });

                this.classList.add('active');

                const videoSrc = this.getAttribute('data-video');
                mainVideo.src = videoSrc;
                mainVideo.load();
                mainVideo.play();
            });
        });
    }
});

/* ===== ВКЛАДКИ (TABS) ===== */
function openTab(evt, tabName) {
    var tabContent = document.getElementsByClassName("tab-pane");
    for (var i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove("active");
    }
    
    var tabLinks = document.getElementsByClassName("product-tabs")[0].getElementsByTagName("button");
    for (var i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }
    
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

/* ===== МОДАЛЬНЫЕ ОКНА ВИДЕО ===== */
function openModal(modalId, videoSrc) {
    const modal = document.getElementById('modal-' + modalId);
    if (modal) {
        modal.classList.add('active');
        const video = modal.querySelector('video');
        if (video) {
            video.src = 'video/' + videoSrc;
            video.load();
            video.play();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const video = modal.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        modal.classList.remove('active');
    }
}

/* ===== АККОРДЕОН ===== */
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
            body.style.maxHeight = body.scrollHeight + "px";
        }
    });
});