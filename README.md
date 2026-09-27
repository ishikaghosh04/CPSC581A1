# CPSC 581 A1 — Team Constellation

An interactive constellation that introduces four team members through their interests, sleep rhythms, and social energy. Each person is a star with a distinct colour. Selecting stars reveals what they share and how they differ.

## Run the project

1. Keep `index.html`, `style.css`, `data.js`, `script.js`, `campfire.js`, and the SVG scene files together in one folder.
2. Open `index.html` in a browser. No installation, build step, or external packages are required.
3. Alternatively, open the folder in VS Code and use Live Server if you prefer a local development server.

**Use the exact filenames shown below.** If your downloaded files have suffixes such as `index(9).html` or `data(9).js`, rename them to `index.html` and `data.js` inside the project folder. The names referenced in `index.html` and `script.js` must match.

## Explore

| Action | Result |
| --- | --- |
| Hover over a star or focus it with the keyboard | The person's name and hobbies appear beside the star, with a gradually strengthening glow. |
| Click a star | It stays selected and its background stars light up in its chosen colour. Click again to deselect it. |
| Select two stars | A line connects them. Shared hobbies are highlighted; the caption describes a similarity and a difference. An illustrated scene appears for each supported shared hobby. |
| Select three or four stars | Only hobbies shared by **every** selected person are highlighted and illustrated. |
| Drag the sun or moon toward the centre, or click it | Stars for early birds or night owls brighten and reveal their names. Click the active control again to clear it. |
| Drag the campfire toward the centre, or click it | Stars move to show social distance: extrovert closest with more sparks, ambivert a little farther with fewer sparks, introverts farthest away. Click again or press Escape to restore their positions. |

The controls can be reached with Tab and activated with Enter or Space. Escape clears an active sun, moon, or campfire interaction.

## The team

| Member | Star colour | Social energy | Sleep rhythm | Hobbies |
| --- | --- | --- | --- | --- |
| Ishika | Gold | Extrovert | Night owl | Music, drawing, running |
| Utaha | Blue | Introvert | Early bird | Music, crocheting, hiking, swimming |
| Yasmin | Red | Ambivert | Early bird | Gym, hiking, running, music |
| Linden | Green | Introvert | Night owl | Pickleball, reading, drawing |

For example, Ishika and Yasmin share **music and running**, so both illustrated scenes appear when only those two stars are selected. Ishika, Utaha, and Yasmin share **music**; when all three are selected, only the music scene appears. The illustrated hobby scenes currently cover music, running, hiking, and drawing. Other hobbies appear in each person's profile and can be highlighted as shared interests without an illustrated scene.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure, sky artwork, and sun, moon, and campfire controls. |
| `style.css` | Layout, stars, captions, animation, and control styling. |
| `data.js` | Team names, colours, hobbies, sleep rhythms, social energy, and starting star positions. |
| `script.js` | Star selection, hover details, shared hobby scenes, captions, and sun/moon behaviour. |
| `campfire.js` | Campfire dragging, social distance positions, sparks, and resetting star positions. |
| `music-cat.svg`, `running-scene1.svg`, `hiking-scene.svg`, `drawing-scene.svg` | Artwork referenced by the shared hobby scenes. |
| `running-scene.svg` | Additional running artwork included in the project; the current scene uses `running-scene1.svg`. |
| `LICENSE` | MIT license. |

To adjust each star's original location, change its `position.x` and `position.y` percentages in `data.js`. To adjust its position **around the campfire**, change the `positions` values in `campfire.js`.

## License

MIT — see [`LICENSE`](LICENSE).
