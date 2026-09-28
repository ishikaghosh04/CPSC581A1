# Team Constellation — CPSC 581 Assignment 1

An interactive night sky introducing four team members. Each illustrated star represents a person; exploring and connecting stars reveals their hobbies, sleep preferences, and personalities.

## Run locally

Download or extract the project, keeping `index.html`, `style.css`, `data.js`, `script.js`, and the `images/` folder together. Open `index.html` in a modern browser. No installation, build command, account, or external package is required. You can also open the folder with VS Code Live Server.

## Interactions

| Action | What happens |
| --- | --- |
| Hover over a star or focus it using Tab | The person's name and illustrated hobbies appear around the star, connected by straight lines. Its picture and glow change. |
| Click a star, or press Enter/Space while it is focused | Selects that person. Their star stays lit and their hobbies remain visible. Activate it again to deselect. |
| Select two stars | A dotted line joins them. Any shared hobbies grow, glow, and wiggle; a small panel names those hobbies and shows each person's sleep preference and personality. |
| Select three or four stars | Only hobbies common to **every** selected person receive the shared-hobby highlight. The panel lists those common hobbies, if any. |
| Drag the sun or moon to the middle of the sky | Every star switches to its assigned morning or night picture. Morning people respond to the sun; night people respond to the moon by growing and shining. |
| Click the sun or moon, or activate it with the keyboard | Activates that mode without dragging. Activate the same control again or press Escape to clear it. |

For example, Ishika and Yasmin share music and running, so both hobbies highlight when they are selected together. Ishika, Utaha, and Yasmin share music; when all three are selected, only music highlights.

## Team data

| Member | Personality | Sleep preference | Hobbies |
| --- | --- | --- | --- |
| Ishika | Extrovert | Night owl | Music, drawing, running |
| Utaha | Introvert | Early bird | Music, crocheting, hiking, swimming |
| Yasmin | Ambivert | Early bird | Gym, hiking, running, music |
| Linden | Introvert | Night owl | Pickleball, reading, drawing |

## Project files

| Path | Purpose |
| --- | --- |
| `index.html` | Sky layout, background artwork, and sun/moon controls. |
| `style.css` | Layout, visual states, transitions, and animations. |
| `data.js` | Member names, hobbies, personality, sleep preference, colour, and initial star position. |
| `script.js` | Star interactions, hobby artwork, connections, comparison panel, and sun/moon logic. |
| `images/` | Illustrated star pictures. Keep this folder next to `index.html`. |
| `LICENSE` | MIT license. |

The ZIP also contains `drawing-scene.svg`, `hiking-scene.svg`, `music-cat.svg`, `running-scene.svg`, and `running-scene1.svg`. They are included project artwork; the current two-star comparison does not launch those scene animations. Some hobby pictures are embedded directly in `script.js`.

## Change the content

- Edit a member's hobbies, personality, sleep preference, or `position` in `data.js`.
- Edit `starPictures` near the top of `script.js` to choose each member's initial, hover, and selected pictures. Filenames must exist in `images/`.
- Edit `timePictures` beside it to choose a separate morning and night picture for **each** member.
- Adjust `hobbyPositions` in `script.js` to move an individual hobby around its star without moving the star itself.

## License

MIT. See [LICENSE](LICENSE).
