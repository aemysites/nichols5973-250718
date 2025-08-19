/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified by the block name
  const headerRow = ['Columns (columns88)'];

  // The structure expects two columns: text (left) and image (right)
  // Find the .entry-point__item inside the root element
  const entryPoint = element.querySelector('.entry-point__item');
  if (!entryPoint) return;

  // LEFT COLUMN: text content (quote & attribution)
  const bodyContainer = entryPoint.querySelector('.entry-point__item--body');
  let leftCellContent = [];
  if (bodyContainer) {
    // Use all direct child nodes (elements or text)
    leftCellContent = Array.from(bodyContainer.childNodes).filter(node => {
      // Only include elements or non-empty text nodes
      return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
    });
    // If nothing found, fallback to empty string
    if (leftCellContent.length === 0) leftCellContent = [''];
  } else {
    leftCellContent = [''];
  }

  // RIGHT COLUMN: image
  const imgContainer = entryPoint.querySelector('.entry-point__item--img');
  let imgElement = null;
  if (imgContainer) {
    imgElement = imgContainer.querySelector('img');
  }

  // If no image found, fallback to empty string
  const rightCellContent = imgElement ? imgElement : '';

  // Compose the table rows: header, then one content row
  const cells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table block
  element.replaceWith(block);
}
