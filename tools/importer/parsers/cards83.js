/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Cards (cards83) block
  const headerRow = ['Cards (cards83)'];
  const rows = [headerRow];

  // Find the <ul> containing all cards
  const ul = element.querySelector('ul');
  if (!ul) {
    // Defensive: no cards found
    element.replaceWith(WebImporter.DOMUtils.createTable(rows, document));
    return;
  }

  // Each <li> is a card
  ul.querySelectorAll('li').forEach((li) => {
    // Card link (wraps image and title)
    const link = li.querySelector('a');
    if (!link) return;

    // Image: inside .related-consultants-list--picture
    const imgContainer = link.querySelector('.related-consultants-list--picture');
    let img = imgContainer ? imgContainer.querySelector('img') : null;
    let imgCell = img ? img : '';

    // Info container
    const infoContainer = link.querySelector('.related-consultants-list--info');
    let title = '', desc = '';
    if (infoContainer) {
      // Name is in <h4> (not <h3>)
      const h4 = infoContainer.querySelector('h4');
      if (h4) title = h4.textContent.trim();
      // Description is in <span>
      const span = infoContainer.querySelector('span');
      if (span) desc = span.textContent.trim();
    }

    // Build text cell: title (bold), then description
    const textCell = document.createElement('div');
    if (title) {
      const heading = document.createElement('strong');
      heading.textContent = title;
      textCell.appendChild(heading);
    }
    if (desc) {
      textCell.appendChild(document.createElement('br'));
      const descElem = document.createElement('span');
      descElem.textContent = desc;
      textCell.appendChild(descElem);
    }

    rows.push([imgCell, textCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
