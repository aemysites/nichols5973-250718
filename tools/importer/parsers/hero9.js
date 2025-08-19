/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table header
  const headerRow = ['Hero (hero9)'];

  // --- Extract Image (row 2) ---
  let imageEl = null;
  // Find the first image in the .cta-spotlight-img > div > img structure
  const imgContainer = element.querySelector('.cta-spotlight-img');
  if (imgContainer) {
    // Allow for cases where the image is directly or nested inside a div
    imageEl = imgContainer.querySelector('img');
  } else {
    // Fallback: any image inside the element
    imageEl = element.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // --- Extract Text and CTA (row 3) ---
  const textCell = [];
  // All text is inside .cta-spotlight-txt
  const txtContainer = element.querySelector('.cta-spotlight-txt');
  if (txtContainer) {
    // Retain all children (h2, h3, etc.) as-is for semantic preservation
    Array.from(txtContainer.children).forEach(child => {
      // Only push non-empty content
      if (child.textContent && child.textContent.trim()) {
        textCell.push(child);
      }
    });
  }
  // The CTA (button) is in .cta-spotlight-button
  const btnContainer = element.querySelector('.cta-spotlight-button');
  if (btnContainer) {
    const btn = btnContainer.querySelector('a');
    if (btn) textCell.push(btn);
  }
  const textRow = [textCell.length > 0 ? textCell : ''];

  // --- Compose table ---
  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}