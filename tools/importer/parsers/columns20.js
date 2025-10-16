/* global WebImporter */
export default function parse(element, { document }) {
  // Find all entry-point rows (each is a columns block row)
  const rows = Array.from(document.querySelectorAll('.entry-points__row'));
  if (!rows.length) return;

  // Prepare the table header
  const headerRow = ['Columns (columns20)'];
  const tableRows = [headerRow];

  rows.forEach(row => {
    // Find the anchor (the whole block is a link)
    const anchor = row.querySelector('a.entry-point__item');
    if (!anchor) return;

    // Left: image
    const imgDiv = anchor.querySelector('.entry-point__item--img');
    let imgEl = imgDiv ? imgDiv.querySelector('img') : null;

    // Right: content (h3, p, arrow img)
    const bodyDiv = anchor.querySelector('.entry-point__item--body');
    const contentFragment = document.createDocumentFragment();
    if (bodyDiv) {
      // h3
      const h3 = bodyDiv.querySelector('h3');
      if (h3) contentFragment.appendChild(h3.cloneNode(true));
      // p
      const p = bodyDiv.querySelector('p');
      if (p) contentFragment.appendChild(p.cloneNode(true));
      // arrow (img) - only if present and not decorative background
      const arrowImg = Array.from(bodyDiv.querySelectorAll('img')).find(img => img !== imgEl);
      if (arrowImg) contentFragment.appendChild(arrowImg.cloneNode(true));
    }

    // Wrap right content in a link (if anchor has href)
    let rightCell;
    if (anchor.href) {
      const link = document.createElement('a');
      link.href = anchor.href;
      if (anchor.title) link.title = anchor.title;
      link.appendChild(contentFragment);
      rightCell = link;
    } else {
      rightCell = contentFragment;
    }

    // Add row: [image, right content]
    tableRows.push([
      imgEl || '',
      rightCell
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the first row with the block table
  if (rows[0]) rows[0].replaceWith(table);
  // Remove the rest of the rows
  for (let i = 1; i < rows.length; i++) {
    rows[i].remove();
  }
}
