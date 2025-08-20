/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards14)'];
  // Get all cards
  const cards = Array.from(element.querySelectorAll(':scope > .reading'));
  const rows = [headerRow];
  cards.forEach(card => {
    // --- Image column ---
    let imageCol = null;
    const imageWrapper = card.querySelector('.reading__image');
    if (imageWrapper) {
      // Use image inside link
      const img = imageWrapper.querySelector('img');
      if (img) {
        imageCol = img;
      }
    }
    // --- Text column ---
    const contentCol = document.createElement('div');
    // Author(s)
    const meta = card.querySelector('.reading__meta');
    if (meta) {
      const authors = meta.querySelector('.reading__authors');
      if (authors) {
        // All visible author names (span)
        authors.querySelectorAll('span').forEach(span => {
          contentCol.appendChild(span);
          contentCol.appendChild(document.createTextNode(' '));
        });
      }
      // Date/read
      const dateRead = meta.querySelector('.reading__date-read');
      if (dateRead) {
        const p = dateRead.querySelector('p');
        if (p) {
          contentCol.appendChild(p);
        }
      }
    }
    // Title
    const titleDiv = card.querySelector('.reading__title');
    if (titleDiv) {
      const h3 = titleDiv.querySelector('h3');
      if (h3) {
        contentCol.appendChild(h3);
      }
    }
    // Tags
    const tagsDiv = card.querySelector('.reading__tags');
    if (tagsDiv && tagsDiv.children.length) {
      const tagsContainer = document.createElement('div');
      Array.from(tagsDiv.children).forEach(tag => {
        tagsContainer.appendChild(tag);
      });
      contentCol.appendChild(tagsContainer);
    }
    rows.push([imageCol, contentCol]);
  });
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
