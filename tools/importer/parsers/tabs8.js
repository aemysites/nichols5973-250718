/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell as per example
  const headerRow = ['Tabs (tabs8)'];

  // Extract tab labels in correct order
  const filtersNav = element.querySelector('.latest-insights-insights__filters-nav');
  let tabLabels = [];
  if (filtersNav) {
    tabLabels = Array.from(filtersNav.querySelectorAll(':scope > .filter__nav-item > div[role="listbox"]'))
      .map(div => div.textContent.trim())
      .filter(Boolean);
  }

  // Extract tab content blocks, one per dropdown, matching tab order
  const dropdowns = Array.from(element.querySelectorAll('.latest-insights-insights__filters-dropdown'));
  const tabCount = Math.max(tabLabels.length, dropdowns.length);

  // Compose tab label header row
  const tabLabelRow = [];
  for (let i = 0; i < tabCount; i++) {
    tabLabelRow.push(tabLabels[i] || '');
  }

  // Compose tab content row (one content block per tab)
  const tabContentRow = [];
  for (let i = 0; i < tabCount; i++) {
    tabContentRow.push(dropdowns[i] || document.createTextNode(''));
  }

  // Compose final table
  const cells = [
    headerRow,
    tabLabelRow,
    tabContentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
