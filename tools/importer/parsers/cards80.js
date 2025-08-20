/* global WebImporter */
export default function parse(element, { document }) {
  // Block header from example: 'Cards (cards80)'
  const headerRow = ['Cards (cards80)'];

  // Get all immediate .entry-points__row children
  const cardRows = Array.from(element.querySelectorAll(':scope .entry-points__row'));
  const cells = [headerRow];

  cardRows.forEach((cardRow) => {
    // Get the card anchor element
    const link = cardRow.querySelector('a.entry-point__item');
    if (!link) return;

    // Image cell: Find the image inside the .entry-point__item--img div
    const imgDiv = link.querySelector('.entry-point__item--img');
    let img = null;
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }

    // Text cell: composed of heading, paragraph, and CTA link
    const textArr = [];
    const bodyDiv = link.querySelector('.entry-point__item--body');
    if (bodyDiv) {
      // Heading (keep the original heading element)
      const heading = bodyDiv.querySelector('h3');
      if (heading) textArr.push(heading);

      // Description paragraph
      const para = bodyDiv.querySelector('p');
      if (para) textArr.push(para);
    }
    // CTA: add a call-to-action link at the bottom of the text cell
    // Only add if the anchor has a meaningful href
    if (link.href && link.getAttribute('href')) {
      // Use the original link's href and title/textContent
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = link.title && link.title.trim() ? link.title.trim() : 'Find out more';
      cta.setAttribute('target', '_blank');
      textArr.push(cta);
    }

    // Push the card row: [image, text cell]
    cells.push([
      img || '',
      textArr,
    ]);
  });

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
