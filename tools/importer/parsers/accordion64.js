/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header (must be a single cell row)
  const headerRow = ['Accordion (accordion64)'];
  const rows = [headerRow];

  // Find the container holding all accordion items
  const container = element.querySelector('.acc-container');
  if (!container) return;

  // Find all accordion items
  const items = container.querySelectorAll('.acc-item');

  items.forEach((item) => {
    // Title: find the .acc-tab > h3 (the clickable header)
    let title = '';
    const tab = item.querySelector('.acc-tab');
    if (tab) {
      const h3 = tab.querySelector('h3');
      if (h3) {
        title = h3.textContent.trim(); // Use plain text only
      } else {
        title = tab.textContent.trim();
      }
    }

    // Content: find the .acc-pane-content (the body)
    let content = '';
    const pane = item.querySelector('.acc-pane');
    if (pane) {
      const paneContent = pane.querySelector('.acc-pane-content');
      if (paneContent) {
        content = paneContent.innerHTML.trim(); // Use HTML content only
      } else {
        content = pane.innerHTML.trim();
      }
    }

    // Only add row if we have a title
    if (title) {
      rows.push([title, content]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
