/* global WebImporter */
export default function parse(element, { document }) {
  // Table header per block name, exactly as specified
  const headerRow = ['Accordion (accordion29)'];
  const rows = [];

  // Get all .acc-item children (accordion items)
  const accItems = element.querySelectorAll('.acc-item');
  accItems.forEach(accItem => {
    // Title cell
    let titleContent = '';
    const tab = accItem.querySelector('.acc-tab');
    if (tab) {
      const headerMain = tab.querySelector('.header--main');
      if (headerMain) {
        titleContent = headerMain.textContent.trim();
      }
    }
    // Content cell: gather all content under .acc-pane
    const pane = accItem.querySelector('.acc-pane');
    let contentElements = [];
    if (pane) {
      // Find all direct children of acc-pane
      // Most content is under .acc-pane-content and/or ul.accordion-list-wrap, but sometimes there are extra para-main divs & lists
      // We'll collect all direct children of .acc-pane, skipping style attributes and irrelevant wrappers
      Array.from(pane.children).forEach(child => {
        // Only include elements with meaningful content
        if (child.classList.contains('acc-pane-content') ||
            child.classList.contains('para-main') ||
            child.tagName.toLowerCase() === 'ul') {
          contentElements.push(child);
        }
      });
    }
    if (contentElements.length === 0) {
      contentElements = ['']; // fall back to empty string if no content
    }
    rows.push([titleContent, contentElements]);
  });
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
