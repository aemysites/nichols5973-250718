/* global WebImporter */
export default function parse(element, { document }) {
  // Find all tab panes
  const tabPanes = element.querySelectorAll(':scope > .fe-tab-pane');
  const rows = [];
  tabPanes.forEach(tabPane => {
    const wrap = tabPane.querySelector(':scope > .tab-wrap-fe');
    if (!wrap) return;
    const left = wrap.querySelector(':scope > .l-wrap-fe-tab');
    const right = wrap.querySelector(':scope > .r-wrap-fe-tab');
    // Combine left and right as siblings in a single cell (array of elements)
    const cellContent = [];
    if (left) cellContent.push(left);
    if (right) cellContent.push(right);
    rows.push([cellContent]); // single column: each row is a one-element array
  });
  // Header row: exactly one column, as in the example
  const cells = [
    ['Columns (columns41)'],
    ...rows
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
