# Higgsfield generation brief: Fortitier "Night Haul" film

Higgsfield's unlimited generations work in **Claude chat**, **Claude Cowork** or ChatGPT, not in Claude Code.
Open a new Claude chat (or Cowork) with the Higgsfield connector on, paste everything in the box below,
and let it run. When it finishes, paste the 13 job IDs it gives you back into the Claude Code session;
the clips are then downloaded into `film-src/` and turned into the site's frames with `npm run film`.

---

```text
Generate a 13-asset cinematic sequence for a website using the Higgsfield connector.
Use my plan's unlimited generations for every request (use_unlim: true). Never spend credits; if a
request would cost credits, stop and tell me instead.

Every image prompt below ends with this LOOK line:
LOOK = "Photoreal cinematic film still, anamorphic lens, shallow depth of field, ARRI Alexa look,
fine 35mm film grain, dusk turning to night in southern Ghana, warm sodium and gold practical light,
deep neutral blacks, no teal. No text, no logos, no lettering, no watermark."

TRUCK = "a modern European cab-over fuel tanker truck: gloss black tractor cab with chrome trim,
polished stainless-steel three-compartment tank semi-trailer with top walkway handrails and a thin
gold pinstripe along the tank, silver rims, dual rear wheels, orange hazard plates"

STEP 1. Hero still K1 (model nano_banana_pro, aspect 16:9, resolution 2k, no reference):
K1: "Low front three-quarter view, camera 60 cm above wet asphalt. TRUCK parked under a fuel depot
loading gantry at blue hour, headlights on, beams cutting through light haze and dust, red laterite
earth at the edges, depot lights as soft bokeh. LOOK"
Show me K1. If the truck looks wrong (warped wheels, odd cab, text on it), regenerate up to 3 times
and keep the best.

STEP 2. Keyframes K2–K7 (model nano_banana_pro, 16:9, 2k), each with K1 as an image_references
input and the words "the same truck as the reference image" in the prompt:
K2: "Close side view along the polished tank under the depot gantry; a loading arm connected to a
top hatch; warm gold reflections rippling on the steel; a worker in reflective overalls seen from
behind, face not visible. TRUCK. LOOK"
K3: "Low tracking shot beside the rear wheels of TRUCK driving at night on a two-lane Ghanaian
highway; wet asphalt reflecting sodium streetlights; red laterite shoulders; savanna tree
silhouettes; motion blur on the road surface, truck sharp. LOOK"
K4: "Drone view ahead of TRUCK looking back at it as it drives toward camera at night; headlights
flaring with an anamorphic lens streak; the highway receding toward a deep amber afterglow on the
horizon. LOOK"
K5: "Top-down aerial from 400 m at night: one straight highway crossing dark savanna as a thin line
of warm light, a single pair of headlights on it, faint scattered village lights. LOOK"
K6: "TRUCK alone in an infinite black studio on a glossy black floor; long soft strip lights reflected
along the tank; gold rim light from behind; car-commercial lighting; front three-quarter view. LOOK"
K7: "Low rear view: TRUCK driving away down a long, straight, empty highway at night; red tail lights;
streetlights receding to the horizon; clear starry sky. LOOK"

STEP 3. Clips c1–c6 at 720p (the unlimited tier), aspect 16:9, duration 5, generate_audio false.
Use model seedance_2_5 in mode omni_reference (it takes start_image and end_image); if that is not
covered by unlimited, use seedance_2_0 in mode std at 720p instead:
c1: start_image K1, end_image K2. "The truck's headlights flicker on; slow dolly in, then a smooth arc
along the side of the tank; reflections slide across the steel; light haze drifts."
c2: start_image K2, end_image K3. "The truck pulls away from the gantry onto the night highway; the
camera drops low beside the rear wheels and tracks with it; streetlights pass overhead."
c3: start_image K3, end_image K4. "The camera speeds forward past the cab, rises and turns to face the
oncoming truck; its headlights flare into the lens."
c4: start_image K4, end_image K5. "The camera cranes straight up into the night sky until it looks
straight down; the truck becomes a moving point of light on a thin line of road."
c5: start_image K6 only. "A slow 30-degree orbit from front three-quarter to the side of the truck;
strip-light reflections glide along the polished tank; the truck stays still."
c6: start_image K7 only. "The truck drives away into the distance while the camera holds, then the
camera slowly tilts up to a clear starry sky; tail lights shrink to points."
For every clip: keep the truck's shape consistent, no morphing, no text appearing, realistic motion.

STEP 4. Reply with a table of all 13 job IDs: K1–K7 and c1–c6, and show me the six clips.
```

---

## Back in Claude Code

Paste the table of job IDs. The six clips are saved as `film-src/c1.mp4` … `film-src/c6.mp4`
(and the stills as `film-src/k1.png` … `k7.png`), then:

```powershell
npm run film
```

rebuilds `public/film/` from the real footage. Any clip still missing keeps its labelled placeholder.
