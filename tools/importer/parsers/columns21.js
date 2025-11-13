/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Columns (columns21)'];

  // Defensive selectors for the two main columns
  // Find the left column (text + icon)
  const leftCol = element.querySelector('.col-md-6.col-12');
  // Find the right column (image)
  const rightCol = element.querySelectorAll('.col-md-6.col-12')[1];

  // --- LEFT COLUMN ---
  let leftContent = [];
  if (leftCol) {
    // Find the icon and heading
    const titleRow = leftCol.querySelector('.base-title');
    if (titleRow) {
      // Icon (img)
      const iconImg = titleRow.querySelector('img');
      if (iconImg) leftContent.push(iconImg);
      // Heading (h1)
      const heading = titleRow.querySelector('h1');
      if (heading) leftContent.push(heading);
    }
    // Description paragraphs
    const desc = leftCol.querySelector('.icon-teaser__desc');
    if (desc) {
      // Get all paragraphs
      const paragraphs = Array.from(desc.querySelectorAll('p'));
      leftContent = leftContent.concat(paragraphs);
    }
  }

  // --- RIGHT COLUMN ---
  let rightContent = [];
  if (rightCol) {
    // Find the main image (img)
    const imgWrap = rightCol.querySelector('.v-image__image img');
    if (imgWrap) rightContent.push(imgWrap);
  }

  // Build the table rows
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
