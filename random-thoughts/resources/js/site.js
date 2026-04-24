// Custom cursor
const cursorMarker = document.querySelector('[data-cursor-type]');
if (cursorMarker) {
    const cursorType = cursorMarker.dataset.cursorType;
    const cursor = document.createElement('div');
    cursor.id = 'cursor';
    cursor.className = cursorType === 'blog' ? 'cursor--blog' : 'cursor--article';
    if (cursorType === 'blog') cursor.textContent = '🌸';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', function (e) {
        cursor.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
    });
    document.addEventListener('mouseleave', function () { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { cursor.style.opacity = '1'; });

    if (cursorType === 'blog') {
        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('mouseenter', function () { cursor.classList.add('cursor--hover'); });
            img.addEventListener('mouseleave', function () { cursor.classList.remove('cursor--hover'); });
        });
    }
}

// Like buttons
var likes = JSON.parse(localStorage.getItem('likes') || '[]');

document.querySelectorAll('[data-like]').forEach(function (btn) {
    var url = btn.dataset.url;
    if (likes.includes(url)) btn.textContent = '💗';

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        var idx = likes.indexOf(url);
        if (idx === -1) {
            likes.push(url);
            btn.textContent = '💗';
        } else {
            likes.splice(idx, 1);
            btn.textContent = '🤍';
        }
        localStorage.setItem('likes', JSON.stringify(likes));
    });
});

// Read later
var readLater = JSON.parse(localStorage.getItem('readLater') || '[]');

function renderReadLaterList() {
    var list = document.getElementById('read-later-list');
    var items = document.getElementById('read-later-items');
    if (!list || !items) return;
    if (readLater.length === 0) { list.classList.add('hidden'); return; }
    list.classList.remove('hidden');
    items.innerHTML = readLater.map(function (item) {
        return '<li><a href="' + item.url + '" class="font-sans text-sm px-3 py-1.5 rounded-full bg-white shadow hover:shadow-md transition">' + item.title + '</a></li>';
    }).join('');
}

renderReadLaterList();

document.querySelectorAll('[data-readlater]').forEach(function (btn) {
    var url = btn.dataset.url;
    var title = btn.dataset.title;
    var isActive = readLater.some(function (i) { return i.url === url; });
    if (isActive) btn.style.opacity = '1';

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        var idx = readLater.findIndex(function (i) { return i.url === url; });
        if (idx === -1) {
            readLater.push({ url: url, title: title });
            btn.style.opacity = '1';
        } else {
            readLater.splice(idx, 1);
            btn.style.opacity = '0.5';
        }
        localStorage.setItem('readLater', JSON.stringify(readLater));
        renderReadLaterList();
    });
});

// Share / copy link
document.querySelectorAll('[data-share]').forEach(function (btn) {
    btn.addEventListener('click', function () {
        navigator.clipboard.writeText(window.location.href).then(function () {
            var span = btn.querySelector('span');
            span.textContent = 'Kopiert ✓';
            setTimeout(function () { span.textContent = 'Link kopieren'; }, 2000);
        });
    });
});
