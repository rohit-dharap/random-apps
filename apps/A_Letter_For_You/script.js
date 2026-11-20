const image = document.querySelector('#memory-image');
const caption = document.querySelector('#memory-caption');
const dots = document.querySelector('#slide-dots');
const status = document.querySelector('#slide-status');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');

const defaultPhotos = [
  { src: 'photo-placeholder.svg', alt: 'फोटोसाठी जागा', caption: 'इथे आपला फोटो' },
  { src: 'photo-placeholder.svg', alt: 'फोटोसाठी जागा', caption: 'आपला एक सुंदर क्षण' },
  { src: 'photo-placeholder.svg', alt: 'फोटोसाठी जागा', caption: 'आणखी एक खास आठवण' },
];
let photos = defaultPhotos;
let current = 0;

function showPhoto(index, announce = true) {
  current = (index + photos.length) % photos.length;
  const photo = photos[current];
  image.src = new URL(photo.src, new URL('./resources/', document.baseURI)).href;
  image.alt = photo.alt || `Memory ${current + 1}`;
  caption.textContent = photo.caption || '';
  [...dots.children].forEach((dot, dotIndex) => {
    dot.setAttribute('aria-current', dotIndex === current ? 'true' : 'false');
  });
  if (announce) status.textContent = `Photo ${current + 1} of ${photos.length}: ${photo.caption || photo.alt || ''}`;
}

function renderDots() {
  dots.replaceChildren(...photos.map((photo, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dot';
    button.setAttribute('aria-label', `फोटो ${index + 1} दाखवा${photo.caption ? `: ${photo.caption}` : ''}`);
    button.addEventListener('click', () => showPhoto(index));
    return button;
  }));
}

previous.addEventListener('click', () => showPhoto(current - 1));
next.addEventListener('click', () => showPhoto(current + 1));

fetch('./config.json', { cache: 'no-store' })
  .then((response) => {
    if (!response.ok) throw new Error(`Could not load app config (${response.status})`);
    return response.json();
  })
  .then((config) => {
    if (Array.isArray(config.photos) && config.photos.length) photos = config.photos;
    renderDots();
    showPhoto(0, false);
  })
  .catch((error) => {
    console.error('Using the built-in photo placeholders:', error);
    renderDots();
    showPhoto(0, false);
  });
