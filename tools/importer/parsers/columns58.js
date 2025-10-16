/* global WebImporter */
export default function parse(element, { document }) {
  // Find the entry link (the main columns block)
  const entryLink = element.querySelector('.entry-point__item');
  if (!entryLink) return;

  // LEFT COLUMN: Heading, paragraph, arrow icon
  const body = entryLink.querySelector('.entry-point__item--body');
  const leftCol = document.createElement('div');
  if (body) {
    // Heading
    const h3 = body.querySelector('h3');
    if (h3) leftCol.appendChild(h3);
    // Paragraph
    const p = body.querySelector('p');
    if (p) leftCol.appendChild(p);
    // Arrow image (decorative, but present in screenshot)
    const arrowImg = body.querySelector('img');
    if (arrowImg) {
      leftCol.appendChild(document.createElement('br'));
      leftCol.appendChild(arrowImg);
    }
  }

  // RIGHT COLUMN: Main image
  const imgDiv = entryLink.querySelector('.entry-point__item--img');
  const rightCol = document.createElement('div');
  if (imgDiv) {
    const img = imgDiv.querySelector('img');
    if (img) rightCol.appendChild(img);
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns58)'];
  const contentRow = [leftCol, rightCol];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
