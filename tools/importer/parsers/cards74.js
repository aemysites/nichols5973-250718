/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row as in the example
  const headerRow = ['Cards (cards74)'];
  // Get all card containers: direct children that are either <a> or <div>
  const cardNodes = Array.from(element.querySelectorAll(':scope > a.entry-point__item, :scope > div.entry-point__item'));
  const rows = cardNodes.map(card => {
    // First cell: Find the image (<img>)
    let img = null;
    const imgDiv = card.querySelector('.entry-point__item--img');
    if (imgDiv) {
      const foundImg = imgDiv.querySelector('img');
      if (foundImg) img = foundImg;
    }
    // Second cell: All text content (title, description, CTA)
    const bodyDiv = card.querySelector('.entry-point__item--body');
    const cellContents = [];
    if (bodyDiv) {
      // Collect each child that holds text, maintaining semantic HTML from source
      bodyDiv.childNodes.forEach(node => {
        if (node.nodeType === 1 && node.textContent.trim()) {
          // Element node with non-empty text
          cellContents.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // Text node with non-empty text
          cellContents.push(document.createTextNode(node.textContent));
        }
      });
    }
    // If the card is a link, add CTA at bottom
    if (card.tagName === 'A' && card.href) {
      const ctaLink = document.createElement('a');
      ctaLink.href = card.getAttribute('href');
      ctaLink.textContent = '→';
      cellContents.push(ctaLink);
    }
    return [img, cellContents];
  });
  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
