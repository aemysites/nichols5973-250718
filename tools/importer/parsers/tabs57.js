/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row as an array with a single string
  const headerRow = ['Tabs (tabs57)'];

  // Find the tab navigation area and extract tab labels
  const nav = element.querySelector('.latest-insights-events__filters-nav');
  let tabRows = [];
  if (nav) {
    // Only direct tab labels, not dropdown or separator
    const tabLabelItems = Array.from(nav.children).filter(item => item.classList.contains('filter__text-link-nav-item'));
    // Find tab content blocks (dropdowns)
    const dropdowns = Array.from(element.querySelectorAll('.latest-insights-events__filters-dropdown'));
    tabRows = tabLabelItems.map((tabItem, idx) => {
      let labelDiv = tabItem.querySelector('div[tabindex]');
      let label = labelDiv ? labelDiv.textContent.trim() : tabItem.textContent.trim();
      let content = '';
      if (dropdowns[idx]) {
        const contentBlock = dropdowns[idx].querySelector('.latest-insights-events__content');
        if (contentBlock) {
          const contentDiv = document.createElement('div');
          Array.from(contentBlock.childNodes).forEach(child => contentDiv.appendChild(child));
          content = contentDiv;
        } else {
          content = dropdowns[idx];
        }
      }
      return [label, content];
    });
  }

  // Build the cells array: one row with one cell (header), all other rows with two cells.
  // WebImporter.DOMUtils.createTable will not set colspan unless asked, so this will be strictly one cell for header row.
  const cells = [headerRow, ...tabRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
