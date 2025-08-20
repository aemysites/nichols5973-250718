/* global WebImporter */
export default function parse(element, { document }) {
  // The header row for the block, as in the example
  const headerRow = ['Cards (cards57)'];

  // Find the container of card elements
  const slidesUl = element.querySelector('ul.glide__slides');
  if (!slidesUl) return;

  // Get all immediate li.insight children (these are the cards)
  const cards = slidesUl.querySelectorAll('li.insight');
  const rows = [];

  cards.forEach(card => {
    // IMAGE CELL: get the image (img element inside .insight--image)
    let imgEl = card.querySelector('.insight--image img');

    // TEXT CELL: Compose text content
    const textCellParts = [];

    // Tags block, if present (as a div of links)
    const tags = card.querySelector('.insight--tags');
    if (tags && tags.children.length) {
      textCellParts.push(tags);
    }

    // Heading (h3.heading2)
    const heading = card.querySelector('h3.heading2');
    if (heading) {
      textCellParts.push(heading);
    }

    // Description: In this HTML, the <p> below heading is empty, so skip
    // If a non-empty <p> is present, include it
    const p = card.querySelector('p');
    if (p && p.textContent.trim()) {
      textCellParts.push(p);
    }

    // Call-to-Action button (a.link--button after text)
    // Make sure we only include the CTA that's not in the image
    const imageLink = card.querySelector('.insight--image a');
    let cta = null;
    // Find all .link--button in this card
    card.querySelectorAll('a.link--button').forEach(a => {
      // Only include if not the one wrapping the image
      if (!imageLink || !imageLink.isSameNode(a)) {
        if (!cta) cta = a;
      }
    });
    if (cta) {
      textCellParts.push(cta);
    }

    // Compose one row: [image, text content]
    rows.push([
      imgEl || '',
      textCellParts
    ]);
  });

  // Final table rows - header plus all cards
  const tableRows = [headerRow, ...rows];
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
