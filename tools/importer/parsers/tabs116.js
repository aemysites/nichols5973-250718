/* global WebImporter */
export default function parse(element, { document }) {
  // Extract tabs from element
  const tabLinks = Array.from(element.querySelectorAll('a'));
  // Compose the header row (1 column)
  const headerRow = ['Tabs (tabs116)'];
  const rows = [headerRow];

  // The structure requires the header row to be single-column,
  // and subsequent rows to be 2-columns (label, content).
  tabLinks.forEach((tabLink) => {
    // Tab label
    let label = '';
    const labelDiv = tabLink.querySelector('.glm-tab-text');
    if (labelDiv) {
      label = labelDiv.textContent.trim();
    } else {
      label = tabLink.textContent.trim();
    }
    // Content: try to find corresponding pane by aria-controls or href (#id)
    let tabPaneId = tabLink.getAttribute('aria-controls') || tabLink.getAttribute('href');
    let contentCell = '';
    if (tabPaneId && tabPaneId.startsWith('#')) {
      tabPaneId = tabPaneId.substring(1);
    }
    if (tabPaneId) {
      const tabPane = document.getElementById(tabPaneId);
      // If found, include all its children as content
      if (tabPane) {
        // If tabPane contains elements, put them as an array; else, just the text content
        if (tabPane.children.length) {
          contentCell = Array.from(tabPane.childNodes);
        } else {
          contentCell = tabPane.textContent.trim();
        }
      } else {
        // No content available for this tab (as in the given HTML)
        contentCell = '';
      }
    }
    rows.push([label, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
