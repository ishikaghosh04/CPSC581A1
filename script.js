let selected = []; // array of selected star IDs(upto 2 for now i think)
const hoverTimers = {};  // store hover timers for each star

function renderStars() {
  const sky = document.getElementById("sky");
  stars.forEach(star => {
    const el = document.createElement("div");
    el.classList.add("star");
    el.id = star.id;
    el.style.left = `${star.position.x}%`;
    el.style.top = `${star.position.y}%`;
    el.textContent = "★"; // TO DO: replace with star icon or image
    el.style.color = "white";
    // user interactions
    el.addEventListener("mouseenter", () => handleHoverStart(star));
    el.addEventListener("mouseleave", () => handleHoverEnd(star));
    el.addEventListener("click", () => handleClick(star));

    sky.appendChild(el);
  });
}

function handleHoverStart(star) {
  hoverTimers[star.id] = setTimeout(() => {
    document.getElementById(star.id).style.color = star.favColor; // currently it changes the user star colour to their fav colour
    // TODO: shine animation
  }, star.hoverTime);
}

function handleHoverEnd(star) {
  clearTimeout(hoverTimers[star.id]);
}
// components of this code is generated using https://chat.openai.com/chat
function handleClick(star) {
  const el = document.getElementById(star.id);

  if (selected.includes(star.id)) {
    // unselect
    selected = selected.filter(id => id !== star.id);
    el.classList.remove("selected");
    clearHobbyIcons(star.id);
    toggleBgStars(star, false); // Hide this member's background stars
    if (selected.length < 2) clearPairEffects();
    return;
  }

  if (selected.length === 2) {
    // cap at 2 — drop oldest selection
    const removedId = selected.shift();
    document.getElementById(removedId).classList.remove("selected");
    clearHobbyIcons(removedId);
    const removedStar = stars.find(star => star.id === removedId); // Hide the background stars of the removed member
    toggleBgStars(removedStar, false);
  }

  selected.push(star.id);
  el.classList.add("selected");
  toggleBgStars(star, true); // Show this member's background stars
  showHobbyIcons(star);

  if (selected.length === 2) {
    handlePair(selected[0], selected[1]);
  }
}

function showHobbyIcons(star) {
  // TODO: create and display small icon elements near the star
}

function clearHobbyIcons(starId) {
  // TODO: remove that star's hobby icon elements
}

function handlePair(id1, id2) {
  clearPairEffects();

  const s1 = stars.find(s => s.id === id1);
  const s2 = stars.find(s => s.id === id2);

  const shared = [
    ...s1.hobbies.filter(h => s2.hobbies.includes(h)),
    ...(s1.sleep === s2.sleep ? [s1.sleep] : []),
    ...(s1.personality === s2.personality ? [s1.personality] : [])
  ];

  if (shared.length === 0) return;

  const sky = document.getElementById("sky");
  const a = document.getElementById(id1).getBoundingClientRect();
  const b = document.getElementById(id2).getBoundingClientRect();
  const bounds = sky.getBoundingClientRect();

  const x1 = a.left + a.width / 2 - bounds.left;
  const y1 = a.top + a.height / 2 - bounds.top;
  const x2 = b.left + b.width / 2 - bounds.left;
  const y2 = b.top + b.height / 2 - bounds.top;

  const line = document.createElement("div");
  line.className = "connecting-line";
  line.title = `Shared: ${shared.join(", ")}`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.width = `${Math.hypot(x2 - x1, y2 - y1)}px`;
  line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;

  sky.appendChild(line);
}

function clearPairEffects() {
  document.querySelectorAll(".connecting-line").forEach(line => line.remove());
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

function clearPairEffects() {
  // TODO: remove line, reset all hobby icons to dim, reset bg stars
}

function blendColors(hex1, hex2) {
  // simple midpoint RGB blend — fill in when you get to bg color logic
}

renderStars();