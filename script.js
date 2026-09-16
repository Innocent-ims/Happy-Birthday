const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const confettiLayer = $('#confettiLayer');
function burstConfetti(count = 90) {
  const colors = ['#f7b5cf', '#c9b9f2', '#b9e3f4', '#f6ce73', '#ffffff'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('i');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * .8}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}

$('#openSurprise').addEventListener('click', () => {
  $('#contentSections').classList.remove('is-hidden');
  burstConfetti(120);
  setTimeout(() => $('#letter').scrollIntoView({ behavior: 'smooth' }), 250);
  typeMessage();
});

function typeMessage() {
  const target = $('#birthdayMessage');
  if (target.dataset.typed) return;
  const fullText = target.textContent.trim();
  target.textContent = '';
  target.dataset.typed = 'true';
  let index = 0;
  const type = () => {
    if (index < fullText.length) {
      target.textContent += fullText[index++];
      setTimeout(type, 18);
    }
  };
  type();
}

function bindChoices(groupId, label) {
  $(`#${groupId}`).addEventListener('click', (event) => {
    const card = event.target.closest('.choice-card');
    if (!card) return;
    $$(`#${groupId} .choice-card`).forEach(item => item.classList.remove('selected'));
    card.classList.add('selected');
    const selected = $$('.choice-card.selected');
    const activity = selected[0]?.dataset.value;
    const food = selected[1]?.dataset.value;
    $('#selectionNote').textContent = activity && food ? `Perfect! ${activity} + ${food} it is ✨` : `${label} saved — choose one from the other row ✨`;
  });
}
bindChoices('activityOptions', 'Plan');
bindChoices('foodOptions', 'Food choice');

$$('.photo').forEach(photo => photo.addEventListener('click', () => {
  $('#lightboxImage').src = photo.dataset.image;
  $('#lightboxImage').alt = photo.querySelector('img').alt;
  $('#lightboxCaption').textContent = photo.dataset.caption;
  $('#lightbox').classList.add('open');
}));
function closeLightbox() { $('#lightbox').classList.remove('open'); }
$('#closeLightbox').addEventListener('click', closeLightbox);
$('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function blowCandles() {
  const cake = $('#cakeWrap');
  if (cake.classList.contains('blown')) return;
  cake.classList.add('blown');
  $('#wishMessage').textContent = 'Wish made! May your year be as lovely as you are. ✨';
  burstConfetti(70);
  setTimeout(() => { $('#finale').scrollIntoView({ behavior: 'smooth' }); launchFireworks(); makeHearts(); }, 1000);
}
$('#blowButton').addEventListener('click', blowCandles);
$('#cakeWrap').addEventListener('click', blowCandles);
$('#cakeWrap').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') blowCandles(); });

let fireworkFrame;
function launchFireworks() {
  const canvas = $('#fireworks');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth * devicePixelRatio; canvas.height = canvas.offsetHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const particles = [];
  for (let j = 0; j < 7; j++) {
    const x = 15 + Math.random() * 70, y = 18 + Math.random() * 42;
    for (let i = 0; i < 45; i++) { const angle = (Math.PI * 2 * i) / 45; particles.push({ x, y, vx: Math.cos(angle) * (1 + Math.random() * 2.4), vy: Math.sin(angle) * (1 + Math.random() * 2.4), life: 1, color: ['#fff','#f7b5cf','#b9e3f4','#f6ce73'][j % 4] }); }
  }
  cancelAnimationFrame(fireworkFrame);
  const draw = () => { ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight); particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .018; p.life -= .009; ctx.globalAlpha = Math.max(p.life, 0); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill(); }); if (particles.some(p => p.life > 0)) fireworkFrame = requestAnimationFrame(draw); }; draw();
}
function makeHearts() {
  const rain = $('#heartRain'); rain.innerHTML = '';
  for (let i = 0; i < 22; i++) { const heart = document.createElement('i'); heart.textContent = '♥'; heart.style.left = `${Math.random() * 100}%`; heart.style.top = `${-Math.random() * 90}%`; heart.style.fontSize = `${12 + Math.random() * 18}px`; heart.style.animationDelay = `${Math.random() * 4}s`; rain.appendChild(heart); }
}
$('#replayButton').addEventListener('click', () => { $('#cakeWrap').classList.remove('blown'); $('#wishMessage').textContent = 'Close your eyes… make it a good one.'; $('#welcome').scrollIntoView({ behavior: 'smooth' }); burstConfetti(100); });

document.addEventListener('pointermove', e => { const heart = $('.cursor-heart'); heart.style.left = `${e.clientX}px`; heart.style.top = `${e.clientY}px`; });
