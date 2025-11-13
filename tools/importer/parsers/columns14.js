/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns14)'];

  // Defensive: Get immediate children that represent the two columns
  const columns = element.querySelectorAll(':scope > div.row.icon-teaser > div');
  // If not found, fallback to direct children
  let leftCol = columns[0], rightCol = columns[1];
  if (!leftCol || !rightCol) {
    const fallbackCols = element.querySelectorAll(':scope > div');
    if (fallbackCols.length === 2) {
      leftCol = fallbackCols[0];
      rightCol = fallbackCols[1];
    }
  }

  // --- Left column: icon, heading, paragraphs ---
  let leftContent = [];
  if (leftCol) {
    // Icon + heading
    const titleRow = leftCol.querySelector('.base-title');
    if (titleRow) {
      // Find the icon image
      const iconImg = titleRow.querySelector('img');
      if (iconImg) leftContent.push(iconImg);
      // Find the heading (h1)
      const heading = titleRow.querySelector('h1');
      if (heading) leftContent.push(heading);
    }
    // Description paragraphs
    const desc = leftCol.querySelector('.icon-teaser__desc');
    if (desc) {
      // Get all paragraphs
      const paragraphs = desc.querySelectorAll('p');
      paragraphs.forEach(p => leftContent.push(p));
    }
  }

  // --- Right column: video/image thumbnail ---
  let rightContent = [];
  if (rightCol) {
    // Find the main image (video thumbnail)
    const img = rightCol.querySelector('.v-image__image img');
    if (img) rightContent.push(img);
    // Find the play button overlay (icon)
    const playIcon = rightCol.querySelector('.popup-video__icon img');
    if (playIcon) rightContent.push(playIcon);
  }

  // Compose the table: header, then one row with two columns
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
