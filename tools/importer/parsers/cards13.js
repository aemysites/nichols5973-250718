/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we handle only if element exists
  if (!element) return;
  const headerRow = ['Cards (cards13)'];
  // Each card is a direct child with class 'reading'
  const cards = Array.from(element.querySelectorAll(':scope > .reading'));
  const rows = [];

  cards.forEach(card => {
    // --- IMAGE CELL ---
    let imgEl = null;
    const imageDiv = card.querySelector('.reading__image');
    if (imageDiv) {
      imgEl = imageDiv.querySelector('img');
    }
    // If no image is present, leave cell null

    // --- CONTENT CELL ---
    const contentDiv = card.querySelector('.reading__content');
    const contentParts = [];

    // Author(s) and Date/Read time
    const metaDiv = contentDiv && contentDiv.querySelector('.reading__meta');
    if (metaDiv) {
      // Authors
      const authorsDiv = metaDiv.querySelector('.reading__authors');
      if (authorsDiv) {
        // Speaker images (do not clone!)
        const speakers = Array.from(authorsDiv.querySelectorAll('.speaker img'));
        speakers.forEach(img => {
          contentParts.push(img);
        });
        // Author name(s), may be one or more spans
        const authorSpans = Array.from(authorsDiv.childNodes).filter(
          node => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN'
        );
        authorSpans.forEach(span => {
          contentParts.push(span);
        });
      }
      // Date and read time
      const dateReadDiv = metaDiv.querySelector('.reading__date-read');
      if (dateReadDiv) {
        const copySm = dateReadDiv.querySelector('.copy--sm');
        if (copySm) {
          contentParts.push(copySm);
        }
      }
    }

    // Title (h3)
    let h3 = null;
    const titleDiv = contentDiv && contentDiv.querySelector('.reading__title');
    if (titleDiv) {
      h3 = titleDiv.querySelector('h3');
      if (h3) contentParts.push(h3);
    }

    // Tags (optional)
    const tagsDiv = contentDiv && contentDiv.querySelector('.reading__tags');
    if (tagsDiv && tagsDiv.children.length > 0) {
      contentParts.push(tagsDiv);
    }

    // Compose row: [img, [content parts]]
    rows.push([
      imgEl,
      contentParts.length ? contentParts : ''
    ]);
  });

  // Only create the table if we have at least one card
  if (rows.length > 0) {
    const cells = [headerRow, ...rows];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
