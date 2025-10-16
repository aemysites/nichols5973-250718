/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract consultant cards from the directory
  function extractConsultantCards(container) {
    const cards = [];
    // Find the main consultant container
    const consultantsContainer = container.querySelector('.consultant-directory--consultants');
    if (!consultantsContainer) return cards;
    // Each consultant is a card
    const consultantDivs = consultantsContainer.querySelectorAll('.consultant');
    consultantDivs.forEach((consultant) => {
      // Find the link wrapping the card
      const link = consultant.querySelector('a');
      if (!link) return;
      // Image (mandatory)
      let imageEl = link.querySelector('.image img');
      // Name (mandatory)
      const nameDiv = link.querySelector('.name');
      // Location (mandatory)
      const locationDiv = link.querySelector('.location');
      // Compose text cell: Name (strong) + location(s)
      const textCell = document.createElement('div');
      if (nameDiv) {
        const nameEl = document.createElement('strong');
        nameEl.textContent = nameDiv.textContent.trim();
        textCell.appendChild(nameEl);
      }
      if (locationDiv) {
        // There may be multiple span children for multiple locations
        const locSpans = locationDiv.querySelectorAll('span');
        if (locSpans.length) {
          locSpans.forEach((span, idx) => {
            const loc = document.createElement('div');
            loc.textContent = span.textContent.trim();
            loc.style.textTransform = 'uppercase';
            textCell.appendChild(loc);
          });
        }
      }
      // Card row: [image, textCell]
      if (imageEl) {
        cards.push([imageEl.cloneNode(true), textCell]);
      }
    });
    return cards;
  }

  // Compose the table rows
  const headerRow = ['Cards (cards22)'];
  const cardRows = extractConsultantCards(element);
  if (cardRows.length === 0) return;

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cardRows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
