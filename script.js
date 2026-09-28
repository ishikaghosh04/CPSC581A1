let selected = []; // array of selected star IDs

const hoverTimers = {}; // store hover timers for each star
const hoverState = {};

// Components of the following code is generated using deepseek api
const starSpritePrefixes = {
  Ishika: "uta",
  Utaha: "uta",
  Yasmin: "uta",
  Linden: "linden"
};

const SPRITE_STATE_COUNT = 4;

function applyStarSprite(el, prefix) {
  el.classList.add("star-image");

  for (let state = 1; state <= SPRITE_STATE_COUNT; state++) {
    const url = `images/${prefix}${state}.png`;
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

    applyStarSprite(el, starSpritePrefixes[star.name]);

    // user interactions
    el.addEventListener("mouseenter", () => handleHoverStart(star));
    el.addEventListener("mouseleave", () => handleHoverEnd(star));
    el.addEventListener("click", () => handleClick(star));

    sky.appendChild(el);
  });

  drawConstellation();
}

function isSelected(id) {
  return selected.includes(id);
}

function handleHoverStart(star) {
  if (isSelected(star.id)) return;

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
  clearTimeout(hoverTimers[star.id]);
  delete hoverTimers[star.id];
  delete hoverState[star.id];

  const el = document.getElementById(star.id);
  if (!el) return;
  el.classList.remove("hover-first-state");
  el.classList.remove("hover-final-state");
}

function clearHover(starId) {
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
    clearHobbyIcons(star.id);
    toggleBgStars(star, false);
    drawConstellation();
    updateSharedHobbyHighlights();
    return;
  }

  selected.push(star.id);

  const el = document.getElementById(star.id);
  el.classList.add("selected");
  el.style.setProperty("--star-glow", star.favColor);
  toggleBgStars(star, true);
  showHobbyIcons(star);
  drawConstellation();
  updateSharedHobbyHighlights();
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

// Components of the following code is generated using Claude.ai
const hobbyImages = {
  Ishika: { music: "music-ishika.png", drawing: "drawing-ishika.png", gym: "gym-ishika.png" },
  Utaha: { music: "music-uta.png", crocheting: "crochet.png", hiking: "hiking-uta.png", swimming: "swimming.png" },
  Yasmin: { gym: "gym-yasmin.png", hiking: "hiking-yasmin.png" },
  Linden: { pickleball: "pickleball.png", reading: "reading.png", drawing: "drawing-linden.png" }
};

function hobbyIcon(star, hobby) {
  const file = (hobbyImages[star.name] || {})[hobby];
  if (!file) return null;

  const image = document.createElement("img");
  image.src = `images/hobbies/${file}`;
  image.alt = hobby;
  return image;
}

const hobbyLayoutCache = {}; // cache for hobby icon positions

function getHobbyLayout(star) {
  if (!hobbyLayoutCache[star.id]) {
    const count = star.hobbies.length;
    hobbyLayoutCache[star.id] = star.hobbies.map((_, i) => {
      const baseAngle = (i / count) * 2 * Math.PI - Math.PI / 2;
      const jitterRange = (2 * Math.PI / count) * 0.7; // stay mostly within its own "slice"
      const angle = baseAngle + (Math.random() - 0.5) * jitterRange;
      const radius = 100 + Math.random() * 10; 
      return { angle, radius };
    });
  }
  return hobbyLayoutCache[star.id];
}

function showHobbyIcons(star) {
  const sky = document.getElementById("sky");
  const svg = document.getElementById("hobby-lines");
  const center = starCenter(star.id);
  if (!sky || !svg || !center) return;

  svg.setAttribute("viewBox", `0 0 ${sky.clientWidth} ${sky.clientHeight}`);
  const layout = getHobbyLayout(star);

  // const radius = 70; // px, distance from star to each hobby icon
  // const count = star.hobbies.length;

  star.hobbies.forEach((hobby, i) => {
    const { angle, radius } = layout[i];
    const iconX = center.x + radius * Math.cos(angle);
    const iconY = center.y + radius * Math.sin(angle);

    const icon = hobbyIcon(star, hobby);
    if (!icon) return;

    icon.classList.add("hobby-icon");
    icon.dataset.starId = star.id;
    icon.dataset.hobby = hobby.toLowerCase();
    icon.title = hobby;
    icon.style.left = `${iconX}px`;
    icon.style.top = `${iconY}px`;
    sky.appendChild(icon);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", center.x);
    line.setAttribute("y1", center.y);
    line.setAttribute("x2", iconX);
    line.setAttribute("y2", iconY);
    line.setAttribute("stroke", "white");
    line.setAttribute("class", "hobby-line");
    line.dataset.starId = star.id;
    svg.appendChild(line);
  });
}

function clearHobbyIcons(starId) {
  document.querySelectorAll(`.hobby-icon[data-star-id="${starId}"]`).forEach(el => el.remove());
  document.querySelectorAll(`.hobby-line[data-star-id="${starId}"]`).forEach(el => el.remove());
}

function sharedSelectedHobbies() {
  if (selected.length < 2) return [];
  const people = selected.map(id => stars.find(star => star.id === id));
  return people[0].hobbies.map(hobby => hobby.toLowerCase()).filter(hobby =>
    people.every(person => person.hobbies.some(item => item.toLowerCase() === hobby)));
}

function updateSharedHobbyHighlights() {
  const shared = sharedSelectedHobbies();

  document.querySelectorAll(".hobby-icon").forEach(icon => {
    icon.classList.toggle("shared-hobby", shared.includes(icon.dataset.hobby));
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

function blendColors(hex1, hex2) {
  // simple midpoint RGB blend — fill in when you get to bg color logic
}

window.addEventListener("resize", drawConstellation);

renderStars();
