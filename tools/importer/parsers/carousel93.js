/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match exactly
  const headerRow = ['Carousel (carousel93)'];

  // 2. Extract the anchor. It contains both image and text content.
  const anchor = element.querySelector('a');

  // 3. Defensive: if anchor is missing, abort
  if (!anchor) return;

  // 4. Find direct children: image div and body div
  const childDivs = anchor.querySelectorAll(':scope > div');
  let imgDiv = childDivs[0];
  let bodyDiv = childDivs[1];

  // 5. Defensive: check for image
  let image = null;
  if (imgDiv) {
    image = imgDiv.querySelector('img');
  }

  // 6. Defensive: check for bodyDiv
  let textCellContents = [];
  if (bodyDiv) {
    // Heading: use h3 as heading element
    const heading = bodyDiv.querySelector('h3');
    if (heading) textCellContents.push(heading);
    // Description: use p if it contains text
    const description = bodyDiv.querySelector('p');
    if (description && description.textContent.trim().length > 0) {
      textCellContents.push(description);
    }
  }

  // 7. If both image and text content missing, abort to avoid empty row
  if (!image && textCellContents.length === 0) return;

  // 8. Build the table
  const row1 = [image, textCellContents.length > 0 ? textCellContents : ''];
  const cells = [headerRow, row1];

  // 9. Create the block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
