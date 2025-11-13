/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children for columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Defensive: expect two columns (image, text)
  let imageCell = null;
  let textCell = null;

  // Find image column (usually has an <img> descendant)
  const imgCol = columns.find(col => col.querySelector('img'));
  if (imgCol) {
    // Find the first <img> in the column
    const img = imgCol.querySelector('img');
    if (img) {
      imageCell = img;
    } else {
      // fallback: use the column itself
      imageCell = imgCol;
    }
  } else {
    // fallback: use the first column
    imageCell = columns[0];
  }

  // Find text column (should contain heading)
  const textCol = columns.find(col => col.querySelector('h1, h2, h3, h4, h5, h6'));
  if (textCol) {
    // Find the heading
    const heading = textCol.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      textCell = heading;
    } else {
      textCell = textCol;
    }
  } else {
    // fallback: use the second column
    textCell = columns[1];
  }

  // Table structure
  const headerRow = ['Columns (columns36)'];
  const contentRow = [imageCell, textCell];
  const cells = [headerRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
