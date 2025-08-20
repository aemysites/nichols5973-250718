/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as shown in the example
  const headerRow = ['Cards (cards86)'];
  const rows = [headerRow];

  // Find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Each <li> is a card
  const cards = ul.querySelectorAll('li');

  cards.forEach(card => {
    // First cell: image element from the .related-consultants-list--picture div
    const imgDiv = card.querySelector('.related-consultants-list--picture');
    let img = '';
    if (imgDiv) {
      const foundImg = imgDiv.querySelector('img');
      if (foundImg) img = foundImg;
    }

    // Second cell: text content (title, etc) from .related-consultants-list--info
    const infoDiv = card.querySelector('.related-consultants-list--info');
    let textContent = '';
    if (infoDiv) {
      // Prefer to use the existing heading element, if present
      const h4 = infoDiv.querySelector('h4');
      if (h4) {
        textContent = h4;
      } else {
        // Fallback: use all child nodes as content
        textContent = Array.from(infoDiv.childNodes).filter(n => n.textContent.trim()).map(n => n);
      }
    }

    rows.push([
      img,
      textContent
    ]);
  });

  // Create and replace with the structured block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
