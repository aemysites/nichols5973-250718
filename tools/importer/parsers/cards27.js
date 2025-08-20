/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image url
  function getBgImageUrl(style) {
    const match = style.match(/url\(["']?(.*?)["']?\)/);
    return match ? match[1] : '';
  }
  // Header row as per example
  const headerRow = ['Cards (cards27)'];
  // Get all testimonial-item-container-internal blocks
  const cardContainers = element.querySelectorAll('.testimonial-item-container-internal');
  const rows = [headerRow];
  cardContainers.forEach(card => {
    // IMAGE CELL
    const imgDiv = card.querySelector('.testimonial-item-image-internal');
    let imgEl = null;
    if (imgDiv && imgDiv.style && imgDiv.style.backgroundImage) {
      const url = getBgImageUrl(imgDiv.style.backgroundImage);
      if (url) {
        imgEl = document.createElement('img');
        imgEl.src = url;
        imgEl.alt = '';
      }
    }
    // TEXT CELL: quotation, author, statement
    const quotationContainer = card.querySelector('.quotation-container');
    let textCellContent = [];
    if (quotationContainer) {
      // Quotation (description)
      const quotation = quotationContainer.querySelector('.quotation');
      if (quotation && quotation.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = quotation.textContent.trim();
        textCellContent.push(p);
      }
      // Author (title) in bold
      const authorLink = quotationContainer.querySelector('.author-link');
      if (authorLink && authorLink.textContent.trim()) {
        const authorStrong = document.createElement('strong');
        // Use reference to the actual link element, NOT clone
        authorStrong.appendChild(authorLink);
        textCellContent.push(authorStrong);
      }
      // Author statement (subtitle)
      const authorStatement = quotationContainer.querySelector('.author-statement');
      if (authorStatement && authorStatement.textContent.trim()) {
        const div = document.createElement('div');
        div.textContent = authorStatement.textContent.trim();
        textCellContent.push(div);
      }
    }
    // Edge case: If all text content is missing, add an empty cell
    if (textCellContent.length === 0) {
      textCellContent.push(document.createTextNode(''));
    }
    // Compose row
    rows.push([
      imgEl ? imgEl : document.createTextNode(''),
      textCellContent
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
