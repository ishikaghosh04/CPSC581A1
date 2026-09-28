let selected = []; // array of selected star IDs

const hoverTimers = {}; // store hover timers for each star
const hoverState = {};

// Components of the following code is generated using deepseek api
const starSpritePrefixes = {
  Ishika: "ishika",
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
    toggleBgStars(star, false);
    drawConstellation();
    layoutAllHobbyIcons(); // removes this star's icons and re-validates everyone else's
    return;
  }

  selected.push(star.id);

  const el = document.getElementById(star.id);
  el.classList.add("selected");
  el.style.setProperty("--star-glow", star.favColor);
  toggleBgStars(star, true);
  drawConstellation();
  layoutAllHobbyIcons(); // adds this star's icons and re-validates everyone else's
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

// Components of the following logic is generated using Claude.ai
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

// Decide hobby icon positions randomly while avoiding collisions with star-star lines
const HOBBY_RADIUS_MIN = 110; // px, distance from star center to icon
const HOBBY_RADIUS_RANGE = 10;
const MIN_LINE_ANGLE = 0.7;      // rad (~35 deg): keep hobby lines off the same star's connecting lines
const MIN_ICON_GAP = 0.6;        // rad (~35 deg): keep one star's own icons apart
const MIN_LINE_CLEARANCE = 35;   // px: keep icons off OTHER stars' connecting lines
const MAX_PLACEMENT_TRIES = 60; // tries max 60 angles before giving up 

const hobbyLayoutCache = {}; // { starId: { hobbyName: { angle, radius } } }

function ccw(a, b, c) {
  return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
}

function segmentsIntersect(a, b, c, d) {
  return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
}

function distToSegment(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

function angleDiff(a, b) {
  const d = Math.abs(a - b) % (2 * Math.PI);
  return d > Math.PI ? 2 * Math.PI - d : d;
}

// All star-star lines currently drawn by drawConstellation()
function constellationSegments() {
  const segs = [];
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      const a = starCenter(selected[i]);
      const b = starCenter(selected[j]);
      if (a && b) segs.push({ a, b, ids: [selected[i], selected[j]] });
    }
  }
  return segs;
}

function isValidSpot(star, center, angle, radius, segs, takenAngles) {
  const end = {
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle)
  };

  // keep this star's own icons apart from each other
  if (takenAngles.some(t => angleDiff(angle, t) < MIN_ICON_GAP)) return false;

  for (const seg of segs) {
    if (seg.ids.includes(star.id)) {
      const otherId = seg.ids.find(id => id !== star.id);
      const otherCenter = starCenter(otherId);
      if (!otherCenter) continue;
      const lineAngle = Math.atan2(otherCenter.y - center.y, otherCenter.x - center.x);
      if (angleDiff(angle, lineAngle) < MIN_LINE_ANGLE) return false;
    } else {
      // a line between two OTHER stars: check real intersection and icon clearance
      if (segmentsIntersect(center, end, seg.a, seg.b)) return false;
      if (distToSegment(end, seg.a, seg.b) < MIN_LINE_CLEARANCE) return false;
    }
  }

  return true;
}

function findSpot(star, center, segs, takenAngles) {
  for (let tries = 0; tries < MAX_PLACEMENT_TRIES; tries++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = HOBBY_RADIUS_MIN + Math.random() * HOBBY_RADIUS_RANGE;
    if (isValidSpot(star, center, angle, radius, segs, takenAngles)) {
      return { angle, radius };
    }
  }
  return null;
}

function renderHobbyIcons(star, segs) {
  const sky = document.getElementById("sky");
  const svg = document.getElementById("hobby-lines");
  const center = starCenter(star.id);
  if (!sky || !svg || !center) return;

  svg.setAttribute("viewBox", `0 0 ${sky.clientWidth} ${sky.clientHeight}`);

  const cached = (hobbyLayoutCache[star.id] ||= {});
  const takenAngles = [];

  star.hobbies.forEach(hobby => {
    const icon = hobbyIcon(star, hobby);
    if (!icon) return;

    // Reuse the cached position unless it's missing or now collides with a new line
    let spot = cached[hobby];
    if (!spot || !isValidSpot(star, center, spot.angle, spot.radius, segs, takenAngles)) {
      spot = findSpot(star, center, segs, takenAngles) || spot || {
        angle: Math.random() * 2 * Math.PI,
        radius: HOBBY_RADIUS_MIN
      };
      cached[hobby] = spot;
    }
    takenAngles.push(spot.angle);

    const iconX = center.x + spot.radius * Math.cos(spot.angle);
    const iconY = center.y + spot.radius * Math.sin(spot.angle);

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

// Rebuilds every selected star's hobby icons. Called after any selection change (and on resize)
function layoutAllHobbyIcons() {
  document.querySelectorAll(".hobby-icon, .hobby-line").forEach(el => el.remove());

  const segs = constellationSegments();
  selected.forEach(id => {
    const star = stars.find(s => s.id === id);
    if (star) renderHobbyIcons(star, segs);
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

window.addEventListener("resize", () => {
  drawConstellation();
  layoutAllHobbyIcons();
});

renderStars();
