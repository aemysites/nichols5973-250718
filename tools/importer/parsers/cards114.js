/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards114) block: 2 columns, header row, each card = 1 row
  const headerRow = ['Cards (cards114)'];
  const rows = [headerRow];

  // Find all card elements (direct children with class 'entry-point__item')
  // Some cards may be wrapped in <a>, others may not
  const cardNodes = Array.from(element.querySelectorAll('.entry-point__item'));

  cardNodes.forEach(card => {
    // Image: first .entry-point__item--img img
    const imgWrapper = card.querySelector('.entry-point__item--img img');
    const image = imgWrapper ? imgWrapper : '';

    // Text: .entry-point__item--body
    const body = card.querySelector('.entry-point__item--body');
    let textContent = [];
    if (body) {
      // Remove any decorative arrow images from the body (not content)
      const bodyClone = body.cloneNode(true);
      // Remove arrow images (SVG or img with arrow in src)
      Array.from(bodyClone.querySelectorAll('img')).forEach(img => {
        if (img.src && img.src.includes('arrow')) {
          img.remove();
        }
      });
      // If card is a link, wrap the body content in the link
      const parentLink = card.closest('a[href]');
      if (parentLink) {
        // Create a new anchor, copy href, and append the body content
        const link = document.createElement('a');
        link.href = parentLink.href;
        link.title = parentLink.title || '';
        // Move all children of bodyClone into the link
        while (bodyClone.firstChild) {
          link.appendChild(bodyClone.firstChild);
        }
        textContent = [link];
      } else {
        // Just use the body content as is
        textContent = Array.from(bodyClone.childNodes);
      }
    }
    rows.push([image, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
