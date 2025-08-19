/* global WebImporter */
export default function parse(element, { document }) {
  // ---------------------
  // Accordion Block Table
  // ---------------------
  // The header row exactly as specified
  const headerRow = ['Accordion (accordion116)'];

  // Find the main accordion container
  let itemContainer = element.querySelector('.acc-container');
  if (!itemContainer) itemContainer = element;

  // Get all accordion item blocks
  const items = Array.from(itemContainer.querySelectorAll(':scope > .acc-item'));

  // Build each accordion row: [title, content]
  const rows = items.map(item => {
    // Title cell: find the header element
    let title = item.querySelector('.header--main');
    // Fallback: first child of .acc-tab if .header--main is missing
    if (!title) {
      const tab = item.querySelector('.acc-tab');
      if (tab && tab.firstElementChild) {
        title = tab.firstElementChild;
      } else {
        // edge case: missing, create empty div
        title = document.createElement('div');
      }
    }

    // Content cell: find the visible content for the accordion
    let contentCell;
    const paneContent = item.querySelector('.acc-pane-content');
    if (paneContent) {
      // If there is both a main paragraph and a list, include both
      const para = paneContent.querySelector('.para-main');
      const list = paneContent.querySelector('ul');
      if (para && list) {
        contentCell = [para, list];
      } else if (paneContent.children.length === 1) {
        // Only a single child within paneContent: use it
        contentCell = paneContent.firstElementChild;
      } else {
        // Multiple children: include all as array
        contentCell = Array.from(paneContent.children);
      }
    } else {
      // Fallback to empty div if no content found
      contentCell = document.createElement('div');
    }
    return [title, contentCell];
  });

  // Compose the table cells array
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
