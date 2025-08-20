/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Carousel (carousel80)'];

  // Find all testimonial slides
  const itemNodes = Array.from(element.querySelectorAll('.testimonial-item-container-internal'));

  // Helper to get image from background-image
  function getImageFromBackground(div) {
    const style = div.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1];
      img.alt = '';
      return img;
    }
    return null;
  }

  // Build content cell for each slide
  function buildContentCell(quotationContainer) {
    const cellContent = [];
    // Quotation paragraphs
    const qDiv = quotationContainer.querySelector('.quotation');
    if (qDiv) {
      Array.from(qDiv.querySelectorAll('p')).forEach((p) => {
        const txt = p.textContent.replace(/^[“”"]+|[“”"]+$/g, '').trim();
        if (txt.length > 0) {
          cellContent.push(p);
        }
      });
    }
    // Author name (bold)
    const authorDiv = quotationContainer.querySelector('.author');
    if (authorDiv && authorDiv.textContent.trim()) {
      const authorStrong = document.createElement('strong');
      authorStrong.textContent = authorDiv.textContent.trim();
      cellContent.push(authorStrong);
    }
    // Author statement (plain text)
    const authorStatementDiv = quotationContainer.querySelector('.author-statement');
    if (authorStatementDiv && authorStatementDiv.textContent.trim()) {
      const statementDiv = document.createElement('div');
      statementDiv.textContent = authorStatementDiv.textContent.trim();
      cellContent.push(statementDiv);
    }
    return cellContent;
  }

  // Build table rows
  const rows = [headerRow];

  itemNodes.forEach((item) => {
    // Image cell
    const imgDiv = item.querySelector('.testimonial-item-image-internal');
    const img = imgDiv ? getImageFromBackground(imgDiv) : '';
    // Content cell
    const quotationContainer = item.querySelector('.quotation-container');
    const contentCell = quotationContainer ? buildContentCell(quotationContainer) : '';
    rows.push([
      img,
      contentCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
