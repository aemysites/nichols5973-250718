/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards2) block: 2 columns, header row, each row is a card (image | text)
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Each <li> is a card
  ul.querySelectorAll(':scope > li').forEach((li) => {
    const a = li.querySelector('a');
    if (!a) return;

    // Image: find the .related-consultants-list--picture img
    const imgDiv = a.querySelector('.related-consultants-list--picture');
    let img = imgDiv ? imgDiv.querySelector('img') : null;
    const imgCell = img ? img : '';

    // Info: name (h4), location(s) (span)
    const infoDiv = a.querySelector('.related-consultants-list--info');
    const textCell = document.createElement('div');
    if (infoDiv) {
      // Name
      const name = infoDiv.querySelector('h4');
      if (name) {
        // Use heading for name
        const heading = document.createElement('strong');
        heading.textContent = name.textContent;
        textCell.appendChild(heading);
      }
      // Location(s):
      const locationSpan = infoDiv.querySelector('span');
      if (locationSpan) {
        // Add a line break between name and location if both exist
        if (name) textCell.appendChild(document.createElement('br'));
        textCell.appendChild(document.createTextNode(locationSpan.textContent));
      }
    }
    // Make the whole card clickable by wrapping text cell in a link
    if (a.href) {
      const link = document.createElement('a');
      link.href = a.href;
      link.append(...textCell.childNodes);
      rows.push([imgCell, link]);
    } else {
      rows.push([imgCell, textCell]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
