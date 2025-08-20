/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: must match example exactly
  const headerRow = ['Hero (hero62)'];

  // 2. Background image row
  let bgImgRow = [''];
  // Find nearest descendant with a background image style
  const bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv && bgDiv.style.backgroundImage) {
    const match = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/i);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1];
      // Optionally: set alt attribute if present in HTML (none in sample)
      bgImgRow = [img];
    }
  }

  // 3. Content row: heading, subheading, call-to-action (video)
  // Gather all block content for semantic preservation
  const contentEls = [];
  // Title (h1)
  const title = element.querySelector('h1');
  if (title) contentEls.push(title);

  // Subheading (h3 or direct .text)
  // Some .text containers only have a h3, sometimes just plain text
  const textDiv = element.querySelector('.text');
  if (textDiv) {
    // If .text contains a heading, use that (usually h3)
    const subheading = textDiv.querySelector('h3');
    if (subheading) {
      contentEls.push(subheading);
    } else if (textDiv.textContent.trim()) {
      // Otherwise, use the text as a paragraph
      const p = document.createElement('p');
      p.textContent = textDiv.textContent.trim();
      contentEls.push(p);
    }
  }

  // CTA: Look for video embed/button
  const videoEmbed = element.querySelector('.video-embed');
  if (videoEmbed) {
    contentEls.push(videoEmbed);
  }

  // To ensure semantic grouping, if there is more than one content element,
  // wrap them in a container div for correct layout
  let contentCell;
  if (contentEls.length === 1) {
    contentCell = contentEls[0];
  } else if (contentEls.length > 1) {
    const container = document.createElement('div');
    contentEls.forEach(el => container.appendChild(el));
    contentCell = container;
  } else {
    contentCell = '';
  }

  // 4. Table build
  const cells = [headerRow, bgImgRow, [contentCell]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
