/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW: must be a single column (one cell)
  const headerRow = ['Columns (columns19)'];

  // --- Extract columns content ---
  // Find the image (if any)
  const imageContainer = element.querySelector('.image-container');
  const imageElem = imageContainer ? imageContainer.querySelector('img') : null;

  // Find the headline and intro
  const layoutContainer = element.querySelector('.layout-container');
  let headingElem = null;
  let introParas = [];
  if (layoutContainer) {
    headingElem = layoutContainer.querySelector('h2');
    introParas = Array.from(layoutContainer.childNodes).filter(
      node => node.nodeType === Node.ELEMENT_NODE &&
        node.tagName === 'P' && node.textContent.trim() !== ''
    );
  }

  // Get the stats columns
  const columnsContainer = element.querySelector('.stat-columns');
  let columns = [];
  if (columnsContainer) {
    columns = Array.from(columnsContainer.querySelectorAll('.stat-columns__item'));
  }

  // Build each cell for the columns row
  const contentCells = columns.map((col, idx) => {
    // Heading
    const colHeading = col.querySelector('h2');
    // Body paragraphs with text
    const colPs = Array.from(col.querySelectorAll('p')).filter(
      p => p.textContent.replace(/\u00a0/g, '').trim() !== ''
    );
    // Link(s)
    const colLinks = Array.from(col.querySelectorAll('a'));

    let colContent = [];
    // For the first column, prepend heading, intro, and image
    if (idx === 0) {
      if (headingElem) colContent.push(headingElem);
      if (introParas.length > 0) colContent = colContent.concat(introParas);
      if (imageElem) colContent.push(imageElem);
    }
    if (colHeading) colContent.push(colHeading);
    if (colPs.length > 0) colContent = colContent.concat(colPs);
    if (colLinks.length > 0) colContent = colContent.concat(colLinks);
    return colContent;
  });

  // --- Table structure: header row (1 cell), then content row (n cells = columns) ---
  const rows = [headerRow, contentCells];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
