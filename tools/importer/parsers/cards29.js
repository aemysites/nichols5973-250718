/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards29) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards29)'];
  const rows = [headerRow];

  // Find all card wrappers (each card)
  const cardWrappers = element.querySelectorAll('.service-card__wrapper');

  cardWrappers.forEach((wrapper) => {
    // Find the main clickable area (the card link)
    const link = wrapper.querySelector('.service-card__link');
    // Find the main card content
    const card = link ? link.querySelector('.service-card') : wrapper.querySelector('.service-card');

    // Find image/icon (may be missing for callout cards)
    let imgEl = null;
    const vImage = card && card.querySelector('.v-image__image img');
    if (vImage) {
      imgEl = vImage;
    }

    // Find text content
    let textContent = document.createElement('div');
    // Title (h3)
    const title = card && card.querySelector('.service-card__title');
    if (title) {
      textContent.appendChild(title);
    }
    // Description (service-card__text)
    const desc = card && card.querySelector('.service-card__text');
    if (desc) {
      textContent.appendChild(desc);
    }
    // For callout cards (no image, just text)
    if (!imgEl && desc && !title) {
      // Use the description as the only cell content
      textContent = desc;
    }

    // Compose the row: [image or null, text content]
    rows.push([imgEl ? imgEl : '', textContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
