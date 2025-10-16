/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: Block name
  const headerRow = ['Hero (hero82)'];

  // 2. Background image row
  let bgImg = null;
  const img = element.querySelector('img');
  if (img) {
    bgImg = img;
  }

  // 3. Content row: Heading, CTA (video link/button)
  // Find the main heading
  let heading = null;
  const h1 = element.querySelector('h1');
  if (h1) {
    heading = h1;
  }

  // Find the CTA (play video button)
  // The CTA is a link with class 'glightbox--brightcove', but the visible button is the play icon + text
  let cta = null;
  const videoLink = element.querySelector('a.glightbox--brightcove');
  if (videoLink) {
    // Create a new anchor and preserve all attributes except children
    const ctaAnchor = document.createElement('a');
    // Copy all attributes from the original videoLink
    for (const attr of videoLink.attributes) {
      ctaAnchor.setAttribute(attr.name, attr.value);
    }
    // Only append play icon and play text (inline elements)
    const playIcon = videoLink.querySelector('.video-embed__play-icon img');
    const playText = videoLink.querySelector('.video-embed__play-text');
    if (playIcon) ctaAnchor.appendChild(playIcon.cloneNode(true));
    if (playText) ctaAnchor.appendChild(playText.cloneNode(true));
    cta = ctaAnchor;
  }

  // Compose the content cell: heading and CTA (if present)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (cta) contentCell.push(cta);

  // Build the table rows
  const rows = [
    headerRow,
    [bgImg].filter(Boolean),
    [contentCell]
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
