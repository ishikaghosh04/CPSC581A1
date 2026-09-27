let selected = []; // array of selected star IDs

const hoverTimers = {}; // store hover timers for each star
const hoverState = {}; 

function renderStars() {
  const sky = document.getElementById("sky");
  const lines = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  lines.id = "constellation-lines";
  sky.appendChild(lines);

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
    el.textContent = "★"; // Main star icon
    const name = document.createElement("span");
    name.className = "star-name";
    name.textContent = star.name;
    el.appendChild(name);
    const icons = {
      music: "♫", drawing: "✏️", running: "🏃",
      crocheting: "🧶", hiking: "🥾", swimming: "🏊",
      gym: "🏋️", pickleball: "🏓", reading: "📖"
    };
    const detail = document.createElement("span");
    detail.className = "star-detail";
    star.hobbies.forEach(hobby => {
      const item = document.createElement("span");
      item.className = "hobby-tag";
      item.dataset.hobby = hobby.toLowerCase();
      item.textContent = `${icons[hobby.toLowerCase()] || "✦"} ${hobby}`;
      detail.appendChild(item);
    });
    el.appendChild(detail);

    // user interactions
    el.addEventListener("mouseenter", () => handleHoverStart(star));
    el.addEventListener("mouseleave", () => handleHoverEnd(star));
    el.addEventListener("focus", () => handleHoverStart(star));
    el.addEventListener("blur", () => handleHoverEnd(star));
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

function handleHoverStart(star) {
  if (isSelected(star.id)) return;

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
  clearTimeout(hoverTimers[star.id]);
  delete hoverTimers[star.id];
  delete hoverState[star.id];

  const el = document.getElementById(star.id);
  if (!el) return;
  el.classList.remove("hover-glow-faint");
  el.classList.remove("hover-glow-bright");
}

function clearHover(starId) {
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
      line.setAttribute("pathLength", "1");
      svg.appendChild(line);
    }
  }

  const hobbies = sharedSelectedHobbies();
  if (selected.length < 2 || hobbies.length === 0) return;

  const scenes = hobbies.filter(hobby => ["music", "hiking", "running", "drawing"].includes(hobby));
  if (!scenes.length) return;
  const centers = selected.map(starCenter);
  if (!centers.every(Boolean)) return;
  const count = centers.length;
  const point = {
    x: centers.reduce((sum, center) => sum + center.x, 0) / count,
    y: centers.reduce((sum, center) => sum + center.y, 0) / count
  };
  scenes.forEach((scene, index) => showSharedScene(scene, point, sky,
    count === 3 && scene === "music" ? "ALL THREE SHARE MUSIC ♫" : undefined,
    index, scenes.length));

}

// Only hobbies present in every selected person's profile count as shared.
function sharedSelectedHobbies() {
  if (selected.length < 2) return [];
  const people = selected.map(id => stars.find(star => star.id === id));
  return people[0].hobbies.map(hobby => hobby.toLowerCase()).filter(hobby =>
    people.every(person => person.hobbies.some(item => item.toLowerCase() === hobby)));
}

function showSharedScene(scene, point, sky, customLabel, index, total) {
  const reveal = document.createElement("div");
  reveal.classList.add("shared-reveal");
  reveal.classList.add(`scene-${scene}`);
  reveal.setAttribute("aria-hidden", "true");
  const bounds = sky.getBoundingClientRect();
  const offset = (index - (total - 1) / 2) * Math.min(150, window.innerWidth * .4);
  reveal.style.left = `${Math.max(65, Math.min(window.innerWidth - 65, bounds.left + point.x + offset))}px`;
  reveal.style.top = `${Math.max(115, Math.min(window.innerHeight - 145, bounds.top + point.y - 10))}px`;
  const art = document.createElement("img");
  art.src = { music: "music-cat.svg", hiking: "hiking-scene.svg", running: "running-scene1.svg", drawing: "drawing-scene.svg" }[scene];
  art.alt = "";
  reveal.appendChild(art);
  for (const [symbol, direction] of (scene === "music" ? [["♫", "left"], ["♪", "right"]] : [["✦", "left"], ["✦", "right"]])) {
    const note = document.createElement("span");
    note.className = `music-note ${direction}`;
    note.textContent = symbol;
    reveal.appendChild(note);
  }
  const label = document.createElement("span");
  label.className = "music-label";
  label.textContent = customLabel || { music: "MUSIC CONNECTS US", hiking: "TRAIL BUDDIES", running: "RUNNING TOGETHER", drawing: "CREATING TOGETHER" }[scene];
  reveal.appendChild(label);
  document.body.appendChild(reveal);
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

// The caption describes the most recently selected pair when 2+ stars are active.
function updatePairCaption() {
  const caption = document.getElementById("pair-caption");
  document.querySelectorAll(".hobby-tag.shared").forEach(tag => tag.classList.remove("shared"));
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

  const active = ["running", "gym", "hiking", "swimming", "pickleball"];
  const aActivity = a.hobbies.find(hobby => active.includes(hobby.toLowerCase()));
  const bActivity = b.hobbies.find(hobby => active.includes(hobby.toLowerCase()));
  let similarity;
  if (sharedHobbies.length) similarity = `Both enjoy ${sharedHobbies.join(" and ")}.`;
  else if (a.sleep === b.sleep) similarity = `Both are ${a.sleep === "night owl" ? "night owls" : "early birds"}.`;
  else if (a.personality === b.personality) similarity = `Both describe themselves as ${a.personality}.`;
  else if (aActivity && bActivity) similarity = `Both enjoy active hobbies: ${a.name} lists ${aActivity}, and ${b.name} lists ${bActivity}.`;
  else similarity = "Their listed interests show different sides of this team.";

  let difference;
  let contrastDetails;
  if (a.sleep !== b.sleep) {
    difference = `${a.name} is ${a.sleep === "night owl" ? "a" : "an"} ${a.sleep}, while ${b.name} is ${b.sleep === "night owl" ? "a" : "an"} ${b.sleep}.`;
    contrastDetails = [a, b].map(star => ({
      icon: star.sleep === "night owl" ? "☾" : "☀",
      label: star.sleep === "night owl" ? "Night owl" : "Early bird"
    }));
  } else if (a.personality !== b.personality) {
    difference = `${a.name} describes themselves as ${a.personality}, while ${b.name} describes themselves as ${b.personality}.`;
    contrastDetails = [a, b].map(star => ({
      icon: { extrovert: "✦", introvert: "❋", ambivert: "◈" }[star.personality] || "✧",
      label: star.personality
    }));
  }
  else {
    const aUnique = a.hobbies.find(hobby => !b.hobbies.some(item => item.toLowerCase() === hobby.toLowerCase()));
    const bUnique = b.hobbies.find(hobby => !a.hobbies.some(item => item.toLowerCase() === hobby.toLowerCase()));
    difference = aUnique && bUnique
      ? `${a.name} enjoys ${aUnique}, while ${b.name} enjoys ${bUnique}.`
      : "They bring their own perspectives to the team.";
    contrastDetails = [aUnique, bUnique].map(hobby => ({
      icon: { music: "♫", drawing: "✎", running: "🏃", crocheting: "🧶", hiking: "🥾", swimming: "🏊", gym: "🏋", pickleball: "🏓", reading: "📖" }[hobby?.toLowerCase()] || "✦",
      label: hobby || "Unique perspective"
    }));
  }

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
    symbol.textContent = contrastDetails[index].icon;
    const info = document.createElement("span");
    const name = document.createElement("b");
    name.textContent = person.name;
    const detail = document.createElement("small");
    detail.textContent = contrastDetails[index].label;
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
  contrast.textContent = difference;
  caption.replaceChildren(title, common, comparison, contrast);
  caption.classList.add("visible");
}

function showHobbyIcons(star) {
  // TODO: create and display small icon elements near the star
}

function clearHobbyIcons(starId) {
  // TODO: remove that star's hobby icon elements
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


// The sun and moon are draggable, and can also be activated with a click or Enter.
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
