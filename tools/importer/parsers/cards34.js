/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card elements
  const cards = element.querySelectorAll('.insight');
  if (!cards.length) return;

  // Block header row
  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow];

  cards.forEach((card) => {
    // --- IMAGE CELL ---
    let imgCell = null;
    const imageLink = card.querySelector('.insight__image a');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      // Also extract the content type badge (icon + label)
      const badge = imageLink.querySelector('.insight__type');
      if (img || badge) {
        const imgDiv = document.createElement('div');
        if (img) imgDiv.appendChild(img.cloneNode(true));
        if (badge) imgDiv.appendChild(badge.cloneNode(true));
        imgCell = imgDiv;
      }
    }

    // --- TEXT CELL ---
    const textCellContent = [];

    // 1. Authors (avatars and names)
    const meta = card.querySelector('.insight__meta');
    if (meta) {
      const authors = meta.querySelector('.insight__authors');
      if (authors) {
        // Collect all author avatars and names, but avoid duplicates
        const authorDiv = document.createElement('div');
        // Avatars
        authors.querySelectorAll('.speaker img').forEach((img) => {
          authorDiv.appendChild(img.cloneNode(true));
        });
        // Names and '+ 1 author' (only direct children spans, no duplicates)
        const seenSpans = new Set();
        authors.querySelectorAll(':scope > span').forEach((span) => {
          const text = span.textContent.trim();
          if (!seenSpans.has(text)) {
            authorDiv.appendChild(span.cloneNode(true));
            seenSpans.add(text);
          }
        });
        if (authorDiv.childNodes.length) {
          textCellContent.push(authorDiv);
        }
      }
      // 2. Date and read time
      const dateRead = meta.querySelector('.insight__date-read');
      if (dateRead) {
        textCellContent.push(dateRead.cloneNode(true));
      }
    }

    // 3. Title (as heading)
    const title = card.querySelector('.insight__title .heading3, .insight__title a');
    if (title) {
      textCellContent.push(title.cloneNode(true));
    }

    // 4. Tags (as pill buttons)
    const tags = card.querySelector('.insight__tags');
    if (tags) {
      textCellContent.push(tags.cloneNode(true));
    }

    // Compose the row
    rows.push([
      imgCell,
      textCellContent
    ]);
  });

  // Create and replace with table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
