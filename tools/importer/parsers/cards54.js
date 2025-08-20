/* global WebImporter */
export default function parse(element, { document }) {
  // Create the block header row as in the example
  const headerRow = ['Cards (cards54)'];
  const rows = [headerRow];

  // Get each card in the list
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(e => e.tagName === 'LI');

  lis.forEach(li => {
    // Extract image (left cell)
    const img = li.querySelector('.related-consultants-list--picture img');

    // Extract text content (right cell)
    const infoDiv = li.querySelector('.related-consultants-list--info');
    const textCell = document.createElement('div');

    if (infoDiv) {
      // Title (name)
      const h4 = infoDiv.querySelector('h4');
      if (h4) textCell.appendChild(h4);
      // Region (should be text, typically in a <span>)
      const regionSpan = infoDiv.querySelector('span');
      if (regionSpan && regionSpan.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = regionSpan.textContent.trim();
        textCell.appendChild(p);
      }
    }
    // Fallback: If no infoDiv, add any plain text from LI
    if (!textCell.childNodes.length) {
      if (li.textContent && li.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = li.textContent.trim();
        textCell.appendChild(p);
      }
    }

    // Add the row for this card
    rows.push([
      img || '',
      textCell
    ]);
  });

  // Create the table and replace the block element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
