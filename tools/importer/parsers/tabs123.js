/* global WebImporter */
export default function parse(element, { document }) {
  // Tabs block: extract tab labels from navigation only (no content panels in this HTML)
  // Header row must be a single cell
  const headerRow = ['Tabs (tabs123)'];

  // Find all tab links (anchors) inside the tab menu
  const tabLinks = Array.from(element.querySelectorAll('a'));

  // For each tab link, extract the label from the .glm-tab-text div
  // Since there is no tab content in the HTML, leave the content cell empty
  const rows = tabLinks.map((a) => {
    const labelDiv = a.querySelector('.glm-tab-text');
    const label = labelDiv ? labelDiv.textContent.trim() : a.textContent.trim();
    return [label, ''];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
