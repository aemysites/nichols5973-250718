/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match example exactly
  const headerRow = ['Accordion (accordion16)'];
  const rows = [];

  // Each .accordion-body__item is one accordion row
  const items = element.querySelectorAll(':scope > .accordion-body__item');
  items.forEach((item) => {
    // --- TITLE CELL: Find the main clickable title (usually a heading) ---
    let titleCell = '';
    const titleContainer = item.querySelector(':scope > .accordion-body__item--title');
    if (titleContainer) {
      // Try to find heading (h3/h2/h4), fallback to all text content
      let heading = titleContainer.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleCell = heading;
      } else {
        // fallback: use all text content (preserving inline tags if present)
        if (titleContainer.childNodes.length === 1 && titleContainer.firstChild.nodeType === Node.TEXT_NODE) {
          titleCell = titleContainer.textContent.trim();
        } else {
          // If any inline elements (span, etc), keep them
          titleCell = Array.from(titleContainer.childNodes).filter(node => {
            return node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
          });
          if (titleCell.length === 1) titleCell = titleCell[0];
        }
      }
    }
    // --- CONTENT CELL: The content to be shown when expanded ---
    let contentCell = '';
    const body = item.querySelector(':scope > .accordion-body__item--body');
    if (body) {
      // Only collect non-empty child elements or non-empty text
      const content = [];
      body.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.tagName === 'P' && child.textContent.trim() === '') {
            // skip empty P
            return;
          }
          content.push(child);
        } else if (child.nodeType === Node.TEXT_NODE) {
          if (child.textContent.trim()) {
            content.push(document.createTextNode(child.textContent));
          }
        }
      });
      if (content.length === 1) {
        contentCell = content[0];
      } else if (content.length > 1) {
        contentCell = content;
      } else {
        contentCell = '';
      }
    }
    rows.push([titleCell, contentCell]);
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
