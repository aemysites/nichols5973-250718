/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell/column
  const headerRow = ['Tabs (tabs5)'];

  // Get all tab links (direct children)
  const tabLinks = Array.from(element.querySelectorAll(':scope > a'));

  // For each tab, get tab label element
  const rows = tabLinks.map(tab => {
    // Prefer the <div> child for label, else use the <a> itself
    const labelElem = tab.querySelector('div') || tab;
    // The second cell (tab content) is not present in this input, so leave blank
    return [labelElem, ''];
  });

  // Compose the cells array with the header row as a single array
  // and all subsequent rows each as their own two-cell array
  const cells = [headerRow, ...rows];

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
