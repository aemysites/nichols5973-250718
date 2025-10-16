/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion89)'];
  const rows = [headerRow];

  // Find all accordion items
  const accItems = element.querySelectorAll('.acc-item');

  accItems.forEach((item) => {
    // Title cell: Find the header text inside .acc-tab > .header--main
    let title = '';
    const tab = item.querySelector('.acc-tab');
    if (tab) {
      const header = tab.querySelector('.header--main');
      if (header) {
        title = header;
      }
    }

    // Content cell: Find the pane content inside .acc-pane
    let content = '';
    const pane = item.querySelector('.acc-pane');
    if (pane) {
      // Gather all children with meaningful content (divs, lists, etc)
      const contentFragments = [];
      Array.from(pane.children).forEach((child) => {
        if (
          child.textContent.trim() ||
          child.querySelector('img, ul, ol, a')
        ) {
          contentFragments.push(child);
        }
      });
      // If there are fragments, use them; otherwise, use pane itself (if not empty)
      if (contentFragments.length > 0) {
        content = contentFragments;
      } else if (pane.textContent.trim()) {
        content = pane;
      }
    }

    // Add row: [title, content]
    rows.push([title, content]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
