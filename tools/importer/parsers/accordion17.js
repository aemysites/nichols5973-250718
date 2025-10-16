/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion17)'];

  // Find all accordion items (acc-item)
  const items = Array.from(element.querySelectorAll('.acc-item'));

  // Build rows for each accordion item
  const rows = items.map((item) => {
    // Title cell: find the header--main inside acc-tab
    const tab = item.querySelector('.acc-tab');
    let titleText = '';
    if (tab) {
      const header = tab.querySelector('.header--main');
      titleText = header ? header.textContent.trim() : tab.textContent.trim();
    }
    // Always use plain text for title cell

    // Content cell: find the acc-pane (may contain acc-pane-content, lists, etc)
    const pane = item.querySelector('.acc-pane');
    let contentEls = [];
    if (pane) {
      // Gather all direct children of acc-pane (acc-pane-content, ul, etc)
      contentEls = Array.from(pane.children).filter((child) => {
        // Only keep elements with meaningful content
        return child.textContent.trim() || child.querySelector('a, ul, img, strong, em');
      });
      // Defensive: if nothing found, fallback to acc-pane text
      if (contentEls.length === 0 && pane.textContent.trim()) {
        const div = document.createElement('div');
        div.textContent = pane.textContent.trim();
        contentEls = [div];
      }
    }
    // Defensive: if no content, provide empty cell
    if (!contentEls.length) {
      const div = document.createElement('div');
      div.textContent = '';
      contentEls = [div];
    }

    return [titleText, contentEls];
  });

  // Compose the table
  const tableCells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
