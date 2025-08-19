/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main tab block
  const mainTab = element.querySelector('.main-tab-cli.w-tabs');
  if (!mainTab) return;

  // 2. Get main tab labels and panes (these are the outer tabs)
  const mainTabMenu = mainTab.querySelector('.main-tab-menu-cli.w-tab-menu');
  const mainTabLinks = Array.from(mainTabMenu.querySelectorAll('.tab-link-main-cli'));
  const mainTabContent = mainTab.querySelector('.main-tab-content-cli.w-tab-content');
  const mainTabPanes = Array.from(mainTabContent.children);

  // 3. Prepare table header
  const headerRow = ['Tabs (tabs41)'];
  const cells = [headerRow];

  // 4. Iterate over main tabs and build rows
  for (let i = 0; i < mainTabLinks.length; i++) {
    // --- Tab Label ---
    // Get label from child div with class
    const labelDiv = mainTabLinks[i].querySelector('.main-tab-text-cli');
    const label = labelDiv ? labelDiv.textContent.trim() : mainTabLinks[i].textContent.trim();

    // --- Tab Content ---
    const pane = mainTabPanes[i];
    let tabContent;
    // Check for sub-tabs (sub-tab-cli.w-tabs)
    const subTabsBlock = pane ? pane.querySelector('.sub-tab-cli.w-tabs') : null;
    if (subTabsBlock) {
      const subTabMenu = subTabsBlock.querySelector('.sub-tab-menu-cli.w-tab-menu');
      const subTabLinks = Array.from(subTabMenu.querySelectorAll('.cli-tab-link-2'));
      const subTabContentContainer = subTabsBlock.querySelector('.sub-tab-content-cli.w-tab-content');
      // Each sub-tab may have a pane in content container, but some may be directly under subTabsBlock
      // Gather all possible panes using role="tabpanel" and class 'w-tab-pane' or 'sub-tab-pane-cli'
      let subTabPanes = [];
      if (subTabContentContainer) {
        subTabPanes = Array.from(subTabContentContainer.children);
      } else {
        // Fallback: find all direct children with role="tabpanel"
        subTabPanes = Array.from(subTabsBlock.querySelectorAll('[role="tabpanel"]'));
      }
      // For each sub-tab, combine label and chart
      const subTabTable = [];
      for (let j = 0; j < subTabLinks.length; j++) {
        // Sub-tab label
        const subLabelDiv = subTabLinks[j].querySelector('.cli-tab-text');
        const subLabel = subLabelDiv ? subLabelDiv.textContent.trim() : subTabLinks[j].textContent.trim();
        // Sub-tab pane: try by index, fallback by id
        let subPane = subTabPanes[j];
        if (!subPane) {
          const paneId = subTabLinks[j].getAttribute('href');
          if (paneId) {
            subPane = subTabsBlock.querySelector(paneId);
          }
        }
        let subContent = [];
        if (subPane) {
          // Get chart and all relevant data
          const chartData = subPane.querySelector('.cli-all-data') || subPane.querySelector('.chart-js-embed-cli') || subPane;
          if (chartData) {
            subContent.push(chartData);
          }
        }
        subTabTable.push([subLabel, subContent]);
      }
      // Create a table for sub-tabs inside the content cell
      // But as per example, all sub-tabs should be presented as a multi-row, two-column table inside outer tab's content cell
      // So, create an inner table and reference it
      const innerTable = WebImporter.DOMUtils.createTable([
        // sub-tab header row
        ...subTabTable.map(row => [row[0], row[1]])
      ], document);
      tabContent = innerTable;
    } else if (pane) {
      // No sub-tabs; reference entire pane
      tabContent = pane;
    } else {
      tabContent = '';
    }
    cells.push([label, tabContent]);
  }

  // 5. Create and replace table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
