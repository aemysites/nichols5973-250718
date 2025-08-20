/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row: exactly one column for the header
  const cells = [['Tabs (tabs20)']];

  // Find the main tab block
  let mainTabWrapper = element.querySelector('.main-tab-wrapper-cli');
  if (!mainTabWrapper) mainTabWrapper = element;
  const mainTab = mainTabWrapper.querySelector('.main-tab-cli');
  if (!mainTab) return;

  // Get the main tab labels and panes
  const tabMenu = mainTab.querySelector('.main-tab-menu-cli');
  if (!tabMenu) return;
  const mainTabLinks = tabMenu.querySelectorAll('.tab-link-main-cli');
  const tabContentWrapper = mainTab.querySelector('.main-tab-content-cli');
  if (!tabContentWrapper) return;
  const mainTabPanes = tabContentWrapper.querySelectorAll(':scope > .main-tab-pane-cli');

  // Map labels to their corresponding tab pane by data-w-tab
  const tabs = Array.from(mainTabLinks).map(link => {
    const dataTab = link.getAttribute('data-w-tab');
    const labelDiv = link.querySelector('.main-tab-text-cli');
    const label = labelDiv ? labelDiv.textContent.trim() : '';
    // Find corresponding pane
    const pane = Array.from(mainTabPanes).find(p => p.getAttribute('data-w-tab') === dataTab);
    return { label, pane };
  });

  // For each tab, add a row with [label, content]
  tabs.forEach(tab => {
    if (!tab.label || !tab.pane) return;
    // As required, include the entire tab pane content as the content cell
    // but only reference the *existing* element (do not clone)
    cells.push([tab.label, tab.pane]);
  });

  // Create and replace the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
