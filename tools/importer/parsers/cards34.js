/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly matching the example
  const headerRow = ['Cards (cards34)'];
  const cells = [headerRow];

  // Locate cards container, robustly
  const cardsContainer = element.querySelector('.latest-insights-events__insights') || element;
  // Get all direct .insight children
  const cardEls = Array.from(cardsContainer.querySelectorAll(':scope > .insight'));

  cardEls.forEach(cardEl => {
    // First cell: image (mandatory)
    let imgElem = null;
    const img = cardEl.querySelector('.insight__image img');
    if (img) imgElem = img;

    // Second cell: all text content, preserving headings, links, tags, etc.
    // Reference all direct children of .insight__content for semantic meaning
    const content = cardEl.querySelector('.insight__content');
    const textCell = document.createElement('div');
    if (content) {
      // Append each child of .insight__content (preserves headings, paragraphs, tags, etc.)
      Array.from(content.children).forEach(child => {
        textCell.appendChild(child);
      });
    } else {
      // Fallback: use all text from cardEl if .insight__content not present
      textCell.textContent = cardEl.textContent.trim();
    }
    // Only push a row if at least image or text content is present
    if (imgElem || textCell.textContent.trim()) {
      cells.push([imgElem, textCell]);
    }
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
