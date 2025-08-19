/* global WebImporter */
export default function parse(element, { document }) {
  // Find tab labels
  const nav = element.querySelector('.latest-insights-events__filters-nav');
  const tabItems = Array.from(nav ? nav.children : []).filter(item =>
    item.classList.contains('filter__nav-item') &&
    item.classList.contains('filter__text-link-nav-item') &&
    item.querySelector('div[tabindex="0"]')
  );
  const tabLabels = tabItems.map(item => {
    const labelDiv = item.querySelector('div[tabindex="0"]');
    return labelDiv ? labelDiv.textContent.trim() : '';
  });

  // Find tab contents in order
  const dropdownsContainer = element.querySelector('.latest-insights-events__filters-dropdowns');
  let tabContents = [];
  if (dropdownsContainer) {
    const dropdowns = Array.from(dropdownsContainer.querySelectorAll('.latest-insights-events__filters-dropdown'));
    tabContents = tabLabels.map((_, i) => {
      const dropdown = dropdowns[i];
      if (!dropdown) return document.createElement('div');
      const items = dropdown.querySelector('.latest-insights-events__items');
      if (items && items.textContent.trim()) {
        return items;
      }
      return dropdown;
    });
  } else {
    tabContents = tabLabels.map(() => document.createElement('div'));
  }

  // Build table: 1st row: header (single cell), 2nd row: tab labels (one per column), 3rd row: tab contents (one per column)
  const cells = [];
  cells.push(['Tabs (tabs59)']);                 // Header row, single cell
  cells.push(tabLabels);                         // Tab label row, one cell per tab
  cells.push(tabContents);                       // Tab content row, one cell per tab

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
