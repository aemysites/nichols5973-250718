/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Columns (columns38)'];

  // Get the container with the links and title
  const scrollable = element.querySelector('.scrollable-container');
  if (!scrollable) return;

  // Get the title and links UL
  const titleElem = scrollable.querySelector('.anchor-links__title');
  const ul = scrollable.querySelector('.anchor-links__items');

  // Prepare cell content, referencing existing elements (not cloning)
  const cellContent = [];
  if (titleElem) cellContent.push(titleElem);
  if (ul) cellContent.push(ul);

  // Construct the table
  const cells = [
    headerRow,
    [cellContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
