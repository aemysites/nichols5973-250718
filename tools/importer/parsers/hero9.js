/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main wrapper (cta-spotlight-wrapper)
  let wrapper = element.querySelector('.cta-spotlight-wrapper') || element;

  // Find background image (first img inside .cta-spotlight-img)
  let img = wrapper.querySelector('.cta-spotlight-img img') || wrapper.querySelector('img');

  // Find text container
  let txt = wrapper.querySelector('.cta-spotlight-txt') || wrapper;
  let heading = txt.querySelector('h2');
  let subheading = txt.querySelector('h3');

  // Find CTA button
  let ctaDiv = wrapper.querySelector('.cta-spotlight-button');
  let cta = ctaDiv ? ctaDiv.querySelector('a') : wrapper.querySelector('a');

  // --- Model field comments for future model support ---
  // <!-- model: image (background) -->
  // <!-- model: heading (title) -->
  // <!-- model: subheading -->
  // <!-- model: cta (call-to-action) -->

  // Compose table rows
  const headerRow = ['Hero (hero9)'];
  const imageRow = [img ? img : ''];

  // Compose content cell: heading, subheading, cta (in order, only if present)
  const content = [];
  if (heading) content.push(heading);
  if (subheading && subheading.textContent.trim()) content.push(subheading);
  if (cta) content.push(cta);

  // Defensive: if no text, fallback to wrapper text
  if (content.length === 0) {
    const fallbackText = document.createElement('div');
    fallbackText.textContent = wrapper.textContent.trim();
    content.push(fallbackText);
  }

  const contentRow = [content];

  // Create table block
  const rows = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace element
  element.replaceWith(block);
}
