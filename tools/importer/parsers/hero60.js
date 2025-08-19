/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero (hero60)'];

  // --- Extract background image (row 2) ---
  let imgEl = null;
  const imgContainer = element.querySelector('.cta-spotlight-img');
  if (imgContainer) {
    const img = imgContainer.querySelector('img');
    if (img) imgEl = img;
  }

  // --- Extract all text and CTA (row 3) ---
  const txtContainer = element.querySelector('.cta-spotlight-txt');
  const textContent = [];
  if (txtContainer) {
    // Get all direct children (preserving order and content)
    Array.from(txtContainer.childNodes).forEach(node => {
      if (node.nodeType === 3) {
        const txt = node.textContent.trim();
        if (txt) {
          const p = document.createElement('p');
          p.textContent = txt;
          textContent.push(p);
        }
      } else if (node.nodeType === 1) {
        // Element node
        if (node.tagName === 'BR') return;
        // Only push non-empty headings/paragraphs/links
        if (node.textContent && node.textContent.trim()) {
          textContent.push(node);
        }
        // If this is a p that contains only a link, still include
        else if (node.tagName === 'P' && node.querySelector('a')) {
          textContent.push(node);
        }
      }
    });
  }

  // .cta-spotlight-button isn't always populated, but check for extra CTA there
  const ctaBtn = element.querySelector('.cta-spotlight-button a');
  if (ctaBtn && !textContent.includes(ctaBtn)) {
    textContent.push(ctaBtn);
  }

  // Ensure textContent is non-empty (could be all whitespace)
  const textCell = textContent.length ? textContent : '';
  const imgCell = imgEl ? imgEl : '';

  // Compose table rows: header, image, text
  const cells = [
    headerRow,
    [imgCell],
    [textCell]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
