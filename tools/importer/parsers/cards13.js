/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards13) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards13)'];
  const rows = [headerRow];

  // Find all card containers (testimonial-item-container-internal)
  const cardContainers = element.querySelectorAll('.testimonial-item-container-internal');

  cardContainers.forEach(card => {
    // --- Column 1: Image ---
    // Find the image element inside the card
    const imageWrapper = card.querySelector('.testimonial-item-image-internal');
    let imgEl = null;
    if (imageWrapper) {
      imgEl = imageWrapper.querySelector('img');
    }

    // --- Column 2: Text Content ---
    // Find the quotation text
    const quotationContainer = card.querySelector('.quotation-container');
    let textContent = [];
    if (quotationContainer) {
      // Description (main testimonial text)
      const desc = quotationContainer.querySelector('.quotation');
      if (desc) {
        textContent.push(desc);
      }
      // Author link and name
      const authorLink = quotationContainer.querySelector('.author-link');
      if (authorLink) {
        textContent.push(authorLink);
      }
      // Author statement/title
      const authorStatement = quotationContainer.querySelector('.author-statement');
      if (authorStatement) {
        textContent.push(authorStatement);
      }
    }

    // Add row: [image, text content]
    rows.push([imgEl, textContent]);
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
