/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one cell with block name
  const headerRow = ['Tabs (tabs13)'];

  // Extract tab labels from direct children <a> elements
  const tabLinks = Array.from(element.querySelectorAll(':scope > a'));

  // Each tab row: [label, '']
  const rows = tabLinks.map(link => {
    // Try to get label from inner <div>, fallback to link text
    const labelDiv = link.querySelector('div');
    const label = labelDiv ? labelDiv.textContent.trim() : link.textContent.trim();
    return [label, ''];
  });

  // Compose the table: header row + tab rows (2 columns from row 2 on)
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}