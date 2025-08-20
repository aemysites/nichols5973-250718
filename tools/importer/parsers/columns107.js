/* global WebImporter */
export default function parse(element, { document }) {
  // The block expects two columns: left = image, right = body content
  // The header must match exactly: 'Columns (columns107)'
  // We must preserve all text content and existing elements

  // Get the main block container (the one passed in)
  const row = element;
  // There is one .entry-point__item child (the main column container)
  const column = row.querySelector(':scope > div');

  // Left column: .entry-point__item--img (contains the <img>)
  const leftImageContainer = column.querySelector('.entry-point__item--img');
  let leftImage = '';
  if (leftImageContainer) {
    const img = leftImageContainer.querySelector('img');
    if (img) {
      leftImage = img;
    }
  }

  // Right column: .entry-point__item--body (contains all text/links)
  const rightBodyContainer = column.querySelector('.entry-point__item--body');
  let rightBodyContent = [];
  if (rightBodyContainer) {
    // Only include non-empty elements, preserve their order and type
    rightBodyContent = Array.from(rightBodyContainer.childNodes)
      .filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Remove empty headings and paragraphs, also skip <br>
          if ((node.tagName === 'H3' || node.tagName === 'P') && !node.textContent.trim()) return false;
          if (node.tagName === 'BR') return false;
          return true;
        }
        return false;
      });
  }

  // The block header
  const headerRow = ['Columns (columns107)'];
  // The block's first (and only) content row consists of left and right
  const contentRow = [leftImage || '', rightBodyContent.length ? rightBodyContent : ''];
  // Compose the block table
  const tableCells = [
    headerRow,
    contentRow
  ];

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
