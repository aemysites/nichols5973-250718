/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per instructions and example
  const headerRow = ['Cards (cardsNoImages97)'];
  const cells = [headerRow];

  // Defensive: support .link-items > .link-item or direct .link-item children
  let cardNodes = [];
  const linkItems = element.querySelector('.link-items');
  if (linkItems) {
    cardNodes = Array.from(linkItems.querySelectorAll(':scope > .link-item'));
  } else {
    cardNodes = Array.from(element.querySelectorAll(':scope > .link-item'));
  }

  cardNodes.forEach(card => {
    // Create array for card content
    const cardContent = [];
    // Heading (h3, possibly with <a>)
    const heading = card.querySelector('h3');
    if (heading) {
      // Use the <a> if present, otherwise use the <h3>
      const headingLink = heading.querySelector('a');
      if (headingLink) {
        cardContent.push(headingLink);
      } else {
        cardContent.push(heading);
      }
    }
    // Description paragraph
    const desc = card.querySelector('p');
    if (desc) {
      cardContent.push(desc);
    }
    // CTA: If there is a <a> with non-image content, include it as CTA. But in this HTML, it's just an arrow image, so skip.
    // All text is extracted. If there were additional elements, we would include them.
    cells.push([cardContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
