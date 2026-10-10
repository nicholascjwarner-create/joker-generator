# Joker Card Generator

Makes a new pixel-art Joker playing card every time you press a button, in bright arcade colours for the graphic novel.

How to play
- NEW JOKER (or tap/swipe the card, or press Space on a Mac) makes a brand-new joker. Swipe right or press BACK to go back.
- 8-BIT / 16-BIT / HD PIXEL: chunky classic pixels, finer detail, or HD PIXEL (the default). HD is still pixel art but has light and shadow from the top left, dithering, a rim light, folds in the fabric, and shiny metal bells and crowns. Each card uses a small set of colours, like a real retro game.
- CRT adds old-TV scanlines. ANIMATE makes the joker blink and the bells jingle.
- Chaos: how wild and wobbly the shapes are. Symmetry: lower it for lopsided, mischievous jokers.
- TRAITS: change any part directly from its list. 🔒 keeps a trait when you press NEW JOKER, 🎲 rerolls only that trait.
  Traits: palette (10 arcade colour schemes), pose (bust, half body, juggling, holding a card/cherries/dice), face shape, skin, eyes, brows, mouth, nose, makeup, hat (jester points, crown, hood, top hat, pom-pom cap), bells, collar, costume pattern, background, card frame, corner marks, layout (double-ended like a real court card, or one full figure), seam (horizontal or diagonal split) and hair.
- Double-ended cards show the top half of the joker turned upside down in the bottom half, like real playing-card Kings and Queens. The corner indices sit in opposite corners, one of them upside down.
- Seed: a number that makes a card. Card code: the exact recipe of the card on screen (codes now start with v2.; older codes still load and are shown as full-figure cards). Copy it down to bring that joker back later with LOAD.
- ☆ FAVOURITE saves the card in this browser. RECENT JOKERS shows your last 40.

Saving pictures
- PNG 4× / 8×: crisp enlarged pictures. PRINT SIZE: 1536×2304 pixels (about a playing card at 600 dpi).
- SHEET OF 9: the current joker plus 8 new ones (respecting your locks) on one picture. FAVOURITES SHEET: up to 9 favourites.
- On iPhone, saved pictures go to the Files app (Downloads). Open one and use Share > Save Image to put it in Photos.

Running it yourself: open this folder in a terminal, run `python3 -m http.server`, then visit http://localhost:8000
