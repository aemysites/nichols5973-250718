/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header row exactly as in the example
  const cells = [['Cards (cards107)']];

  // Select all direct children that are cards (div or a)
  const cardElements = Array.from(element.children).filter(child => child.classList.contains('entry-point__item'));

  cardElements.forEach(card => {
    // Find image element (always present according to block requirements)
    const imgContainer = card.querySelector('.entry-point__item--img');
    let img = imgContainer ? imgContainer.querySelector('img') : null;
    // Null fallback for robustness
    if (!img) img = '';

    // Find the text content wrapper
    const body = card.querySelector('.entry-point__item--body');
    const textParts = [];
    if (body) {
      // Heading/title (h3)
      const heading = body.querySelector('h3');
      if (heading) textParts.push(heading);
      // Description (p)
      const desc = body.querySelector('p');
      if (desc) textParts.push(desc);
      // If the card is a link, add a CTA link at the bottom
      if (card.tagName.toLowerCase() === 'a') {
        const cta = document.createElement('a');
        cta.href = card.href;
        // Use card's title attr or fallback to link text
        cta.textContent = card.getAttribute('title') || card.textContent.trim() || 'Learn more';
        textParts.push(cta);
      }
    }

    // Add the row for this card
    cells.push([
      img,
      textParts.length === 1 ? textParts[0] : textParts
    ]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
