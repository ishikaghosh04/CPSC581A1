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
  const s1 = stars.find(s => s.id === id1);
  const s2 = stars.find(s => s.id === id2);
  const shared = s1.hobbies.filter(h => s2.hobbies.includes(h));

  // TODO: highlight shared icons, dim the rest
  // TODO: draw connecting line between s1.position and s2.position
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