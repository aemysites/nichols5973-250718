/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns87)'];

  // Defensive: get the main content container
  const layoutContainer = element.querySelector('.layout-container');
  if (!layoutContainer) return;

  // Get the rich text content
  const richText = layoutContainer.querySelector('.rich-text-basic__text');
  if (!richText) return;

  // Find the table (right column)
  const table = richText.querySelector('table');

  // --- Extract left column content ---
  // We'll collect all nodes before the table as the left column
  const leftColumnNodes = [];
  let node = richText.firstChild;
  while (node && node !== table) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Ignore empty whitespace nodes
      if ((node.textContent || '').trim() !== '') {
        leftColumnNodes.push(node);
      }
    }
    node = node.nextSibling;
  }

  // Also, after the table, there are more paragraphs for the left column
  node = table ? table.nextSibling : null;
  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if ((node.textContent || '').trim() !== '') {
        leftColumnNodes.push(node);
      }
    }
    node = node.nextSibling;
  }

  // --- Extract right column content ---
  // The right column is the content inside the table cell (the card), plus the link below
  let rightColumnContent = [];
  if (table) {
    const tableCell = table.querySelector('td[style*="400px"]');
    if (tableCell) {
      // The card (statistic and supporting text)
      const cardDiv = tableCell.querySelector('.row');
      if (cardDiv) {
        rightColumnContent.push(cardDiv);
      }
      // The link below the card
      const linkPara = tableCell.querySelector('p > sub > a, p > a');
      if (linkPara) {
        rightColumnContent.push(linkPara.closest('p'));
      }
    }
  }

  // Defensive: fallback if cardDiv not found
  if (rightColumnContent.length === 0 && table) {
    const tableCell = table.querySelector('td[style*="400px"]');
    if (tableCell) {
      rightColumnContent.push(tableCell);
    }
  }

  // --- Build the columns row ---
  const columnsRow = [leftColumnNodes, rightColumnContent];

  // Build the table
  const tableRows = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element
  element.replaceWith(block);
}
