/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as per block spec
  const headerRow = ['Cards (cards121)'];

  // 2. Find the container holding the cards
  const cardRow = element.querySelector('.related-consultants-list--card-row');
  const table = [headerRow];
  if (cardRow) {
    const lis = cardRow.querySelectorAll('ul > li');
    lis.forEach((li) => {
      // Each li > a (contains image and text)
      const link = li.querySelector('a');
      if (!link) return;
      // Image: first .related-consultants-list--picture img
      const imgDiv = link.querySelector('.related-consultants-list--picture');
      const img = imgDiv ? imgDiv.querySelector('img') : null;
      // Text: .related-consultants-list--info h3 (or H2/H4 etc for resilience)
      const infoDiv = link.querySelector('.related-consultants-list--info');
      let textContent = '';
      if (infoDiv) {
        const heading = infoDiv.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) textContent = heading;
      }
      // Add row: always 2 columns
      table.push([
        img ? img : '',
        textContent ? textContent : ''
      ]);
    });
  }
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
