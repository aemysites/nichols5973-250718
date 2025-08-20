/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the spec
  const headerRow = ['Cards (cards87)'];
  
  // Find the source table (cards container)
  const table = element.querySelector('table');
  if (!table) return;

  // Get all card rows
  const rows = Array.from(table.querySelectorAll('tbody > tr'));
  const cells = [headerRow];
  
  rows.forEach((tr) => {
    const tds = tr.querySelectorAll('td');
    if (tds.length < 2) return;
    // First cell: find first <img> within first <td>
    const img = tds[0].querySelector('img');
    // Just reference the image node if it exists
    const imgCell = img ? img : '';
    
    // Second cell: gather the content (title, description, CTA)
    // Collect all non-empty nodes from the second <td>, except meaningless <p>&nbsp;</p>
    const contentTd = tds[1];
    // Only grab significant nodes (those with non-empty text or meaningful elements)
    const contentNodes = Array.from(contentTd.childNodes).filter((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Ignore empty <p> or <p>\u00a0</p>
        if (node.tagName === 'P') {
          return node.textContent.trim().replace(/\u00a0/g, '').length > 0;
        }
        return true;
      } else if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return false;
    });
    // Fallback: if for some reason nothing is left, just use the whole contentTd
    const textCell = contentNodes.length > 0 ? contentNodes : [contentTd];
    
    cells.push([imgCell, textCell]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
