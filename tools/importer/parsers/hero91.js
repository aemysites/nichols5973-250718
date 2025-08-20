/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name
  const headerRow = ['Hero (hero91)'];

  // 2. Background image row: parse from background-image style on root
  let bgImgElem = '';
  const styleAttr = element.getAttribute('style') || '';
  const bgUrlMatch = styleAttr.match(/background-image:\s*url\(([^)]+)\)/i);
  if (bgUrlMatch && bgUrlMatch[1]) {
    const bgImgUrl = bgUrlMatch[1].replace(/^['"]|['"]$/g, '');
    bgImgElem = document.createElement('img');
    bgImgElem.src = bgImgUrl;
    // Add default size from example (if possible)
    bgImgElem.setAttribute('width', '750');
    bgImgElem.setAttribute('height', '415');
    bgImgElem.alt = 'Hero background';
  }

  // 3. Content row: heading, subheading, CTA(s)
  let contentCell = [];
  // Find the main content area inside layout-container > .row > .column
  const layout = element.querySelector('.layout-container');
  if (layout) {
    const row = layout.querySelector('.row');
    if (row) {
      const column = row.querySelector('.column');
      if (column) {
        // 1. Heading (h2 in this case)
        const heading = column.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) contentCell.push(heading);

        // 2. Collect all paragraphs (excluding empties/only spaces)
        const paras = Array.from(column.querySelectorAll('p')).filter(p => p.textContent.trim().length > 0);
        // 3. For each paragraph, if it contains links, add links; else add paragraph
        paras.forEach(p => {
          const links = Array.from(p.querySelectorAll('a'));
          if (links.length > 0) {
            links.forEach(a => contentCell.push(a));
          } else {
            contentCell.push(p);
          }
        });
      }
    }
  }
  // If nothing found, fallback to empty string
  if (contentCell.length === 0) contentCell = [''];
  // If only one item, pass as single element; else as array
  const contentRow = [contentCell.length === 1 ? contentCell[0] : contentCell];

  // Compose the table
  const cells = [headerRow, [bgImgElem], contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
