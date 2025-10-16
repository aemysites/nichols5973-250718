/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns41)'];

  // Get the intro text and map image
  const intro = element.querySelector('.au-pre-text');
  const bgImg = element.querySelector('img[src*="map-light-gray"]');

  // Only include visible/statistic blocks (ignore hidden ones)
  const statBlocks = Array.from(element.querySelectorAll('.about-us-container.horz > .au-big-num-blk')).filter(
    (blk) => !blk.classList.contains('hide')
  );

  // For each stat block, extract all relevant content (number, symbol, icon, description)
  const statCells = statBlocks.map((blk) => {
    const frag = document.createElement('div');
    // Number and symbol
    const numTop = blk.querySelector('.au-num-top');
    if (numTop) {
      Array.from(numTop.children).forEach((el) => {
        frag.appendChild(el.cloneNode(true));
      });
    }
    // Icon and description
    const iconBlk = blk.querySelector('.au-icon');
    if (iconBlk) {
      Array.from(iconBlk.children).forEach((el) => {
        frag.appendChild(el.cloneNode(true));
      });
    }
    return frag;
  });

  // Compose rows for the table: header, intro+bg, stats (single row, 4 columns)
  const rows = [headerRow];
  // Add intro text and map image as a single cell row if present
  if (intro || bgImg) {
    const introCell = document.createElement('div');
    if (bgImg) introCell.appendChild(bgImg.cloneNode(true));
    if (intro) introCell.appendChild(intro.cloneNode(true));
    rows.push([introCell]);
  }
  // Add all stats in a single row (multi-column)
  rows.push(statCells);

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
