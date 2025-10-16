/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header
  const headerRow = ['Hero (hero59)'];

  // 2. Get background image (row 2)
  let imageEl = null;
  const img = element.querySelector('.cta-spotlight-img img');
  if (img) imageEl = img.cloneNode(true);
  const imageRow = [imageEl ? [imageEl] : ['']];

  // 3. Compose text + CTA (row 3)
  const contentParts = [];
  // Title
  const h2 = element.querySelector('.cta-spotlight-txt h2');
  if (h2 && h2.textContent.trim()) {
    const h2Clone = document.createElement('h2');
    h2Clone.textContent = h2.textContent.trim();
    contentParts.push(h2Clone);
  }
  // Only include non-empty <h3> (subheading)
  const h3 = element.querySelector('.cta-spotlight-txt h3');
  if (h3 && h3.textContent.trim()) {
    const h3Clone = document.createElement('h3');
    h3Clone.textContent = h3.textContent.trim();
    contentParts.push(h3Clone);
  }
  // CTA button (force all caps for text content to match screenshot)
  const cta = element.querySelector('.cta-spotlight-button a');
  if (cta) {
    const ctaClone = cta.cloneNode(true);
    ctaClone.textContent = cta.textContent.trim().toUpperCase();
    contentParts.push(ctaClone);
  }
  const contentRow = [contentParts];

  // 4. Build table
  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace element
  element.replaceWith(table);
}
