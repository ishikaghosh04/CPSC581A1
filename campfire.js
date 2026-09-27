// Drag the campfire into the middle, click it, or press Enter to explore social distance.
function setupCampfire() {
  const control = document.getElementById('campfire-control');
  const announcement = document.getElementById('campfire-announcement');
  const sky = document.getElementById('sky');
  let active = false;
  let origin = null;
  let suppressClick = false;
  const particles = document.createElement('div');
  particles.id = 'campfire-sparks';
  sky.appendChild(particles);

  function placeStars() {
    const box = sky.getBoundingClientRect();
    const centerX = box.width * .5;
    const centerY = box.height * .54;
    const unit = Math.min(box.width, box.height);
    const positions = {
      extrovert: [[-.10, .02]],
      ambivert: [[.27, -.07]],
      introvert: [[-.54, -.29], [.56, 30]]
    };
    const used = {extrovert: 0, ambivert: 0, introvert: 0};
    particles.replaceChildren();
    for (const star of stars) {
      const el = document.getElementById(star.id);
      if (!el) continue;
      if (active) {
        const group = positions[star.personality] || positions.ambivert;
        const [dx, dy] = group[(used[star.personality] || 0) % group.length];
        used[star.personality] = (used[star.personality] || 0) + 1;
        const x = Math.max(70, Math.min(box.width - 70, centerX + dx * unit));
        const y = Math.max(145, Math.min(box.height - 90, centerY + dy * unit));
        el.style.left = `${x / box.width * 100}%`;
        el.style.top = `${y / box.height * 100}%`;
        el.classList.add('campfire-star');
        el.dataset.socialType = star.personality;
        const count = star.personality === 'extrovert' ? 9 : star.personality === 'ambivert' ? 4 : 0;
        for (let n = 0; n < count; n++) {
          const spark = document.createElement('i');
          spark.className = `social-spark ${star.personality}`;
          spark.style.left = `${x}px`;
          spark.style.top = `${y}px`;
          spark.style.setProperty('--angle', `${n * 360 / count}deg`);
          spark.style.animationDelay = `${n * -.32}s`;
          particles.appendChild(spark);
        }
      } else {
        el.style.left = `${star.position.x}%`;
        el.style.top = `${star.position.y}%`;
        el.classList.remove('campfire-star');
        delete el.dataset.socialType;
      }
    }
    // Reposition existing hobby connections when stars finish moving.
    if (typeof drawConstellation === 'function') {
      requestAnimationFrame(drawConstellation);
      setTimeout(drawConstellation, 850);
    }
  }

  function setActive(value) {
    active = value;
    control.setAttribute('aria-pressed', String(active));
    document.body.classList.toggle('campfire-active', active);
    if (active) {
      for (const id of ['sun-control', 'moon-control']) {
        const other = document.getElementById(id);
        if (other && other.getAttribute('aria-pressed') === 'true') other.click();
      }
    }
    control.style.left = active ? `${window.innerWidth / 2 - control.offsetWidth / 2}px` : '';
    control.style.top = active ? `${window.innerHeight * .54 - control.offsetHeight / 2}px` : '';
    placeStars();
    announcement.textContent = active
      ? 'Around the campfire: Ishika is closest with lively sparks, Yasmin stays a little farther with a few sparks, and Utaha and Linden keep the most space.'
      : 'Campfire cleared; stars returned to their places.';
  }

  control.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const rect = control.getBoundingClientRect();
    origin = {x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, moved: false};
    control.setPointerCapture(event.pointerId);
  });
  control.addEventListener('pointermove', event => {
    if (!origin) return;
    if (!origin.moved && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) < 5) return;
    origin.moved = true;
    control.classList.add('dragging');
    control.style.left = `${Math.max(0, Math.min(window.innerWidth - control.offsetWidth, origin.left + event.clientX - origin.x))}px`;
    control.style.top = `${Math.max(0, Math.min(window.innerHeight - control.offsetHeight, origin.top + event.clientY - origin.y))}px`;
    const centerDistance = Math.hypot(event.clientX - window.innerWidth / 2, event.clientY - window.innerHeight * .54);
    control.classList.toggle('near-center', centerDistance < Math.min(window.innerWidth, window.innerHeight) * .25);
  });
  control.addEventListener('pointerup', () => {
    if (!origin) return;
    const moved = origin.moved;
    origin = null;
    control.classList.remove('dragging');
    if (moved) {
      suppressClick = true;
      setActive(control.classList.contains('near-center'));
    }
    control.classList.remove('near-center');
  });
  control.addEventListener('pointercancel', () => {
    origin = null;
    control.classList.remove('dragging', 'near-center');
    setActive(active);
  });
  control.addEventListener('click', () => {
    if (suppressClick) { suppressClick = false; return; }
    setActive(!active);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) setActive(false);
  });
  window.addEventListener('resize', () => {
    if (active) setActive(true);
  });
}
setupCampfire();
