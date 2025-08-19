/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we reference the correct header as in the example
  const headerRow = ['Hero (hero115)'];

  // Background image row: No image in the source HTML, leave cell empty
  const backgroundRow = [''];

  // Find the main text container.
  const textContainer = element.querySelector('.rich-text-basic__text') || element;

  // Gather all direct children (in case of source structure variation)
  const children = Array.from(textContainer.childNodes).filter(node => {
    // Only include Elements and meaningful Text nodes
    return (
      node.nodeType === Node.ELEMENT_NODE ||
      (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
    );
  });

  // Compose all content in a single array for the cell
  const contentElements = [];
  children.forEach(child => {
    // Reference only non-empty elements
    if (
      child.nodeType === Node.ELEMENT_NODE &&
      (child.tagName !== 'P' || child.textContent.trim())
    ) {
      contentElements.push(child);
    }
  });

  // If no content found, fallback to empty string
  const contentRow = [contentElements.length ? contentElements : ['']];

  // Build the table: always 1 column, 3 rows as per spec
  const tableCells = [headerRow, backgroundRow, contentRow];

  // Create the table
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace original element
  element.replaceWith(blockTable);
}
