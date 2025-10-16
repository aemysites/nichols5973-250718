/* global WebImporter */
export default function parse(element, { document }) {
  // Find the navigation bar: the <p> with anchor tags at the very top of the .rich-text-basic__text
  const mainContentDiv = element.querySelector('.rich-text-basic__text');
  if (!mainContentDiv) return;

  let navBar = null;
  // Find the first <p> with anchor tags (the nav bar)
  for (const child of mainContentDiv.children) {
    if (child.tagName === 'P' && child.querySelectorAll('a').length) {
      navBar = child.cloneNode(true);
      break;
    }
  }

  // Find the right column (the blue box in the table)
  let rightColumn = null;
  const table = mainContentDiv.querySelector('table');
  if (table) {
    const col = table.querySelector('.row > .column');
    if (col) rightColumn = col;
  }

  // Find left column: h3 and following paragraphs (after the table)
  const leftColumnElements = [];
  let foundH3 = false;
  for (const child of mainContentDiv.children) {
    if (child.tagName === 'TABLE') continue;
    if (child.tagName === 'H3') {
      leftColumnElements.push(child);
      foundH3 = true;
      continue;
    }
    if (foundH3 && child.tagName === 'P') {
      leftColumnElements.push(child);
    }
  }
  // Defensive: if no h3, take all paragraphs after the table
  if (!leftColumnElements.length) {
    let afterTable = false;
    for (const child of mainContentDiv.children) {
      if (child.tagName === 'TABLE') {
        afterTable = true;
        continue;
      }
      if (afterTable && (child.tagName === 'H3' || child.tagName === 'P')) {
        leftColumnElements.push(child);
      }
    }
  }

  // Compose the table rows
  const headerRow = ['Columns (columns102)'];
  const columnsRow = [
    [navBar, ...leftColumnElements].filter(Boolean),
    rightColumn ? rightColumn : ''
  ];
  const cells = [headerRow, columnsRow];

  // Replace the original element
  const tableEl = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(tableEl);
}
