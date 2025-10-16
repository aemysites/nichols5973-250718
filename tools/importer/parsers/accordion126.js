/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block name header (must match guidelines)
  const headerRow = ['Accordion (accordion126)']; // single cell, not <th>

  // Find all accordion items
  const items = element.querySelectorAll('.acc-item');

  const rows = Array.from(items).map(item => {
    // Title: .acc-tab > .header--main
    let titleCell = '';
    const tab = item.querySelector('.acc-tab');
    if (tab) {
      const titleEl = tab.querySelector('.header--main');
      if (titleEl) {
        titleCell = titleEl;
      }
    }

    // Content: .acc-pane > .acc-pane-content
    let contentCell = '';
    const pane = item.querySelector('.acc-pane');
    if (pane) {
      const contentEl = pane.querySelector('.acc-pane-content');
      if (contentEl) {
        contentCell = contentEl;
      }
    }

    return [titleCell || '', contentCell || ''];
  });

  // Compose the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
