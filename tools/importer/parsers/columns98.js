/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main layout container (for columns)
  const layoutContainer = element.querySelector('.layout-container');
  let leftColContent = [];
  let rightColContent = [];
  let postColumnsContent = [];

  if (layoutContainer) {
    // Find the rich text content
    const richText = layoutContainer.querySelector('.rich-text-basic__text');
    if (richText) {
      // Find the table that holds the right column (quote box)
      const table = richText.querySelector('table');
      let quoteBox = null;
      if (table) {
        // Defensive: find the colored column inside the table
        const quoteCol = table.querySelector('.column');
        if (quoteCol) {
          // Remove empty paragraphs from quote box
          const quoteColClone = quoteCol.cloneNode(true);
          Array.from(quoteColClone.querySelectorAll('p')).forEach(p => {
            if (p.textContent.trim() === '') p.remove();
          });
          quoteBox = quoteColClone;
        }
      }

      // Left column: everything before the <hr> and excluding the table (quote box)
      let foundHR = false;
      leftColContent = [];
      postColumnsContent = [];
      Array.from(richText.childNodes).forEach((node) => {
        if (node === table || node.nodeType === Node.COMMENT_NODE) return;
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'HR') {
          foundHR = true;
          postColumnsContent.push(node.cloneNode());
          return;
        }
        if (!foundHR) {
          if (!(node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P' && node.textContent.trim() === '')) {
            leftColContent.push(node);
          }
        } else {
          if (!(node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P' && node.textContent.trim() === '')) {
            postColumnsContent.push(node);
          }
        }
      });

      // Right column: the quote box
      if (quoteBox) {
        rightColContent = [quoteBox];
      }
    }
  }

  // If for some reason we couldn't find the layout, fallback to all content
  if (leftColContent.length === 0) {
    leftColContent = [element];
  }

  // Table structure: header row, then columns row
  const headerRow = ['Columns (columns98)'];
  const columnsRow = [leftColContent, rightColContent.length ? rightColContent : ['']];
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block and any post-columns content
  if (postColumnsContent.length > 0) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(block);
    postColumnsContent.forEach(node => fragment.appendChild(node));
    element.replaceWith(fragment);
  } else {
    element.replaceWith(block);
  }
}
