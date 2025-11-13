/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children divs
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: ensure we have at least two main column containers
  // Left: location, Right: marketing/info
  let leftCol, rightCol;
  if (topDivs.length === 2) {
    [leftCol, rightCol] = topDivs;
  } else {
    // fallback: try to find by class
    leftCol = element.querySelector('.nearest-location-block__main');
    rightCol = element.querySelector('.nearest-location-block__marketing');
  }

  // LEFT COLUMN: location heading + spinner
  let leftContent = [];
  if (leftCol) {
    // Title box: icon + heading
    const titleBox = leftCol.querySelector('.nearest-location-block__title-box');
    if (titleBox) leftContent.push(titleBox);
    // Location box: spinner
    const locationBox = leftCol.querySelector('.nearest-location-block__location-box');
    if (locationBox) leftContent.push(locationBox);
  }

  // RIGHT COLUMN: marketing info
  let rightContent = [];
  if (rightCol) {
    // Marketing text container
    const marketingText = rightCol.querySelector('.nearest-location-block__marketing-text');
    if (marketingText) rightContent.push(marketingText);
    else rightContent.push(rightCol); // fallback: whole rightCol
  }

  // Table structure: header, then columns
  const headerRow = ['Columns (columns38)'];
  const columnsRow = [leftContent, rightContent];
  const cells = [headerRow, columnsRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
