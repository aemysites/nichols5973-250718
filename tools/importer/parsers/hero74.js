/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as specified
  const headerRow = ['Hero (hero74)'];

  // There is NO background image present in the HTML, but the row must exist, so keep as empty string
  const bgImageRow = [''];

  // Content row: must contain ALL text content in the element
  // If the element has childNodes, wrap them in a div for structure and future-proofing
  let contentCell;
  if (element.childNodes.length > 1) {
    const wrapper = document.createElement('div');
    Array.from(element.childNodes).forEach(node => wrapper.appendChild(node));
    contentCell = wrapper;
  } else if (element.childNodes.length === 1) {
    contentCell = element.childNodes[0]; // preserve semantics (e.g. <p>)
  } else {
    contentCell = '';
  }

  const cells = [headerRow, bgImageRow, [contentCell]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
