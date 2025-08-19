/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as specified in the example
  const headerRow = ['Accordion (accordion20)'];
  const rows = [headerRow];

  // Get all immediate accordion items
  const items = element.querySelectorAll(':scope > .accordion-body__item');

  items.forEach((item) => {
    // Title cell extraction
    let titleElem = null;
    const titleContainer = item.querySelector('.accordion-body__item--title');
    if (titleContainer) {
      // Try to find any heading (h3, h2, h4, etc), falling back to first child
      titleElem = titleContainer.querySelector('h1, h2, h3, h4, h5, h6');
      if (!titleElem) {
        // If no heading found, fallback to first meaningful node (skip icons)
        for (const node of titleContainer.childNodes) {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName.match(/^I$/)) continue; // skip icon
          if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')) {
            titleElem = node;
            break;
          }
        }
      }
    }
    // If nothing found, fallback to empty string
    if (!titleElem) titleElem = document.createTextNode('');

    // Content cell extraction
    let bodyContent;
    const bodyContainer = item.querySelector('.accordion-body__item--body');
    if (bodyContainer) {
      // Remove empty <p> nodes and whitespace text nodes
      const contentNodes = Array.from(bodyContainer.childNodes).filter((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P' && node.textContent.trim() === '') return false;
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') return false;
        return true;
      });
      // If multiple content nodes, create an array for the table cell
      bodyContent = contentNodes.length === 0 ? document.createTextNode('') : (contentNodes.length === 1 ? contentNodes[0] : contentNodes);
    } else {
      bodyContent = document.createTextNode('');
    }

    rows.push([titleElem, bodyContent]);
  });

  // Create table using referenced nodes
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}