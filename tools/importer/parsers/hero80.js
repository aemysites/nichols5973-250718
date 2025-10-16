/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row (block name)
  const headerRow = ['Hero (hero80)'];

  // 2. Background image row
  // Find the first <img> in the block (background image)
  const bgImg = element.querySelector('img');
  const bgImgCell = bgImg ? bgImg : '';

  // 3. Content row: Headline, subheading, CTA
  // Find headline (h1), subheading (h3 or .text), and CTA (video link/button)
  const headline = element.querySelector('h1');
  const subheading = element.querySelector('.text h3') || element.querySelector('h3');

  // Find CTA: look for a link with video or play indication
  const ctaLink = element.querySelector('.video-embed__media a');
  let ctaButton = null;
  if (ctaLink) {
    // Compose button: icon + text
    const playIcon = ctaLink.querySelector('.video-embed__play-icon img');
    const playText = ctaLink.querySelector('.video-embed__play-text');
    // Build button element
    ctaButton = document.createElement('a');
    ctaButton.href = ctaLink.href || '#';
    ctaButton.style.display = 'inline-flex';
    ctaButton.style.alignItems = 'center';
    if (playIcon) ctaButton.appendChild(playIcon);
    if (playText) ctaButton.appendChild(playText);
    ctaButton.className = 'hero-cta';
  }

  // Compose content cell
  const contentCell = [];
  if (headline) contentCell.push(headline);
  if (subheading) contentCell.push(subheading);
  if (ctaButton) contentCell.push(ctaButton);

  // Compose table rows
  const rows = [
    headerRow,
    [bgImgCell],
    [contentCell]
  ];

  // Create table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
