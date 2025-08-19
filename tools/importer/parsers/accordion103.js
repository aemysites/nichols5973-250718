/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row matches exactly
  const headerRow = ['Accordion (accordion103)'];
  const cells = [headerRow];

  // 2. Get all accordion items (each becomes a table row with 2 columns)
  const items = element.querySelectorAll(':scope > .accordion-body__item');
  items.forEach(item => {
    // Title cell: get all direct children of .accordion-body__item--title
    const titleDiv = item.querySelector('.accordion-body__item--title');
    let titleCellContent = [];
    if (titleDiv) {
      // Prefer referencing ALL children (to handle icons, headings, etc.)
      titleCellContent = Array.from(titleDiv.childNodes).filter(node => {
        // Only keep elements and non-empty text nodes
        return (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()));
      });
      // If nothing found, fallback to empty string
      if (titleCellContent.length === 0) titleCellContent = [''];
    } else {
      titleCellContent = [''];
    }

    // Content cell: all children of .accordion-body__item--body
    const bodyDiv = item.querySelector('.accordion-body__item--body');
    let contentCellContent = [];
    if (bodyDiv) {
      // Reference all children (paragraphs, lists, etc.)
      contentCellContent = Array.from(bodyDiv.childNodes).filter(node => {
        // Only keep elements and non-empty text nodes
        return (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()));
      });
      if (contentCellContent.length === 0) contentCellContent = [''];
    } else {
      contentCellContent = [''];
    }
    // Add the row
    cells.push([titleCellContent, contentCellContent]);
  });

  // 3. Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // 4. Replace the original element
  element.replaceWith(block);
}
