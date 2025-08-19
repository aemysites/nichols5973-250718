/* global WebImporter */
export default function parse(element, { document }) {
  // Find main container
  const container = element.querySelector('.column');
  if (!container) return;
  const headerRow = ['Cards (cards110)'];
  const cardsTable = container.querySelector('table');
  if (!cardsTable) return;

  // Build card rows
  const cardRows = [];
  Array.from(cardsTable.querySelectorAll('tr')).forEach(tr => {
    Array.from(tr.querySelectorAll('td')).forEach(td => {
      // Only process cells with an image (these are cards)
      const img = td.querySelector('img');
      if (!img) return;
      // Get the link (for title & CTA)
      const link = td.querySelector('a.link--button');
      // Create title element
      let titleEl;
      if (link && link.textContent.trim()) {
        titleEl = document.createElement('strong');
        titleEl.textContent = link.textContent.trim();
      } else if (img.alt && img.alt.trim()) {
        titleEl = document.createElement('strong');
        titleEl.textContent = img.alt.trim();
      }
      // Gather description: any non-empty text nodes, plus <p> and other elements except the image & link
      let descriptionEls = [];
      Array.from(td.childNodes).forEach(node => {
        if (node.nodeType === 3) { // Text node
          const txt = node.textContent.trim();
          if (txt) descriptionEls.push(document.createTextNode(txt));
        } else if (node.nodeType === 1 && node !== img && node !== link) { // Element
          // For <p> and others, include only if not empty
          if (node.textContent && node.textContent.trim() && node.tagName !== 'A') {
            descriptionEls.push(node);
          }
        }
      });
      // Compose second cell: title, description, CTA link
      const cellContent = [titleEl, ...descriptionEls, link].filter(Boolean);
      cardRows.push([img, cellContent]);
    });
  });

  const cells = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
