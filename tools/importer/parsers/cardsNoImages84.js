/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages84) block parser

  // 1. Find the container with the cards table
  const layoutContainer = element.querySelector('.layout-container');
  if (!layoutContainer) return;

  // 2. Find the table containing the card
  const cardsTable = layoutContainer.querySelector('table');
  if (!cardsTable) return;

  // 3. Table header row
  const headerRow = ['Cards (cardsNoImages84)'];

  // 4. Extract all content from the card cell (single card)
  const cardRows = [];
  const tr = cardsTable.querySelector('tbody > tr');
  if (tr) {
    const td = tr.querySelector('td');
    if (td) {
      // Collect all relevant children in order
      const cardContent = [];
      // Heading (h2 or h3)
      const heading = td.querySelector('h2, h3');
      if (heading) cardContent.push(heading.cloneNode(true));
      // All paragraphs (skip empty ones)
      td.querySelectorAll('p').forEach(p => {
        if (p.textContent.trim() && p.textContent.trim() !== '\u00A0') {
          cardContent.push(p.cloneNode(true));
        }
      });
      // CTA (link inside h3 or direct a)
      const cta = td.querySelector('h3 a, a.link--button, a');
      if (cta) {
        // If CTA is inside an h3, clone the h3
        const h3 = cta.closest('h3');
        if (h3) {
          cardContent.push(h3.cloneNode(true));
        } else {
          cardContent.push(cta.cloneNode(true));
        }
      }
      // Only add if there's actual content
      if (cardContent.length) {
        cardRows.push([cardContent]);
      }
    }
  }

  // 5. Compose the table data
  const tableData = [headerRow, ...cardRows];

  // 6. Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // 7. Replace the original element with the block
  element.replaceWith(block);
}
