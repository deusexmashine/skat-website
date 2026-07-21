/* ==========================================================
   БИБЛИОТЕКА РЕСУРСОВ (assets.js)
   Все пути к картинкам, видео и иконкам в одном месте.
   ========================================================== */

const SKAT_ASSETS = {
    // ===== ИЗОБРАЖЕНИЯ ДЛЯ ПРОДУКТОВ (Галереи) =====
    images: {
        'avn70': ['images/avn70-1.png', 'images/avn70-2.png', 'images/avn70-3.png'],
        'ik100': ['images/ik100-1.png', 'images/ik100-2.png', 'images/ik100-3.png'],
        'kvc-b': ['images/kvc-b-1.png', 'images/kvc-b-2.png', 'images/kvc-b-3.png'],
        'kvc-c': ['images/kvc-c-1.png', 'images/kvc-c-2.png', 'images/kvc-c-3.png'],
        'm100v': ['images/m100v-1.png', 'images/m100v-2.png', 'images/m100v-3.png'],
        'stend50': ['images/stend50-1.png', 'images/stend50-2.png', 'images/stend50-3.png'],
        'svs': ['images/svs-1.png', 'images/svs-2.png', 'images/svs-3.png'],
        'tangens': ['images/tangens-1.png', 'images/tangens-2.png', 'images/tangens-3.png'],
        'ubsvn': ['images/ubsvn-1.png', 'images/ubsvn-2.png', 'images/ubsvn-3.png'],
        '70c': ['images/70c-1.png', 'images/70c-2.png', 'images/70c-3.png'],
        '70m': ['images/70m-1.png', 'images/70m-2.png', 'images/70m-3.png'],
        '70p': ['images/70p-1.png', 'images/70p-2.png', 'images/70p-3.png']
    },

    // ===== ПОСТЕРЫ ДЛЯ ВИДЕО (Главное видео и превью) =====
    posters: {
        'avn70': {
            main: 'images/avn70-main-poster.jpg',
            thumbs: ['images/avn70-thumb1.jpg', 'images/avn70-thumb2.jpg', 'images/avn70-thumb3.jpg']
        },
        'ik100': {
            main: 'images/ik100-main-poster.jpg',
            thumbs: ['images/ik100-thumb1.jpg', 'images/ik100-thumb2.jpg', 'images/ik100-thumb3.jpg']
        },
        'kvc-b': {
            main: 'images/kvc-b-main-poster.jpg',
            thumbs: ['images/kvc-b-thumb1.jpg', 'images/kvc-b-thumb2.jpg', 'images/kvc-b-thumb3.jpg']
        },
        'kvc-c': {
            main: 'images/kvc-c-main-poster.jpg',
            thumbs: ['images/kvc-c-thumb1.jpg', 'images/kvc-c-thumb2.jpg', 'images/kvc-c-thumb3.jpg']
        },
        'm100v': {
            main: 'images/m100v-main-poster.jpg',
            thumbs: ['images/m100v-thumb1.jpg', 'images/m100v-thumb2.jpg', 'images/m100v-thumb3.jpg']
        },
        'stend50': {
            main: 'images/stend50-main-poster.jpg',
            thumbs: ['images/stend50-thumb1.jpg', 'images/stend50-thumb2.jpg', 'images/stend50-thumb3.jpg']
        },
        'svs': {
            main: 'images/svs-main-poster.jpg',
            thumbs: ['images/svs-thumb1.jpg', 'images/svs-thumb2.jpg', 'images/svs-thumb3.jpg']
        },
        'tangens': {
            main: 'images/tangens-main-poster.jpg',
            thumbs: ['images/tangens-thumb1.jpg', 'images/tangens-thumb2.jpg', 'images/tangens-thumb3.jpg', 'images/tangens-thumb4.jpg']
        },
        'ubsvn': {
            main: 'images/ubsvn-main-poster.jpg',
            thumbs: ['images/ubsvn-thumb1.jpg', 'images/ubsvn-thumb2.jpg', 'images/ubsvn-thumb3.jpg']
        },
        '70c': {
            main: 'images/70c-main-poster.jpg',
            thumbs: ['images/70c-thumb1.jpg', 'images/70c-thumb2.jpg', 'images/70c-thumb3.jpg']
        },
        '70m': {
            main: 'images/70m-main-poster.jpg',
            thumbs: ['images/70m-thumb1.jpg', 'images/70m-thumb2.jpg', 'images/70m-thumb3.jpg']
        },
        '70p': {
            main: 'images/70p-main-poster.jpg',
            thumbs: ['images/70p-thumb1.jpg', 'images/70p-thumb2.jpg', 'images/70p-thumb3.jpg']
        }
    },

    // ===== ВИДЕОФАЙЛЫ (Главные и дополнительные) =====
    videos: {
        'avn70': {
            main: 'video/avn70-main.mp4',
            extras: ['video/avn70-extra-1.mp4', 'video/avn70-extra-2.mp4']
        },
        'ik100': {
            main: 'video/ik100-main.mp4',
            extras: ['video/ik100-extra-1.mp4', 'video/ik100-extra-2.mp4']
        },
        'kvc-b': {
            main: 'video/kvc-b-main.mp4',
            extras: ['video/kvc-b-extra-1.mp4', 'video/kvc-b-extra-2.mp4']
        },
        'kvc-c': {
            main: 'video/kvc-c-main.mp4',
            extras: ['video/kvc-c-extra-1.mp4', 'video/kvc-c-extra-2.mp4']
        },
        'm100v': {
            main: 'video/m100v-main.mp4',
            extras: ['video/m100v-extra-1.mp4', 'video/m100v-extra-2.mp4']
        },
        'stend50': {
            main: 'video/stend50-main.mp4',
            extras: ['video/stend50-extra-1.mp4', 'video/stend50-extra-2.mp4']
        },
        'svs': {
            main: 'video/svs-main.mp4',
            extras: ['video/svs-extra-1.mp4', 'video/svs-extra-2.mp4']
        },
        'tangens': {
            main: 'video/tangens-main.mp4',
            extras: ['video/tangens-extra-1.mp4', 'video/tangens-extra-2.mp4', 'video/tangens-extra-3.mp4']
        },
        'ubsvn': {
            main: 'video/ubsvn-main.mp4',
            extras: ['video/ubsvn-extra-1.mp4', 'video/ubsvn-extra-2.mp4']
        },
        '70c': {
            main: 'video/70c-main.mp4',
            extras: ['video/70c-extra-1.mp4', 'video/70c-extra-2.mp4']
        },
        '70m': {
            main: 'video/70m-main.mp4',
            extras: ['video/70m-extra-1.mp4', 'video/70m-extra-2.mp4']
        },
        '70p': {
            main: 'video/70p-main.mp4',
            extras: ['video/70p-extra-1.mp4', 'video/70p-extra-2.mp4']
        }
    },

    // ===== ИКОНКИ ДЛЯ МЕГА-МЕНЮ =====
    icons: {
        'dielectric': 'icons/flask.png',
        'acdc': 'icons/damaged-wire.png',
        'stationary': 'icons/ppe.png',
        'precision': 'icons/KVC.png',
        'calibration': 'icons/AVN.png',
        'stand': 'icons/rod.png'
    }
};
/* ==========================================================
   БИБЛИОТЕКА РЕСУРСОВ (assets.js) — ДОБАВЛЕНИЕ КАТЕГОРИЙ
   ========================================================== */

// ===== ФОНОВЫЕ ИЗОБРАЖЕНИЯ ДЛЯ СТРАНИЦ КАТЕГОРИЙ =====
const categoryImages = {
    'dielectric': 'images/category-dielectric-bg.jpg',
    'acdc': 'images/category-acdc-bg.jpg',
    'stationary': 'images/category-stationary-bg.jpg',
    'precision': 'images/category-precision-bg.jpg',
    'calibration': 'images/category-calibration-bg.jpg'
};
