/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards54) block: 2 columns, multiple rows
  // Header row: must be exactly one column
  const headerRow = ['Cards (cards54)'];

  // Find the UL containing all cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Each LI is a card
  const cardRows = [];
  ul.querySelectorAll('li').forEach((li) => {
    // Image: first column
    const img = li.querySelector('.related-consultants-list--picture img');
    const imgEl = img ? img.cloneNode(true) : '';

    // Text: second column
    const infoDiv = li.querySelector('.related-consultants-list--info');
    const textCell = document.createElement('div');
    if (infoDiv) {
      // Title (consultant name) as heading
      const title = infoDiv.querySelector('h4');
      if (title) {
        const heading = document.createElement('h4');
        heading.textContent = title.textContent.trim();
        textCell.appendChild(heading);
      }
      // Location (region)
      const location = infoDiv.querySelector('span');
      if (location) {
        const region = document.createElement('div');
        region.textContent = location.textContent.trim();
        textCell.appendChild(region);
      }
    }
    // Compose row: [image, text]
    cardRows.push([
      imgEl,
      textCell
    ]);
  });

  // Compose table cells
  const cells = [headerRow, ...cardRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
