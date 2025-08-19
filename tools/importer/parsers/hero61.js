/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must exactly match the block name.
  const headerRow = ['Hero (hero61)'];

  // The image/background row is not present in the provided HTML, so keep empty string.
  const imageRow = [''];

  // For the content row, include all text and HTML content from the block.
  // Reference the entire element, which ensures all content is included and structure preserved.
  const contentRow = [element];

  const cells = [headerRow, imageRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
