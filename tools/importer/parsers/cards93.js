/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main column with the heading and cards table
  const column = element.querySelector('.column');
  if (!column) return;

  // Get the heading (the actual content, not the empty one)
  const headings = column.querySelectorAll('h2');
  let headingEl = null;
  for (const h of headings) {
    if (h.textContent.trim().length > 0) {
      headingEl = h;
      break;
    }
  }

  // Find the cards table
  const cardsTable = column.querySelector('table');
  if (!cardsTable) return;
  const rows = Array.from(cardsTable.querySelectorAll('tbody > tr'));

  // Prepare block table rows
  const tableRows = [];
  // Header row
  tableRows.push(['Cards (cards93)']);

  // Each card row: first cell is image, second cell is text content
  rows.forEach(tr => {
    const tds = tr.querySelectorAll('td');
    if (tds.length < 2) return;
    // First cell: find the image (icon)
    const img = tds[0].querySelector('img');
    // Second cell: extract text content (title, description, link)
    const contentCell = tds[1];
    // Find the strong (title)
    const strong = contentCell.querySelector('strong');
    // Find all paragraphs
    const paragraphs = Array.from(contentCell.querySelectorAll('p'));

    // Compose content for the text cell
    const cellContent = [];
    // Title
    if (strong) {
      const h3 = document.createElement('h3');
      h3.innerHTML = strong.innerHTML.replace(/<br\s*\/?>(\s*)?/gi, '');
      cellContent.push(h3);
    }
    // Description: get all text nodes after the strong (including inline links)
    if (strong && strong.parentNode) {
      let node = strong.nextSibling;
      let desc = '';
      while (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          desc += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
          // Inline link
          const a = document.createElement('a');
          a.href = node.getAttribute('href');
          a.className = node.className;
          a.innerHTML = node.innerHTML;
          desc += a.outerHTML;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          desc += node.outerHTML;
        }
        node = node.nextSibling;
      }
      if (desc.trim()) {
        const p = document.createElement('p');
        p.innerHTML = desc.trim();
        cellContent.push(p);
      }
    }
    // Add any remaining paragraphs (excluding empty and those with only strong)
    paragraphs.forEach(p => {
      if (strong && p.contains(strong)) return;
      if (p.innerHTML.replace(/\s|&nbsp;/g, '').length === 0) return;
      cellContent.push(p);
    });
    // Compose the row: [image, text content]
    tableRows.push([
      img || '',
      cellContent
    ]);
  });

  // Place heading above the table if present
  if (headingEl) {
    element.parentNode.insertBefore(headingEl, element);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element
  element.replaceWith(blockTable);
}
