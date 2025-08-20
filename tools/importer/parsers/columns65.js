/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns65) block header, single column
  const headerRow = ['Columns (columns65)'];

  // Find main content (be flexible for variations)
  let main = element;
  const layout = element.querySelector('.layout-container');
  if (layout) {
    const richText = layout.querySelector('.rich-text-basic__text');
    if (richText) main = richText;
    else main = layout;
  }

  // Helper: remove empty paragraphs and whitespace-only nodes
  function isNonEmpty(node) {
    if (node.nodeType === 3 && node.textContent.replace(/\u00a0/g, '').trim() === '') return false;
    if (node.nodeType === 1 && node.tagName === 'P' && node.textContent.replace(/\u00a0/g, '').trim() === '') return false;
    return true;
  }

  // Find the left column (table with image) and right column (rest of the content)
  let leftCol = [];
  let rightCol = [];
  const nodes = Array.from(main.childNodes).filter(isNonEmpty);

  // Look for the image table (left column)
  let foundTable = false;
  nodes.forEach((node) => {
    if (!foundTable && node.nodeType === 1 && node.tagName === 'TABLE') {
      leftCol.push(node);
      foundTable = true;
    } else {
      rightCol.push(node);
    }
  });

  // If no table found, treat all as right column (single column layout)
  if (leftCol.length === 0) {
    rightCol = nodes;
  }

  // Build block table
  let contentRow;
  if (leftCol.length && rightCol.length) {
    contentRow = [leftCol, rightCol];
  } else {
    contentRow = [rightCol];
  }

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
