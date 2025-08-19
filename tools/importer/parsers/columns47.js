/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block header: must be exactly one cell
  const headerRow = ['Columns (columns47)'];

  // Find the main about-us container
  const mainContainer = element.querySelector('.about-us-container._1');
  if (!mainContainer) return;

  // Extract pre-text and map image for first column
  const introContent = [];
  const preText = mainContainer.querySelector('.au-pre-text');
  if (preText && preText.textContent.trim()) {
    // Preserve text formatting (e.g., line breaks)
    const p = document.createElement('p');
    p.textContent = preText.textContent.trim();
    introContent.push(p);
  }
  // The first img in mainContainer should be the map image
  const imgs = mainContainer.querySelectorAll('img');
  if (imgs.length) {
    introContent.push(imgs[0]);
  }

  // Now extract all visible stat blocks (each is its own column)
  const horzContainer = mainContainer.querySelector('.about-us-container.horz');
  if (!horzContainer) return;

  const statBlocks = Array.from(horzContainer.children)
    .filter(el => el.classList.contains('au-big-num-blk') && !el.classList.contains('hide'));

  // Each stat block may contain multiple elements (number, %, icon, description)
  // To ensure all text and semantics are preserved, reference the entire block element for each cell

  // Compose the columns row: first cell is intro, others are stat blocks
  const contentRow = [introContent, ...statBlocks];

  // Make sure every cell has at least some content
  if (contentRow.every(cell => (Array.isArray(cell) ? cell.length === 0 : !cell.textContent))) return;

  // Table structure: header row, then one row with all columns
  const cells = [headerRow, contentRow];

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
