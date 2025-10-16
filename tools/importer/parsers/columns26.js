/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // Find the main container holding the three columns
  const slideContainer = element.querySelector('.sd-container-slide');
  if (!slideContainer) return;

  // Get the big data/stat containers (left and right columns)
  const bigDataBlocks = slideContainer.querySelectorAll('.sd-container-big-data');
  // Get the middle container (center column)
  const middleContainer = slideContainer.querySelector('.sd-container-middle');

  // Defensive: ensure we have the expected structure
  if (bigDataBlocks.length !== 2 || !middleContainer) return;

  // Left column: first big-data block
  const leftCol = bigDataBlocks[0];
  // Center column: the middle container
  const centerCol = middleContainer;
  // Right column: second big-data block
  const rightCol = bigDataBlocks[1];

  // Build the table rows
  const headerRow = ['Columns (columns26)'];
  const contentRow = [leftCol, centerCol, rightCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
