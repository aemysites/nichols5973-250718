/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as required by the spec
  const headerRow = ['Accordion (accordion82)'];
  const rows = [headerRow];

  // Get all direct accordion items
  const accItems = element.querySelectorAll(':scope > .acc-container > .acc-item');

  accItems.forEach(accItem => {
    // Get the title cell
    let titleCell = '';
    const tab = accItem.querySelector(':scope > .acc-tab');
    if (tab) {
      const header = tab.querySelector(':scope > .header--main');
      if (header) titleCell = header;
    }

    // Get the content cell
    let contentCell = '';
    const pane = accItem.querySelector(':scope > .acc-pane');
    if (pane) {
      // Only grab visible contents (those under .acc-pane-content and lists)
      // This makes the cell more robust to variation
      const contents = [];
      // .acc-pane-content blocks
      pane.querySelectorAll(':scope > .acc-pane-content').forEach(c => contents.push(c));
      // any ul.accordion-list-wrap directly under pane
      pane.querySelectorAll(':scope > ul.accordion-list-wrap').forEach(c => contents.push(c));
      // Handle the case where pane might also have content nodes directly (e.g., text nodes, divs)
      Array.from(pane.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
          contents.push(document.createTextNode(node.textContent));
        }
      });
      if (contents.length === 1) contentCell = contents[0];
      else if (contents.length > 1) contentCell = contents;
      else contentCell = '';
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
