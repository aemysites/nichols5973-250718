/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion112)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = element.querySelectorAll('.accordion-body__item');

  items.forEach((item) => {
    // Title cell: get the text content of the header (h3)
    const titleContainer = item.querySelector('.accordion-body__item--title');
    let titleCell = '';
    if (titleContainer) {
      const h3 = titleContainer.querySelector('h3');
      if (h3) {
        titleCell = h3.textContent.trim();
      } else {
        titleCell = titleContainer.textContent.trim();
      }
    }

    // Content cell: get the body content (the content to show when expanded)
    const bodyContainer = item.querySelector('.accordion-body__item--body');
    let contentCell = '';
    if (bodyContainer) {
      // Defensive: remove empty <p> before/after ul
      const bodyClone = bodyContainer.cloneNode(true);
      // Remove empty <p> tags
      bodyClone.querySelectorAll('p').forEach(p => {
        if (!p.textContent.trim() && !p.querySelector('*')) {
          p.remove();
        }
      });
      // If only one child (ul), use that directly, else use all children
      if (bodyClone.children.length === 1 && bodyClone.firstElementChild.tagName.toLowerCase() === 'ul') {
        contentCell = bodyClone.firstElementChild;
      } else {
        // Collect all non-empty children
        const children = Array.from(bodyClone.children).filter(child => {
          return child.textContent.trim() || child.querySelector('*');
        });
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        } else {
          contentCell = '';
        }
      }
    }

    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
