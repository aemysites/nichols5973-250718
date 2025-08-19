/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header
  const headerRow = ['Cards (cards94)'];
  const rows = [headerRow];

  // Select the direct card elements
  const cardEls = element.querySelectorAll(':scope > .testimonial-item-container-internal');

  cardEls.forEach(card => {
    // 1. Image (from background-image)
    let imgCell = null;
    const imgDiv = card.querySelector('.testimonial-item-image-internal');
    if (imgDiv) {
      const style = imgDiv.getAttribute('style') || '';
      // Extract url
      const urlMatch = style.match(/background-image:\s*url\(["']?(.*?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        imgCell = document.createElement('img');
        imgCell.src = urlMatch[1];
        imgCell.alt = '';
        imgCell.loading = 'lazy';
      }
    }

    // 2. Text cell (author name, description)
    const quotationContainer = card.querySelector('.quotation-container');
    const textCell = document.createElement('div');
    if (quotationContainer) {
      // Author name in <strong>
      const authorLink = quotationContainer.querySelector('.author-link');
      const authorSpan = authorLink ? authorLink.querySelector('.author') : null;
      if (authorSpan && authorSpan.textContent) {
        const strong = document.createElement('strong');
        strong.textContent = authorSpan.textContent.trim();
        textCell.appendChild(strong);
      }
      // Description text
      const statement = quotationContainer.querySelector('.author-statement');
      if (statement && statement.textContent) {
        // Place description in a <div> below name for structure
        const descDiv = document.createElement('div');
        descDiv.textContent = statement.textContent.trim();
        textCell.appendChild(descDiv);
      }
    }
    
    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}