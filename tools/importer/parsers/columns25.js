/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Columns (columns25)'];

  // 2. Find main image (background)
  const img = element.querySelector('img');

  // 3. Find main inner container
  const inner = element.querySelector('.vioc-contact-form-block__inner');
  const row = inner ? inner.querySelector('.row') : null;

  // 4. Left column: contact info
  let leftCol = null;
  if (row) {
    leftCol = row.querySelector('.white--text.col-md-3');
  }
  let leftContent = [];
  if (leftCol) {
    // Add image to the top of left column
    if (img) leftContent.push(img);
    const heading = leftCol.querySelector('h2');
    if (heading) leftContent.push(heading);
    const subtitle = leftCol.querySelector('.vioc-contact-form-block__subtitle');
    if (subtitle) leftContent.push(subtitle);
    const paragraphs = leftCol.querySelectorAll('p');
    paragraphs.forEach((p) => leftContent.push(p));
  }

  // 5. Right column: form
  let rightCol = null;
  if (row) {
    rightCol = row.querySelector('.col:not(.col-md-3)');
  }
  let rightContent = [];
  if (rightCol) {
    const form = rightCol.querySelector('form');
    if (form) rightContent.push(form);
  }

  // 6. Compose rows
  // Only two rows: header and columns (left: sidebar+image, right: form)
  const columnsRow = [leftContent, rightContent];

  // 7. Create table
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 8. Replace element
  element.replaceWith(table);
}
