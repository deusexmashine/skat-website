/* ============================================= */
/* MEGA-MENU LOGIC (только для главной страницы) */
/* ============================================= */

function initMegaMenu() {
    const toggleBtn = document.getElementById('megaMenuToggle');
    const overlay = document.getElementById('megaOverlay');
    const closeBtn = document.querySelector('.mega-close-btn');
    const cards = document.querySelectorAll('.mega-card-item');
    const groups = document.querySelectorAll('.mega-links-group');

    if (!toggleBtn || !overlay) return;

    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();

        if (overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            cards.forEach(c => c.classList.remove('active'));
            groups.forEach(g => g.classList.remove('active'));
            return;
        }

        overlay.classList.add('active');
        if (cards.length > 0 && groups.length > 0) {
            cards[0].classList.add('active');
            const firstCategory = cards[0].getAttribute('data-category');
            const targetGroup = document.querySelector(`.mega-links-group[data-category="${firstCategory}"]`);
            if (targetGroup) targetGroup.classList.add('active');
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            overlay.classList.remove('active');
            cards.forEach(c => c.classList.remove('active'));
            groups.forEach(g => g.classList.remove('active'));
        });
    }

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            cards.forEach(c => c.classList.remove('active'));
            groups.forEach(g => g.classList.remove('active'));
        }
    });

    cards.forEach(card => {
        card.addEventListener('click', function() {
            cards.forEach(c => c.classList.remove('active'));
            groups.forEach(g => g.classList.remove('active'));

            this.classList.add('active');
            const category = this.getAttribute('data-category');
            const targetGroup = document.querySelector(`.mega-links-group[data-category="${category}"]`);
            if (targetGroup) {
                targetGroup.classList.add('active');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('megaMenuToggle')) {
        initMegaMenu();
    }
});