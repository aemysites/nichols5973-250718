/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards7) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards7)'];
  const rows = [headerRow];

  // Find the main container for cards
  const layoutContainer = element.querySelector('.layout-container');
  if (!layoutContainer) return;

  // Find all card rows
  const cardRows = layoutContainer.querySelectorAll('.entry-points__row');
  cardRows.forEach((cardRow) => {
    const cardLinks = cardRow.querySelectorAll('a.entry-point__item');
    cardLinks.forEach((card) => {
      // Image (first cell)
      const imgDiv = card.querySelector('.entry-point__item--img');
      let img = imgDiv ? imgDiv.querySelector('img') : null;
      const imgCell = img ? img.cloneNode(true) : '';

      // Text (second cell) - preserve link
      const bodyDiv = card.querySelector('.entry-point__item--body');
      let textCell;
      if (bodyDiv) {
        // Collect all text content as a single block, including all children
        const textDiv = document.createElement('div');
        Array.from(bodyDiv.childNodes).forEach(child => {
          textDiv.appendChild(child.cloneNode(true));
        });
        // Wrap textDiv in a link to preserve CTA
        const link = card.getAttribute('href');
        if (link) {
          const a = document.createElement('a');
          a.href = link;
          a.title = card.title || '';
          a.appendChild(textDiv);
          textCell = a;
        } else {
          textCell = textDiv.childNodes.length ? textDiv : '';
        }
      } else {
        textCell = '';
      }
      rows.push([imgCell, textCell]);
    });
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Insert heading and intro paragraph before the table (outside the table)
  const sectionHeading = layoutContainer.querySelector('h2');
  const sectionParagraph = layoutContainer.querySelector('p');
  if (sectionHeading || sectionParagraph) {
    const introDiv = document.createElement('div');
    if (sectionHeading) introDiv.appendChild(sectionHeading.cloneNode(true));
    if (sectionParagraph) introDiv.appendChild(sectionParagraph.cloneNode(true));
    element.parentNode.insertBefore(introDiv, element);
  }

  element.replaceWith(table);
}
