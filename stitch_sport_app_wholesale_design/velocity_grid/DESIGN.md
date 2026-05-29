# Design System Document: Sport-App Architectural Identity

## 1. Overview & Creative North Star: "The Kinetic Warehouse"
This design system moves away from the static, "boxed-in" feel of traditional wholesale management software. Our Creative North Star is **"The Kinetic Warehouse"**—an experience that mirrors the speed, precision, and energy of elite sports. 

We utilize **Material Design 3 (M3)** as a functional foundation but elevate it through **Editorial Asymmetry** and **Tonal Layering**. Instead of rigid grids, we use breathing room and high-contrast typography to create a "Premium Logistics" feel. The interface shouldn't feel like a spreadsheet; it should feel like a high-end sports magazine that happens to manage millions in inventory.

---

## 2. Colors & Tonal Depth
Our palette is anchored by the deep authority of Navy Blue and the high-octane energy of Neon Green.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section content. Layout boundaries must be defined solely through background shifts (e.g., a `surface-container-low` card resting on a `surface` background). This creates a seamless, modern flow that feels engineered rather than "drawn."

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, physical layers. 
- **Base Level:** `surface` (#f8f9fa) for the main canvas.
- **Content Zones:** Use `surface-container-low` to define major work areas.
- **Actionable Elements:** Use `surface-container-lowest` (#ffffff) for cards or inputs to create a "lifted" feel.

### The "Glass & Gradient" Rule
To inject "soul" into the admin experience:
- **Floating Nav:** Use `surface` with 80% opacity and a 20px backdrop-blur for the desktop sidebar and mobile bottom bar.
- **Signature Gradients:** For primary CTAs and KPI headers, use a subtle linear gradient from `primary` (#000209) to `primary-container` (#001d3d) at a 135-degree angle.

---

## 3. Typography: The Editorial Edge
We pair the geometric precision of **Space Grotesk** for data and headlines with the approachable clarity of **Lexend** for UI labels and long-form text.

- **Display & Headlines (Space Grotesk):** These are your "Aggressive" elements. Use `display-lg` (3.5rem) for big warehouse totals or hero metrics. The tight kerning of Space Grotesk provides a technical, "pro-athlete" aesthetic.
- **Body & Titles (Lexend):** Used for everything functional. Lexend’s variable width ensures high readability for complex product names and Colombian Peso (COP) values.
- **Contextual Language:** All microcopy must be in **Spanish (Colombia)**. Ensure price strings follow the format: `$ 1.250.000 COP`.

---

## 4. Elevation & Depth: The Layering Principle
We reject traditional drop shadows in favor of **Tonal Layering**.

- **Ambient Shadows:** Only use shadows for "Floating" elements (e.g., Modals, Tooltips). Use an extra-diffused shadow: `box-shadow: 0 12px 40px rgba(0, 29, 61, 0.08);`. The shadow color is a tinted version of our Navy Blue, not grey.
- **The "Ghost Border" Fallback:** If a divider is mandatory for accessibility in high-density tables, use the `outline-variant` token at **15% opacity**. It should be felt, not seen.
- **Interaction States:** When hovering over an inventory card, do not add a border. Instead, shift the background from `surface-container-lowest` to `secondary-container` (#c3f400) at 10% opacity.

---

## 5. Components

### Inventory Cards & Lists
*   **Design Rule:** No dividers. Use 24px of vertical whitespace between items.
*   **Visuals:** Use `surface-container-lowest` as the card base. The "Stock Status" should be a high-contrast pill using `secondary-container` with `on-secondary-container` (#556d00) text.

### Buttons (The Kinetic Set)
*   **Primary:** Solid `primary` (#000209). On hover, it transitions to a `secondary` (#506600) glow.
*   **Secondary:** Ghost style. No background, just `on-surface` text with a "Ghost Border" that becomes solid `secondary` on hover.
*   **Shape:** Use the `md` (0.375rem) roundedness for a professional, sharp look. Avoid "Pill" shapes for primary actions to maintain a serious, warehouse-industrial feel.

### Charts & Data Visualization
*   **Bar/Pie Charts:** Use `secondary` (#c3f400) for the primary data series. Use `primary-fixed-dim` (#b0c8f0) for secondary comparisons. 
*   **Atmosphere:** Charts should be "borderless." Use `surface-container-high` for grid lines at 50% opacity.

### Navigation Architecture
*   **Desktop Sidebar:** Expandable. When collapsed, show icons with a `secondary` neon vertical bar indicating the active state.
*   **Mobile Bottom Bar:** Use Glassmorphism. A semi-transparent `surface` blur with active icons highlighted in `secondary`.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place high-level stats (KPIs) in large, off-center display type to draw the eye.
*   **Respect the COP:** Always include the "COP" suffix in financial tables to distinguish from other dollar currencies.
*   **Layer with Intent:** Ensure that a "Highest" container always sits on a "High" or "Low" container to maintain the physical logic of the UI.

### Don't:
*   **Don't use 100% Black:** Use our `primary` (#000209) for text to maintain a premium "ink" feel.
*   **Don't use standard M3 Shadows:** They are too heavy for a modern wholesale app. Stick to Tonal Layering.
*   **Don't use "Warehouse" Clichés:** Avoid forklift or box icons. Use high-performance "Sport" metaphors: arrows, speed lines, and precision gauges.

---

## 7. Colombian Localization (COP)
*   **Decimals:** Use a comma (,) for decimals and a dot (.) for thousands (e.g., `$ 45.600,00`).
*   **Tone:** The voice should be "Professional but Energetic" (e.g., instead of "Error," use "Ajuste Requerido"; instead of "Buy," use "Abastecer Inventario").