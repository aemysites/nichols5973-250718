/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Ensure we have the expected split-text-image block
  if (!element || !element.classList.contains('split-text-image')) return;

  // Find main layout container
  const layoutContainer = element.querySelector('.layout-container');
  if (!layoutContainer) return;

  // Find split-text-image-wrapper for columns
  const wrapper = layoutContainer.querySelector('.split-text-image-wrapper');
  if (!wrapper) return;

  // Content column (left or right)
  let contentCol = wrapper.querySelector('.split-text-image__content');
  if (!contentCol) return;
  // Use deepest child for semantic grouping if present
  const contentInner = contentCol.querySelector('.split-text-image__content-container');
  if (contentInner) contentCol = contentInner;

  // Image column (left or right)
  let imageCol = wrapper.querySelector('.split-text-image__image');
  if (!imageCol) return;
  // Use image container if present
  const imageInner = imageCol.querySelector('.split-text-image__image-container');
  if (imageInner) imageCol = imageInner;

  // Build the block table as per example: header row, then a single row with 2 columns
  const cells = [
    ['Columns (columns32)'],
    [contentCol, imageCol]
  ];

  // Create and replace the element with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
