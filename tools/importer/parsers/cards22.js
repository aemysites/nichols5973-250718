/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  // Find the consultant cards container
  const consultantsSection = element.querySelector('.consultant-directory--consultants');
  if (consultantsSection) {
    const consultantEls = consultantsSection.querySelectorAll('.consultant');
    consultantEls.forEach(consultantEl => {
      // First cell: reference the <img> element (if present)
      let img = consultantEl.querySelector('.image img');

      // Second cell: name (bold/strong) and all text content from .location-wrapper
      const cellFragment = document.createDocumentFragment();
      // Name, always present
      const name = consultantEl.querySelector('.name');
      if (name) {
        const strong = document.createElement('strong');
        strong.textContent = name.textContent.trim();
        cellFragment.appendChild(strong);
      }
      // All locations (may be multiple <span>)
      const locations = consultantEl.querySelectorAll('.location-wrapper .location span');
      if (locations.length > 0) {
        const locDiv = document.createElement('div');
        locations.forEach((loc, i) => {
          if (i > 0) locDiv.appendChild(document.createElement('br'));
          locDiv.appendChild(document.createTextNode(loc.textContent.trim()));
        });
        cellFragment.appendChild(locDiv);
      }
      // Add row to table
      rows.push([img, cellFragment]);
    });
  }

  // Only replace if we actually have cards
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
