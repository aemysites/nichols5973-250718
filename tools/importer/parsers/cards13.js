/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards13) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards13)'];

  // 2. Find all card items within the parent container
  // The cards are direct children of .teaser-collection-block__items-container
  const cardsContainer = element.querySelector('.teaser-collection-block__items-container');
  if (!cardsContainer) return;

  // Each card is a .teaser-collection-item-block
  const cardElements = Array.from(cardsContainer.querySelectorAll('.teaser-collection-item-block'));

  // 3. Build rows for each card
  const rows = cardElements.map(card => {
    // --- Image/Icon cell ---
    // The icon is inside .icon-container > img
    const iconContainer = card.querySelector('.icon-container');
    let imageEl = null;
    if (iconContainer) {
      imageEl = iconContainer.querySelector('img');
    }
    // Defensive fallback: if no image, use iconContainer itself (rare)
    const imageCell = imageEl || iconContainer || '';

    // --- Text cell ---
    // Title (h3), Subtitle (h4), Description (ul, p)
    const textFragments = [];
    // Title
    const title = card.querySelector('h3');
    if (title) textFragments.push(title);
    // Subtitle
    const subtitle = card.querySelector('h4');
    if (subtitle) textFragments.push(subtitle);
    // Description block
    const descBlock = card.querySelector('.teaser-collection-item-block__description');
    if (descBlock) {
      // Find all lists and paragraphs inside descBlock
      const lists = descBlock.querySelectorAll('ul, ol');
      lists.forEach(list => textFragments.push(list));
      // Find all paragraphs (for CTA link)
      const paragraphs = descBlock.querySelectorAll('p');
      paragraphs.forEach(p => textFragments.push(p));
      // Defensive: if there is a div.teaser-block__desc, include its children
      const innerDesc = descBlock.querySelector('.teaser-block__desc');
      if (innerDesc) {
        Array.from(innerDesc.children).forEach(child => textFragments.push(child));
      }
    }
    // Defensive: if no descBlock, include all direct children except icon/title/subtitle
    if (!descBlock) {
      Array.from(card.children).forEach(child => {
        if (!child.classList.contains('teaser-collection-item-block__title-container')) {
          textFragments.push(child);
        }
      });
    }
    // Text cell is array of elements
    const textCell = textFragments;

    return [imageCell, textCell];
  });

  // 4. Compose table data
  const tableData = [headerRow, ...rows];

  // 5. Create table and replace original element
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(blockTable);
}
