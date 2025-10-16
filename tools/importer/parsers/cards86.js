/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards86) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards86)'];

  // 2. Find card rows
  // The parent container holds multiple .entry-points__row elements, each with a single <a> containing card content
  const cardRows = Array.from(element.querySelectorAll('.entry-points__row'));

  // 3. Parse each card
  const rows = cardRows.map(row => {
    // Each row contains a single <a>
    const cardLink = row.querySelector('a.entry-point__item');
    if (!cardLink) return null;

    // Image: inside .entry-point__item--img > img
    const imgContainer = cardLink.querySelector('.entry-point__item--img');
    const img = imgContainer ? imgContainer.querySelector('img') : null;

    // Text content: inside .entry-point__item--body
    const body = cardLink.querySelector('.entry-point__item--body');
    let textContent = [];
    if (body) {
      // Arrow image (call-to-action icon), h3 (title), p (description)
      const arrowImg = body.querySelector('img');
      const title = body.querySelector('h3');
      const desc = body.querySelector('p');
      if (title) textContent.push(title);
      if (desc) textContent.push(desc);
      // If the card is a link, add a CTA link at the bottom (using the arrow icon)
      if (cardLink.href && arrowImg) {
        // Create a link wrapping the arrow image
        const cta = document.createElement('a');
        cta.href = cardLink.href;
        cta.title = cardLink.title || '';
        cta.appendChild(arrowImg);
        textContent.push(cta);
      }
    }
    // Defensive: If no text, fallback to link text
    if (textContent.length === 0 && cardLink.textContent) {
      textContent.push(document.createTextNode(cardLink.textContent));
    }
    // Defensive: If no image, fallback to null
    return [img || '', textContent];
  }).filter(Boolean);

  // 4. Build table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace original element
  element.replaceWith(table);
}
