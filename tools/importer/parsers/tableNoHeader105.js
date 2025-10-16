/* global WebImporter */
export default function parse(element, { document }) {
  // Table (no header, tableNoHeader105) block
  // 1. Header row
  const headerRow = ['Table (no header, tableNoHeader105)'];

  // Defensive: Find the <ul> or <ol> containing the list items
  let listContainer = element.querySelector('ul,ol');
  if (!listContainer) listContainer = element;
  const listItems = Array.from(listContainer.children).filter(child => child.tagName === 'LI');

  // 2. Data rows: Each <li> contains a link or text
  const rows = listItems.map(li => {
    const link = li.querySelector('a');
    // Reference the existing anchor element if present
    if (link) {
      return [link];
    }
    // Otherwise, use the text content
    return [li.textContent.trim()];
  });

  // Create the table using the required header
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
