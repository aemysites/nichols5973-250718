/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as required by the block
  const headerRow = ['Columns (columns102)'];

  // 2. This block is a two column block: left = image, right = text and CTA
  // Get the main '.entry-point__item'
  const item = element.querySelector('.entry-point__item');
  if (!item) return;

  // Left column: the image
  let leftCell = '';
  const imgDiv = item.querySelector('.entry-point__item--img');
  if (imgDiv) {
    const img = imgDiv.querySelector('img');
    if (img) leftCell = img;
  }

  // Right column: text and button
  let rightCellContent = [];
  const bodyDiv = item.querySelector('.entry-point__item--body');
  if (bodyDiv) {
    // We want all non-empty children (ignore empty <h3> or <p>)
    bodyDiv.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (
          (node.tagName === 'H3' || node.tagName === 'P') &&
          !node.textContent.trim()
        ) {
          // skip empty
        } else {
          rightCellContent.push(node);
        }
      }
    });
  }
  // If there's no content, fall back to blank
  const rightCell = rightCellContent.length ? rightCellContent : '';

  // 3. Compose the table
  const tableRows = [
    headerRow,
    [leftCell, rightCell]
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // 4. Replace the original element
  element.replaceWith(table);
}
