/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns12)'];

  // Defensive: get all immediate children of the main block
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // There should be two main columns: image (left), content (right)
  // Find the image column (usually has an img inside)
  const imageCol = children.find((child) => child.querySelector('img'));
  // Find the content column (has heading, icon, text)
  const contentCol = children.find((child) => child !== imageCol);

  // --- Left column: extract image ---
  let leftCell = null;
  if (imageCol) {
    // Try to get the actual img element
    const img = imageCol.querySelector('img');
    if (img) {
      leftCell = img;
    } else {
      // fallback: use the whole imageCol if no img found
      leftCell = imageCol;
    }
  }

  // --- Right column: extract ALL content ---
  let rightCell = document.createElement('div');
  if (contentCol) {
    // Instead of picking individual elements, include ALL content
    // This ensures no text is missed
    Array.from(contentCol.childNodes).forEach((node) => {
      rightCell.appendChild(node.cloneNode(true));
    });
  }

  // Compose the table rows
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
