/* global WebImporter */
export default function parse(element, { document }) {
  // Extract tab labels
  const tabLabelEls = element.querySelectorAll('.tabs-list .tabs-list__link, .tabs-list__link');
  const tabLabels = Array.from(tabLabelEls).map(el => el.textContent.trim());

  // Extract tab content panels (order must match tab labels)
  const tabContents = Array.from(element.querySelectorAll('.tabs-content'));

  // Defensive: If no tabs or no content, do nothing
  if (!tabLabels.length || !tabContents.length) return;

  // Table header row as per spec
  const headerRow = ['Tabs (tabs100)'];

  // Compose rows: each tab label and its content panel
  const rows = tabLabels.map((label, idx) => {
    const panel = tabContents[idx];
    if (!panel) return null;
    // Build a fragment for tab content
    const frag = document.createElement('div');
    Array.from(panel.childNodes).forEach((node) => {
      // Skip whitespace-only text nodes
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      frag.appendChild(node.cloneNode(true));
    });
    return [label, frag];
  }).filter(Boolean);

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
