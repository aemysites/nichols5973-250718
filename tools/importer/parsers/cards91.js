/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const headerRow = ['Cards (cards91)'];

  // Helper to extract all cards
  const cards = Array.from(element.querySelectorAll('.reading'));

  // Build rows for each card
  const rows = cards.map(card => {
    // --- IMAGE CELL ---
    // Find the main image (first <img> inside .reading__image)
    let imageCell;
    const imageLink = card.querySelector('.reading__image a');
    if (imageLink) {
      // Add alt text to SVG icon if missing
      const typeImg = imageLink.querySelector('.reading__type img');
      if (typeImg && !typeImg.hasAttribute('alt')) {
        typeImg.setAttribute('alt', '');
      }
      imageCell = imageLink;
    } else {
      // Fallback: just the image
      const img = card.querySelector('.reading__image img');
      imageCell = img || '';
    }

    // --- TEXT CELL ---
    const textCellContent = [];

    // Authors (if present)
    const authors = card.querySelector('.reading__authors');
    if (authors && authors.children.length > 0) {
      textCellContent.push(authors);
    }

    // Meta info (Featured, read time)
    const meta = card.querySelector('.reading__date-read');
    if (meta) {
      textCellContent.push(meta);
    }

    // Title (as heading, usually inside .reading__title)
    const title = card.querySelector('.reading__title');
    if (title) {
      textCellContent.push(title);
    }

    // Tags (if present)
    const tags = card.querySelector('.reading__tags');
    if (tags && tags.children.length > 0) {
      textCellContent.push(tags);
    }

    // Build the row: [image, text]
    return [imageCell, textCellContent];
  });

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace original element with the block table
  element.replaceWith(table);
}
