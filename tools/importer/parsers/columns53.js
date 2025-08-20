/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches example
  const headerRow = ['Columns (columns53)'];
  
  // 2. Two columns: Left (title + tags), Right (type, authors, date)
  // Reference original elements from the document, do not clone

  // LEFT COLUMN
  const titleContainer = element.querySelector('.article-heading--title-container');
  const leftCol = document.createElement('div');
  if (titleContainer) {
    // Title (h1)
    const title = titleContainer.querySelector('.article-heading--title');
    if (title) leftCol.appendChild(title);
    // Tags (all .tag links)
    const tags = titleContainer.querySelector('.article-heading--tags-in-title');
    if (tags) leftCol.appendChild(tags);
  }

  // RIGHT COLUMN
  const info = element.querySelector('.article-heading--info');
  const rightCol = document.createElement('div');
  if (info) {
    // Each child div: .type, .authors, .date
    Array.from(info.children).forEach(child => {
      rightCol.appendChild(child);
    });
  }

  // 3. Cells structure: two columns only
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];

  // 4. No Section Metadata table, as none is present in the example

  // 5. Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
