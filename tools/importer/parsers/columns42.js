/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns42)'];

  // Get the two main column containers
  const columns = Array.from(element.querySelectorAll(':scope > .row.icon-teaser > .col-md-6.col-12'));

  // --- Left Column: Icon + Heading + Description ---
  let leftCellContent = [];
  if (columns[0]) {
    // Find the title row (contains icon and h1)
    const titleRow = columns[0].querySelector('.base-title');
    if (titleRow) {
      // Find the icon (img inside .v-image)
      const iconImg = titleRow.querySelector('.v-image img');
      // Find the heading (h1)
      const heading = titleRow.querySelector('h1');
      if (iconImg) leftCellContent.push(iconImg.cloneNode(true));
      if (heading) leftCellContent.push(heading.cloneNode(true));
    }
    // Find description paragraphs
    const desc = columns[0].querySelector('.icon-teaser__desc');
    if (desc) {
      leftCellContent = leftCellContent.concat(Array.from(desc.children).map(el => el.cloneNode(true)));
    }
  }

  // --- Right Column: Main Image and Icon Overlay ---
  let rightCellContent = [];
  if (columns[1]) {
    // The main image is inside .popup-video__img .v-image img
    const mainImg = columns[1].querySelector('.popup-video__img .v-image img');
    if (mainImg) rightCellContent.push(mainImg.cloneNode(true));
    // Find the radiator/cooling system icon overlay (SVG)
    const iconOverlay = columns[1].querySelector('.popup-video__icon img');
    if (iconOverlay) rightCellContent.push(iconOverlay.cloneNode(true));
  }

  // Build table rows
  const rows = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
