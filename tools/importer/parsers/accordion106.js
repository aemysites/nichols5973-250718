/* global WebImporter */
export default function parse(element, { document }) {
  // Determine total columns (accordion items are 2 columns)
  const items = element.querySelectorAll(':scope > .accordion-body__item');
  let columnsCount = 2;

  // Create header row as a single cell with colspan to span all columns
  const headerCell = document.createElement('th');
  headerCell.textContent = 'Accordion (accordion106)';
  if (columnsCount > 1) {
    headerCell.setAttribute('colspan', columnsCount);
  }
  const headerRow = [headerCell];

  const rows = [headerRow];

  items.forEach((item) => {
    // Title: find the .accordion-body__item--title, prefer heading element
    let titleCell;
    const titleWrap = item.querySelector('.accordion-body__item--title');
    if (titleWrap) {
      const heading = titleWrap.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) {
        titleCell = heading;
      } else {
        // fallback: get text content only
        const texts = Array.from(titleWrap.childNodes)
          .filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
          .map(n => n.textContent.trim());
        const span = document.createElement('span');
        span.textContent = texts.join(' ');
        titleCell = span;
      }
    } else {
      titleCell = document.createTextNode('');
    }

    // Content: all valid children of .accordion-body__item--body
    let contentCell;
    const bodyWrap = item.querySelector('.accordion-body__item--body');
    if (bodyWrap) {
      // Filter empty <p> and empty text nodes
      const contentNodes = Array.from(bodyWrap.childNodes).filter((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (
            node.tagName.toLowerCase() === 'p' &&
            node.textContent.trim() === '' &&
            !node.querySelector('img,iframe,audio,video')
          ) {
            return false;
          }
          return true;
        }
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim() !== '';
        }
        return false;
      });
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes;
      } else {
        contentCell = document.createTextNode('');
      }
    } else {
      contentCell = document.createTextNode('');
    }

    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
