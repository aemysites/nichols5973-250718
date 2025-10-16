/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Carousel block
  const headerRow = ['Carousel (carousel99)'];

  // Find the anchor that wraps the carousel item
  const anchor = element.querySelector('a.entry-point__item');
  if (!anchor) return;

  // Extract the image (first image inside the left image container)
  const imgContainer = anchor.querySelector('.entry-point__item--img');
  const img = imgContainer ? imgContainer.querySelector('img') : null;

  // Extract the text content (right side)
  const body = anchor.querySelector('.entry-point__item--body');
  let textContent = [];
  if (body) {
    // Heading (h3)
    const heading = body.querySelector('h3');
    if (heading) {
      textContent.push(heading);
    }
    // Description (p) if present and not empty
    const desc = body.querySelector('p');
    if (desc && desc.textContent.trim()) {
      textContent.push(desc);
    }
    // Arrow image (SVG or img) as CTA if present
    // Only include if it's not decorative and is meaningful
    const arrowImg = body.querySelector('img[src*="arrow"]');
    if (arrowImg) {
      textContent.push(arrowImg);
    }
  }

  // Build the table rows
  const rows = [
    headerRow,
    [img, textContent],
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
