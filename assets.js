/* ==========================================================
   БИБЛИОТЕКА РЕСУРСОВ (assets.js) — Двуязычная версия
   Все пути к картинкам, видео и иконкам в одном месте.
   Явно экспортирует оба объекта в window.
   ========================================================== */

// ==========================================================
// 1. АНГЛИЙСКАЯ ВЕРСИЯ (EN)
// ==========================================================
const SKAT_ASSETS_EN = {
    // ===== ИЗОБРАЖЕНИЯ ДЛЯ ПРОДУКТОВ (Галереи) =====
    images: {
        'avn70': ['images/avn70-1.webp', 'images/avn70-2.webp', 'images/avn70-3.webp'],
        'ik100': ['images/ik100-1.webp', 'images/ik100-2.webp', 'images/ik100-3.webp'],
        'kvc-b': ['images/kvc-b-1.webp', 'images/kvc-b-2.webp', 'images/kvc-b-3.webp'],
        'kvc-c': ['images/kvc-c-1.webp', 'images/kvc-c-2.webp', 'images/kvc-c-3.webp'],
        'm100v': ['images/m100v-1.webp', 'images/m100v-2.webp', 'images/m100v-3.webp'],
        'stend50': ['images/stend50-1.webp', 'images/stend50-2.webp', 'images/stend50-3.webp'],
        'svs': ['images/svs-1.webp', 'images/svs-2.webp', 'images/svs-3.webp'],
        'tangens': ['images/tangens-1.webp', 'images/tangens-2.webp', 'images/tangens-3.webp'],
        'ubsvn': ['images/ubsvn-1.webp', 'images/ubsvn-2.webp', 'images/ubsvn-3.webp'],
        '70c': ['images/70c-1.webp', 'images/70c-2.webp', 'images/70c-3.webp'],
        '70m': ['images/70m-1.webp', 'images/70m-2.webp', 'images/70m-3.webp'],
        '70p': ['images/70p-1.webp', 'images/70p-2.webp', 'images/70p-3.webp']
    },

    // ===== ПОДПИСИ К ИЗОБРАЖЕНИЯМ (для галереи продуктов) =====
    captions: {
        'avn70': [
            'Front view of the SKAT-AVN-70 active high-voltage load cabinet',
            'Internal resistor assembly and wiring detail',
            'Automatic forced-air cooling system and control panel'
        ],
        'ik100': [
            'IK 100-0.4 high-voltage pulse capacitor – general view',
            'Terminal and mounting details',
            'Application setup in a high-voltage impulse generator'
        ],
        'kvc-b': [
            'KVC B-Series digital kilovoltmeter with oil-insulated divider',
            'Indication unit front panel with LCD display',
            'High-voltage divider unit with anti-corona ring'
        ],
        'kvc-c': [
            'KVC C-Series digital kilovoltmeter – air-insulated divider',
            'Indication unit and control interface',
            'High-voltage divider with frequency-compensated design'
        ],
        'm100v': [
            'SKAT-M100V fully automatic oil breakdown tester',
            'Test cell with high-voltage electrodes',
            'Front panel with control interface and thermal printer'
        ],
        'stend50': [
            'SKAT-STEND-50 test stand – full assembly',
            'Dielectric bases and rod clamping detail',
            'Test setup with insulating rod connected'
        ],
        'svs': [
            'SKAT-SVS stationary test bench – control unit and HV blocks',
            'Test bath for dielectric gloves and boots',
            'Control unit front panel with LCD and rotary encoder'
        ],
        'tangens': [
            'SKAT-TANGENS-M liquid dielectric tester – general view',
            'Three-terminal measuring cell and electrode assembly',
            'Touchscreen interface with test results'
        ],
        'ubsvn': [
            'UBSVN-LM safety interlock and audio-visual alarm unit',
            'Internal wiring and connection diagram',
            'Installed above a laboratory door with warning lamp'
        ],
        '70c': [
            'SKAT-70C digital dielectric tester – portable configuration',
            'Control unit with 6" LCD display',
            'High-voltage block with automatic earthing rod'
        ],
        '70m': [
            'SKAT-70M analog dielectric tester – field-ready',
            'Control unit with analog interface',
            'High-voltage block and earthing rod assembly'
        ],
        '70p': [
            'SKAT-70P measuring attachment – control box and test bath',
            'Four-channel leakage current display',
            'Setup for testing dielectric gloves'
        ]
    },

    // ===== ПОСТЕРЫ ДЛЯ ВИДЕО (Главное видео и превью) =====
    posters: {
        'avn70': { main: 'images/avn70-main-poster.webp', thumbs: ['images/avn70-thumb1.webp', 'images/avn70-thumb2.webp'] },
        'ik100': { main: 'images/ik100-main-poster.webp', thumbs: ['images/ik100-thumb1.webp', 'images/ik100-thumb2.webp'] },
        'kvc-b': { main: 'images/kvc-b-main-poster.webp', thumbs: ['images/kvc-b-thumb1.webp', 'images/kvc-b-thumb2.webp'] },
        'kvc-c': { main: 'images/kvc-c-main-poster.webp', thumbs: ['images/kvc-c-thumb1.webp', 'images/kvc-c-thumb2.webp'] },
        'm100v': { main: 'images/m100v-main-poster.webp', thumbs: ['images/m100v-thumb1.webp', 'images/m100v-thumb2.webp'] },
        'stend50': { main: 'images/stend50-main-poster.webp', thumbs: ['images/stend50-thumb1.webp', 'images/stend50-thumb2.webp'] },
        'svs': { main: 'images/svs-main-poster.webp', thumbs: ['images/svs-thumb1.webp', 'images/svs-thumb2.webp'] },
        'tangens': { main: 'images/tangens-main-poster.webp', thumbs: ['images/tangens-thumb1.webp', 'images/tangens-thumb2.webp', 'images/tangens-thumb3.webp'] },
        'ubsvn': { main: 'images/ubsvn-main-poster.webp', thumbs: ['images/ubsvn-thumb1.webp', 'images/ubsvn-thumb2.webp'] },
        '70c': { main: 'images/70c-main-poster.webp', thumbs: ['images/70c-thumb1.webp', 'images/70c-thumb2.webp'] },
        '70m': { main: 'images/70m-main-poster.webp', thumbs: ['images/70m-thumb1.webp', 'images/70m-thumb2.webp'] },
        '70p': { main: 'images/70p-main-poster.webp', thumbs: ['images/70p-thumb1.webp', 'images/70p-thumb2.webp'] }
    },

    // ===== ВИДЕОФАЙЛЫ (Главные и дополнительные) =====
    videos: {
        'avn70': { main: 'video/avn70-main.mp4', extras: ['video/avn70-extra-1.mp4', 'video/avn70-extra-2.mp4'] },
        'ik100': { main: 'video/ik100-main.mp4', extras: ['video/ik100-extra-1.mp4', 'video/ik100-extra-2.mp4'] },
        'kvc-b': { main: 'video/kvc-b-main.mp4', extras: ['video/kvc-b-extra-1.mp4', 'video/kvc-b-extra-2.mp4'] },
        'kvc-c': { main: 'video/kvc-c-main.mp4', extras: ['video/kvc-c-extra-1.mp4', 'video/kvc-c-extra-2.mp4'] },
        'm100v': { main: 'video/m100v-main.mp4', extras: ['video/m100v-extra-1.mp4', 'video/m100v-extra-2.mp4'] },
        'stend50': { main: 'video/stend50-main.mp4', extras: ['video/stend50-extra-1.mp4', 'video/stend50-extra-2.mp4'] },
        'svs': { main: 'video/svs-main.mp4', extras: ['video/svs-extra-1.mp4', 'video/svs-extra-2.mp4'] },
        'tangens': { main: 'video/tangens-main.mp4', extras: ['video/tangens-extra-1.mp4', 'video/tangens-extra-2.mp4', 'video/tangens-extra-3.mp4'] },
        'ubsvn': { main: 'video/ubsvn-main.mp4', extras: ['video/ubsvn-extra-1.mp4', 'video/ubsvn-extra-2.mp4'] },
        '70c': { main: 'video/70c-main.mp4', extras: ['video/70c-extra-1.mp4', 'video/70c-extra-2.mp4'] },
        '70m': { main: 'video/70m-main.mp4', extras: ['video/70m-extra-1.mp4', 'video/70m-extra-2.mp4'] },
        '70p': { main: 'video/70p-main.mp4', extras: ['video/70p-extra-1.mp4', 'video/70p-extra-2.mp4'] }
    },

    // ===== ИКОНКИ ДЛЯ МЕГА-МЕНЮ =====
    icons: {
        'dielectric': 'icons/flask.png',
        'acdc': 'icons/damaged-wire.png',
        'stationary': 'icons/ppe.png',
        'precision': 'icons/KVC.png',
        'calibration': 'icons/AVN.png',
        'stand': 'icons/rod.png'
    },

    // ===== МЕТАДАННЫЕ ДЛЯ ВИДЕО =====
    video_metadata: {
        'tangens': [
            { title: 'SKAT-TANGENS-M: Product Overview', desc: 'A general overview of the instrument’s key features and capabilities.' },
            { title: 'Measurement Process', desc: 'Step-by-step demonstration of a typical tan δ measurement cycle.' },
            { title: 'Setup and Preparation', desc: 'How to prepare the test cell and start a testing sequence.' },
            { title: 'Data Analysis and Export', desc: 'Viewing and exporting test results via the built-in software.' }
        ],
        '70c': [
            { title: 'SKAT-70C: Product Overview', desc: 'Overview of the digital dielectric tester and its core functions.' },
            { title: 'Connecting the Unit', desc: 'Instructions for connecting the high-voltage block to the control unit.' },
            { title: 'Running a Test Sequence', desc: 'Demonstration of an automated test cycle.' }
        ],
        '70m': [
            { title: 'SKAT-70M: Product Overview', desc: 'Robust analog AC/DC tester designed for field and laboratory applications.' },
            { title: 'Setup and Configuration', desc: 'Preparing the unit for a withstand voltage test.' },
            { title: 'Safety Features Overview', desc: 'Automatic earthing, overcurrent protection, and interlock system.' }
        ],
        '70p': [
            { title: 'SKAT-70P: Product Overview', desc: '4-channel leakage current measuring attachment for PPE testing.' },
            { title: 'Testing PPE', desc: 'How to test dielectric gloves and boots using the 4-channel system.' }
        ],
        'avn70': [
            { title: 'SKAT-AVN-70: Product Overview', desc: 'Active high-voltage load bank designed for calibration and verification.' },
            { title: 'Step Selection', desc: 'Selecting resistor combinations to simulate various load conditions.' }
        ],
        'ik100': [
            { title: 'IK 100-0.4: Product Overview', desc: 'High-voltage pulse capacitor for impulse current generators.' },
            { title: 'Applications', desc: 'Usage in impulse voltage and current generators for HV testing.' }
        ],
        'kvc-b': [
            { title: 'KVC B-Series: Product Overview', desc: 'Oil-insulated digital kilovoltmeter for precision AC/DC measurements.' },
            { title: 'PC Connection', desc: 'Using the USB interface for data acquisition and analysis.' }
        ],
        'kvc-c': [
            { title: 'KVC C-Series: Product Overview', desc: 'Class 0.25 precision kilovoltmeter with THD analysis capabilities.' },
            { title: 'VLF Measurement Mode', desc: 'Performing ultra-low frequency measurements for advanced diagnostics.' }
        ],
        'm100v': [
            { title: 'SKAT-M100V: Product Overview', desc: 'Fully automatic oil breakdown tester for transformer oil analysis.' },
            { title: 'Running a Test', desc: 'Demonstration of a complete automatic test sequence.' }
        ],
        'stend50': [
            { title: 'SKAT-STEND-50: Product Overview', desc: 'Test stand for insulating rods and voltage indicators up to 50 kV.' },
            { title: 'Assembly Guide', desc: 'Step-by-step instructions for assembling the test stand.' }
        ],
        'svs': [
            { title: 'SKAT-SVS: Product Overview', desc: 'Stationary high-voltage test bench for cables and PPE.' },
            { title: 'Testing PPE', desc: 'Testing dielectric gloves and boots using the test bath.' }
        ],
        'ubsvn': [
            { title: 'UBSVN-LM: Product Overview', desc: 'Safety interlock and audio-visual alarm for HV laboratories.' },
            { title: 'Wiring Connections', desc: 'Connection diagram for integration with HV test sources.' }
        ]
    },

    // ===== ФОНОВЫЕ ИЗОБРАЖЕНИЯ ДЛЯ СТРАНИЦ КАТЕГОРИЙ =====
    categoryImages: {
        'dielectric': 'images/category-dielectric-bg.webp',
        'acdc': 'images/category-acdc-bg.webp',
        'stationary': 'images/category-stationary-bg.webp',
        'precision': 'images/category-precision-bg.webp',
        'calibration': 'images/category-calibration-bg.webp'
    },

    // ===== ФОНОВОЕ ИЗОБРАЖЕНИЕ ДЛЯ ABOUT =====
    aboutHeroBg: 'images/about-hero-bg.webp',

    // ===== ПОДДЕРЖКА ПРОДУКТОВ (для модалки "Поддержка продукта") =====
    support: {
        'm100v': {
            docs: { ds: 'docs/M100V_DS', ug: 'docs/M100V_UG' },
            faq: [
                { q: 'How to connect the measuring cell?', a: 'See User guide, section 2.' },
                { q: 'Error during test?', a: 'Check the lid is securely closed. See Troubleshooting.' },
                { q: 'Where is the serial number?', a: 'On the nameplate at the back of the device.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'tangens': {
            docs: { ds: 'docs/TANGENS-M_DS', ug: 'docs/TANGENS-M_UG' },
            faq: [
                { q: 'How to connect the measuring cell?', a: 'See User guide, section 2.' },
                { q: 'Error «Error 2/3»?', a: 'Foreign object in electrode gap. See Troubleshooting.' },
                { q: 'Where is the serial number?', a: 'On the nameplate at the back of the device.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        '70c': {
            docs: { ds: 'docs/70C_DS', ug: 'docs/70C_UG' },
            faq: [
                { q: 'How to connect the HV block?', a: 'See User guide, section 3.' },
                { q: 'Test does not start?', a: 'Check the safety interlock. See Troubleshooting.' },
                { q: 'Where is the serial number?', a: 'On the nameplate of the control unit.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        '70m': {
            docs: { ds: 'docs/70M_DS', ug: 'docs/70M_UG' },
            faq: [
                { q: 'How to connect the load?', a: 'See User guide, section 2.' },
                { q: 'No AC output?', a: 'Check the fuses. See Troubleshooting.' },
                { q: 'Where is the serial number?', a: 'On the nameplate of the control unit.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        '70p': {
            docs: { ds: 'docs/70P_DS', ug: 'docs/70P_UG' },
            faq: [
                { q: 'How to connect 4 channels?', a: 'See User guide, section 2.' },
                { q: 'No current readings?', a: 'Check the bath grounding. See Troubleshooting.' },
                { q: 'Where is the serial number?', a: 'On the nameplate of the control unit.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'svs': {
            docs: { ds: 'docs/SVS_DS', ug: 'docs/SVS_UG' },
            faq: [
                { q: 'How to connect HV blocks?', a: 'See User guide, section 3.' },
                { q: 'Test does not start?', a: 'Check cable connections. See Troubleshooting.' },
                { q: 'Where is the serial number?', a: 'On the nameplate of the control unit.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'stend50': {
            docs: { ds: 'docs/STEND50_DS', ug: 'docs/STEND50_UG' },
            faq: [
                { q: 'How to assemble the stand?', a: 'See User guide, section 2.' },
                { q: 'How to fix the rod?', a: 'Use dielectric bases. See User guide.' },
                { q: 'Where is the serial number?', a: 'On the table nameplate.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'ubsvn': {
            docs: { ds: 'docs/UBSVN-LM_DS', ug: 'docs/UBSVN-LM_UG' },
            faq: [
                { q: 'How to connect to a source?', a: 'See User guide, section 3.' },
                { q: 'Interlock does not trigger?', a: 'Check the limit switch. See Troubleshooting.' },
                { q: 'Where is the serial number?', a: 'On the device housing.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'avn70': {
            docs: { ds: 'docs/AVN70_DS', ug: 'docs/AVN70_UG' },
            faq: [
                { q: 'How to select load step?', a: 'See User guide, section 2.' },
                { q: 'Overheating?', a: 'Check ventilation. See Troubleshooting.' },
                { q: 'Where is the serial number?', a: 'On the cabinet nameplate.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'ik100': {
            docs: { ds: 'docs/IK100_DS', ug: 'docs/IK100_UG' },
            faq: [
                { q: 'How to connect to generator?', a: 'See User guide, section 2.' },
                { q: 'Discharge before work!', a: 'Always discharge and ground the capacitor.' },
                { q: 'Where is the serial number?', a: 'On the capacitor housing.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'kvc-b': {
            docs: { ds: 'docs/KVC-B_DS', ug: 'docs/KVC-B_UG' },
            faq: [
                { q: 'How to connect to network?', a: 'See User guide, section 2.' },
                { q: 'No readings?', a: 'Check the divider. See Troubleshooting.' },
                { q: 'Where is the serial number?', a: 'On the indication unit nameplate.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'kvc-c': {
            docs: { ds: 'docs/KVC-C_DS', ug: 'docs/KVC-C_UG' },
            faq: [
                { q: 'How to connect to network?', a: 'See User guide, section 2.' },
                { q: 'No readings?', a: 'Check the divider. See Troubleshooting.' },
                { q: 'Where is the serial number?', a: 'On the indication unit nameplate.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        }
    }
};

// ==========================================================
// 2. РУССКАЯ ВЕРСИЯ (RU)
// ==========================================================
const SKAT_ASSETS_RU = {
    images: SKAT_ASSETS_EN.images,
    posters: SKAT_ASSETS_EN.posters,
    videos: SKAT_ASSETS_EN.videos,
    icons: SKAT_ASSETS_EN.icons,
    categoryImages: SKAT_ASSETS_EN.categoryImages,
    aboutHeroBg: SKAT_ASSETS_EN.aboutHeroBg,

    // ===== ПОДПИСИ К ИЗОБРАЖЕНИЯМ (RU) =====
    captions: {
        'avn70': [
            'Общий вид активной высоковольтной нагрузки СКАТ-АВН-70',
            'Внутреннее расположение резисторных сборок и проводки',
            'Система автоматического принудительного воздушного охлаждения и панель управления'
        ],
        'ik100': [
            'Высоковольтный импульсный конденсатор ИК 100-0,4 – общий вид',
            'Детали клемм и крепления',
            'Пример применения в генераторе импульсных токов'
        ],
        'kvc-b': [
            'Цифровой киловольтметр серии KVC-B с маслонаполненным делителем',
            'Лицевая панель блока индикации с ЖК-дисплеем',
            'Блок высоковольтного измерителя напряжения с антикоронным экраном'
        ],
        'kvc-c': [
            'Цифровой киловольтметр серии KVC-C – воздушно-изолированный делитель',
            'Блок индикации и интерфейс управления',
            'Высоковольтный делитель с частотно-компенсированной конструкцией'
        ],
        'm100v': [
            'Полностью автоматический аппарат для испытания масла СКАТ-М100В',
            'Измерительная ячейка с высоковольтными электродами',
            'Панель управления с интерфейсом и термопринтером'
        ],
        'stend50': [
            'Испытательный стенд СКАТ-СТЕНД-50 – полная сборка',
            'Диэлектрические основания и детали зажима штанги',
            'Испытательная установка с подключенной изолирующей штангой'
        ],
        'svs': [
            'Стационарный стенд СКАТ-СВС – блок управления и высоковольтные блоки',
            'Испытательная ванна для диэлектрических перчаток и бот',
            'Лицевая панель блока управления с ЖК-дисплеем и энкодером'
        ],
        'tangens': [
            'Тестер жидких диэлектриков СКАТ-ТАНГЕНС-М – общий вид',
            'Трёхзажимная измерительная ячейка и электродная сборка',
            'Сенсорный интерфейс с отображением результатов испытаний'
        ],
        'ubsvn': [
            'Устройство блокировки и светозвуковой сигнализации УБСВН-ЛМ',
            'Внутренняя схема подключения и монтажа',
            'Установлено над дверью лаборатории с лампой предупреждения'
        ],
        '70c': [
            'Цифровой аппарат испытания диэлектриков СКАТ-70Ц – портативное исполнение',
            'Блок управления с 6" ЖК-дисплеем',
            'Высоковольтный блок с автоматической штангой заземления'
        ],
        '70m': [
            'Аналоговый аппарат испытания диэлектриков СКАТ-70М – для полевых условий',
            'Блок управления с аналоговым интерфейсом',
            'Высоковольтный блок и узел заземления'
        ],
        '70p': [
            'Приставка измерительная СКАТ-70П – измерительный блок и ванна',
            'Четырёхканальный дисплей тока утечки',
            'Настройка для испытания диэлектрических перчаток'
        ]
    },

    // ===== МЕТАДАННЫЕ ДЛЯ ВИДЕО (RU) =====
    video_metadata: {
        'tangens': [
            { title: 'СКАТ-ТАНГЕНС-М: Обзор продукта', desc: 'Общий обзор ключевых функций и возможностей прибора.' },
            { title: 'Процесс измерения', desc: 'Пошаговая демонстрация типичного цикла измерения tan δ.' },
            { title: 'Подготовка и настройка', desc: 'Как подготовить измерительную ячейку и начать последовательность испытаний.' },
            { title: 'Анализ и экспорт данных', desc: 'Просмотр и экспорт результатов испытаний через встроенное ПО.' }
        ],
        '70c': [
            { title: 'СКАТ-70Ц: Обзор продукта', desc: 'Обзор цифрового аппарата испытания диэлектриков и его основных функций.' },
            { title: 'Подключение аппарата', desc: 'Инструкции по подключению высоковольтного блока к блоку управления.' },
            { title: 'Запуск последовательности испытаний', desc: 'Демонстрация автоматизированного цикла испытаний.' }
        ],
        '70m': [
            { title: 'СКАТ-70М: Обзор продукта', desc: 'Надёжный аналоговый испытатель переменного/постоянного тока для полевых и лабораторных применений.' },
            { title: 'Настройка и конфигурация', desc: 'Подготовка аппарата к испытанию на электрическую прочность.' },
            { title: 'Обзор функций безопасности', desc: 'Автоматическое заземление, защита от перегрузки по току и система блокировки.' }
        ],
        '70p': [
            { title: 'СКАТ-70П: Обзор продукта', desc: '4-канальная приставка для измерения тока утечки для испытаний СИЗ.' },
            { title: 'Испытание СИЗ', desc: 'Как проводить испытания диэлектрических перчаток и бот с помощью 4-канальной системы.' }
        ],
        'avn70': [
            { title: 'СКАТ-АВН-70: Обзор продукта', desc: 'Активная высоковольтная нагрузка для калибровки и поверки.' },
            { title: 'Выбор ступеней', desc: 'Выбор комбинаций резисторов для имитации различных нагрузочных условий.' }
        ],
        'ik100': [
            { title: 'ИК 100-0,4: Обзор продукта', desc: 'Высоковольтный импульсный конденсатор для генераторов импульсных токов.' },
            { title: 'Применение', desc: 'Использование в испытаниях импульсным напряжением и током.' }
        ],
        'kvc-b': [
            { title: 'Серия KVC-B: Обзор продукта', desc: 'Маслонаполненный цифровой киловольтметр для прецизионных измерений AC/DC.' },
            { title: 'Подключение к ПК', desc: 'Использование интерфейса USB для сбора данных и анализа.' }
        ],
        'kvc-c': [
            { title: 'Серия KVC-C: Обзор продукта', desc: 'Прецизионный киловольтметр класса 0,25 с возможностями анализа THD.' },
            { title: 'Режим измерения СНЧ', desc: 'Выполнение измерений на сверхнизких частотах для расширенной диагностики.' }
        ],
        'm100v': [
            { title: 'СКАТ-М100В: Обзор продукта', desc: 'Полностью автоматический аппарат для испытания пробивного напряжения масла.' },
            { title: 'Запуск испытания', desc: 'Демонстрация полного автоматического цикла испытаний.' }
        ],
        'stend50': [
            { title: 'СКАТ-СТЕНД-50: Обзор продукта', desc: 'Стенд для испытания изолирующих штанг и указателей напряжения до 50 кВ.' },
            { title: 'Руководство по сборке', desc: 'Пошаговая инструкция по сборке стенда.' }
        ],
        'svs': [
            { title: 'СКАТ-СВС: Обзор продукта', desc: 'Стационарный высоковольтный стенд для испытания кабелей и СИЗ.' },
            { title: 'Испытание СИЗ', desc: 'Испытание диэлектрических перчаток и бот с использованием испытательной ванны.' }
        ],
        'ubsvn': [
            { title: 'УБСВН-ЛМ: Обзор продукта', desc: 'Устройство блокировки и светозвуковой сигнализации для высоковольтных лабораторий.' },
            { title: 'Схема подключения', desc: 'Диаграмма подключения для интеграции с источниками высокого напряжения.' }
        ]
    },

    // ===== ПОДДЕРЖКА ПРОДУКТОВ (для модалки "Поддержка продукта") =====
    support: {
        'm100v': {
            docs: { ds: 'docs/M100V_DS', ug: 'docs/M100V_UG' },
            faq: [
                { q: 'Как подключить измерительную ячейку?', a: 'См. Руководство по эксплуатации, раздел 2.' },
                { q: 'Ошибка при испытании?', a: 'Проверьте плотность закрытия крышки. См. Troubleshooting.' },
                { q: 'Где серийный номер?', a: 'На шильдике сзади прибора.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'tangens': {
            docs: { ds: 'docs/TANGENS-M_DS', ug: 'docs/TANGENS-M_UG' },
            faq: [
                { q: 'Как подключить измерительную ячейку?', a: 'См. Руководство по эксплуатации, раздел 2.' },
                { q: 'Ошибка «Error 2/3»?', a: 'Посторонний предмет в зазоре электродов. См. Troubleshooting.' },
                { q: 'Где серийный номер?', a: 'На шильдике сзади прибора.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        '70c': {
            docs: { ds: 'docs/70C_DS', ug: 'docs/70C_UG' },
            faq: [
                { q: 'Как подключить высоковольтный блок?', a: 'См. Руководство по эксплуатации, раздел 3.' },
                { q: 'Не запускается тест?', a: 'Проверьте блокировку безопасности. См. Troubleshooting.' },
                { q: 'Где серийный номер?', a: 'На шильдике блока управления.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        '70m': {
            docs: { ds: 'docs/70M_DS', ug: 'docs/70M_UG' },
            faq: [
                { q: 'Как подключить нагрузку?', a: 'См. Руководство по эксплуатации, раздел 2.' },
                { q: 'Нет выхода AC?', a: 'Проверьте предохранители. См. Troubleshooting.' },
                { q: 'Где серийный номер?', a: 'На шильдике блока управления.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        '70p': {
            docs: { ds: 'docs/70P_DS', ug: 'docs/70P_UG' },
            faq: [
                { q: 'Как подключить 4 канала?', a: 'См. Руководство по эксплуатации, раздел 2.' },
                { q: 'Нет показаний тока?', a: 'Проверьте заземление ванны. См. Troubleshooting.' },
                { q: 'Где серийный номер?', a: 'На шильдике блока управления.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'svs': {
            docs: { ds: 'docs/SVS_DS', ug: 'docs/SVS_UG' },
            faq: [
                { q: 'Как подключить высоковольтные блоки?', a: 'См. Руководство по эксплуатации, раздел 3.' },
                { q: 'Не запускается тест?', a: 'Проверьте соединения кабелей. См. Troubleshooting.' },
                { q: 'Где серийный номер?', a: 'На шильдике блока управления.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'stend50': {
            docs: { ds: 'docs/STEND50_DS', ug: 'docs/STEND50_UG' },
            faq: [
                { q: 'Как собрать стенд?', a: 'См. Руководство по эксплуатации, раздел 2.' },
                { q: 'Как закрепить штангу?', a: 'Используйте диэлектрические основания. См. Руководство.' },
                { q: 'Где серийный номер?', a: 'На шильдике стола.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'ubsvn': {
            docs: { ds: 'docs/UBSVN-LM_DS', ug: 'docs/UBSVN-LM_UG' },
            faq: [
                { q: 'Как подключить к источнику?', a: 'См. Руководство по эксплуатации, раздел 3.' },
                { q: 'Не срабатывает блокировка?', a: 'Проверьте концевой выключатель. См. Troubleshooting.' },
                { q: 'Где серийный номер?', a: 'На корпусе устройства.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'avn70': {
            docs: { ds: 'docs/AVN70_DS', ug: 'docs/AVN70_UG' },
            faq: [
                { q: 'Как выбрать ступень нагрузки?', a: 'См. Руководство по эксплуатации, раздел 2.' },
                { q: 'Перегрев?', a: 'Проверьте вентиляцию. См. Troubleshooting.' },
                { q: 'Где серийный номер?', a: 'На шильдике шкафа.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'ik100': {
            docs: { ds: 'docs/IK100_DS', ug: 'docs/IK100_UG' },
            faq: [
                { q: 'Как подключить к генератору?', a: 'См. Руководство по эксплуатации, раздел 2.' },
                { q: 'Разрядить перед работой!', a: 'Всегда разряжайте и заземляйте конденсатор.' },
                { q: 'Где серийный номер?', a: 'На корпусе конденсатора.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'kvc-b': {
            docs: { ds: 'docs/KVC-B_DS', ug: 'docs/KVC-B_UG' },
            faq: [
                { q: 'Как подключить к сети?', a: 'См. Руководство по эксплуатации, раздел 2.' },
                { q: 'Нет показаний?', a: 'Проверьте делитель. См. Troubleshooting.' },
                { q: 'Где серийный номер?', a: 'На шильдике блока индикации.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        },
        'kvc-c': {
            docs: { ds: 'docs/KVC-C_DS', ug: 'docs/KVC-C_UG' },
            faq: [
                { q: 'Как подключить к сети?', a: 'См. Руководство по эксплуатации, раздел 2.' },
                { q: 'Нет показаний?', a: 'Проверьте делитель. См. Troubleshooting.' },
                { q: 'Где серийный номер?', a: 'На шильдике блока индикации.' }
            ],
            phone: '+7 (8442) 26-99-94',
            email: 'st@skat-v.com'
        }
    }
};

// ==========================================================
// 3. ЯВНЫЙ ЭКСПОРТ В ГЛОБАЛЬНУЮ ОБЛАСТЬ (КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ)
// ==========================================================
window.SKAT_ASSETS_EN = SKAT_ASSETS_EN;
window.SKAT_ASSETS_RU = SKAT_ASSETS_RU;

// ===== ФУНКЦИЯ ОПРЕДЕЛЕНИЯ ЯЗЫКА (нужна для инициализации) =====
function getCurrentLang() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang') === 'ru' ? 'ru' : 'en';
}

// ===== ИНИЦИАЛИЗАЦИЯ АКТИВНОГО ОБЪЕКТА ПРИ ЗАГРУЗКЕ =====
const lang = getCurrentLang();
const activeAssets = lang === 'ru' ? window.SKAT_ASSETS_RU : window.SKAT_ASSETS_EN;

window.SKAT_ASSETS = activeAssets;
window.SKAT_VIDEO_METADATA = activeAssets.video_metadata;
window.categoryImages = activeAssets.categoryImages;
window.aboutHeroBg = activeAssets.aboutHeroBg;
window.SKAT_ASSETS._lang = lang;

// ==========================================================
// ПОДКЛЮЧЕНИЕ КРИТИЧЕСКИХ СКРИПТОВ
// ==========================================================

// Функция для подключения language-selector.js
function ensureLanguageSelector() {
    if (document.querySelector('script[src="language-selector.js"]')) {
        return;
    }
    
    const script = document.createElement('script');
    script.src = 'language-selector.js';
    document.body.appendChild(script);
    console.log('✅ language-selector.js подключен через assets.js');
}

// Автоматическое подключение после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Запускаем проверку сразу
    ensureLanguageSelector();
    
    // И повторяем через интервал на случай, если шапка загрузится позже
    const checkInterval = setInterval(function() {
        const trigger = document.querySelector('#languageSelector, .language-selector, .lang-switcher');
        if (trigger) {
            ensureLanguageSelector();
            clearInterval(checkInterval);
            console.log('✅ Триггер языка найден, language-selector.js активен');
        }
    }, 500);
});