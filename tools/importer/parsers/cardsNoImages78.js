/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const rows = [['Cards (cardsNoImages78)']];

  // Find the main table containing card content
  const table = element.querySelector('table');
  if (!table) return;

  // Get all <tr> elements in the table
  const trList = table.querySelectorAll('tr');
  trList.forEach(tr => {
    // For each <td> (should only be one per row in this layout)
    const tds = tr.querySelectorAll('td');
    tds.forEach(td => {
      // Collect all non-empty children (preserve all content)
      const cardContents = [];
      Array.from(td.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Ignore empty <p> and <br>
          if (
            (node.tagName === 'BR') ||
            (node.tagName === 'P' && !node.textContent.trim() && node.innerHTML.trim() === '&nbsp;')
          ) {
            return;
          }
          cardContents.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // preserve text nodes
          const span = document.createElement('span');
          span.textContent = node.textContent;
          cardContents.push(span);
        }
      });
      // Only push rows with actual content
      if (cardContents.length > 0) {
        rows.push([cardContents]);
      }
    });
  });
  // Create and replace with the correct block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
