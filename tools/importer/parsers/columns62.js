/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container with left and right content
  // The structure is: ...wrapper > ...container > ...content > ...item > ...intro & ...nav-wrapper
  const item = element.querySelector('.landing-subnav--item');

  // Defensive fallbacks
  let leftCol = null;
  let rightCol = null;
  if (item) {
    leftCol = item.querySelector('.landing-subnav--intro');
    rightCol = item.querySelector('.landing-subnav--nav-wrapper');
  } else {
    leftCol = element.querySelector('.landing-subnav--intro');
    rightCol = element.querySelector('.landing-subnav--nav-wrapper');
  }

  // If either column is missing, create a fallback div with no content to preserve layout
  if (!leftCol) {
    leftCol = document.createElement('div');
  }
  if (!rightCol) {
    rightCol = document.createElement('div');
  }

  // Construct the block table with correct header
  const cells = [
    ['Columns (columns62)'],
    [leftCol, rightCol]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
