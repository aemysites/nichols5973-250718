/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns90)'];

  // Defensive: Find the main anchor (the column wrapper)
  const anchor = element.querySelector('a.entry-point__item');
  if (!anchor) return;

  // Column 1: Text content (heading, paragraph, arrow icon)
  const body = anchor.querySelector('.entry-point__item--body');
  let col1Content = [];
  if (body) {
    // Get heading
    const heading = body.querySelector('h3');
    if (heading) col1Content.push(heading.cloneNode(true));
    // Get paragraph
    const paragraph = body.querySelector('p');
    if (paragraph) col1Content.push(paragraph.cloneNode(true));
    // Get arrow image (if present)
    const arrowImg = body.querySelector('img');
    if (arrowImg) col1Content.push(arrowImg.cloneNode(true));
  }

  // Column 2: Main image (branding/podcast visual)
  const imgWrapper = anchor.querySelector('.entry-point__item--img');
  let col2Content = [];
  if (imgWrapper) {
    const img = imgWrapper.querySelector('img');
    if (img) col2Content.push(img.cloneNode(true));
  }

  // Compose the table rows with two columns
  const rows = [
    headerRow,
    [col1Content, col2Content]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
