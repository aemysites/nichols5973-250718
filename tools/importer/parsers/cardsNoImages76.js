/* global WebImporter */
export default function parse(element, { document }) {
  // The block header row, per the example
  const cells = [['Cards (cardsNoImages76)']];

  // Find the main content area. Use the first table for cards content
  const layoutContainer = element.querySelector('.layout-container') || element;
  const cardTable = layoutContainer.querySelector('table');
  if (!cardTable) return;

  // Find the card row (each <tr> should be a card)
  const trs = cardTable.querySelectorAll('tr');
  trs.forEach(tr => {
    const tds = tr.querySelectorAll('td');
    tds.forEach(td => {
      // Compose all meaningful content from the card cell
      const cardContent = [];
      // h2/h3 headings (in order)
      const headings = td.querySelectorAll('h2, h3');
      headings.forEach(h => cardContent.push(h));
      // All <p> that are not empty or whitespace only
      td.querySelectorAll('p').forEach(p => {
        if (p.textContent.replace(/\u00a0/g, '').trim()) {
          cardContent.push(p);
        }
      });
      // Any <a> links, if present and not already included
      td.querySelectorAll('a').forEach(a => {
        if (!cardContent.includes(a)) {
          cardContent.push(a);
        }
      });
      // Only add card if there is real content
      if (cardContent.length) {
        cells.push([cardContent]);
      }
    });
  });

  // Create the block table with the extracted content
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
