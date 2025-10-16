/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name
  const headerRow = ['Hero (hero56)'];

  // 2. Background image row: first <img> element
  const bgImg = element.querySelector('img');
  const bgImgRow = [bgImg ? bgImg : ''];

  // 3. Content row: flatten the hero content (no nested table)
  let contentRow = [''];
  const layout = element.querySelector('.layout-container');
  if (layout) {
    const table = layout.querySelector('table');
    if (table) {
      // Get the <td> inside the table and extract its children (headline, paragraphs, list)
      const td = table.querySelector('td');
      if (td) {
        // Create a container div and move all children from <td> into it
        const div = document.createElement('div');
        Array.from(td.childNodes).forEach(node => {
          // Skip empty paragraphs
          if (node.nodeType === 1 && node.tagName === 'P' && !node.textContent.trim()) return;
          if (node.nodeType === 3 && !node.textContent.trim()) return;
          div.appendChild(node.cloneNode(true));
        });
        contentRow = [div];
      }
    } else {
      // fallback: use all non-empty children of layout
      const div = document.createElement('div');
      Array.from(layout.childNodes).forEach(node => {
        if (node.nodeType === 1 && node.tagName === 'P' && !node.textContent.trim()) return;
        if (node.nodeType === 3 && !node.textContent.trim()) return;
        div.appendChild(node.cloneNode(true));
      });
      contentRow = [div];
    }
  }

  // Compose the table
  const rows = [headerRow, bgImgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
