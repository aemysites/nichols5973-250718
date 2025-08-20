/* global WebImporter */
export default function parse(element, { document }) {
  // Build cells: header row should be a single cell, and content row should have two cells
  const cells = [
    ['Columns (columns60)'], // single cell in header row
  ];

  // Left column: Title and Description
  let leftContent = '';
  const intro = element.querySelector('.landing-subnav--intro');
  if (intro) {
    const frag = document.createDocumentFragment();
    const h1 = intro.querySelector('h1');
    if (h1) frag.appendChild(h1);
    const text = intro.querySelector('.text');
    if (text) frag.appendChild(text);
    leftContent = frag.childNodes.length ? frag : '';
  }

  // Right column: CTA link
  let rightContent = '';
  const navWrapper = element.querySelector('.landing-subnav--nav-wrapper');
  if (navWrapper) {
    const cta = navWrapper.querySelector('a');
    if (cta) rightContent = cta;
  }

  // Add content row (two columns)
  cells.push([
    leftContent,
    rightContent,
  ]);

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
