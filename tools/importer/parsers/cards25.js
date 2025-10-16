/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards25) block header
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Select all card elements
  const cardElements = element.querySelectorAll('.reading');

  cardElements.forEach((card) => {
    // --- IMAGE CELL ---
    // Find the main image inside the card
    let imageCell = '';
    const imageWrapper = card.querySelector('.reading__image a');
    if (imageWrapper) {
      // Use the anchor with its children (img, overlay, etc.)
      imageCell = imageWrapper;
    }

    // --- TEXT CELL ---
    const textCellContent = [];

    // Meta (author, date, read time)
    const meta = card.querySelector('.reading__meta');
    if (meta) {
      // Author (if present)
      const authors = meta.querySelector('.reading__authors');
      if (authors && authors.textContent.trim()) {
        // If there's an image (avatar), include it
        const avatar = authors.querySelector('img');
        if (avatar) {
          textCellContent.push(avatar);
        }
        // Author name
        const authorName = authors.textContent.trim();
        if (authorName) {
          const authorSpan = document.createElement('span');
          authorSpan.textContent = authorName;
          textCellContent.push(authorSpan);
        }
      }
      // Date and read time
      const dateRead = meta.querySelector('.reading__date-read');
      if (dateRead) {
        // Use the <p> element as-is for date and read time
        const p = dateRead.querySelector('p');
        if (p) textCellContent.push(p);
      }
    }

    // Title (as heading)
    const titleDiv = card.querySelector('.reading__title');
    if (titleDiv) {
      const h3 = titleDiv.querySelector('h3');
      if (h3) {
        textCellContent.push(h3);
      }
    }

    // Tags (as links)
    const tagsDiv = card.querySelector('.reading__tags');
    if (tagsDiv) {
      // Collect all tag links
      const tags = Array.from(tagsDiv.querySelectorAll('a.tag'));
      if (tags.length) {
        // Wrap tags in a div for layout
        const tagsContainer = document.createElement('div');
        tags.forEach(tag => tagsContainer.appendChild(tag));
        textCellContent.push(tagsContainer);
      }
    }

    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
