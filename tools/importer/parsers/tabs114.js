/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child .w-tab-pane elements (each tab)
  const tabPanes = Array.from(element.querySelectorAll(':scope > div.w-tab-pane'));

  // Header row: single cell, but it will span two columns visually
  const headerRow = ['Tabs (tabs114)', '']; // Empty second cell ensures two columns; createTable will render th for each cell

  // Each tab: [Tab Label, Tab Content]
  const rows = tabPanes.map((tabPane) => {
    const label = tabPane.getAttribute('data-w-tab') ? tabPane.getAttribute('data-w-tab').trim() : '';
    const content = Array.from(tabPane.childNodes).filter((node) => {
      // Filter out empty text nodes
      if (node.nodeType === 3) return node.textContent.trim().length > 0;
      return true;
    });
    return [label, content.length === 1 ? content[0] : content];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // After table generation, set correct colspan on header cell if needed
  const ths = table.querySelectorAll('tr:first-child th');
  if (ths.length === 2) {
    ths[0].setAttribute('colspan', '2');
    ths[1].remove();
  }

  element.replaceWith(table);
}
