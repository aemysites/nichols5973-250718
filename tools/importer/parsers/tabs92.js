/* global WebImporter */
export default function parse(element, { document }) {
  // Find tab labels
  const tabLabels = Array.from(element.querySelectorAll('ul.tabs-list > li > a'));
  // Find tab contents
  const tabContents = Array.from(element.querySelectorAll('div.tabs-content'));

  // Header row matches block name from example
  const headerRow = ['Tabs (tabs92)'];

  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label: reference existing text from anchor
    const labelText = tabLabels[i]?.textContent.trim() || '';
    // Use <strong> for label, matching example bold style
    const labelElem = document.createElement('strong');
    labelElem.textContent = labelText;
    // Tab content: reference the actual content block
    const tabContentDiv = tabContents[i];
    // Defensive: skip row if content is missing
    if (!tabContentDiv) continue;
    rows.push([labelElem, tabContentDiv]);
  }

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
