/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards78) block: 2 columns, first row is header, each row is a card (image | text)
  const headerRow = ['Cards (cards78)'];
  const rows = [headerRow];

  // Find all card elements ('.insight')
  const cardEls = element.querySelectorAll('.insight');

  cardEls.forEach((card) => {
    // --- IMAGE/ICON COLUMN ---
    let imageCell = null;
    const imageLink = card.querySelector('.insight__image a');
    if (imageLink) {
      imageCell = imageLink;
    } else {
      const img = card.querySelector('.insight__image img');
      if (img) imageCell = img;
    }

    // --- TEXT CONTENT COLUMN ---
    const textFrag = document.createDocumentFragment();

    // 1. Meta (date, read time, speakers/authors)
    const meta = card.querySelector('.insight__meta');
    if (meta) {
      // Clone meta (includes speakers, date, etc.)
      textFrag.appendChild(meta.cloneNode(true));
    }

    // 2. Title (as heading)
    const title = card.querySelector('.insight__title');
    if (title) {
      textFrag.appendChild(title.cloneNode(true));
    }

    // 3. Tags (as pills)
    const tags = card.querySelector('.insight__tags');
    if (tags) {
      textFrag.appendChild(tags.cloneNode(true));
    }

    // Compose the row
    rows.push([imageCell, textFrag]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
