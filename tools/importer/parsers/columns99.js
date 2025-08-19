/* global WebImporter */
export default function parse(element, { document }) {
  // Header row - must match exactly
  const headerRow = ['Columns (columns99)'];

  // Find the image and content columns
  // Structure: .entry-points__row > .entry-point__item.img-half
  const item = element.querySelector('.entry-point__item.img-half');
  if (!item) return;

  // Left column: .entry-point__item--img (contains <img>)
  const imgDiv = item.querySelector('.entry-point__item--img');
  let leftCell = '';
  if (imgDiv) {
    // Reference the <img> element directly
    const img = imgDiv.querySelector('img');
    if (img) leftCell = img;
  }

  // Right column: .entry-point__item--body (contains text, links, etc)
  const bodyDiv = item.querySelector('.entry-point__item--body');
  let rightCell = '';
  if (bodyDiv) {
    // Remove empty elements but retain semantic structure
    // Reference the original elements, not clones
    // Collect non-empty children
    const children = [];
    bodyDiv.childNodes.forEach((node) => {
      // Remove empty h3, p, br
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (
          node.tagName === 'H3' && !node.textContent.trim()
        ) return;
        if (
          node.tagName === 'P' && !node.textContent.trim() && node.childNodes.length === 0
        ) return;
        if (node.tagName === 'BR') return;
        children.push(node);
      } else if (node.nodeType === Node.TEXT_NODE) {
        if (!node.textContent.trim()) return;
        children.push(node);
      }
    });
    // If at least one element, put in cell as array
    if (children.length) {
      rightCell = children;
    }
  }

  // Build the table
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Replace element with table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
