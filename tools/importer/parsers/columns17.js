/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate children of the block
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // --- LEFT COLUMN ---
  // Find main left column container
  const leftMain = children.find(div => div.classList.contains('nearest-location-block__main'));

  // --- RIGHT COLUMN ---
  // Find marketing right column container
  const rightMarketing = children.find(div => div.classList.contains('nearest-location-block__marketing'));

  // Compose the two columns
  // Each cell must reference the original element for semantic fidelity
  const columnsRow = [
    [leftMain, rightMarketing]
  ];

  // Table header row
  const headerRow = ['Columns (columns17)'];

  // Compose table rows: header + columns
  const tableRows = [headerRow, ...columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
