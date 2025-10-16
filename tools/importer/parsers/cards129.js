/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards129) block
  // 1. Header row
  const headerRow = ['Cards (cards129)'];

  // 2. Find the parent container for cards
  const cardRow = element.querySelector('.related-consultants-list--card-row ul');
  if (!cardRow) return;

  // 3. Extract each card (li)
  const rows = [];
  cardRow.querySelectorAll('li').forEach((li) => {
    const a = li.querySelector('a');
    if (!a) return;
    const img = a.querySelector('.related-consultants-list--picture img');
    const info = a.querySelector('.related-consultants-list--info h3');
    rows.push([
      img || '',
      info || '',
    ]);
  });

  // 4. Include the section heading 'Asia Pacific' above the table
  const heading = element.querySelector('h2');
  const fragment = document.createDocumentFragment();
  if (heading) fragment.appendChild(heading.cloneNode(true));

  // 5. Create the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  fragment.appendChild(table);

  // 6. Replace the original element
  element.replaceWith(fragment);
}
