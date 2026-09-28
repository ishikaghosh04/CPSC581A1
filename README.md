# Team Constellation — CPSC 581 Assignment 1

Team Constellation is an interactive night sky introducing Ishika, Utaha, Yasmin, and Linden. Each illustrated star represents one person. Explore stars to see hobbies, select several to find connections, and drag a star toward the fixed sun or moon to reveal its morning or night reaction.

## Run the application

1. Download or extract the complete project ZIP.
2. Keep `index.html`, `style.css`, `data.js`, `script.js`, and the `images/` folder in the same project folder. Keep `images/hobbies/` inside `images/`.
3. Open `index.html` in a modern browser. VS Code Live Server also works.

No build step, package installation, account, or server-side code is required.

## Explore the sky

| Action | Result |
| --- | --- |
| Hover over a star or focus it with Tab | The person's name appears, and illustrated, labelled hobbies appear around the star with straight connecting lines. After one second, the star shows its first hover picture. If you continue hovering, it shows a second picture after that person's `hoverTime`. |
| Click a star, or use Enter/Space when it is focused | The person stays selected with their hobbies visible. Click again to deselect. |
| Select two stars | A dotted line connects them. Every hobby they share grows, glows, and wiggles. A caption names the shared hobbies and compares their sleep preferences and personalities. |
| Select three or four stars | Only hobbies shared by **all** selected people are highlighted. The caption lists those hobbies, or says when no hobby is shared by everyone. |
| Drag a star near the fixed sun or moon | While dragging, the star previews its assigned morning or night picture. Stars whose sleep preference matches that celestial body grow and glow, and a short label appears. On release, the star returns to its original position and picture, and the temporary glow clears. |
| Focus a star and press S or M | Preview its sun or moon reaction without dragging. Press Escape to clear that preview. |

The sun and moon stay at the top of the screen; the four member stars are the draggable controls. Dragging does not permanently move a star.

**Examples:** Ishika and Yasmin share music and running, so both are highlighted when those two are selected. Ishika, Utaha, and Yasmin all share music; selecting all three highlights only music. The two-person caption also shows whether the people are early birds or night owls and lists their personality types.

## Team members

| Member | Personality | Sleep preference | Hobbies |
| --- | --- | --- | --- |
| Ishika | Extrovert | Night owl | Music, drawing, running |
| Utaha | Introvert | Early bird | Music, crocheting, hiking, swimming |
| Yasmin | Ambivert | Early bird | Gym, hiking, running, music |
| Linden | Introvert | Night owl | Pickleball, reading, drawing |

## Project files

| Path | Purpose |
| --- | --- |
| `index.html` | Page structure, sky artwork, fixed sun and moon, and status text. |
| `style.css` | Layout, picture states, glow, transitions, hobby highlights, and responsive styling. |
| `data.js` | Member data, hover times, star positions, and chosen glow colours. |
| `script.js` | Star rendering, hover and selection, hobby layout, connections, captions, and star dragging. |
| `images/*.png` | The illustrated star pictures. |
| `images/hobbies/*.png` | Hobby illustrations. Ishika and Yasmin use the same `running.png`; CSS tints Ishika's displayed copy yellow while Yasmin's stays red. |
| `music-cat.svg` | Included artwork; the current star connection interaction uses hobby highlighting instead of launching this scene. |
| `LICENSE` | Project licence. |

Some hobby artwork is embedded in `script.js` as image data. The pictured hobbies are also mapped to files in `images/hobbies/`.

## Customize a member

- Edit the member's `hobbies`, `personality`, `sleep`, `hoverTime`, or percentage `position` in `data.js`.
- Edit `starPictures` near the beginning of `script.js` to choose the initial, first-hover, second-hover, and clicked pictures. Yasmin currently uses `uta1.png` and `uta3.png` for her first and third frames, alongside `yasmin2.png` and `yasmin4.png`.
- Edit `timePictures` in `script.js` to choose a morning and night preview picture for **each** person. These filenames refer to files directly inside `images/`.
- Edit `hobbyPositions` in `script.js` to adjust individual hobby offsets without moving their star. Hobby picture filenames are in the `hobbyPictures` mapping.
- Keep the illustrated star PNGs in `images/` and hobby PNGs in `images/hobbies/` when renaming or replacing artwork.

## Licence

See [LICENSE](LICENSE).
