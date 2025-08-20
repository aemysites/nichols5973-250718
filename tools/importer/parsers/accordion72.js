/* global WebImporter */
export default function parse(element, { document }) {
  // The header row as required by the example
  const headerRow = ['Accordion (accordion72)'];
  const rows = [headerRow];

  // Find the accordion container, which should contain all acc-item blocks
  const container = element.querySelector('.acc-container');
  if (!container) return;
  // Select all direct children with .acc-item
  const items = container.querySelectorAll(':scope > .acc-item');

  items.forEach((item) => {
    // Extract the title cell: .acc-tab > h3.h3-header--main
    let titleCell = '';
    const tab = item.querySelector('.acc-tab');
    if (tab) {
      const h3 = tab.querySelector('h3.h3-header--main');
      if (h3) {
        titleCell = h3;
      } else {
        // fallback: use tab's textContent
        const span = document.createElement('span');
        span.textContent = tab.textContent.trim();
        titleCell = span;
      }
    }

    // Extract the content cell: .acc-pane > .acc-pane-content
    let contentCell = '';
    const pane = item.querySelector('.acc-pane');
    if (pane) {
      const content = pane.querySelector('.acc-pane-content');
      if (content) {
        contentCell = content;
      } else if (pane.textContent.trim()) {
        // fallback: use pane's textContent if not empty
        const span = document.createElement('span');
        span.textContent = pane.textContent.trim();
        contentCell = span;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the table using the rows definition
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}