/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, using exact name from the example
  const cells = [['Cards (cards110)']];

  // Collect all immediate card children
  const cardElements = element.querySelectorAll(':scope > *');
  cardElements.forEach((cardEl) => {
    // Each card: image (first cell), text (second cell)
    let imgCell = null;
    let textCell = null;

    // Find image in card
    const imgWrapper = cardEl.querySelector('.entry-point__item--img');
    if (imgWrapper) {
      const img = imgWrapper.querySelector('img');
      if (img) imgCell = img;
    }

    // Find text in card
    const bodyWrapper = cardEl.querySelector('.entry-point__item--body');
    if (bodyWrapper) {
      // For text cell, reference the wrapper directly for robustness
      // If card is a link (CTA), append CTA link at bottom
      if (cardEl.tagName.toLowerCase() === 'a') {
        // We reference bodyWrapper directly, and add CTA link under it
        const textContent = document.createElement('div');
        Array.from(bodyWrapper.childNodes).forEach((node) => textContent.appendChild(node));
        // CTA link uses href and title
        const cta = document.createElement('a');
        cta.href = cardEl.href;
        cta.textContent = cardEl.title || 'Find out more';
        textContent.appendChild(document.createElement('br'));
        textContent.appendChild(cta);
        textCell = textContent;
      } else {
        textCell = bodyWrapper;
      }
    }

    cells.push([imgCell, textCell]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
