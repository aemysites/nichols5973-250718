/* global WebImporter */
export default function parse(element, { document }) {
  // Get the first (and only) row containing the card
  const row = element.querySelector('.entry-points__row');
  if (!row) return;
  const anchor = row.querySelector('a.entry-point__item');
  if (!anchor) return;

  // Get image element (reference, not clone)
  let imgElem = null;
  const imgDiv = anchor.querySelector('.entry-point__item--img');
  if (imgDiv) {
    imgElem = imgDiv.querySelector('img');
  }

  // Get heading and paragraph (reference, not clone)
  let headingElem = null;
  let paragraphElem = null;
  const bodyDiv = anchor.querySelector('.entry-point__item--body');
  if (bodyDiv) {
    headingElem = bodyDiv.querySelector('h3');
    paragraphElem = bodyDiv.querySelector('p');
  }

  // Left column: heading + paragraph
  const leftCol = document.createElement('div');
  if (headingElem) leftCol.appendChild(headingElem);
  if (paragraphElem) leftCol.appendChild(paragraphElem);

  // Right column: image
  const rightCol = document.createElement('div');
  if (imgElem) rightCol.appendChild(imgElem);

  // Header row must match exactly
  const cells = [
    ['Columns (columns58)'],
    [leftCol, rightCol],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
