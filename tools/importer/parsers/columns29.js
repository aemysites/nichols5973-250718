/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block header row
  const headerRow = ['Columns (columns29)'];

  // Find all tab panes (each is a row in this block)
  const tabPanes = Array.from(element.querySelectorAll(':scope > div.fe-tab-pane'));

  // For each tab, extract left and right columns
  const rows = tabPanes.map(tabPane => {
    const leftWrap = tabPane.querySelector('.l-wrap-fe-tab');
    const rightWrap = tabPane.querySelector('.r-wrap-fe-tab');
    // Defensive: fallback to empty div if not found
    const leftContent = leftWrap ? leftWrap : document.createElement('div');
    const rightContent = rightWrap ? rightWrap : document.createElement('div');
    return [leftContent, rightContent];
  });

  // Build table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
