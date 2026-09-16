/* ==========================================================
   mobile-hero.js — свайпаемая карусель мобильного хиро на главной.
   Работает только если на странице есть #mhTrack (index.html).
   Свайп — нативный (scroll-snap), скрипт лишь синхронизирует точки
   и добавляет мягкое автолистание, которое останавливается, как
   только пользователь сам взаимодействует с каруселью.
   ========================================================== */
(function () {
    'use strict';

    function init() {
        var track = document.getElementById('mhTrack');
        var dotsWrap = document.getElementById('mhDots');
        if (!track || !dotsWrap) return;

        var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('.mh-dot'));
        var slides = Array.prototype.slice.call(track.children);
        if (!slides.length) return;

        function setActive(index) {
            dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
        }

        function currentIndex() {
            var width = track.clientWidth || 1;
            return Math.round(track.scrollLeft / width);
        }

        var ticking = false;
        track.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                setActive(Math.min(Math.max(currentIndex(), 0), slides.length - 1));
                ticking = false;
            });
        }, { passive: true });

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                userInteracted = true;
                stopAutoplay();
                track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
            });
        });

        var autoplayTimer = null;
        var userInteracted = false;

        function stopAutoplay() {
            if (autoplayTimer) clearInterval(autoplayTimer);
            autoplayTimer = null;
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(function () {
                if (userInteracted) return;
                var next = (currentIndex() + 1) % slides.length;
                track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' });
            }, 5000);
        }

        function stopForGood() {
            userInteracted = true;
            stopAutoplay();
        }
        track.addEventListener('touchstart', stopForGood, { passive: true });
        track.addEventListener('mousedown', stopForGood);
        track.addEventListener('wheel', stopForGood, { passive: true });

        // Пересчёт позиции при повороте экрана / ресайзе
        window.addEventListener('resize', function () {
            track.scrollTo({ left: currentIndex() * track.clientWidth });
        });

        setActive(0);
        startAutoplay();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
