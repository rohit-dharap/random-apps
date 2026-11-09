const intro = document.querySelector('#intro');
const scene = document.querySelector('#scene');
const portrait = document.querySelector('#portrait');
const gift = document.querySelector('#gift');
const portraitPhoto = document.querySelector('#portrait-photo');
const giftCardLink = document.querySelector('#gift-card-link');
let revealed = false;
let pointerStart = null;

fetch('./config.json', { cache: 'no-store' })
  .then((response) => {
    if (!response.ok) throw new Error(`Could not load app config (${response.status})`);
    return response.json();
  })
  .then((config) => {
    const resourceRoot = new URL(config.resourcePath || './resources/', document.baseURI);
    if (config.assets?.portrait) {
      portraitPhoto.src = new URL(config.assets.portrait, resourceRoot).href;
    }
    if (config.amazonGiftCardUrl) giftCardLink.href = config.amazonGiftCardUrl;
  })
  .catch((error) => console.error('Using the built-in app defaults:', error));

function reveal() {
  if (revealed) return;
  revealed = true;
  intro.classList.add('hidden');
  portrait.classList.remove('hidden');
  window.setTimeout(() => {
    portrait.classList.add('hidden');
    gift.classList.remove('hidden');
  }, 5000);
}

scene.addEventListener('click', reveal);
scene.addEventListener('pointerdown', (event) => {
  if (event.pointerType !== 'mouse') pointerStart = { x: event.clientX, y: event.clientY };
});
scene.addEventListener('pointerup', (event) => {
  if (!pointerStart) return;
  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  pointerStart = null;
  if (dy < -45 && Math.abs(dy) > Math.abs(dx)) reveal();
});
scene.addEventListener('pointercancel', () => { pointerStart = null; });
