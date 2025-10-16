/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards68) block: 2 columns, multiple rows, each row is a card with image and text
  const headerRow = ['Cards (cards68)'];
  const rows = [headerRow];

  // Find all card anchor elements (each card is an <a> inside the container)
  const cardAnchors = element.querySelectorAll('.entry-point__item');

  cardAnchors.forEach((cardAnchor) => {
    // --- IMAGE CELL ---
    // Find the image inside the card
    const imgWrapper = cardAnchor.querySelector('.entry-point__item--img');
    let imageEl = null;
    if (imgWrapper) {
      imageEl = imgWrapper.querySelector('img');
    }

    // --- TEXT CELL ---
    const body = cardAnchor.querySelector('.entry-point__item--body');
    const textCellContent = [];
    if (body) {
      // Arrow icon (CTA) - must be included as per feedback
      const arrowImg = body.querySelector('img');
      let arrowIcon = null;
      if (arrowImg) {
        arrowIcon = arrowImg.cloneNode(true);
      }
      // Heading
      const heading = body.querySelector('h3');
      if (heading) textCellContent.push(heading);
      // Description (p)
      const desc = body.querySelector('p');
      if (desc) {
        // Always push the <p>, even if empty, to preserve original structure
        textCellContent.push(desc.cloneNode(true));
      }
      // Always add the arrow icon at the end of the text cell
      if (arrowIcon) {
        textCellContent.push(arrowIcon);
      }
    }
    if (textCellContent.length === 0) {
      textCellContent.push(document.createTextNode(cardAnchor.textContent.trim()));
    }
    rows.push([
      imageEl || '',
      textCellContent.length === 1 ? textCellContent[0] : textCellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
