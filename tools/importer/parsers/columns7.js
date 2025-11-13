/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns7)'];

  // Find the logo image in the right column
  const logoDiv = element.querySelector('.footer__logo');
  let logoImg = '';
  if (logoDiv) {
    logoImg = logoDiv.querySelector('img');
    if (logoImg) {
      logoImg.setAttribute('alt', 'Valvoline Instant Oil Change');
    }
  }

  // Two columns: left (empty), right (image)
  const leftCell = '';
  const rightCell = logoImg ? [logoImg] : '';
  const rows = [headerRow, [leftCell, rightCell]];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
