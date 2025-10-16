/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirements
  const headerRow = ['Columns (columns118)'];

  // Find the menu row (the horizontal nav bar)
  const nav = element.querySelector('.latest-insights-podcasts__filters-nav');
  if (!nav) return;

  // Compose the row by extracting all direct children of the nav bar
  const row = Array.from(nav.children).map(child => {
    if (child.classList.contains('filter__image-link-nav-item')) {
      const link = child.querySelector('a');
      return link ? link.cloneNode(true) : '';
    }
    if (child.classList.contains('filter__nav-item-separator')) {
      return child.textContent.trim();
    }
    if (child.classList.contains('filter__text-link-nav-item')) {
      const innerDiv = child.querySelector('div');
      const span = document.createElement('span');
      span.textContent = innerDiv ? innerDiv.textContent.trim() : child.textContent.trim();
      return span;
    }
    return child.textContent.trim();
  });

  // Add all other text content from the original HTML as additional columns in the same row (to ensure all text is included)
  // Get all text nodes that are not inside nav
  const extraTexts = [];
  // 'Filters' button
  const mobileNav = element.querySelector('.latest-insights-podcasts__mobile-nav-link');
  if (mobileNav) {
    extraTexts.push(mobileNav.cloneNode(true));
  }
  // 'Clear All Filters' link
  const clearTags = element.querySelector('.latest-insights-podcasts__clear-tags');
  if (clearTags) {
    extraTexts.push(clearTags.cloneNode(true));
  }

  // Compose a single row with all content (nav + extra text content)
  const fullRow = [...row, ...extraTexts];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    fullRow
  ], document);

  element.replaceWith(table);
}
