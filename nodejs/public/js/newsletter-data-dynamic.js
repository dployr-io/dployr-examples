const heroImages = [
    'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop',
];
const comicImages = ['img/001.jpg', 'img/002.jpg', 'img/003.jpg', 'img/004.jpg', 'img/005.jpg'];

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function render(data) {
    const headerDivs = document.querySelectorAll('.header div');
    headerDivs[0].textContent = data.header.edition;
    headerDivs[1].textContent = data.header.date;

    document.querySelector('.title').textContent = data.title;

    const h2s = document.querySelectorAll('h2');
    const ps = document.querySelectorAll('p');
    h2s[0].textContent = data.mainArticle.title;
    ps[0].textContent = data.mainArticle.content;
    document.querySelector('.caption').textContent = data.mainArticle.imageCaption;

    const cols = document.querySelectorAll('.column');
    cols[0].querySelector('h2').textContent = data.leftColumn.title;
    cols[0].querySelector('p').textContent = data.leftColumn.content;
    cols[1].querySelector('h2').textContent = data.rightColumn.title;
    cols[1].querySelectorAll('p')[0].textContent = data.rightColumn.content;
    cols[1].querySelector('.joke-lines').innerHTML = data.rightColumn.jokeLines.join('<br>');
    cols[1].querySelector('.note').textContent = data.rightColumn.note;

    h2s[2].textContent = data.comicSection.title;
    document.querySelector('.comic-caption').textContent = data.comicSection.caption;

    const contrib = document.querySelector('.contribute');
    contrib.querySelector('h2').textContent = data.contributeSection.title;
    data.contributeSection.paragraphs.forEach((text, i) => {
        const p = contrib.querySelectorAll('p')[i];
        if (p) p.textContent = text;
    });

    const hero = document.querySelector('.meeting-photo');
    hero.src = rand(heroImages);
    hero.alt = 'Company meeting';

    const comic = document.querySelector('.comic-strip');
    comic.src = rand(comicImages);
    comic.alt = 'Comic strip of the month';

    setTimeout(() => {
        document.querySelectorAll('.meeting-photo, .comic-strip').forEach(img => {
            img.style.filter = 'grayscale(100%) contrast(1.2) brightness(0.9)';
        });
    }, 500);
}

async function load() {
    try {
        const res = await fetch('/api/newsletter-data');
        if (!res.ok) throw new Error(res.statusText);
        render(await res.json());
    } catch (err) {
        console.error('Failed to load newsletter data:', err);
    }
}

load();
setInterval(load, 60000);
