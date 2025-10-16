/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards103) block header
  const headerRow = ['Cards (cards103)'];
  const rows = [headerRow];

  // Select all card containers
  const cardContainers = element.querySelectorAll('.testimonial-item-container-internal');

  cardContainers.forEach(card => {
    // Image (first column)
    const imgContainer = card.querySelector('.testimonial-item-image-internal img');
    let imgEl = null;
    if (imgContainer) {
      imgEl = imgContainer;
    }

    // Text content (second column)
    const quotationContainer = card.querySelector('.quotation-container');
    let textContent = [];
    if (quotationContainer) {
      // Description
      const desc = quotationContainer.querySelector('.quotation');
      if (desc) {
        textContent.push(desc);
      }
      // Author link and name
      const authorLink = quotationContainer.querySelector('.author-link');
      if (authorLink) {
        // Make author name bold (simulate heading)
        const authorName = authorLink.querySelector('.author');
        if (authorName) {
          const strong = document.createElement('strong');
          strong.appendChild(authorLink.cloneNode(true));
          textContent.push(strong);
        } else {
          textContent.push(authorLink.cloneNode(true));
        }
      }
      // Author statement (subtitle)
      const authorStatement = quotationContainer.querySelector('.author-statement');
      if (authorStatement) {
        textContent.push(authorStatement);
      }
    }

    // Add row: [image, text content]
    rows.push([
      imgEl,
      textContent
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
