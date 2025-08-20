/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Cards (cards105)'];
  // Select all card items (both <a> and <div>) directly under the wrapper
  const cardEls = Array.from(element.querySelectorAll(':scope > a, :scope > div'));
  const rows = [headerRow];
  cardEls.forEach(card => {
    // Image cell: always present as first child with class .entry-point__item--img > img
    let imgCell = null;
    const imgWrapper = card.querySelector('.entry-point__item--img');
    if (imgWrapper) {
      const img = imgWrapper.querySelector('img');
      if (img) imgCell = img;
    }
    // Text cell: heading, description, CTA if present
    const bodyWrapper = card.querySelector('.entry-point__item--body');
    let textCellContent = [];
    if (bodyWrapper) {
      const heading = bodyWrapper.querySelector('h3');
      if (heading) textCellContent.push(heading);
      const para = bodyWrapper.querySelector('p');
      if (para) textCellContent.push(para);
    }
    // CTA: only for <a> cards, use card.title as CTA label and card.href as link
    if (card.tagName.toLowerCase() === 'a' && card.title && card.getAttribute('href')) {
      const ctaLink = document.createElement('a');
      ctaLink.href = card.getAttribute('href');
      ctaLink.textContent = card.title;
      textCellContent.push(ctaLink);
    }
    // Edge case: if no heading/para/cta, but still a card, gracefully handle as empty array
    rows.push([
      imgCell,
      textCellContent
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
