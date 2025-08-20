/* global WebImporter */
export default function parse(element, { document }) {
  // Header as per block requirements
  const headerRow = ['Cards (cards108)'];
  const rows = [];

  // Helper to extract info from each card
  function extractCard(cardEl) {
    // Image in first cell
    let imgEl = null;
    const imgWrap = cardEl.querySelector(':scope > .entry-point__item--img');
    if (imgWrap) {
      imgEl = imgWrap.querySelector('img');
    }
    // Text content in second cell
    const bodyWrap = cardEl.querySelector(':scope > .entry-point__item--body');
    const bodyContent = [];
    if (bodyWrap) {
      // Title (h3/h2/h1)
      const heading = bodyWrap.querySelector('h1, h2, h3');
      if (heading) bodyContent.push(heading);
      // Description
      bodyWrap.querySelectorAll('p').forEach(p => bodyContent.push(p));
      // No CTA in the HTML, but if cardEl is an <a> and not already used as wrapper, add CTA at bottom
      if (
        cardEl.tagName === 'A' &&
        cardEl.href &&
        !Array.from(bodyWrap.querySelectorAll('a')).some((a) => a.href === cardEl.href)
      ) {
        const link = document.createElement('a');
        link.href = cardEl.href;
        link.textContent = cardEl.title || 'Find out more';
        bodyContent.push(link);
      }
    }
    return [imgEl, bodyContent];
  }

  // Cards are direct children with .entry-point__item
  Array.from(element.children).forEach((child) => {
    if (child.classList.contains('entry-point__item')) {
      rows.push(extractCard(child));
    }
  });

  // Build final table
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
