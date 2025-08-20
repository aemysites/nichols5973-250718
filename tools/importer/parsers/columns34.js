/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match example exactly
  const headerRow = ['Columns (columns34)'];

  // First content row: intro text and map image as a single cell
  let introCell = [];
  const aboutUsContainer = element.querySelector('.about-us-container._1');
  if (aboutUsContainer) {
    aboutUsContainer.childNodes.forEach((node) => {
      // Exclude .horz block and empty text nodes
      if (
        !(node.nodeType === 1 && node.classList && node.classList.contains('horz')) &&
        !(node.nodeType === 3 && !node.textContent.trim())
      ) {
        introCell.push(node);
      }
    });
  }

  // Second row: four stat columns in a single row
  const horz = element.querySelector('.about-us-container.horz');
  let statCells = [];
  if (horz) {
    const statDivs = horz.querySelectorAll(':scope > .au-big-num-blk:not(.hide)');
    statDivs.forEach(stat => {
      // Gather all children and text nodes of the stat block
      const statCellContent = [];
      stat.childNodes.forEach(node => {
        if (node.nodeType === 3 && !node.textContent.trim()) return;
        statCellContent.push(node);
      });
      statCells.push(statCellContent);
    });
  }

  // Compose table rows
  // - header row (1 cell)
  // - intro/map row (1 cell)
  // - stats row (4 cells)
  const cells = [
    headerRow,
    [introCell],
    statCells
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
