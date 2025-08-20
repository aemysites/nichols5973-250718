/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name as in example
  const headerRow = ['Accordion (accordion71)'];
  const rows = [headerRow];

  // 2. Find accordion items container
  const accContainer = element.querySelector('.acc-container');
  if (!accContainer) return;

  // 3. Find all accordion items
  const items = Array.from(accContainer.querySelectorAll(':scope > .acc-item'));
  if (!items.length) return;

  // 4. For each item, extract title and content as elements
  items.forEach(item => {
    // Title cell
    let titleEl = '';
    const tab = item.querySelector(':scope > .acc-tab');
    if (tab) {
      // Prefer the <h3> if present, otherwise whole tab
      const heading = tab.querySelector('h1, h2, h3, .h3-header--main');
      titleEl = heading ? heading : tab;
    }
    // Content cell
    let contentEl = '';
    const pane = item.querySelector(':scope > .acc-pane');
    if (pane) {
      // Prefer .acc-pane-content if present, otherwise whole pane
      const paneContent = pane.querySelector('.acc-pane-content');
      contentEl = paneContent ? paneContent : pane;
    }
    rows.push([titleEl, contentEl]);
  });

  // 5. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
