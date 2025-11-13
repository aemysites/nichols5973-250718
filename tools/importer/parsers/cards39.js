/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards39) block: 2 columns, header row, each card is a row
  const headerRow = ['Cards (cards39)'];
  const rows = [headerRow];

  // Find all card sections within the parent block
  // Each card is a <section> with class 'icon-rich-text-block'
  const cardSections = element.querySelectorAll('section.icon-rich-text-block');

  cardSections.forEach((section) => {
    // --- IMAGE/ICON CELL ---
    let imageOrIconCell = null;
    // Try to find an image
    const imageWrap = section.querySelector('.v-image__image img');
    if (imageWrap) {
      imageOrIconCell = imageWrap;
    } else {
      // Try to find an icon container (SVG mask or similar)
      const iconDiv = section.querySelector('.icon-rich-text-block__icon, .main-icon');
      if (iconDiv) {
        // Create a placeholder for the icon (since it's a styled div, not an <img>)
        // We'll use a simple div with the same aria-label and style
        const iconClone = document.createElement('div');
        iconClone.setAttribute('role', iconDiv.getAttribute('role') || 'img');
        iconClone.setAttribute('aria-label', iconDiv.getAttribute('aria-label') || 'Icon');
        iconClone.style.height = iconDiv.style.height;
        iconClone.style.width = iconDiv.style.width;
        iconClone.style.backgroundColor = iconDiv.style.backgroundColor;
        iconClone.style.maskImage = iconDiv.style.maskImage;
        iconClone.className = iconDiv.className;
        imageOrIconCell = iconClone;
      }
    }
    // Defensive fallback: if no image or icon, use an empty cell
    if (!imageOrIconCell) {
      imageOrIconCell = document.createElement('div');
    }

    // --- TEXT CELL ---
    // Find the text container
    const textContainer = section.querySelector('.icon-rich-text-block__text');
    let textCellContent = [];
    if (textContainer) {
      // Heading (optional)
      const heading = textContainer.querySelector('h2, h3, h4, h5, h6');
      if (heading) {
        textCellContent.push(heading);
      }
      // Paragraphs (description and CTA)
      // We'll include all <p> elements in order
      const paragraphs = textContainer.querySelectorAll('p');
      paragraphs.forEach((p) => {
        textCellContent.push(p);
      });
    }
    // Defensive fallback: if no text, use an empty cell
    if (textCellContent.length === 0) {
      textCellContent = [document.createElement('div')];
    }

    // Add the card row: [image/icon, text]
    rows.push([imageOrIconCell, textCellContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
