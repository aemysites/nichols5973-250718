/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards2) block
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];
  // Find all li elements under the main list
  const list = element.querySelector('ul');
  if (!list) return;
  const items = list.querySelectorAll('li');
  items.forEach((li) => {
    // First cell: image
    const pictureDiv = li.querySelector('.related-consultants-list--picture');
    let img = pictureDiv ? pictureDiv.querySelector('img') : null;
    // Use the actual img element (not cloned)
    let imageCell = img || '';

    // Second cell: text content (name and locations)
    const infoDiv = li.querySelector('.related-consultants-list--info');
    const cellContent = document.createDocumentFragment();
    if (infoDiv) {
      // Name as strong (from h3)
      const h3 = infoDiv.querySelector('h3');
      if (h3) {
        const strong = document.createElement('strong');
        strong.textContent = h3.textContent.trim();
        cellContent.appendChild(strong);
      }
      // Locations (one or more spans inside the .related-consultants-list--info span)
      const locContainer = infoDiv.querySelector('span');
      if (locContainer) {
        // Find all span children of first span, or just use textContent
        let locSpans = locContainer.querySelectorAll('span');
        let locations = [];
        if (locSpans.length > 0) {
          locations = Array.from(locSpans).map(s => s.textContent.trim()).filter(Boolean);
        } else if (locContainer.textContent.trim()) {
          locations = [locContainer.textContent.trim()];
        }
        if (locations.length > 0) {
          const p = document.createElement('p');
          p.textContent = locations.join(', ');
          cellContent.appendChild(p);
        }
      }
    }
    rows.push([imageCell, cellContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
