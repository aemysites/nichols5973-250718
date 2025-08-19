/* global WebImporter */
export default function parse(element, { document }) {
  // Set header as per block name
  const headerRow = ['Cards (cards64)'];
  const rows = [headerRow];

  // Get all cards (each .testimonial-item-container-internal is a card)
  const cards = element.querySelectorAll(':scope > .testimonial-item-container-internal');

  cards.forEach((card) => {
    // Extract image from .testimonial-item-image-internal background-image
    const imageDiv = card.querySelector('.testimonial-item-image-internal');
    let imgEl = null;
    if (imageDiv) {
      const bg = imageDiv.style.backgroundImage;
      const urlMatch = bg.match(/url\(["']?(.*?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        imgEl = document.createElement('img');
        imgEl.src = urlMatch[1];
        imgEl.alt = '';
      }
    }

    // Extract text content
    const quotationContainer = card.querySelector('.quotation-container');
    const textCellElements = [];

    if (quotationContainer) {
      // Quotation (description)
      const quote = quotationContainer.querySelector('.quotation');
      if (quote && quote.textContent.trim().length) {
        const quoteDiv = document.createElement('div');
        quoteDiv.textContent = quote.textContent.trim();
        textCellElements.push(quoteDiv);
      }
      // Author (name, with link)
      const authorLink = quotationContainer.querySelector('a.author-link');
      if (authorLink && authorLink.textContent.trim().length) {
        // Bold the author's name, keep the link
        const strong = document.createElement('strong');
        strong.textContent = authorLink.textContent.trim();
        const a = document.createElement('a');
        a.href = authorLink.href;
        a.appendChild(strong);
        textCellElements.push(document.createElement('br'));
        textCellElements.push(a);
      }
      // Author statement (subheading/role)
      const authorStatement = quotationContainer.querySelector('.author-statement');
      if (authorStatement && authorStatement.textContent.trim().length) {
        const div = document.createElement('div');
        div.textContent = authorStatement.textContent.trim();
        textCellElements.push(document.createElement('br'));
        textCellElements.push(div);
      }
    }
    // Clean leading/trailing <br>
    while (textCellElements.length && textCellElements[0].tagName === 'BR') textCellElements.shift();
    while (textCellElements.length && textCellElements[textCellElements.length - 1].tagName === 'BR') textCellElements.pop();

    rows.push([imgEl, textCellElements]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
