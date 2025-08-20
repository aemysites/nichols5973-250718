/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, must match exactly
  const headerRow = ['Columns (columns84)'];

  // Get the rich text section
  const layoutContainer = element.querySelector('.layout-container');
  const richText = layoutContainer ? layoutContainer.querySelector('.rich-text-basic__text') : null;

  if (!richText) return;

  // We'll split the content into two columns:
  // Left: all headings (h1/h2/h3/h4/h5/h6) and paragraphs before the .row
  // Right: the .row (which includes the columns of links/questions)

  // Gather left column content (existing elements, not clones)
  const leftContent = [];
  let foundRow = false;
  Array.from(richText.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('row')) {
      foundRow = true;
    }
    if (!foundRow && node.nodeType === Node.ELEMENT_NODE) {
      if (/^H[1-6]$/.test(node.tagName) || node.tagName === 'P') {
        // Only push if contains visible text
        if (node.textContent && node.textContent.trim()) {
          leftContent.push(node);
        }
      }
    }
  });

  // Gather right column content: the row (as a block, not individual table cells)
  const rowDiv = richText.querySelector('.row');
  let rightContent = [];
  if (rowDiv) {
    rightContent = [rowDiv];
  }

  // Defensive: If leftContent or rightContent empty, try to include as much as possible
  // If there is no .row, put all children into leftContent
  if (!rowDiv) {
    leftContent.length = 0;
    Array.from(richText.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && (/^H[1-6]$/.test(node.tagName) || node.tagName === 'P')) {
        if (node.textContent && node.textContent.trim()) {
          leftContent.push(node);
        }
      }
    });
  }

  // The structure is a table with one header row and one content row (with two columns)
  const cells = [headerRow, [leftContent, rightContent]];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
