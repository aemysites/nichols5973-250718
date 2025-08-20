/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, single column as specified
  const headerRow = ['Columns (columns26)'];

  // Gather each column's content from direct child divs
  const columns = Array.from(element.querySelectorAll(':scope > .related-article'));

  // Each column cell should contain all content from that .related-article
  const columnCells = columns.map((col) => {
    // The anchor contains all content for this column
    const anchor = col.querySelector('a');
    if (!anchor) return document.createElement('div');

    // We'll gather individual content elements
    const content = [];

    // 1. Image (if present)
    const img = anchor.querySelector('img');
    if (img) content.push(img);

    // 2. Tags (buttons as list)
    const tags = anchor.querySelector('.related-article__tags');
    if (tags) {
      const tagBtns = Array.from(tags.querySelectorAll('button'));
      if (tagBtns.length) {
        const ul = document.createElement('ul');
        tagBtns.forEach(btn => {
          const li = document.createElement('li');
          li.textContent = btn.textContent;
          ul.appendChild(li);
        });
        content.push(ul);
      }
    }

    // 3. Title (as heading)
    const title = anchor.querySelector('.related-article__title');
    if (title) content.push(title);

    // 4. Read More link to article
    const href = anchor.getAttribute('href');
    if (href) {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = href;
      link.textContent = 'Read More';
      p.appendChild(link);
      content.push(p);
    }

    return content.length ? content : document.createElement('div');
  });

  // Construct the table: header row is single cell, then a single row with N columns
  const cells = [
    headerRow,
    columnCells,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
