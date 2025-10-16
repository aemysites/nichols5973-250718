/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns65)'];

  // Column 1: Navigation/filter bar (all nav/filter items)
  const nav = element.querySelector('.latest-insights-events__filters-nav');
  let navColumn = '';
  if (nav) {
    navColumn = nav.cloneNode(true);
  }

  // Column 2: Date filter fields (if present)
  const dateFields = element.querySelector('.filter__date-fields');
  let dateColumn = '';
  if (dateFields) {
    dateColumn = dateFields.cloneNode(true);
  }

  // Column 3: Locations dropdown content (all visible location items)
  const locationsList = element.querySelector('.latest-insights-events__items');
  let locationsColumn = '';
  if (locationsList) {
    const items = Array.from(locationsList.querySelectorAll('.latest-insights-events__item'));
    if (items.length) {
      const div = document.createElement('div');
      items.forEach(item => div.appendChild(item.cloneNode(true)));
      locationsColumn = div;
    }
  }

  // Column 4: Mobile nav button (if present)
  const mobileNav = element.querySelector('.latest-insights-events__mobile-nav-link');
  let mobileColumn = '';
  if (mobileNav) {
    mobileColumn = mobileNav.cloneNode(true);
  }

  // Column 5: Clear tags button (if present)
  const clearTags = element.querySelector('.latest-insights-events__clear-tags');
  let clearColumn = '';
  if (clearTags) {
    clearColumn = clearTags.cloneNode(true);
  }

  // Compose the columns row: each column is a block of related content
  const columnsRow = [
    navColumn,
    dateColumn,
    locationsColumn,
    mobileColumn,
    clearColumn
  ].filter(cell => cell && (typeof cell === 'string' ? cell.trim() : true));

  if (columnsRow.length) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      columnsRow
    ], document);
    element.replaceWith(table);
  }
}
