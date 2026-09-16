// ==========================================================
// prod_vid.js — видеогалерея: канвас + автокалибровка + КАСТОМНЫЙ ПЛЕЕР
// ИСПРАВЛЕНО: перемотка, тайм-бар, синхронизация UI
// ==========================================================

let videoSoundEnabled = false;
const orientationCache = {};
let trueDims = null;

// Калибровка
let calibDone = false;
let calibFactor = 1;
let calibAttempts = 0;
let calibLast = 0;

let mainVideoRef = null;
let renderCanvasRef = null;
let renderCtxRef = null;
let rafId = 0;
let currentVideoProductKey = null;

const SKAT_VIDEO_ORIENTATION = {
    'tangens': ['auto', 'auto', 'auto', 'auto']
};

// ===== Кастомный плеер =====
function initCustomPlayer(video, container) {
    if (container.querySelector('.video-controls-overlay')) return;

    // Удаляем внешнюю кнопку звука, чтобы не дублировать
    const externalAudioControl = container.querySelector('.video-audio-control');
    if (externalAudioControl) externalAudioControl.remove();

    const overlay = document.createElement('div');
    overlay.className = 'video-controls-overlay';

    // Кнопки
    const rewBtn = document.createElement('button');
    rewBtn.innerHTML = '<i class="fa-solid fa-backward-step"></i>';
    
    const playBtn = document.createElement('button');
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    
    const fwdBtn = document.createElement('button');
    fwdBtn.innerHTML = '<i class="fa-solid fa-forward-step"></i>';
    
    const muteBtn = document.createElement('button');
    muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';

    // Прогресс-бар
    const progressWrap = document.createElement('div');
    progressWrap.className = 'progress-bar';
    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    progressWrap.appendChild(progressFill);

    // Время
    const timeDisplay = document.createElement('span');
    timeDisplay.className = 'time-display';
    timeDisplay.textContent = '0:00 / 0:00';

    overlay.append(rewBtn, playBtn, muteBtn, fwdBtn, progressWrap, timeDisplay);
    container.appendChild(overlay);

    // --- ЛОГИКА ---

    function updateUI() {
        // Play/Pause иконка
        const icon = playBtn.querySelector('i');
        icon.className = video.paused ? 'fa-solid fa-play' : 'fa-solid fa-pause';

        // Прогресс
        const dur = video.duration || 0;
        const cur = video.currentTime || 0;
        const pct = dur ? (cur / dur * 100) : 0;
        progressFill.style.width = pct + '%';

        // Время
        const fmt = (s) => {
            const m = Math.floor(s / 60);
            const sec = Math.floor(s % 60);
            return m + ':' + (sec < 10 ? '0' : '') + sec;
        };
        timeDisplay.textContent = fmt(cur) + ' / ' + fmt(dur);

        // Звук
        const muteIcon = muteBtn.querySelector('i');
        muteIcon.className = video.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    }

    // Слушатели видео
    video.addEventListener('timeupdate', updateUI);
    video.addEventListener('loadedmetadata', updateUI);
    video.addEventListener('play', updateUI);
    video.addEventListener('pause', updateUI);
    video.addEventListener('seeked', updateUI);
    // Play/Pause
    playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (video.paused) video.play().catch(() => {});
        else video.pause();
    });

    // Перемотка -10
    rewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (video.duration) {
            video.currentTime = Math.max(0, video.currentTime - 10);
            updateUI(); // Принудительно обновляем UI сразу
        }
    });

    // Перемотка +10
    fwdBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (video.duration) {
            video.currentTime = Math.min(video.duration, video.currentTime + 10);
            updateUI(); // Принудительно обновляем UI сразу
        }
    });

    // Звук
    muteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        video.muted = !video.muted;
        videoSoundEnabled = !video.muted;
        updateUI();
    });

    // Клик по прогресс-бару
    progressWrap.addEventListener('click', (e) => {
        e.preventDefault();
        if (!video.duration) return;
        const rect = progressWrap.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
        updateUI(); // Принудительно обновляем UI сразу
    });

    // Показ/скрытие контролов
    let hideTimeout;
    function showControls() {
        overlay.classList.add('active');
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => overlay.classList.remove('active'), 3000);
    }

    container.addEventListener('mousemove', showControls);
    container.addEventListener('touchstart', showControls);
    overlay.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        overlay.classList.add('active');
    });
    overlay.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(() => overlay.classList.remove('active'), 1000);
    });

    setTimeout(showControls, 500);
}

// ===== Инициализация =====
function initVideoGallery(productKey) {
    currentVideoProductKey = productKey;

    const wrapper = document.querySelector('.video-gallery-wrapper');
    if (!wrapper) return;
    if (wrapper.dataset.vgInit) return;
    wrapper.dataset.vgInit = '1';

    const mainVideo    = document.getElementById('mainProductVideo');
    const playlist     = document.getElementById('videoPlaylist');
    const titleEl      = document.getElementById('currentVideoTitle');
    const descEl       = document.getElementById('currentVideoDesc');
    
    if (!mainVideo || !playlist) return;
    mainVideoRef = mainVideo;

    const container = getContainer(mainVideo);

    // Канвас
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;background:#000;z-index:1;pointer-events:none;';
    container.insertBefore(canvas, mainVideo);
    renderCanvasRef = canvas;
    renderCtxRef = canvas.getContext('2d', { willReadFrequently: true });

    // Скрытое видео
    mainVideo.style.cssText = 'position:absolute;top:0;left:0;width:2px;height:2px;opacity:0;pointer-events:none;';

    const videos       = window.SKAT_ASSETS.videos[productKey];
    const posters      = window.SKAT_ASSETS.posters[productKey];
    const metadata     = window.SKAT_VIDEO_METADATA[productKey] || [];
    const orientations = SKAT_VIDEO_ORIENTATION[productKey] || [];
    if (!videos) return;

    const allVideos  = [videos.main, ...(videos.extras || [])];
    const allPosters = [posters.main, ...(posters.thumbs || [])];
    while (allPosters.length < allVideos.length) allPosters.push('');

    // Плейлист
    playlist.innerHTML = '';
    allVideos.forEach((src, index) => {
        const meta = metadata[index] || { title: 'Видео ' + (index + 1), desc: '' };
        const poster = allPosters[index] || '';
        const orientation = orientations[index] || 'auto';

        const item = document.createElement('div');
        item.className = 'playlist-item' + (index === 0 ? ' active' : '');
        item.setAttribute('data-video-src', src);
        item.setAttribute('data-title', meta.title);
        item.setAttribute('data-desc', meta.desc);
        item.setAttribute('data-poster', poster);
        item.setAttribute('data-vertical', orientation);

        const imgSrc = poster || 'images/placeholder-video-thumb.webp';
        item.innerHTML = `
            <div class="playlist-thumb">
                <img src="${imgSrc}" alt="${meta.title}">
                <span class="play-icon-overlay">▶</span>
            </div>
            <div class="playlist-meta">
                <span class="playlist-title">${meta.title}</span>
            </div>
        `;

        const img = item.querySelector('img');
        img.addEventListener('error', function onErr() {
            img.removeEventListener('error', onErr);
            img.src = 'images/placeholder-video-thumb.webp';
        });

        playlist.appendChild(item);
    });

    enforceCriticalStyles(container);
    probePlaylistOrientations(allVideos, playlist);

    let currentItem = playlist.querySelector('.playlist-item.active');

    mainVideo.addEventListener('loadedmetadata', function () {
        hideSpinner(mainVideo);
        if (!currentItem) return;
        const forced = currentItem.getAttribute('data-vertical');
        applyPreliminaryOrientation(mainVideo, currentItem, forced);
        refineOrientationOnFrame(mainVideo, currentItem, forced);
        attemptPlay(mainVideo);
    });

    mainVideo.addEventListener('loadeddata', function () {
        trueDims = null;
        if (window.createImageBitmap) {
            createImageBitmap(mainVideo).then(function (bmp) {
                trueDims = { w: bmp.width, h: bmp.height };
                bmp.close();
            }).catch(function () {
                trueDims = { w: mainVideo.videoWidth || 16, h: mainVideo.videoHeight || 9 };
            });
        } else {
            trueDims = { w: mainVideo.videoWidth || 16, h: mainVideo.videoHeight || 9 };
        }
    });

    mainVideo.addEventListener('error', function () {
        console.warn('Ошибка загрузки видео:', mainVideo.src);
        hideSpinner(mainVideo);
        const c = getContainer(mainVideo);
        if (c && !c.querySelector('.video-fallback')) {
            const f = document.createElement('div');
            f.className = 'video-fallback';
            // ИСПРАВЛЕНО: раньше текст был захардкожен по-русски и показывался
            // даже на страницах на других языках. Теперь берём перевод из
            // словаря текущего языка (window.SKAT_DICT, см. lang.js).
            f.textContent = (window.SKAT_DICT && window.SKAT_DICT.video_unavailable) || 'Video unavailable';
            c.appendChild(f);
        }
    });

    startRenderLoop();

    const firstItem = playlist.querySelector('.playlist-item.active');
    if (firstItem) {
        currentItem = firstItem;
        loadVideo(firstItem, mainVideo, titleEl, descEl);
    }

    playlist.addEventListener('click', function (e) {
        const item = e.target.closest('.playlist-item');
        if (!item) return;
        playlist.querySelectorAll('.playlist-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        currentItem = item;
        loadVideo(item, mainVideo, titleEl, descEl);
        if (window.innerWidth < 900) {
            mainVideo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Инициализируем кастомный плеер
    initCustomPlayer(mainVideo, container);
}

// ===== Обновление подписей плейлиста при смене языка =====
// ИСПРАВЛЕНО: раньше заголовки/описания видео (title/desc) заполнялись один
// раз при инициализации и не обновлялись при переключении языка без
// перезагрузки страницы (SPA-переключение через switchLang()). Теперь при
// каждом событии languageChanged перечитываем window.SKAT_VIDEO_METADATA
// (собирается заново в lang.js под текущий язык) и обновляем DOM.
document.addEventListener('languageChanged', function () {
    if (!currentVideoProductKey) return;
    const metadata = (window.SKAT_VIDEO_METADATA && window.SKAT_VIDEO_METADATA[currentVideoProductKey]) || [];
    const playlist = document.getElementById('videoPlaylist');
    if (!playlist) return;

    const items = playlist.querySelectorAll('.playlist-item');
    items.forEach(function (item, index) {
        const meta = metadata[index];
        if (!meta) return;
        item.setAttribute('data-title', meta.title);
        item.setAttribute('data-desc', meta.desc);
        const titleSpan = item.querySelector('.playlist-title');
        if (titleSpan) titleSpan.textContent = meta.title;
        const img = item.querySelector('img');
        if (img) img.alt = meta.title;
    });

    const activeItem = playlist.querySelector('.playlist-item.active');
    if (activeItem) {
        const titleEl = document.getElementById('currentVideoTitle');
        const descEl = document.getElementById('currentVideoDesc');
        if (titleEl) titleEl.textContent = activeItem.getAttribute('data-title');
        if (descEl) descEl.textContent = activeItem.getAttribute('data-desc');
    }
});

function enforceCriticalStyles(container) {
    if (!container) return;
    container.style.position = 'relative';
    container.style.background = '#000';
    container.style.borderRadius = '8px';
    container.style.overflow = 'hidden';
}

function startRenderLoop() {
    if (rafId) return;
    const step = function () {
        rafId = requestAnimationFrame(step);
        drawFrame();
    };
    rafId = requestAnimationFrame(step);
}

function drawFrame() {
    const video  = mainVideoRef;
    const canvas = renderCanvasRef;
    const ctx    = renderCtxRef;
    if (!video || !canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;

    const dpr = window.devicePixelRatio || 1;
    const W = Math.max(2, Math.round(rect.width * dpr));
    const H = Math.max(2, Math.round(rect.height * dpr));
    if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
    }

    if (video.readyState < 2) return;

    const tw = (trueDims && trueDims.w) || video.videoWidth || 16;
    const th = (trueDims && trueDims.h) || video.videoHeight || 9;
    const scale = Math.min(W / tw, H / th) * calibFactor;
    const dw = tw * scale;
    const dh = th * scale;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    try {
        ctx.drawImage(video, (W - dw) / 2, (H - dh) / 2, dw, dh);
    } catch (e) {}

    // Автокалибровка
    if (!calibDone) {
        const now = performance.now();
        if (now - calibLast > 400 && calibAttempts < 8) {
            calibLast = now;
            calibAttempts++;
            const bb = measureContentBB(ctx, W, H);
            if (bb && bb.w > W * 0.08 && bb.h > H * 0.08) {
                const f = Math.min(W / bb.w, H / bb.h);
                calibFactor = (f > 1.03 && f < 5) ? f : 1;
                calibDone = true;
            } else if (calibAttempts >= 8) {
                calibFactor = 1;
                calibDone = true;
            }
        }
    }
}

function measureContentBB(ctx, W, H) {
    let data;
    try { data = ctx.getImageData(0, 0, W, H).data; } catch (e) { return null; }
    const stride = 4;
    let minX = W, maxX = -1, minY = H, maxY = -1;
    for (let y = 0; y < H; y += stride) {
        const row = y * W * 4;
        for (let x = 0; x < W; x += stride) {
            const i = row + x * 4;
            if ((data[i] + data[i + 1] + data[i + 2]) > 72) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }
    if (maxX < 0) return null;
    return { w: maxX - minX + 1, h: maxY - minY + 1 };
}

function probePlaylistOrientations(allVideos, playlist) {
    allVideos.forEach(function (src, index) {
        if (orientationCache[src] !== undefined) {
            applyThumbOrientation(playlist, index, orientationCache[src]);
            return;
        }
        const probe = document.createElement('video');
        probe.preload = 'auto';
        probe.muted = true;
        probe.playsInline = true;
        let done = false;

        const finish = function (vert) {
            if (done) return;
            done = true;
            orientationCache[src] = vert;
            applyThumbOrientation(playlist, index, vert);
            probe.pause();
            probe.removeAttribute('src');
            probe.load();
        };

        if (probe.requestVideoFrameCallback && window.createImageBitmap) {
            probe.requestVideoFrameCallback(function () {
                createImageBitmap(probe).then(function (bmp) {
                    const vert = bmp.height > bmp.width;
                    bmp.close();
                    finish(vert);
                }).catch(function () {
                    finish(probe.videoHeight > probe.videoWidth);
                });
            });
            setTimeout(function () {
                finish(probe.videoHeight > probe.videoWidth);
            }, 2000);
        } else {
            probe.addEventListener('loadedmetadata', function () {
                finish(probe.videoHeight > probe.videoWidth);
            }, { once: true });
        }

        probe.src = src;
        probe.play().catch(function () {});
    });
}

function applyThumbOrientation(playlist, index, isVertical) {
    const item = playlist.children[index];
    if (!item) return;
    const thumb = item.querySelector('.playlist-thumb');
    if (thumb) thumb.classList.toggle('is-vertical', isVertical);
}

function loadVideo(item, mainVideo, titleEl, descEl) {
    const src    = item.getAttribute('data-video-src');
    const poster = item.getAttribute('data-poster');
    const title  = item.getAttribute('data-title');
    const desc   = item.getAttribute('data-desc');

    const container = getContainer(mainVideo);
    resetContainer(container);

    calibDone = false;
    calibFactor = 1;
    calibAttempts = 0;
    calibLast = 0;

    mainVideo.src = src;
    if (poster) mainVideo.poster = poster;
    if (titleEl) titleEl.textContent = title;
    if (descEl)  descEl.textContent  = desc;

    mainVideo.muted = !videoSoundEnabled;

    const forced = item.getAttribute('data-vertical');
    if (forced === 'v') applyOrientationStyles(container, item, true);
    if (forced === 'h') applyOrientationStyles(container, item, false);

    mainVideo.load();
}

function resetContainer(container) {
    if (!container) return;
    container.classList.remove('is-vertical', 'is-horizontal', 'loaded');
    container.style.width = '';
    container.style.maxWidth = '';
    container.style.height = '';
    container.style.maxHeight = '';
    container.style.aspectRatio = '';
    container.style.minHeight = '';
    const fallback = container.querySelector('.video-fallback');
    if (fallback) fallback.remove();
}

function getContainer(video) {
    return video.closest('.video-player-container') || video.parentElement;
}

function hideSpinner(video) {
    const c = getContainer(video);
    if (c) c.classList.add('loaded');
}

function applyPreliminaryOrientation(video, item, forced) {
    if (forced === 'v' || forced === 'h') return;
    const container = getContainer(video);
    if (!container) return;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;
    applyOrientationStyles(container, item, vh > vw);
}

function refineOrientationOnFrame(video, item, forced) {
    if (forced === 'v' || forced === 'h') return;
    const container = getContainer(video);
    if (!container) return;
    if (!video.requestVideoFrameCallback) return;

    video.requestVideoFrameCallback(function (now, frameMeta) {
        if (window.createImageBitmap) {
            createImageBitmap(video).then(function (bmp) {
                const visW = bmp.width;
                const visH = bmp.height;
                const baked = scanBakedBars(bmp, visW, visH);
                bmp.close();
                applyOrientationStyles(container, item, baked !== null ? baked : visH > visW);
            }).catch(function () {
                applyByFrameMeta(video, frameMeta, container, item);
            });
        } else {
            applyByFrameMeta(video, frameMeta, container, item);
        }
    });
}

function applyByFrameMeta(video, frameMeta, container, item) {
    let w = video.videoWidth;
    let h = video.videoHeight;
    if (frameMeta && frameMeta.displayWidth && frameMeta.displayHeight) {
        w = frameMeta.displayWidth;
        h = frameMeta.displayHeight;
    }
    if (!w || !h) return;
    const baked = scanBakedBars(video, w, h);
    applyOrientationStyles(container, item, baked !== null ? baked : h > w);
}

function scanBakedBars(source, visW, visH) {
    const size = 200;
    const canvas = document.createElement('canvas');
    canvas.width  = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const scale = Math.min(size / visW, size / visH);
    const dw = Math.round(visW * scale);
    const dh = Math.round(visH * scale);
    const dx = Math.floor((size - dw) / 2);
    const dy = Math.floor((size - dh) / 2);

    try {
        ctx.drawImage(source, dx, dy, dw, dh);
    } catch (e) {
        return null;
    }

    const threshold = 20;
    const sample    = 10;
    const inset     = 2;
    const x0 = dx + inset, x1 = dx + dw - inset;
    const y0 = dy + inset, y1 = dy + dh - inset;
    const midX = Math.floor((x0 + x1) / 2);
    const midY = Math.floor((y0 + y1) / 2);

    let blackLeft = 0, blackRight = 0, blackTop = 0, blackBottom = 0;
    for (let i = 0; i < sample; i++) {
        if (isBlackPixel(ctx, x0 + i,     midY, threshold)) blackLeft++;
        if (isBlackPixel(ctx, x1 - 1 - i, midY, threshold)) blackRight++;
        if (isBlackPixel(ctx, midX, y0 + i,     threshold)) blackTop++;
        if (isBlackPixel(ctx, midX, y1 - 1 - i, threshold)) blackBottom++;
    }

    const side = blackLeft + blackRight;
    const tb   = blackTop + blackBottom;
    if (Math.abs(side - tb) <= 5) return null;
    return side > tb;
}

function isBlackPixel(ctx, x, y, threshold) {
    const d = ctx.getImageData(x, y, 1, 1).data;
    return ((d[0] + d[1] + d[2]) / 3) < threshold;
}

function applyOrientationStyles(container, item, isVertical) {
    if (!container) return;
    container.classList.remove('is-vertical', 'is-horizontal');
    container.style.width       = '';
    container.style.maxWidth    = '';
    container.style.height      = '';
    container.style.maxHeight   = '';
    container.style.aspectRatio = '';
    container.style.minHeight   = '';

    if (isVertical) {
        container.classList.add('is-vertical');
        container.style.width       = '100%';
        container.style.maxWidth    = 'min(450px, calc(75vh * 9 / 16))';
        container.style.aspectRatio = '9 / 16';
        container.style.height      = 'auto';
        container.style.maxHeight   = '75vh';
    } else {
        container.classList.add('is-horizontal');
        container.style.width       = '100%';
        container.style.maxWidth    = '100%';
        container.style.aspectRatio = '16 / 9';
        container.style.height      = 'auto';
        container.style.maxHeight   = '';
    }

    enforceCriticalStyles(container);
    const idx = Array.prototype.indexOf.call(item.parentElement.children, item);
    if (idx >= 0) applyThumbOrientation(item.parentElement, idx, isVertical);
    requestAnimationFrame(() => { void container.offsetHeight; });
}

function attemptPlay(video) {
    video.play().then(() => {
        hideSpinner(video);
        videoSoundEnabled = !video.muted;
    }).catch(function () {
        video.muted = true;
        videoSoundEnabled = false;
        video.play().catch(function (e) {
            console.warn('Автозапуск даже без звука не удался:', e);
        });
    });
}

// ==========================================================
// Перевод плейлиста при смене языка (без пересборки галереи —
// initVideoGallery() идемпотентен и второй раз не выполнится
// из-за wrapper.dataset.vgInit). Зеркалит подход prod_img.js,
// который просто перечитывает SKAT_ASSETS при каждом рендере.
// ==========================================================
function retranslateVideoGallery(productKey) {
    if (!productKey || !window.SKAT_VIDEO_METADATA) return;
    const metadata = window.SKAT_VIDEO_METADATA[productKey] || [];
    const playlist = document.getElementById('videoPlaylist');
    if (!playlist) return;

    playlist.querySelectorAll('.playlist-item').forEach((item, index) => {
        const meta = metadata[index];
        if (!meta) return;
        item.setAttribute('data-title', meta.title);
        item.setAttribute('data-desc', meta.desc);
        const titleSpan = item.querySelector('.playlist-title');
        if (titleSpan) titleSpan.textContent = meta.title;
        const img = item.querySelector('.playlist-thumb img');
        if (img) img.alt = meta.title;
    });

    // Заголовок/описание активного (сейчас проигрываемого) видео
    const activeItem = playlist.querySelector('.playlist-item.active');
    if (activeItem) {
        const titleEl = document.getElementById('currentVideoTitle');
        const descEl  = document.getElementById('currentVideoDesc');
        if (titleEl) titleEl.textContent = activeItem.getAttribute('data-title') || '';
        if (descEl)  descEl.textContent  = activeItem.getAttribute('data-desc') || '';
    }
}

document.addEventListener('languageChanged', function () {
    retranslateVideoGallery(currentVideoProductKey);
});