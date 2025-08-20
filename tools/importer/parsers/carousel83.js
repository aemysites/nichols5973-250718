/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Carousel (carousel83)'];
  const cells = [headerRow];

  // Find all slides
  const slides = Array.from(element.querySelectorAll('.testimonial-item-container-internal'));

  slides.forEach(slide => {
    // IMAGE CELL
    const imgDiv = slide.querySelector('.testimonial-item-image-internal');
    let imgEl = null;
    if (imgDiv && imgDiv.style.backgroundImage) {
      // Extract URL from style
      const match = imgDiv.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1];
        imgEl.setAttribute('loading', 'lazy');
      }
    }

    // TEXT CELL
    const textCellContent = [];
    const quoteContainer = slide.querySelector('.quotation-container');
    if (quoteContainer) {
      // Get the main quote (all <p> under .quotation)
      const quotation = quoteContainer.querySelector('.quotation');
      if (quotation) {
        const ps = Array.from(quotation.querySelectorAll('p'));
        ps.forEach(p => {
          if (p.textContent && p.textContent.trim()) {
            textCellContent.push(p);
          }
        });
      }
      // Get author + statement, style author as <strong> and statement as plain text
      const author = quoteContainer.querySelector('.author');
      const authorStatement = quoteContainer.querySelector('.author-statement');
      if (author && author.textContent.trim()) {
        const authorBlock = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = author.textContent.trim();
        authorBlock.appendChild(strong);
        if (authorStatement && authorStatement.textContent.trim()) {
          const statementDiv = document.createElement('div');
          statementDiv.textContent = authorStatement.textContent.trim();
          authorBlock.appendChild(statementDiv);
        }
        textCellContent.push(authorBlock);
      }
    }
    // Add row: always 2 columns (image, text)
    cells.push([
      imgEl,
      textCellContent
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
