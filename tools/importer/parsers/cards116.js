/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards116) block: 2 columns, each row is a card: [image, text content]
  const headerRow = ['Cards (cards116)'];
  const rows = [headerRow];

  // Find all card elements within the container
  const cardSelector = '.entry-point__item';
  const cards = Array.from(element.querySelectorAll(cardSelector));

  cards.forEach(card => {
    // Image: first .entry-point__item--img > img
    const imgWrapper = card.querySelector('.entry-point__item--img');
    let img = imgWrapper ? imgWrapper.querySelector('img') : null;

    // Text content: .entry-point__item--body
    const body = card.querySelector('.entry-point__item--body');
    let textContent = null;
    if (body) {
      const textDiv = document.createElement('div');
      // Copy all children except arrow icon (img with src containing arrow-white.svg)
      Array.from(body.children).forEach(child => {
        if (child.tagName.toLowerCase() === 'img' && child.src.includes('arrow-white.svg')) return;
        textDiv.appendChild(child.cloneNode(true));
      });
      // If there is an arrow icon and the card is a link, wrap the whole textDiv in a link
      const arrowImg = body.querySelector('img[src*="arrow-white.svg"]');
      if (arrowImg && card.tagName.toLowerCase() === 'a') {
        const link = document.createElement('a');
        link.href = card.href;
        link.title = card.title || '';
        // Move all children from textDiv into link
        Array.from(textDiv.childNodes).forEach(node => link.appendChild(node));
        // Append the arrow icon to the link
        link.appendChild(arrowImg.cloneNode(true));
        // Set textDiv to be the link
        textContent = link;
      } else {
        // If not a link card, just append the arrow if present
        if (arrowImg) {
          textDiv.appendChild(arrowImg.cloneNode(true));
        }
        textContent = textDiv;
      }
    }

    // Defensive: Only add row if both image and text are present
    if (img && textContent) {
      rows.push([img, textContent]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
