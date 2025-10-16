/* global WebImporter */
export default function parse(element, { document }) {
  // Find the card container and heading
  const column = element.querySelector('.column');
  if (!column) return;

  // Get heading (if present)
  const heading = column.querySelector('h3');

  // Get the table containing cards
  const cardsTable = column.querySelector('table');
  if (!cardsTable) return;

  // Prepare rows for the block table
  const rows = [];
  // Header row (block name)
  const headerRow = ['Cards (cards120)'];
  rows.push(headerRow);

  // Parse each card from the table rows
  const cardRows = Array.from(cardsTable.querySelectorAll('tbody > tr'));
  cardRows.forEach(tr => {
    const cells = Array.from(tr.children);
    cells.forEach(td => {
      // Each td is a card
      // Find image (first <img> in <a>)
      const img = td.querySelector('img');
      // Find label link (the <a> with text)
      let labelLink = null;
      const links = Array.from(td.querySelectorAll('a'));
      // The label link is the <a> whose text is not empty (ignoring whitespace)
      labelLink = links.find(a => a.textContent && a.textContent.trim().length > 0);
      // Compose the text cell
      let textCell = '';
      if (labelLink) {
        // Create a link element with arrow and uppercase text
        const a = document.createElement('a');
        a.href = labelLink.getAttribute('href');
        a.innerHTML = labelLink.textContent.trim().toUpperCase() + ' \u2192';
        textCell = a;
      }
      if (img && textCell) {
        rows.push([img, textCell]);
      }
    });
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Place heading outside the table if present
  if (heading) {
    // Insert the heading before the block table in the DOM
    column.insertBefore(heading, cardsTable);
    column.insertBefore(block, cardsTable);
    cardsTable.remove();
    element.replaceWith(column);
  } else {
    // Replace the original element
    element.replaceWith(block);
  }
}
