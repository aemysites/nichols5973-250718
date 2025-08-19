/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the block header
  const headerRow = ['Cards (cards84)'];
  const rows = [headerRow];

  // Find the list of consultants
  const ul = element.querySelector('ul');
  if (ul) {
    ul.querySelectorAll(':scope > li').forEach((li) => {
      const link = li.querySelector('a');
      // First column: image
      let img = null;
      const pictureDiv = li.querySelector('.related-consultants-list--picture');
      if (pictureDiv) {
        img = pictureDiv.querySelector('img');
      }
      // Second column: name as a link (from inner h4 and a)
      let textCell = '';
      const infoDiv = li.querySelector('.related-consultants-list--info');
      if (infoDiv) {
        const h4 = infoDiv.querySelector('h4');
        if (h4 && link) {
          // Use the anchor, but only with the name as text
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = h4.textContent;
          textCell = a;
        }
      }
      // Assemble the row
      rows.push([
        img || '',
        textCell || ''
      ]);
    });
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
