/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name
  const headerRow = ['Columns (columns19)'];

  // --- Extract heading and intro text ---
  const layoutContainer = element.querySelector('.layout-container');
  let headingText = '';
  let introParagraph = '';
  if (layoutContainer) {
    const headingEl = layoutContainer.querySelector('h2');
    if (headingEl) headingText = headingEl.textContent.trim();
    // Find the first non-empty <p> after the heading
    const paragraphs = Array.from(layoutContainer.querySelectorAll('p'));
    for (const p of paragraphs) {
      const txt = p.textContent.trim();
      if (txt) {
        introParagraph = txt;
        break;
      }
    }
  }

  // --- Extract columns ---
  const statColumns = element.querySelector('.stat-columns');
  let columnCells = [];
  if (statColumns) {
    const items = statColumns.querySelectorAll('.stat-columns__item');
    columnCells = Array.from(items).map((item) => {
      // Column cell: heading, description, link
      const cellDiv = document.createElement('div');
      // Heading
      const colHeading = item.querySelector('.stat-columns__item--value h2');
      if (colHeading) {
        const h2 = document.createElement('strong');
        h2.textContent = colHeading.textContent.trim();
        cellDiv.appendChild(h2);
      }
      // Description (first non-empty <p>)
      const paragraphs = Array.from(item.querySelectorAll('p'));
      for (const p of paragraphs) {
        const txt = p.textContent.trim();
        if (txt && txt !== '\u00A0') {
          const descP = document.createElement('p');
          descP.textContent = txt;
          cellDiv.appendChild(descP);
          break;
        }
      }
      // Link
      const link = item.querySelector('a');
      if (link) {
        const clonedLink = link.cloneNode(true);
        clonedLink.textContent = link.textContent.trim();
        cellDiv.appendChild(clonedLink);
      }
      return cellDiv;
    });
  }

  // Compose table rows: header, then one row with two columns (heading+intro, columns)
  // Place heading+intro in first column, second column left empty
  const headingIntroCell = document.createElement('div');
  if (headingText) {
    const h2 = document.createElement('h2');
    h2.textContent = headingText;
    headingIntroCell.appendChild(h2);
  }
  if (introParagraph) {
    const p = document.createElement('p');
    p.textContent = introParagraph;
    headingIntroCell.appendChild(p);
  }

  // Table must have same number of columns in every row after header
  const cells = [
    headerRow,
    [headingIntroCell, ''],
    columnCells.length ? columnCells : ['', '']
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
