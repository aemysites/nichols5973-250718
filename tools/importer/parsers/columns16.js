/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns16)'];

  // Get the .row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get the two main columns
  const columns = row.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // Left column: get all content (heading, paragraphs, badges)
  const leftCol = columns[0];
  // Clone all children to preserve structure and images/links
  const leftContent = document.createElement('div');
  Array.from(leftCol.children).forEach(child => {
    leftContent.appendChild(child.cloneNode(true));
  });

  // Right column: get the main image (the phone/app screenshot)
  const rightCol = columns[1];
  // Try to find the <img> tag inside rightCol (may be nested)
  const img = rightCol.querySelector('img');
  let rightContent;
  if (img) {
    rightContent = document.createElement('div');
    rightContent.appendChild(img.cloneNode(true));
  } else {
    // Fallback: clone all children
    rightContent = document.createElement('div');
    Array.from(rightCol.children).forEach(child => {
      rightContent.appendChild(child.cloneNode(true));
    });
  }

  // Build the table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
