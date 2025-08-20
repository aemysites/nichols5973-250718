/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row from specification
  const headerRow = ['Columns (columns104)'];

  // Find columns: image and body
  const item = element.querySelector('.entry-point__item');
  if (!item) return;

  // Get direct children of entry-point__item
  const itemChildren = item.querySelectorAll(':scope > div');
  if (itemChildren.length < 2) return;

  // Column 1: image
  const imgDiv = itemChildren[0];
  const imgEl = imgDiv.querySelector('img');
  // Defensive: if no image, leave cell empty
  const imgCell = imgEl ? imgEl : '';

  // Column 2: body content
  const bodyDiv = itemChildren[1];
  const column2Content = [];
  bodyDiv.childNodes.forEach((node) => {
    // Only append non-empty elements, keep links and paragraphs
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Don't include empty headings or paragraphs unless they have links
      if (
        (node.tagName === 'H3' || node.tagName === 'P') &&
        node.textContent.trim() === '' &&
        !node.querySelector('a')
      ) {
        return;
      }
      column2Content.push(node);
    } else if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.trim()) {
        // If non-empty text node, wrap it in a paragraph
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        column2Content.push(p);
      }
    }
  });
  // If no body content, leave cell empty
  const bodyCell = column2Content.length ? column2Content : '';

  // Assemble table
  const cells = [headerRow, [imgCell, bodyCell]];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
