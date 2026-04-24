document.addEventListener('DOMContentLoaded', () => {
    // Lightbox
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.getElementById('lightbox-close');

        document.querySelectorAll('.gallery-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                lightboxImg.src = btn.dataset.src;
                lightbox.classList.remove('hidden');
                lightbox.classList.add('flex');
            });
        });

        const closeLightbox = () => {
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex');
            lightboxImg.src = '';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
    }


    const liked = JSON.parse(localStorage.getItem('liked-articles') ?? '[]');

    // Like buttons (blog + favorites page)
    document.querySelectorAll('.like-btn').forEach(btn => {
        const slug = btn.dataset.slug;
        const icon = btn.querySelector('.like-icon');

        if (liked.includes(slug)) {
            icon.setAttribute('fill', '#FD2D78');
        }

        btn.addEventListener('click', () => {
            const index = liked.indexOf(slug);
            if (index === -1) {
                liked.push(slug);
                icon.setAttribute('fill', '#FD2D78');
            } else {
                liked.splice(index, 1);
                icon.setAttribute('fill', 'none');
                // Hide card on favorites page when unliked
                if (document.getElementById('favorites-grid')) {
                    btn.closest('.favorite-card').style.display = 'none';
                    updateNoFavoritesMessage();
                }
            }
            localStorage.setItem('liked-articles', JSON.stringify(liked));
        });
    });

    // Favorites page: show only liked cards
    const favoritesGrid = document.getElementById('favorites-grid');
    if (favoritesGrid) {
        document.querySelectorAll('.favorite-card').forEach(card => {
            if (liked.includes(card.dataset.slug)) {
                card.style.display = 'block';
            }
        });
        updateNoFavoritesMessage();
    }

    // Nav heart: show count badge if any liked
    updateNavHeart();

    function updateNoFavoritesMessage() {
        const visible = document.querySelectorAll('.favorite-card[style="display: block"], .favorite-card:not([style*="none"])');
        const hasVisible = [...document.querySelectorAll('.favorite-card')].some(c => c.style.display !== 'none');
        document.getElementById('no-favorites')?.classList.toggle('hidden', hasVisible);
    }

    function updateNavHeart() {
        const badge = document.getElementById('nav-heart-badge');
        if (badge) {
            badge.textContent = liked.length;
            badge.classList.toggle('hidden', liked.length === 0);
        }
    }
});
