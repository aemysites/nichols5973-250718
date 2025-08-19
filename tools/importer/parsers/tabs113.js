/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as a single column
  const headerRow = ['Tabs (tabs113)'];

  // Each tab gets its own row, with two columns: label, content (blank)
  const tabLinks = Array.from(element.querySelectorAll('a'));
  const tabRows = tabLinks.map(tabLink => {
    // Tab label: use .glm-tab-text div if available, else anchor text
    const tabTextDiv = tabLink.querySelector('.glm-tab-text');
    const labelEl = tabTextDiv ? tabTextDiv : document.createTextNode(tabLink.textContent.trim());
    // Content cell blank, as HTML doesn't provide content
    return [labelEl, ''];
  });

  // Compose table cells: header is single cell, each tab is a row with two cells
  const cells = [headerRow, ...tabRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
