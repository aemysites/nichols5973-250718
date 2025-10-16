/* global WebImporter */
export default function parse(element, { document }) {
  // Only use visible timeline columns (exclude .hide) for correct Columns block structure
  const wraps = Array.from(element.querySelectorAll(':scope > ._10p-wrap'))
    .filter(wrap => !wrap.classList.contains('hide'));

  if (!wraps.length) return;

  // Each column is a timeline-block-single inside _10p-wrap
  const columns = wraps.map(wrap => {
    const block = wrap.querySelector('.timeline-block-single');
    if (!block) return null;
    // Gather all circle icons (some columns have multiple)
    const circles = Array.from(block.querySelectorAll('.small-data-circle-pli')).filter(circle => circle.children.length);
    // Gather all year labels (inline year)
    const years = Array.from(block.querySelectorAll('._10p-timeline-text-year.inline')).filter(year => year.textContent.trim().length);
    // Gather all main timeline text blocks
    const texts = Array.from(block.querySelectorAll('._10p-timeline-text')).filter(text => text.textContent.trim().length);
    // Compose column cell content
    const cellContent = [];
    if (circles.length) cellContent.push(...circles);
    if (years.length) cellContent.push(...years);
    if (texts.length) cellContent.push(...texts);
    return cellContent.length ? cellContent : null;
  }).filter(Boolean);

  if (!columns.length) return;

  // Build table rows
  const headerRow = ['Columns (columns44)'];
  const contentRow = columns;

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element with block table
  element.replaceWith(table);
}
