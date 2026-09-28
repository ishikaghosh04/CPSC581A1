let selected = []; // array of selected star IDs

const hoverTimers = {}; // store hover timers for each star
const hoverState = {};

const hoveredHobbyStars = new Set();

// Components of the following code is generated using deepseek api
const starSpritePrefixes = {
  Ishika: "ishika",
  Utaha: "uta",
  Yasmin: "uta",
  Linden: "linden"
};

// Per-state art overrides; states not listed fall back to the star's prefix set.
// Yasmin's own drawings exist for states 2 and 4; states 1 and 3 still use the uta set.
const starSpriteOverrides = {
  Yasmin: { 2: "yasmin2.png", 4: "yasmin4.png" }
};

const SPRITE_STATE_COUNT = 4;

function applyStarSprite(el, prefix, overrides) {
  el.classList.add("star-image");

  for (let state = 1; state <= SPRITE_STATE_COUNT; state++) {
    const url = `images/${(overrides && overrides[state]) || `${prefix}${state}.png`}`;
    el.style.setProperty(`--star-frame-${state}`, `url("${url}")`);

    const preload = new Image();
    preload.src = url;
  }
}

function renderStars() {
  const sky = document.getElementById("sky");
  const lines = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  lines.id = "constellation-lines";
  sky.appendChild(lines);

  const hobbyLines = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  hobbyLines.id = "hobby-lines";
  sky.appendChild(hobbyLines);

  stars.forEach(star => {
    const el = document.createElement("div");
    el.classList.add("star");
    el.id = star.id;
    el.style.left = `${star.position.x}%`;
    el.style.top = `${star.position.y}%`;
    el.style.setProperty("--star-glow", star.favColor);

    applyStarSprite(el, starSpritePrefixes[star.name], starSpriteOverrides[star.name]);

    const name = document.createElement("span");
    name.className = "star-name";
    name.textContent = star.name;
    el.appendChild(name);

    // user interactions
    el.addEventListener("mouseenter", () => handleHoverStart(star));
    el.addEventListener("mouseleave", () => handleHoverEnd(star));
    el.addEventListener("click", () => handleClick(star));

    sky.appendChild(el);
  });

  drawConstellation();
  layoutAllHobbyIcons();
}

function isSelected(id) {
  return selected.includes(id);
}

function handleHoverStart(star) {
  if (isSelected(star.id)) return;

  hoveredHobbyStars.add(star.id);
  layoutAllHobbyIcons();

  clearTimeout(hoverTimers[star.id]);
  hoverState[star.id] = true;

  const el = document.getElementById(star.id);
  if (el) {
    el.classList.remove("hover-first-state");
    el.classList.remove("hover-final-state");
  }

  hoverTimers[star.id] = setTimeout(() => {
    if (!hoverState[star.id] || isSelected(star.id)) return;
    const el = document.getElementById(star.id);
    el.classList.add("hover-first-state");

    hoverTimers[star.id] = setTimeout(() => {
      if (!hoverState[star.id] || isSelected(star.id)) return;
      const el = document.getElementById(star.id);
      el.classList.remove("hover-first-state");
      el.classList.add("hover-final-state");
    }, star.hoverTime);
  }, 1000);
}

function handleHoverEnd(star) {
  hoveredHobbyStars.delete(star.id);
  layoutAllHobbyIcons();

  clearTimeout(hoverTimers[star.id]);
  delete hoverTimers[star.id];
  delete hoverState[star.id];

  const el = document.getElementById(star.id);
  if (!el) return;
  el.classList.remove("hover-first-state");
  el.classList.remove("hover-final-state");
}

function clearHover(starId) {
  hoveredHobbyStars.delete(starId);
  layoutAllHobbyIcons();

  clearTimeout(hoverTimers[starId]);
  delete hoverTimers[starId];
  delete hoverState[starId];

  const el = document.getElementById(starId);
  if (!el) return;
  el.classList.remove("hover-first-state");
  el.classList.remove("hover-final-state");
}

// components of this code is generated using https://chat.openai.com/chat
function handleClick(star) {
  clearHover(star.id);

  if (isSelected(star.id)) {
    selected = selected.filter(id => id !== star.id);
    document.getElementById(star.id).classList.remove("selected");
    document.getElementById(star.id).style.setProperty("--star-glow", "white");
    toggleBgStars(star, false);
    drawConstellation();
    layoutAllHobbyIcons(); // removes this star's labels and re-validates everyone else's
    return;
  }

  selected.push(star.id);

  const el = document.getElementById(star.id);
  el.classList.add("selected");
  el.style.setProperty("--star-glow", star.favColor);
  toggleBgStars(star, true);
  drawConstellation();
  layoutAllHobbyIcons(); // adds this star's labels and re-validates everyone else's
}

function drawConstellation() {
  const svg = document.getElementById("constellation-lines");
  if (!svg) return;

  const sky = document.getElementById("sky");
  svg.innerHTML = "";
  svg.setAttribute("viewBox", `0 0 ${sky.clientWidth} ${sky.clientHeight}`);

  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      const start = starCenter(selected[i]);
      const end = starCenter(selected[j]);
      if (!start || !end) continue;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", start.x);
      line.setAttribute("y1", start.y);
      line.setAttribute("x2", end.x);
      line.setAttribute("y2", end.y);
      line.setAttribute("class", "connecting-line");

      svg.appendChild(line);
    }
  }
}

function starCenter(id) {
  const sky = document.getElementById("sky");
  const el = document.getElementById(id);
  if (!sky || !el) return null;

  const bounds = sky.getBoundingClientRect();
  const box = el.getBoundingClientRect();

  return {
    x: box.left + box.width / 2 - bounds.left,
    y: box.top + box.height / 2 - bounds.top
  };
}

function sharedTraits(id1, id2) {
  const s1 = stars.find(s => s.id === id1);
  const s2 = stars.find(s => s.id === id2);
  if (!s1 || !s2) return [];

  return [
    ...s1.hobbies.filter(h => s2.hobbies.includes(h)),
    ...(s1.sleep === s2.sleep ? [s1.sleep] : []),
    ...(s1.personality === s2.personality ? [s1.personality] : [])
  ];
}

const hobbyImages = {
  Ishika: { music: "music-ishika.png", drawing: "drawing-ishika.png", gym: "gym-ishika.png" },
  Utaha: { music: "music-uta.png", crocheting: "crochet.png", hiking: "hiking-uta.png", swimming: "swimming.png" },
  Yasmin: { gym: "gym-yasmin.png", hiking: "hiking-yasmin.png", running: "running.png" },
  Linden: { pickleball: "pickleball.png", reading: "reading.png", drawing: "drawing-linden.png" }
};

function hobbyLabel(star, hobby) {
  const file = (hobbyImages[star.name] || {})[hobby.toLowerCase()];

  const item = document.createElement("div");
  item.className = "orbit-hobby";
  item.dataset.starId = star.id;
  item.dataset.hobby = hobby.toLowerCase();

  if (file) {
    const picture = document.createElement("img");
    picture.className = "hobby-picture";
    picture.src = `images/hobbies/${file}`;
    picture.alt = ""; // The visible hobby name provides the accessible label.
    item.appendChild(picture);
  }

  const label = document.createElement("span");
  label.textContent = hobby;
  item.appendChild(label);

  return item;
}

const hobbyPositions = {
  star1: { // Ishika
    music: { x: -50, y: 200 }, drawing: { x: -120, y: -40 }
  },
  star2: { // Utaha
    music: { x: 30, y: -80 }, crocheting: { x: 70, y: -50 },
    hiking: { x: 110, y: 0 }, swimming: { x: 80, y: 150 }
  },
  star3: { // Yasmin
    gym: { x: 200, y: 190 }, hiking: { x: 20, y: 300 }, running: { x: -180, y: 200 }
  },
  star4: { // Linden
    pickleball: { x: 0, y: 200 }, reading: { x: 80, y: 300 }, drawing: { x: 80, y: 50 }
  }
};

// Rebuilds every shown star's hobby labels. Called after any selection or
// hover change (and on resize).
function layoutAllHobbyIcons() {
  const sky = document.getElementById("sky");
  const lines = document.getElementById("hobby-lines");
  if (!sky || !lines) return;

  sky.querySelectorAll(".orbit-hobby").forEach(item => item.remove());
  lines.replaceChildren();
  lines.setAttribute("viewBox", `0 0 ${sky.clientWidth} ${sky.clientHeight}`);

  [...new Set([...selected, ...hoveredHobbyStars])].forEach(id => {
    const star = stars.find(s => s.id === id);
    const center = starCenter(id);
    if (!star || !center) return;

    const hobbies = star.hobbies;
    const count = hobbies.length;
    const radius = Math.min(155, Math.max(90, sky.clientWidth * .115));
    const spread = Math.min(Math.PI * .95, (count - 1) * .57);
    // Point away from the nearest horizontal edge; place hobbies above the star.
    const direction = center.x < sky.clientWidth / 2 ? -Math.PI / 2 + .22 : -Math.PI / 2 - .22;

    hobbies.forEach((hobby, index) => {
      const angle = direction - spread / 2 + (count === 1 ? 0 : index * spread / (count - 1));
      const offset = hobbyPositions[id]?.[hobby.toLowerCase()] || { x: 0, y: 0 };
      const item = hobbyLabel(star, hobby);
      sky.appendChild(item); // appended first so its height can be measured below
 
      // Keep the whole label inside the sky; it is roughly 81px tall.
      const labelHalf = (item.offsetHeight || 81) / 2;
      const x = Math.max(53, Math.min(sky.clientWidth - 53, center.x + radius * Math.cos(angle) + offset.x));
      const y = Math.max(labelHalf + 8, Math.min(sky.clientHeight - labelHalf - 8, center.y + radius * Math.sin(angle) + offset.y));

      item.style.left = `${x}px`;
      item.style.top = `${y}px`;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "hobby-connector");
      line.setAttribute("x1", center.x);
      line.setAttribute("y1", center.y);
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);
      lines.appendChild(line);
    });
  });

  updateSharedHobbyHighlights();
}

function sharedSelectedHobbies() {
  if (selected.length < 2) return [];
  const people = selected.map(id => stars.find(star => star.id === id));
  return people[0].hobbies.map(hobby => hobby.toLowerCase()).filter(hobby =>
    people.every(person => person.hobbies.some(item => item.toLowerCase() === hobby)));
}

function updateSharedHobbyHighlights() {
  const shared = sharedSelectedHobbies();

  document.querySelectorAll(".orbit-hobby").forEach(item => {
    item.classList.toggle("shared", shared.includes(item.dataset.hobby));
  });
}

function toggleBgStars(star, show) {
  const bgStars = document.getElementById(
    `member${star.id.replace("star", "")}-bg-stars`
  );

  if (bgStars) {
    bgStars.style.color = star.favColor;
    bgStars.style.display = show ? "block" : "none";
  }
}

window.addEventListener("resize", () => {
  drawConstellation();
  layoutAllHobbyIcons();
});

renderStars();

function setupTimeControls() {
  const container = document.getElementById("time-controls");
  const target = document.getElementById("time-target");
  const announcement = document.getElementById("time-announcement");
  const controls = [document.getElementById("sun-control"), document.getElementById("moon-control")];
  let active = null;

  function setMode(mode) {
    active = mode;
    controls.forEach(control => {
      const chosen = control.id === (mode === "morning" ? "sun-control" : "moon-control") && mode !== null;
      control.setAttribute("aria-pressed", String(chosen));
      control.style.left = chosen ? `${window.innerWidth / 2 - control.offsetWidth / 2}px` : "";
      control.style.top = chosen ? `${window.innerHeight * .43 - control.offsetHeight / 2}px` : "";
      if (!chosen) control.style.right = "";
      else control.style.right = "auto";
    });
    paint(mode);
  }

  function paint(mode) {
    controls.forEach(control => control.setAttribute("aria-pressed", String(control.id === (mode === "morning" ? "sun-control" : "moon-control") && mode !== null)));
    stars.forEach(star => {
      const el = document.getElementById(star.id);
      const matches = mode === "morning" ? star.sleep === "early bird" : mode === "night" && star.sleep === "night owl";
      el.classList.toggle("time-match", matches);
      if (matches) {
        el.style.setProperty("--time-color", mode === "morning" ? "#ffe092" : "#bed4ff");
        el.dataset.timeLabel = mode === "morning" ? "☀ Morning person" : "☾ Night person";
      } else {
        el.style.removeProperty("--time-color");
        delete el.dataset.timeLabel;
      }
    });
    const names = stars.filter(star => mode === "morning" ? star.sleep === "early bird" : mode === "night" && star.sleep === "night owl").map(star => star.name);
    announcement.textContent = mode ? `${mode === "morning" ? "Morning people" : "Night people"}: ${names.join(" and ")}.` : "Morning and night highlights cleared.";
  }

  controls.forEach(control => {
    const mode = control.id === "sun-control" ? "morning" : "night";
    let origin = null;
    let suppressClick = false;
    control.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      const box = control.getBoundingClientRect();
      origin = { x: event.clientX, y: event.clientY, left: box.left, top: box.top, moved: false };
      control.setPointerCapture(event.pointerId);
    });
    control.addEventListener("pointermove", event => {
      if (!origin) return;
      if (!origin.moved && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) < 5) return;
      origin.moved = true;
      control.classList.add("dragging");
      container.classList.add("dragging");
      control.style.right = "auto";
      control.style.left = `${Math.max(0, Math.min(window.innerWidth - control.offsetWidth, origin.left + event.clientX - origin.x))}px`;
      control.style.top = `${Math.max(0, Math.min(window.innerHeight - control.offsetHeight, origin.top + event.clientY - origin.y))}px`;
      const box = target.getBoundingClientRect();
      const inTarget = event.clientX >= box.left - 55 && event.clientX <= box.right + 55 && event.clientY >= box.top - 65 && event.clientY <= box.bottom + 65;
      container.classList.toggle("in-target", inTarget);
      paint(inTarget ? mode : null);
    });
    control.addEventListener("pointerup", () => {
      if (!origin) return;
      const moved = origin.moved;
      origin = null;
      control.classList.remove("dragging");
      container.classList.remove("dragging");
      if (moved) {
        suppressClick = true;
        const inTarget = container.classList.contains("in-target");
        setMode(inTarget ? mode : null);
      }
      container.classList.remove("in-target");
    });
    control.addEventListener("pointercancel", () => {
      origin = null;
      control.classList.remove("dragging");
      container.classList.remove("dragging", "in-target");
      setMode(active);
    });
    control.addEventListener("click", () => {
      if (suppressClick) { suppressClick = false; return; }
      setMode(active === mode ? null : mode);
    });
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && active) setMode(null);
  });
  window.addEventListener("resize", () => { if (active) setMode(active); });
}

setupTimeControls();
