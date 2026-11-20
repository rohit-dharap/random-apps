const image = document.querySelector('#memory-image');
const caption = document.querySelector('#memory-caption');
const dots = document.querySelector('#slide-dots');
const status = document.querySelector('#slide-status');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');

const defaultPhotos = [
  { src: 'memory-1.jpg', alt: 'आपण दोघे आणि आपली मांजर', caption: 'आपण दोघे आणि आपली मांजर 🐾' },
  { src: 'memory-2.jpg', alt: 'एकमेकांच्या जवळचा निवांत क्षण', caption: 'तुझ्या कुशीतला निवांत क्षण' },
  { src: 'memory-3.jpg', alt: 'आपल्या दोघांचं सुंदर चित्र', caption: 'आपण दोघं, एका सुंदर आठवणीत' },
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
    button.setAttribute('aria-label', `Show photo ${index + 1}${photo.caption ? `: ${photo.caption}` : ''}`);
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
