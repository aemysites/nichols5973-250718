/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main layout container if present
  const container = element.querySelector('.layout-container') || element;
  // Get the main rich text area
  const richText = container.querySelector('.rich-text-basic__text') || container;

  // Find the stat table and right column content
  const statTable = richText.querySelector('table');
  let rightColumnContent = null;
  if (statTable) {
    // find the right cell (contains the stat box)
    const td = statTable.querySelector('td[style*="width: 400px"]');
    if (td) {
      // reference the stat cell's children as the right column
      rightColumnContent = Array.from(td.childNodes).filter(
        n => n.nodeType !== 3 || n.textContent.trim() // skip empty text nodes
      );
    }
    // Remove the table from the left column content
    statTable.remove();
  }

  // For the left column, grab all remaining child nodes
  // Remove empty <p> tags at start and end (for resilience)
  let leftNodes = Array.from(richText.childNodes).filter(n => {
    // skip whitespace
    return n.nodeType !== 3 || n.textContent.trim();
  });
  // Remove leading empty paragraphs
  while (leftNodes.length && leftNodes[0].nodeName === 'P' && !leftNodes[0].textContent.trim()) {
    leftNodes.shift();
  }
  // Remove trailing empty paragraphs
  while (leftNodes.length && leftNodes[leftNodes.length-1].nodeName === 'P' && !leftNodes[leftNodes.length-1].textContent.trim()) {
    leftNodes.pop();
  }

  // Compose columns for the block
  // Left column: all content nodes except the stat table
  // Right column: stat table cell's children
  const leftCol = leftNodes;
  const rightCol = rightColumnContent || [];

  const cells = [
    ['Columns (columns90)'],
    [leftCol, rightCol]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
