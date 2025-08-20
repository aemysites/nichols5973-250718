/* global WebImporter */
export default function parse(element, { document }) {
  // Compose table header as required by block name and example
  const headerRow = ['Hero (hero3)'];

  // Row 2: background image; none present, so empty string (matches example behavior)
  const bgRow = [''];

  // Row 3: main content
  // Extract all content within the main column
  let mainColumn = element.querySelector('.column') || element;
  // Collect all non-empty children, skipping empty <p>
  const contentElements = Array.from(mainColumn.childNodes).filter(node => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P' && node.innerHTML.replace(/&nbsp;/g, '').trim() === '') return false;
    return true;
  });
  // Ensure all content is referenced, including the stats <table> and CTA <a>

  // Build the cells array
  const cells = [
    headerRow,
    bgRow,
    [contentElements],
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
