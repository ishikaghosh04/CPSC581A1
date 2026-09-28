let selected = []; // array of selected star IDs

const hoverTimers = {}; // store hover timers for each star
const hoverState = {}; 
const hoveredHobbyStars = new Set();
const pointerHoverStars = new Set();
const keyboardFocusStars = new Set();

// Change filenames here to choose each person's initial, hover, and clicked art.
// Files live in the images/ folder. Both glow stages use the same hover picture.
// Linden's four star pictures: initial, first hover, second hover, selected.
// Yasmin uses Utaha's first and third frames, as in Linden's original code.
const starPictures = {
  Ishika: { initial: "ishika1.png", hover1: "ishika2.png", hover2: "ishika3.png", clicked: "ishika4.png" },
  Utaha:  { initial: "uta1.png", hover1: "uta2.png", hover2: "uta3.png", clicked: "uta4.png" },
  Yasmin: { initial: "uta1.png", hover1: "yasmin2.png", hover2: "uta3.png", clicked: "yasmin4.png" },
  Linden: { initial: "linden1.png", hover1: "linden2.png", hover2: "linden3.png", clicked: "linden4.png" }
};
// Choose one sun picture and one moon picture for EVERY star.
// Put each image in images/. These choices are independent of initial/hover/clicked.
// Empty strings keep the usual star picture until you choose one.
const timePictures = {
  Ishika: { morning: "linden2.png", night: "ishika4.png" },
  Utaha:  { morning: "ishika4.png", night: "linden2.png" },
  Yasmin: { morning: "ishika4.png", night: "linden2.png" },
  Linden: { morning: "linden2.png", night: "ishika4.png" }
};
function attachStarArt(el, star) {
  el.classList.add("illustrated-star", `star-art-${star.id}`);
  const pictures = starPictures[star.name];
  const frames = [pictures.initial, pictures.hover1, pictures.hover2, pictures.clicked];
  frames.forEach((filename, index) => {
    const url = `images/${filename}`;
    el.style.setProperty(`--art-${index + 1}`, `url("${url}")`);
    const preload = new Image();
    preload.src = url;
  });
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
    const el = document.createElement("button");
    el.type = "button";
    el.classList.add("star");
    el.setAttribute("aria-label", `Explore ${star.name}`);
    el.setAttribute("aria-pressed", "false");
    el.id = star.id;
    el.style.left = `${star.position.x}%`;
    el.style.top = `${star.position.y}%`;
    el.style.setProperty("--star-glow", star.favColor);
    attachStarArt(el, star); // Illustrated shape; the button stays interactive.
    const name = document.createElement("span");
    name.className = "star-name";
    name.textContent = star.name;
    el.appendChild(name);
    // hobby sketches, with the existing running artwork for running.
    const hobbyPictures = {
      Ishika: {music: "music-ishika.png", drawing: "drawing-ishika.png", running: "running.png"},
      Utaha: {music: "music-uta.png", crocheting: "crochet.png", hiking: "hiking-uta.png", swimming: "swimming.png"},
      Yasmin: {gym: "gym-yasmin.png", hiking: "hiking-yasmin.png", running: "running.png", music: "music-uta.png"},
      Linden: {pickleball: "pickleball.png", reading: "reading.png", drawing: "drawing-linden.png"}
    };
    const detail = document.createElement("span");
    detail.className = "star-detail";
    star.hobbies.forEach(hobby => {
      const item = document.createElement("span");
      item.className = "hobby-tag";
      item.dataset.hobby = hobby.toLowerCase();
      const picture = (hobbyPictures[star.name] || {})[hobby.toLowerCase()];
      if (picture) {
        const icon = document.createElement("img");
        icon.className = "hobby-picture";
        icon.src = picture.endsWith(".svg") ? picture : `images/hobbies/${picture}`;
        icon.alt = ""; // The visible text provides the accessible hobby name.
        item.appendChild(icon);
      }
      const label = document.createElement("span");
      label.textContent = hobby;
      item.appendChild(label);
      detail.appendChild(item);
    });
    el.appendChild(detail);

    // user interactions
    el.addEventListener("mouseenter", () => {
      pointerHoverStars.add(star.id);
      handleHoverStart(star);
    });
    el.addEventListener("pointerdown", () => keyboardFocusStars.delete(star.id));
    el.addEventListener("mouseleave", () => {
      pointerHoverStars.delete(star.id);
      if (!keyboardFocusStars.has(star.id)) handleHoverEnd(star);
    });
    el.addEventListener("focus", () => {
      if (el.matches(":focus-visible")) {
        keyboardFocusStars.add(star.id);
        handleHoverStart(star);
      }
    });
    el.addEventListener("blur", () => {
      keyboardFocusStars.delete(star.id);
      if (!pointerHoverStars.has(star.id)) handleHoverEnd(star);
    });
    el.addEventListener("click", () => handleClick(star));

    sky.appendChild(el);
  });

  const caption = document.createElement("section");
  caption.id = "pair-caption";
  caption.setAttribute("role", "status");
  caption.setAttribute("aria-live", "polite");
  document.body.appendChild(caption);
  drawConstellation();
  updatePairCaption();
}

function isSelected(id) {
  return selected.includes(id);
}

//  components of the following code generated with deepseek api
function handleHoverStart(star) {
  if (isSelected(star.id)) return;

  hoveredHobbyStars.add(star.id);
  layoutAllHobbyIcons();
  clearTimeout(hoverTimers[star.id]);
  hoverState[star.id] = true;

  const el = document.getElementById(star.id);
  if (el) {
    el.classList.remove("hover-glow-faint");
    el.classList.remove("hover-glow-bright");
  }

  hoverTimers[star.id] = setTimeout(() => {
    if (!hoverState[star.id] || isSelected(star.id)) return;
    const el = document.getElementById(star.id);
    el.classList.add("hover-glow-faint");

    hoverTimers[star.id] = setTimeout(() => {
      if (!hoverState[star.id] || isSelected(star.id)) return;
      const el = document.getElementById(star.id);
      el.classList.remove("hover-glow-faint");
      el.classList.add("hover-glow-bright");
    }, star.hoverTime);
  }, 1000);
}

function handleHoverEnd(star) {
  const el = document.getElementById(star.id);
  hoveredHobbyStars.delete(star.id);
  layoutAllHobbyIcons();
  clearTimeout(hoverTimers[star.id]);
  delete hoverTimers[star.id];
  delete hoverState[star.id];

  if (!el) return;
  el.classList.remove("hover-glow-faint");
  el.classList.remove("hover-glow-bright");
}

function clearHover(starId) {
  keyboardFocusStars.delete(starId);
  hoveredHobbyStars.delete(starId);
  layoutAllHobbyIcons();
  clearTimeout(hoverTimers[starId]);
  delete hoverTimers[starId];
  delete hoverState[starId];

  const el = document.getElementById(starId);
  if (!el) return;
  el.classList.remove("hover-glow-faint");
  el.classList.remove("hover-glow-bright");
}

// components of this code is generated using https://chat.openai.com/chat
function handleClick(star) {
  clearHover(star.id);

  if (isSelected(star.id)) {
    selected = selected.filter(id => id !== star.id);
    document.getElementById(star.id).classList.remove("selected");
    document.getElementById(star.id).setAttribute("aria-pressed", "false");
    clearHobbyIcons(star.id);
    toggleBgStars(star, false);
    drawConstellation();
    updatePairCaption();
    return;
  }

  selected.push(star.id);

  const el = document.getElementById(star.id);
  el.classList.add("selected");
  el.setAttribute("aria-pressed", "true");
  toggleBgStars(star, true);
  showHobbyIcons(star);
  drawConstellation();
  updatePairCaption();
}

function drawConstellation() {
  const svg = document.getElementById("constellation-lines");
  if (!svg) return;

  const sky = document.getElementById("sky");
  svg.innerHTML = "";
  document.querySelectorAll(".shared-reveal").forEach(reveal => reveal.remove());
  svg.setAttribute("viewBox", `0 0 ${sky.clientWidth} ${sky.clientHeight}`);
  layoutAllHobbyIcons();

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

// Only hobbies present in every selected person's profile count as shared.
function sharedSelectedHobbies() {
  if (selected.length < 2) return [];
  const people = selected.map(id => stars.find(star => star.id === id));
  return people[0].hobbies.map(hobby => hobby.toLowerCase()).filter(hobby =>
    people.every(person => person.hobbies.some(item => item.toLowerCase() === hobby)));
}

function starCenter(id) {
  const sky = document.getElementById("sky");
  const star = stars.find(item => item.id === id);
  if (!sky || !star) return null;

  return {
    x: sky.clientWidth * star.position.x / 100,
    y: sky.clientHeight * star.position.y / 100
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

// The caption describes the most recently selected pair when 2+ stars are active.
function updatePairCaption() {
  const caption = document.getElementById("pair-caption");
  // The orbit copies already have the right shared state; reset only the
  // hidden profile tags so clicking a second star highlights immediately.
  document.querySelectorAll(".star .hobby-tag.shared").forEach(tag => tag.classList.remove("shared"));
  if (selected.length < 2) {
    caption.classList.remove("visible");
    caption.replaceChildren();
    return;
  }

  const sharedHobbies = sharedSelectedHobbies();
  if (selected.length > 2) {
    selected.forEach(id => document.querySelectorAll(`#${id} .hobby-tag`).forEach(tag => {
      tag.classList.toggle("shared", sharedHobbies.includes(tag.dataset.hobby));
    }));
    const title = document.createElement("strong");
    title.textContent = selected.map(id => stars.find(star => star.id === id).name).join(" + ");
    const similarity = document.createElement("p");
    similarity.textContent = sharedHobbies.length
      ? `All ${selected.length} enjoy ${sharedHobbies.join(" and ")}.`
      : `No hobby is shared by all ${selected.length} selected people.`;
    caption.replaceChildren(title, similarity);
    caption.classList.add("visible");
    return;
  }

  const [a, b] = selected.slice(-2).map(id => stars.find(star => star.id === id));
  [a, b].forEach(star => {
    document.querySelectorAll(`#${star.id} .hobby-tag`).forEach(tag => {
      tag.classList.toggle("shared", sharedHobbies.includes(tag.dataset.hobby));
    });
  });

  const hobbyText = sharedHobbies.length
    ? `Both enjoy ${sharedHobbies.join(" and ")}.`
    : "They do not have a listed hobby in common.";
  const similarity = hobbyText;

  const title = document.createElement("strong");
  title.textContent = `${a.name} + ${b.name}`;
  const common = document.createElement("p");
  common.textContent = similarity;
  const comparison = document.createElement("div");
  comparison.className = "difference-comparison";
  [a, b].forEach((person, index) => {
    const card = document.createElement("div");
    card.className = "difference-card";
    card.style.setProperty("--card-color", person.favColor);
    const symbol = document.createElement("span");
    symbol.className = "difference-symbol";
    symbol.textContent = person.sleep === "night owl" ? "☾" : "☀";
    const info = document.createElement("span");
    const name = document.createElement("b");
    name.textContent = person.name;
    const detail = document.createElement("small");
    detail.textContent = `${person.sleep === "night owl" ? "Night owl" : "Early bird"} · ${person.personality}`;
    info.append(name, detail);
    card.append(symbol, info);
    comparison.appendChild(card);
    if (index === 0) {
      const link = document.createElement("span");
      link.className = "difference-link";
      link.textContent = "✧";
      link.setAttribute("aria-hidden", "true");
      comparison.appendChild(link);
    }
  });
  const contrast = document.createElement("p");
  contrast.className = "screen-reader-only";
  contrast.textContent = `${a.name}: ${a.hobbies.join(", ")}. ${b.name}: ${b.hobbies.join(", ")}.`;
  caption.replaceChildren(title, common, comparison, contrast);
  caption.classList.add("visible");
}

function showHobbyIcons(star) {
  layoutAllHobbyIcons();
}

function clearHobbyIcons(starId) {
  layoutAllHobbyIcons();
}

// Fan each person's illustrated hobbies out from their star. 
// Clone existing labelled tags so the image source stays consistent.
// Change x/y for one person's hobby without moving any star.
// Positive x moves the hobby right; positive y moves it down.
const hobbyPositions = {
  star1: { // Ishika
    music: { x: -50, y: 200  }, drawing: { x: -120, y: -40 }, running: { x: -50, y: -170 }
  },
  star2: { // Utaha
    music: { x: 30, y: -80 }, crocheting: { x: 70, y: -50 },
    hiking: { x: 110, y: 0 }, swimming: { x: 80, y: 150 }
  },
  star3: { // Yasmin
    gym: { x: 200, y: 190 }, hiking: { x: 20, y: 300 },
    running: { x: -180, y: 200 }, music: { x: -130, y: -80 }
  },
  star4: { // Linden
    pickleball: { x: 0, y: 200 }, reading: { x: 80, y: 300 }, drawing: { x: 80, y: 50 }
  }
};

function layoutAllHobbyIcons() {
  const sky = document.getElementById("sky");
  const lines = document.getElementById("hobby-lines");
  if (!sky || !lines) return;
  sky.querySelectorAll(".orbit-hobby").forEach(item => item.remove());
  lines.replaceChildren();
  lines.setAttribute("viewBox", `0 0 ${sky.clientWidth} ${sky.clientHeight}`);

  [...new Set([...selected, ...hoveredHobbyStars])].forEach(id => {
    const star = document.getElementById(id);
    const center = starCenter(id);
    if (!star || !center) return;
    const hobbies = [...star.querySelectorAll(".hobby-tag")];
    const count = hobbies.length;
    const radius = Math.min(155, Math.max(90, sky.clientWidth * .115));
    const spread = Math.min(Math.PI * .95, (count - 1) * .57);
    // Point away from the nearest horizontal edge; place hobbies above the star.
    const direction = center.x < sky.clientWidth / 2 ? -Math.PI / 2 + .22 : -Math.PI / 2 - .22;
    hobbies.forEach((tag, index) => {
      const angle = direction - spread / 2 + (count === 1 ? 0 : index * spread / (count - 1));
      const offset = hobbyPositions[id]?.[tag.dataset.hobby] || { x: 0, y: 0 };
      const x = Math.max(53, Math.min(sky.clientWidth - 53, center.x + radius * Math.cos(angle) + offset.x));
      const y = Math.max(78, Math.min(sky.clientHeight - 38, center.y + radius * Math.sin(angle) + offset.y));
      const item = tag.cloneNode(true);
      item.classList.add("orbit-hobby");
      item.dataset.starId = id;
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      sky.appendChild(item);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "hobby-connector");
      line.setAttribute("x1", center.x);
      line.setAttribute("y1", center.y);
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);
      lines.appendChild(line);
    });
  });
  const common = sharedSelectedHobbies();
  sky.querySelectorAll(".orbit-hobby").forEach(item => {
    item.classList.toggle("shared", common.includes(item.dataset.hobby));
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


// The sun and moon are fixed targets. Only the four star buttons are interactive.
function setupTimeControls() {
  const container = document.getElementById("time-controls");
  const announcement = document.getElementById("time-announcement");
  const originalArt = new Map();
  document.getElementById("time-target")?.remove();
  stars.forEach(star => ["morning", "night"].forEach(mode => {
    const filename = timePictures[star.name]?.[mode];
    if (filename) { const picture = new Image(); picture.src = `images/${filename}`; }
  }));

  // Convert the old sun/moon buttons into decorative drop targets.
  const targets = {};
  for (const [mode, id, label] of [
    ["morning", "sun-control", "Sun: drag a star here"],
    ["night", "moon-control", "Moon: drag a star here"]
  ]) {
    const old = document.getElementById(id);
    const target = document.createElement("div");
    target.id = id;
    target.className = old.className;
    target.setAttribute("role", "img");
    target.setAttribute("aria-label", label);
    target.append(...old.childNodes);
    old.replaceWith(target);
    targets[mode] = target;
  }

  function setStarMode(star, mode) {
    const el = document.getElementById(star.id);
    if (!originalArt.has(star.id)) {
      originalArt.set(star.id, [1, 2, 3, 4].map(index => el.style.getPropertyValue(`--art-${index}`)));
    }
    const matches = mode && (mode === "morning" ? star.sleep === "early bird" : star.sleep === "night owl");
    const filename = mode && timePictures[star.name]?.[mode];
    el.classList.toggle("time-match", Boolean(matches));
    el.classList.toggle("time-art-active", Boolean(filename));
    el.classList.toggle("time-other", Boolean(mode && !matches));
    if (filename) el.style.setProperty("--time-art", `url("images/${filename}")`);
    else el.style.removeProperty("--time-art");
    // Apply the chosen picture to every artwork state. Hover and selection
    // therefore cannot replace it with an older picture during a drag.
    [1, 2, 3, 4].forEach((index) => {
      el.style.setProperty(`--art-${index}`, filename
        ? `url("images/${filename}")`
        : originalArt.get(star.id)[index - 1]);
    });
    if (matches) {
      el.style.setProperty("--time-color", mode === "morning" ? "#ffe092" : "#bed4ff");
      el.dataset.timeLabel = mode === "morning" ? "☀ Morning person" : "☾ Night person";
    } else {
      el.style.removeProperty("--time-color");
      delete el.dataset.timeLabel;
    }
    el.dataset.timeMode = mode || "";
    announcement.textContent = mode
      ? `${star.name} at the ${mode === "morning" ? "sun" : "moon"}: ${matches ? "this is their time" : "this is not their usual time"}.`
      : `${star.name} returned to their usual picture.`;
  }

  function targetAt(x, y, starElement) {
    const starBox = starElement.getBoundingClientRect();
    const starX = starBox.left + starBox.width / 2;
    const starY = starBox.top + starBox.height / 2;
    let nearest = null;
    let nearestDistance = 155;
    for (const mode of ["morning", "night"]) {
      const box = targets[mode].getBoundingClientRect();
      const targetX = box.left + box.width / 2;
      const targetY = box.top + box.height / 2;
      // A generous proximity zone triggers before the pictures touch.
      const distance = Math.hypot(starX - targetX, starY - targetY);
      if (distance < nearestDistance) { nearest = mode; nearestDistance = distance; }
    }
    return nearest;
  }

  stars.forEach(star => {
    const el = document.getElementById(star.id);
    el.setAttribute("aria-label", `Explore ${star.name}; drag to sun or moon, or press S or M when focused`);
    let drag = null;
    let suppressClick = false;
    el.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      drag = { x: event.clientX, y: event.clientY, left: el.style.left, top: el.style.top,
        moved: false, previousMode: el.dataset.timeMode || null, preview: null };
      el.setPointerCapture(event.pointerId);
    });
    el.addEventListener("pointermove", event => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 5) return;
      drag.moved = true;
      el.classList.add("star-dragging");
      document.body.classList.add("dragging-member");
      el.style.left = `calc(${drag.left} + ${dx}px)`;
      el.style.top = `calc(${drag.top} + ${dy}px)`;
      const over = targetAt(event.clientX, event.clientY, el);
      for (const mode of ["morning", "night"]) targets[mode].classList.toggle("star-over-target", mode === over);
      if (over !== drag.preview) {
        drag.preview = over;
        setStarMode(star, over || drag.previousMode);
      }
      drawConstellation();
    });
    function finish(event, cancelled = false) {
      if (!drag) return;
      const moved = drag.moved;
      // Always return to the person's assigned position, even if a previous
      // drag was interrupted before its saved inline position was restored.
      el.style.left = `${star.position.x}%`;
      el.style.top = `${star.position.y}%`;
      el.classList.remove("star-dragging");
      document.body.classList.remove("dragging-member");
      for (const target of Object.values(targets)) target.classList.remove("star-over-target");
      drag = null;
      // The sun/moon image and its glow are only a drag preview.
      setStarMode(star, null);
      pointerHoverStars.delete(star.id);
      clearHover(star.id);
      drawConstellation();
      if (moved) {
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
      }
    }
    el.addEventListener("pointerup", event => finish(event));
    el.addEventListener("pointercancel", event => finish(event, true));
    el.addEventListener("click", event => {
      if (!suppressClick) return;
      event.stopImmediatePropagation();
      event.preventDefault();
      suppressClick = false;
    }, true);
    el.addEventListener("keydown", event => {
      const key = event.key.toLowerCase();
      if (key === "s" || key === "m") {
        event.preventDefault();
        setStarMode(star, key === "s" ? "morning" : "night");
      } else if (event.key === "Escape") setStarMode(star, null);
    });
  });
}

setupTimeControls();
