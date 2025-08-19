/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for block name, must match the specification
  const headerRow = ['Columns (columns50)'];

  // Defensive: check for all necessary wrappers
  const mainWrap = element.querySelector('.rai-main-wrapper');
  if (!mainWrap) return;
  const sectionWrap = mainWrap.querySelector('.rai-section-wrap');
  if (!sectionWrap) return;

  // The structure is: image (left), then all text content (right)
  // Left column: image
  let leftColumn = null;
  const accSub = sectionWrap.querySelector('.rai-acc-sub');
  if (accSub) {
    leftColumn = accSub.querySelector('.rai-image-container');
  }

  // Right column: heading + all blocks
  const rightColumn = document.createElement('div');
  // Heading
  const heading = sectionWrap.querySelector('.acc-rai-heading');
  if (heading) rightColumn.appendChild(heading);
  // Each principle is a .rai-acc-block
  if (accSub) {
    const textContent = accSub.querySelector('.rai-text-content');
    if (textContent) {
      const blocks = textContent.querySelectorAll('.rai-acc-block');
      blocks.forEach(block => {
        // Reference the existing block node (do not clone)
        rightColumn.appendChild(block);
      });
    }
  }

  // Compose table: header row, then [left, right] columns
  const cells = [
    headerRow,
    [leftColumn, rightColumn]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
