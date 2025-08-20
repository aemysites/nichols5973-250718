/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for the block table
  const headerRow = ['Tabs (tabs94)'];
  const rows = [headerRow];

  // 2. Get all tab labels from the tabs list (in correct order)
  const tabLinks = element.querySelectorAll('ul.tabs-list a');
  // 3. Get all content panels (div.tabs-content)
  const tabContents = element.querySelectorAll('div.tabs-content');

  // 4. For each tab, extract label and corresponding content (retain all markup)
  for (let i = 0; i < tabLinks.length; i++) {
    const tabLink = tabLinks[i];
    const label = tabLink.textContent.trim();
    const tabContent = tabContents[i];
    if (!tabContent) continue;
    // Remove from DOM so it's not duplicated if it's referenced later
    if (tabContent.parentNode) tabContent.parentNode.removeChild(tabContent);
    // Remove any active class/hidden display for cleaner output
    tabContent.classList.remove('active');
    tabContent.style.display = '';
    rows.push([label, tabContent]);
  }

  // 5. Create and replace the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
