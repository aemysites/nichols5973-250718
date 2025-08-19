/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards54)'];
  const cells = [headerRow];

  // Get all <li> items in the card list
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children);

  lis.forEach((li) => {
    // IMAGE CELL: Always the first image in the card
    const img = li.querySelector('img');
    const imgCell = img || '';

    // TEXT CELL: Contains heading and location, keep structure
    // Reference .related-consultants-list--info div if present
    const infoDiv = li.querySelector('.related-consultants-list--info');
    let textCell;
    if (infoDiv) {
      // Reference the entire content block to preserve current and future content
      textCell = infoDiv;
    } else {
      // Fallback: if no infoDiv, get all text content from the <li>
      textCell = document.createElement('div');
      textCell.textContent = li.textContent.trim();
    }
    // Each card row is [image, text]
    cells.push([imgCell, textCell]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
