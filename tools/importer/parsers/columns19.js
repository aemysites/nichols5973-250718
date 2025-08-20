/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to collect all content nodes (excluding .stat-columns)
  function collectContentBeforeStatColumns(container, statColumns) {
    const content = [];
    for (const child of Array.from(container.childNodes)) {
      if (child === statColumns) break;
      // Skip empty <p> tags
      if (
        child.nodeType === 1 &&
        child.tagName === 'P' &&
        (!child.textContent.trim() || child.innerHTML.trim() === '&nbsp;')
      ) {
        continue;
      }
      content.push(child);
    }
    return content;
  }

  // Left column: image and all content before stat-columns
  const leftDiv = document.createElement('div');
  const img = element.querySelector('.image-container img');
  if (img) leftDiv.appendChild(img);
  const layoutContainer = element.querySelector('.layout-container');
  const statColumns = layoutContainer && layoutContainer.querySelector('.stat-columns');
  if (layoutContainer) {
    const beforeStats = collectContentBeforeStatColumns(layoutContainer, statColumns);
    beforeStats.forEach((n) => leftDiv.appendChild(n));
  }

  // Stat columns
  let statCells = [];
  if (statColumns) {
    statCells = Array.from(statColumns.children).map((statItem) => {
      const statDiv = document.createElement('div');
      Array.from(statItem.childNodes).forEach((child) => {
        // Skip empty <p> tags
        if (
          child.nodeType === 1 &&
          child.tagName === 'P' &&
          (!child.textContent.trim() || child.innerHTML.trim() === '&nbsp;')
        ) {
          return;
        }
        statDiv.appendChild(child);
      });
      return statDiv;
    });
  }

  // Compose the table row in this order: left column, then each stat column
  const columnsRow = [leftDiv, ...statCells];

  // Build the columns block table with header
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns19)'],
    columnsRow
  ], document);

  element.replaceWith(table);
}
