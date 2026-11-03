Update the ZK17 website’s complete button and interaction styling to match the attached approved “REFINED CONTROLS / NO ARROWS” mockup.

Repository: nrsandoval1231-oss/ZK17
Development preview: https://cinematic-opening-dev.zk17-review.pages.dev/

Work from the latest development code containing the cinematic stadium opening, Hudl integration, and removed Watch Film buttons. Inspect current branches and PR #11 first so these changes are preserved. Use a feature branch and deliver a PR.

## Objective

Create a consistent, premium editorial interaction system across every page. Use clear text, precise typography, generous spacing, thin underlines, and restrained contrast.

The attached image is a visual reference for control styling. Preserve existing branding, destinations, page content, and functionality. Do not replace the canonical ZK logo with the mockup’s text-only placeholder.

## Absolute design rule

Remove all decorative arrows, chevrons, directional triangles, and arrow animations from site-owned controls.

This includes diagonal arrows, next/previous icons, back-to-top arrows, scroll arrows, circular arrow buttons, pseudo-elements, SVGs, and icon-library components.

Use words such as PREVIOUS, NEXT, BACK, MENU, CLOSE, and BACK TO TOP.

Keep necessary functional media icons: play, pause, volume, and fullscreen. Keep native dropdown affordances where required for usability. Hudl retains its native controls.

## Apply throughout the site

1. Navigation
- Preserve existing navigation labels and routes.
- Use clean uppercase labels with consistent spacing.
- Indicate the active page with a fine underline and aria-current.
- Keep the removed header and hero Watch Film buttons absent.

2. Section links
- Use text with a thin underline fitted to the label width.
- Apply consistently to Explore Personal, On the Field, business inquiries, recruiting links, back links, and other existing actions.
- Avoid pills, circular icon containers, heavy outlines, and oversized button padding.

3. Primary actions
- Use sharp rectangular buttons with centered text.
- White background and black text on dark surfaces; inverse on light surfaces.
- Reserve solid fills for genuinely primary actions.
- Preserve working destinations. Do not invent contact details, forms, or new actions.

4. Mobile menu
- Use text-only MENU and CLOSE controls.
- Present links in a clear vertical list with generous spacing.
- Underline the selected page.
- Preserve keyboard navigation, Escape dismissal, focus management, and scroll locking.

5. Playoff controls
- Apply the same editorial typography to tabs, regions, rounds, view toggles, and previous/next controls.
- Show selection through an underline and existing approved accent color.
- Use PREVIOUS and NEXT without icons.
- Preserve bracket behavior, game details, data, hashes, and existing interactions.

6. Arcade
- Retain its distinct retro typography and personality.
- Replace decorative selection pointers with a purple text/underline state.
- Use text-only PRESS START and BACK.
- Preserve every category and interaction.

7. Media and utilities
- Restyle site-owned close and utility controls consistently.
- Give icon-only media controls accessible names.
- Do not overlay, crop, replace, or interfere with Hudl’s player controls.

## Interaction details

- Use the existing fonts and palette.
- Provide clear default, hover, focus-visible, pressed, selected, and disabled states where applicable.
- Keep hover motion subtle and brief; respect reduced-motion preferences.
- Ensure selected states remain identifiable without relying only on color.
- Provide at least 44 × 44 CSS-pixel touch targets without making every visible control bulky.
- Use semantic links for navigation and buttons for actions.
- Keep labels readable and controls usable without hover.

## Implementation boundaries

Reuse shared styles/components where useful. Remove obsolete arrow assets, styles, and imports when no longer referenced.

Preserve the cinematic opening, GSAP timing and scroll distance, photographs, videos, canonical logos, page layouts, and stable Hudl iframe mounting. Do not add dependencies for this styling change.

## Verification and delivery

Run the repository’s required checks and focused browser checks for affected interactions.

Review desktop, mobile portrait, and landscape. Check navigation, mobile menu, playoff selectors, arcade controls, media controls, keyboard focus, contrast, wrapping, and horizontal overflow.

Confirm:
- No decorative arrows remain, including on hover.
- Removed Watch Film buttons remain absent.
- Hudl loads and plays without reloads caused by scrolling or layout refresh.
- The cinematic sequence still works.
- Existing destinations and functionality remain intact.

Report failures honestly, distinguishing pre-existing or third-party issues from regressions. Do not suppress checks to claim success.

Deliver:
- PR with a concise change summary.
- Before/after screenshots covering all control families.
- Validation results and remaining limitations.
- An updated development preview with its exact URL and deployed commit.

Deploy the development preview only. Do not merge or deploy production.