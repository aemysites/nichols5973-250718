/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as in example
  const headerRow = ['Accordion (accordion118)'];

  // Collect all immediate accordion items
  // Each accordion item is a .acc-item inside .acc-container
  const items = element.querySelectorAll(':scope .acc-container > .acc-item');
  const rows = [];

  items.forEach(item => {
    // Title: .header--main inside .acc-tab
    const title = item.querySelector('.acc-tab .header--main');
    // Content: .acc-pane-content (may contain div.para-main or other elements)
    const content = item.querySelector('.acc-pane-content');
    // For missing, fallback to empty string
    rows.push([title ? title : '', content ? content : '']);
  });

  // Compose final table rows
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
