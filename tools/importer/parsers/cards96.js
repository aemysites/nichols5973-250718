/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table, matching exactly the example
  const headerRow = ['Cards (cards96)'];

  const rows = [];
  // Get all card elements
  const cardEls = element.querySelectorAll(':scope > .testimonial-item-container-internal');
  cardEls.forEach(card => {
    // Extract image from background-image
    let img = null;
    const bgDiv = card.querySelector('.testimonial-item-image-internal');
    if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
      const match = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        img = document.createElement('img');
        img.src = match[1];
        img.alt = '';
      }
    }
    // Compose the text cell
    const quoteContainer = card.querySelector('.quotation-container');
    const fragments = [];
    if (quoteContainer) {
      // Quotation
      const quote = quoteContainer.querySelector('.quotation');
      if (quote && quote.textContent.trim()) {
        const quoteDiv = document.createElement('div');
        quoteDiv.textContent = quote.textContent.trim();
        fragments.push(quoteDiv);
      }
      // Author link and name
      const authorLink = quoteContainer.querySelector('a.author-link');
      if (authorLink) {
        const authorSpan = authorLink.querySelector('.author');
        if (authorSpan && authorSpan.textContent.trim()) {
          const strong = document.createElement('strong');
          const a = authorLink; // re-use the original link element, but move it
          a.textContent = authorSpan.textContent.trim();
          // Remove .author span from inside link if present
          authorSpan.remove();
          strong.appendChild(a);
          fragments.push(strong);
        }
      }
      // Author statement
      const authorStatement = quoteContainer.querySelector('.author-statement');
      if (authorStatement && authorStatement.textContent.trim()) {
        const roleDiv = document.createElement('div');
        roleDiv.textContent = authorStatement.textContent.trim();
        fragments.push(roleDiv);
      }
    }
    // Ensure both cells are populated as per structure
    rows.push([img, fragments]);
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
