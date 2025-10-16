/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row must match block name exactly (single cell)
  const headerRow = ['Tabs (tabs6)'];

  // 2. Find all tab triggers (anchors)
  const tabLinks = Array.from(element.querySelectorAll('a.tablinnk-pli'));

  // 3. For each tab, extract the label (from the inner <div>), content cell is empty (no panels in source)
  // If no tab content is present, add a placeholder to clarify
  const rows = tabLinks.map((a) => {
    let label = '';
    const div = a.querySelector('div');
    if (div) {
      label = div.textContent.trim();
    } else {
      label = a.textContent.trim();
    }
    return [label, 'No content provided']; // Two columns: label, placeholder for missing content
  });

  // 4. Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
