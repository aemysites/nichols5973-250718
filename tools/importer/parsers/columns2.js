/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns2)'];

  // Defensive: get all immediate children of the main block
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // --- LEFT COLUMN ---
  // Find the main left column container
  const leftCol = children.find(div => div.classList.contains('nearest-location-block__main'));

  let leftContent = null;
  if (leftCol) {
    // Title box (icon + heading)
    const titleBox = leftCol.querySelector('.nearest-location-block__title-box');
    // Location box (spinner/loading area)
    const locationBox = leftCol.querySelector('.nearest-location-block__location-box');
    // Compose left column content
    leftContent = document.createElement('div');
    if (titleBox) leftContent.appendChild(titleBox);
    if (locationBox) leftContent.appendChild(locationBox);
  }

  // --- RIGHT COLUMN ---
  // Find the right column marketing container
  const rightCol = children.find(div => div.classList.contains('nearest-location-block__marketing'));

  let rightContent = null;
  if (rightCol) {
    // Use the entire marketing block (includes icon, heading, list, disclaimer)
    rightContent = rightCol;
  }

  // Compose the table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
