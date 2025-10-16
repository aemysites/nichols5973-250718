/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block header
  const headerRow = ['Columns (columns27)'];

  // Find all direct child columns (each .related-article is a column)
  const columns = Array.from(element.querySelectorAll(':scope > .related-article'));

  if (!columns.length) return;

  const columnCells = columns.map((col) => {
    const cellContent = [];

    // 1. Add the image if present
    const img = col.querySelector('img');
    if (img) cellContent.push(img);

    // 2. Add the tags/buttons at the top
    const tagsContainer = col.querySelector('.related-article__tags');
    if (tagsContainer) {
      const tags = Array.from(tagsContainer.querySelectorAll('button'));
      if (tags.length) cellContent.push(...tags);
    }

    // 3. Add the heading/title
    const heading = col.querySelector('.related-article__title') || col.querySelector('h2');
    if (heading) cellContent.push(heading);

    // 4. Optionally, wrap everything in a link if the column is a link
    const link = col.querySelector('a[href]');
    if (link && cellContent.length) {
      // Create a new <a> and move all cellContent into it
      const a = document.createElement('a');
      a.href = link.href;
      cellContent.forEach(node => a.appendChild(node.cloneNode(true)));
      return a;
    }

    return cellContent.length ? cellContent : col;
  });

  const rows = [headerRow, columnCells];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
