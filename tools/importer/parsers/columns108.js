/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with block name
  const headerRow = ['Columns (columns108)'];

  // Get the two main columns: image (left), content (right)
  // The structure is: .entry-points__row > .entry-point__item.img-half
  // Inside .entry-point__item: .entry-point__item--img (image), .entry-point__item--body (text)
  const item = element.querySelector('.entry-point__item');
  if (!item) return;

  // Left column: image
  const imgCol = item.querySelector('.entry-point__item--img');
  // Defensive: ensure we use the actual image element
  let leftContent = '';
  if (imgCol) {
    const img = imgCol.querySelector('img');
    if (img) leftContent = img;
  }

  // Right column: body content (text, link, button)
  const bodyCol = item.querySelector('.entry-point__item--body');
  let rightContent = '';
  if (bodyCol) {
    // We'll collect all children except empty <h3> and empty <p>
    const nodes = Array.from(bodyCol.childNodes).filter((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) {
        // Exclude empty h3 and empty p
        if ((n.tagName === 'H3' || n.tagName === 'P') && !n.textContent.trim() && !n.querySelector('a')) {
          return false;
        }
        // Exclude <br>
        if (n.tagName === 'BR') return false;
      }
      // Keep everything else
      return true;
    });
    // If there are multiple nodes, group them in a fragment
    if (nodes.length === 1) {
      rightContent = nodes[0];
    } else if (nodes.length > 1) {
      const frag = document.createDocumentFragment();
      nodes.forEach(n => frag.appendChild(n));
      rightContent = frag;
    }
  }

  // Build the table rows
  const tableRows = [
    headerRow,
    [leftContent, rightContent],
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
