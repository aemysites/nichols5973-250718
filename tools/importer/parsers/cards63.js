/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row as block definition
  const cells = [['Cards (cards63)']];

  // Find the reading cards container
  const readingsContainer = element.querySelector('.related-reading__readings');
  if (!readingsContainer) return;

  // Collect all cards
  const cards = Array.from(readingsContainer.querySelectorAll('.reading'));

  cards.forEach((card) => {
    // FIRST CELL: Image (always present)
    let imageCell = null;
    const imageLink = card.querySelector('.reading__image a');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) imageCell = img;
    }

    // SECOND CELL: Textual Content
    const textContent = [];

    // Meta block: authors and read time
    const metaBlock = card.querySelector('.reading__meta');
    if (metaBlock) {
      // Authors
      const authorsContainer = metaBlock.querySelector('.reading__authors');
      if (authorsContainer) {
        const authorImgs = Array.from(authorsContainer.querySelectorAll('img'));
        if (authorImgs.length) {
          // Group author imgs in a div
          const authorDiv = document.createElement('div');
          authorDiv.className = 'authors';
          authorImgs.forEach(img => authorDiv.appendChild(img));
          textContent.push(authorDiv);
        }
      }
      // Date/Read time
      const dateRead = metaBlock.querySelector('.reading__date-read');
      if (dateRead) textContent.push(dateRead);
    }
    // Title (H3)
    const titleBlock = card.querySelector('.reading__title h3');
    if (titleBlock) textContent.push(titleBlock);
    // Tags
    const tagsBlock = card.querySelector('.reading__tags');
    if (tagsBlock) textContent.push(tagsBlock);

    // Only include the row if image and some content
    if (imageCell && textContent.length) {
      cells.push([
        imageCell,
        textContent.length === 1 ? textContent[0] : textContent
      ]);
    }
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
