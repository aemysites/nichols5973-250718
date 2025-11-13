/* global WebImporter */
export default function parse(element, { document }) {
  // --- Hero (hero32) block ---
  // Table: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional)
  // Row 3: Heading, subheading, CTA (optional)

  // Header row (always required)
  const headerRow = ['Hero (hero32)'];

  // --- Extract background image ---
  let imgEl = null;
  // Look for an <img> element inside the hero block
  const imgs = element.querySelectorAll('img');
  if (imgs.length > 0) {
    imgEl = imgs[0];
  }
  // If no <img>, check for background-image style
  if (!imgEl) {
    const bgDiv = element.querySelector('[data-hlx-background-image]');
    if (bgDiv) {
      const bgUrl = bgDiv.getAttribute('data-hlx-background-image');
      if (bgUrl) {
        // Create an <img> element from the background-image URL
        const urlMatch = bgUrl.match(/url\(["']?(.*?)["']?\)/);
        if (urlMatch && urlMatch[1]) {
          imgEl = document.createElement('img');
          imgEl.src = urlMatch[1];
        }
      }
    }
  }
  const imageRow = [imgEl ? imgEl : ''];

  // --- Extract text content (heading, subheading, CTA) ---
  // For this source, there is no visible heading, subheading, or CTA in the HTML or screenshot
  // So, the third row is left empty
  const contentRow = [''];

  // --- Compose table ---
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
