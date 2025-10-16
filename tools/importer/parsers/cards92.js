/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards92) block parsing for consultant directory
  // 1. Header row
  const headerRow = ['Cards (cards92)'];

  // 2. Find all card items (li elements inside the ul)
  const ul = element.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children).filter(li => li.tagName === 'LI');

  // 3. Build card rows: [image, name as heading]
  const rows = cards.map(li => {
    // Each li contains an anchor
    const a = li.querySelector('a');
    if (!a) return null;
    // Image: find the img inside .related-consultants-list--picture
    const imgDiv = a.querySelector('.related-consultants-list--picture');
    const img = imgDiv ? imgDiv.querySelector('img') : null;
    // Name: find the h4 inside .related-consultants-list--info
    const infoDiv = a.querySelector('.related-consultants-list--info');
    const h4 = infoDiv ? infoDiv.querySelector('h4') : null;
    // Compose text cell: name as heading, link to profile
    let textCell;
    if (h4) {
      // Wrap name in anchor for CTA if not already
      const nameLink = document.createElement('a');
      nameLink.href = a.href;
      nameLink.append(h4.textContent);
      textCell = nameLink;
    } else {
      textCell = a.href;
    }
    return [img, textCell];
  }).filter(Boolean);

  // 4. Compose table data
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace original element with block table
  element.replaceWith(table);
}
