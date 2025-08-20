/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure correct block header
  const headerRow = ['Cards (cards76)'];

  // Get all cards (both <a> and <div> direct children)
  const cards = Array.from(element.querySelectorAll(':scope > a.entry-point__item, :scope > div.entry-point__item'));

  const rows = cards.map(card => {
    // --- First cell: image/icon ---
    const imgDiv = card.querySelector('.entry-point__item--img');
    const firstCell = imgDiv || '';

    // --- Second cell: text content ---
    const bodyDiv = card.querySelector('.entry-point__item--body');
    const contentParts = [];
    if (bodyDiv) {
      // Heading if present
      const h3 = bodyDiv.querySelector('h3');
      if (h3 && h3.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = h3.textContent.trim();
        contentParts.push(strong);
      }
      // Description and other text - look for all paragraphs
      const paragraphs = Array.from(bodyDiv.querySelectorAll('p'));
      paragraphs.forEach((p, idx) => {
        if (p.textContent.trim()) {
          if (contentParts.length > 0) {
            contentParts.push(document.createElement('br'));
          }
          contentParts.push(document.createTextNode(p.textContent.trim()));
        }
      });
      // Fallback: if no <p> and heading absent, include all text
      if (contentParts.length === 0) {
        const fallback = bodyDiv.textContent.trim();
        if (fallback) {
          contentParts.push(document.createTextNode(fallback));
        }
      }
    }
    // Defensive: if still empty, fallback to card's text
    if (contentParts.length === 0) {
      const fallback = card.textContent.trim();
      if (fallback) {
        contentParts.push(document.createTextNode(fallback));
      }
    }
    const secondCell = contentParts.length === 1 ? contentParts[0] : contentParts;
    return [firstCell, secondCell];
  });

  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
