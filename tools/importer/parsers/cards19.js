/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract the section heading (must preserve all text content)
  const headingEl = element.querySelector('.base-title h2');
  let heading = '';
  if (headingEl) {
    heading = headingEl.textContent.trim();
  }

  // 2. Cards (cards19) block header row
  const headerRow = ['Cards (cards19)'];

  // 3. Find the parent container for cards
  const cardsContainer = element.querySelector('.__items');
  if (!cardsContainer) return;

  // 4. Find all card wrappers
  const cardWrappers = cardsContainer.querySelectorAll('.service-card__wrapper');
  if (!cardWrappers.length) return;

  // 5. Build card rows
  const rows = [];
  cardWrappers.forEach(cardWrapper => {
    // Card image/icon
    let imageEl = cardWrapper.querySelector('.v-image__image img');
    if (!imageEl) imageEl = cardWrapper.querySelector('img');
    // Card title (preserve all caps)
    const titleEl = cardWrapper.querySelector('.service-card__title');
    let title = '';
    if (titleEl) {
      title = titleEl.textContent.trim();
    }
    // Card description
    const descEl = cardWrapper.querySelector('.service-card__text p');
    let desc = '';
    if (descEl) {
      desc = descEl.textContent.trim();
    }
    // Compose text cell: title + description (preserve heading style)
    const textCell = [];
    if (title) {
      const h = document.createElement('h3');
      h.textContent = title;
      textCell.push(h);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc;
      textCell.push(p);
    }
    rows.push([
      imageEl || '',
      textCell
    ]);
  });

  // 6. Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // 7. Insert heading above table if present
  if (heading) {
    const headingNode = document.createElement('h2');
    headingNode.textContent = heading;
    element.replaceWith(headingNode, table);
  } else {
    element.replaceWith(table);
  }
}
