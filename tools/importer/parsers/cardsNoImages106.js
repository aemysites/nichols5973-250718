/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cardsNoImages106)'];
  const rows = [headerRow];

  // Find the container holding all cards
  const list = element.querySelector('.link-items');
  if (!list) return;

  // Each card is a .link-item
  const cards = list.querySelectorAll('.link-item');
  cards.forEach((card) => {
    const frag = document.createDocumentFragment();

    // Heading (optional)
    const heading = card.querySelector('h3');
    if (heading) {
      frag.appendChild(heading.cloneNode(true));
    }

    // Description (optional)
    const desc = card.querySelector('p');
    if (desc) {
      frag.appendChild(document.createElement('br'));
      frag.appendChild(desc.cloneNode(true));
    }

    // CTA (arrow icon link): always present as the last <a> in the card
    const cta = card.querySelector('a:last-of-type');
    if (cta) {
      frag.appendChild(document.createElement('br'));
      frag.appendChild(cta.cloneNode(true));
    }

    rows.push([frag]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
