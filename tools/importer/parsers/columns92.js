/* global WebImporter */
export default function parse(element, { document }) {
  // The block header must match the component name exactly
  const headerRow = ['Columns (columns92)'];

  // The only content in the sample HTML is the .rich-text-basic__text div
  // Reference the existing content block directly
  const textBlock = element.querySelector('.rich-text-basic__text');
  // Edge case: fallback to the whole element if inner div missing (robustness)
  const contentCell = textBlock || element;

  // Create the table structure
  const cells = [
    headerRow,
    [contentCell]
  ];

  // Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
