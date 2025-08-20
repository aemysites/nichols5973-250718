/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct children with a specific class
  function getImmediateChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(e => e.classList.contains(className));
  }

  // Find all direct .w-layout-grid.grid-2 sections (each is a row in this Columns block)
  const gridBlocks = element.querySelectorAll(':scope > ._1-2-flex > .w-layout-grid.grid-2, :scope > ._1-2-flex > .w-layout-grid.grid-2.plus');

  const rows = [];
  // Header must match block name exactly
  rows.push(['Columns (columns10)']);

  gridBlocks.forEach(grid => {
    const children = Array.from(grid.children);
    if (!children.length) return;
    // First column: big number block
    const left = children[0];
    // Remaining children are the icon+label pairs
    const rightBlocks = children.slice(1);

    // Arrange right blocks in two vertical columns (as in screenshot)
    // Split rightBlocks in half for two columns
    const half = Math.ceil(rightBlocks.length / 2);
    const col1 = rightBlocks.slice(0, half);
    const col2 = rightBlocks.slice(half);
    // Container for right two columns
    const rightContainer = document.createElement('div');
    rightContainer.style.display = 'flex';
    rightContainer.style.gap = '2em';
    rightContainer.style.alignItems = 'flex-start';
    const colDiv1 = document.createElement('div');
    colDiv1.style.display = 'flex';
    colDiv1.style.flexDirection = 'column';
    colDiv1.append(...col1);
    const colDiv2 = document.createElement('div');
    colDiv2.style.display = 'flex';
    colDiv2.style.flexDirection = 'column';
    colDiv2.append(...col2);
    rightContainer.append(colDiv1, colDiv2);

    rows.push([left, rightContainer]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
