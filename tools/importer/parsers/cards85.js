/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header - block name exactly as required
  const headerRow = ['Cards (cards85)'];

  // 2. Find the source <table> containing the cards
  const table = element.querySelector('table');
  if (!table) return;
  const rows = Array.from(table.querySelectorAll('tbody > tr'));
  const cells = [headerRow];

  rows.forEach((row) => {
    const tds = row.querySelectorAll('td');
    if (tds.length !== 2) return;

    // 3. First cell: image/icon (refer existing <img> element)
    const imgWrap = tds[0];
    const img = imgWrap.querySelector('img'); // Will be undefined if missing
    // if not found, use an empty string for that cell

    // 4. Second cell: text content (refer to existing <p> with <strong> inside)
    // This ensures we get both the heading and description as a single block
    const textTd = tds[1];
    // Find the first <p> in textTd containing a <strong> (the card heading and description)
    let cardText = null;
    const pEls = Array.from(textTd.querySelectorAll('p'));
    cardText = pEls.find(p => p.querySelector('strong'));
    // fallback: if not found, use the first non-empty <p>
    if (!cardText) cardText = pEls.find(p => p.textContent.trim());

    // 5. Only push if there's some text (ignore empty rows)
    if (img || cardText) {
      cells.push([
        img || '',
        cardText || ''
      ]);
    }
  });

  // 6. Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // 7. Replace the original element
  element.replaceWith(block);
}
