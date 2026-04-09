# Design System Specification: The Temporal Sanctuary

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **"The Meditative Pulse."** 

Unlike traditional productivity tools that feel like rigid spreadsheets, this system treats time as a fluid, organic element. We are moving away from "The Dashboard" and toward "The Sanctuary." To break the "template" look, we employ **intentional asymmetry**—placing primary timer controls off-center to create a sense of movement—and **tonal depth** that mimics the natural transition from dawn to dusk. The interface should feel less like a software application and more like a high-end physical timepiece resting on a dark slate desk.

---

## 2. Colors: Tonal Atmosphere
The palette is rooted in the deep shadows of `surface` (#131313), utilizing the Material-based tokens to create a "No-Line" environment.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** Do not use 1px solid lines to separate the timer from the task list. Instead, define boundaries through background shifts:
*   Place a `surface-container-low` (#1C1B1B) section against the main `surface` (#131313) to create a soft "z-axis" transition.
*   Use `surface-container-highest` (#353534) only for the most critical interactive elements to make them "pop" against the void.

### Surface Hierarchy & Nesting
Treat the UI as layered sheets of fine obsidian. 
*   **Base:** `surface-dim` (#131313)
*   **Secondary Content (Task Lists):** `surface-container-low` (#1C1B1B)
*   **Active Focus Element (The Timer Card):** `surface-container-high` (#2A2A2A)

### The "Glass & Gradient" Rule
To add "soul," avoid flat `primary` fills for large areas. 
*   **The Focus Pulse:** Use a radial gradient for the timer background transitioning from `primary` (#FFB5A0) to `primary_container` (#FC5929) at 15% opacity.
*   **Floating Navigation:** Use Glassmorphism for mobile navigation bars or floating action buttons—applying `surface_variant` at 60% opacity with a `24px` backdrop-blur.

---

## 3. Typography: Editorial Precision
The system pairs **Manrope** (Display/Headlines) for its geometric, modern authority with **Inter** (Body/Labels) for its high-legibility "invisible" utility.

*   **Display-LG (56px, Manrope):** Reserved exclusively for the countdown digits. It should feel monumental and calm.
*   **Headline-MD (28px, Manrope):** Used for session titles (e.g., *Odaklanma Zamanı*).
*   **Body-LG (16px, Inter):** Used for task descriptions and notes.
*   **Label-MD (12px, Inter):** Used for metadata, such as "Tamamlanan: 3/4".

**Editorial Note:** Use `on_surface_variant` (#E4BEB4) for secondary text to reduce visual "noise" and maintain the calm atmosphere. High contrast (`on_surface`) is reserved only for active time and primary task titles.

---

## 4. Elevation & Depth: Tonal Layering
We do not use structural lines. We use light and shadow as a physical medium.

*   **The Layering Principle:** To lift a task card, do not add a border. Instead, nest a `surface_container_highest` card inside a `surface_container_low` section. The contrast in value creates a natural "lift."
*   **Ambient Shadows:** For the main timer dial, use a custom shadow: `0px 24px 48px rgba(0, 0, 0, 0.4)`. The shadow should not be grey; it should feel like it is absorbing the light of the background.
*   **The "Ghost Border" Fallback:** If a container sits on a background of the same color, use `outline_variant` (#5B4139) at **12% opacity**. This is a "breath" of a line, not a wall.

---

## 5. Components: Bespoke Implementation

### The Timer (Signature Component)
*   **Visuals:** A large `display-lg` readout. The progress ring should not be a flat stroke; use a gradient from `primary` to `primary_container`.
*   **State Change:** When switching to "Rest" (*Dinlenme*), the entire `surface_tint` should shift toward `secondary` (#70D8C8) with a 600ms ease-in-out transition.

### Buttons (Butonlar)
*   **Primary:** Rounded `full` (9999px). Background: `primary` (#FFB5A0). Text: `on_primary` (#601500). No shadow—use a subtle inner glow.
*   **Secondary (Rest):** Background: `secondary_container` (#32A192). Text: `on_secondary_container` (#00302A). 

### Cards & Lists (Görev Listesi)
*   **Constraint:** Forbid divider lines. 
*   **Layout:** Use `1.5rem` (xl) vertical spacing between list items. Use a subtle `surface_container_low` background on hover to indicate interactivity.
*   **Checkboxes:** Use a soft `md` (0.75rem) corner radius instead of a sharp square. When checked, the background should morph into `secondary`.

### Input Fields (Giriş Alanları)
*   **Style:** Minimalist. No bottom line. Use a `surface_container_highest` background with `none` border. 
*   **Focus State:** A 1px "Ghost Border" using `primary` at 40% opacity.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Turkish Typography:** Ensure the Manrope and Inter fonts correctly support Turkish characters (ı, ğ, ü, ş, ö, ç, İ).
*   **Use Asymmetry:** Place the "Settings" icon off-grid to the top-right, balanced by a large "Focus" heading on the mid-left.
*   **Micro-interactions:** Use the `secondary` (teal) color for subtle "success" haptics and animations when a Pomodoro is completed.

### Don't:
*   **Don't use pure black (#000000):** Use `surface` (#131313) to keep the dark theme soft and premium.
*   **Don't use standard shadows:** Never use the default CSS `box-shadow: 0 2px 4px rgba(0,0,0,0.5)`. It feels cheap. Always use wide, diffused, low-opacity ambient shadows.
*   **Don't crowd the UI:** Productivity comes from focus. If an element doesn't help the user focus on the timer or the current task, remove it or hide it under a "More" menu.