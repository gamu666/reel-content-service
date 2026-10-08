const reels = Array.from({ length: 10 }, (_, index) => ({
  src: `assets/videos/reel-${String(index + 1).padStart(2, '0')}.mp4`,
  title: `Reel ${String(index + 1).padStart(2, '0')}`,
  category: index < 2 ? 'SOCIAL CAMPAIGN' : index < 6 ? 'LIFESTYLE REEL' : 'BRAND CONTENT',
}));

const player = document.querySelector('#player');
const strip = document.querySelector('#filmstrip');
const title = document.querySelector('#title');
const category = document.querySelector('#category');
const counter = document.querySelector('#counter');
let active = 0;

reels.forEach((reel, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'thumb';
  button.innerHTML = `<b>${reel.title}</b><span>${reel.category}</span>`;
  button.addEventListener('click', () => select(index));
  strip.append(button);
});

function select(index) {
  active = (index + reels.length) % reels.length;
  const reel = reels[active];
  player.pause();
  player.src = reel.src;
  title.textContent = reel.title;
  category.textContent = reel.category;
  counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(reels.length).padStart(2, '0')}`;
  [...strip.children].forEach((button, i) => button.classList.toggle('is-active', i === active));
  // Scroll only the thumbnail strip; never its iframe or parent page.
  const thumbnail = strip.children[active];
  const stripBounds = strip.getBoundingClientRect();
  const thumbnailBounds = thumbnail.getBoundingClientRect();
  const scale = stripBounds.width / strip.offsetWidth || 1;
  strip.scrollTo({
    left: strip.scrollLeft + (thumbnailBounds.left - stripBounds.left) / scale
      - (strip.clientWidth - thumbnail.offsetWidth) / 2,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });
  player.play().catch(() => {});
}

document.querySelector('.arrow--prev').addEventListener('click', () => select(active - 1));
document.querySelector('.arrow--next').addEventListener('click', () => select(active + 1));
document.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  select(active + (event.key === 'ArrowRight' ? 1 : -1));
});
select(0);
