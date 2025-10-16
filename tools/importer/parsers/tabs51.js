/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs container
  const tabsContainer = element.querySelector('.home-page-tabs');
  if (!tabsContainer) return;

  // Find tab headers (tab navigation)
  const tabMenu = tabsContainer.querySelector('.home-tabs-menu');
  if (!tabMenu) return;
  const tabHeaderEls = Array.from(tabMenu.querySelectorAll('[data-w-tab]'));

  // Find tab content panels
  const tabContentContainer = tabsContainer.querySelector('.home-tabs-content');
  if (!tabContentContainer) return;
  const tabPanelEls = Array.from(tabContentContainer.querySelectorAll('.w-tab-pane[data-w-tab]'));

  // Defensive: Only pair as many as both headers and panels exist
  const tabCount = Math.min(tabHeaderEls.length, tabPanelEls.length);

  // Build rows: header, then one row per tab (label, content)
  const rows = [];
  // Always use the required block name as header
  rows.push(['Tabs (tabs51)']);

  for (let i = 0; i < tabCount; i++) {
    const headerEl = tabHeaderEls[i];
    const panelEl = tabPanelEls[i];

    // Tab label: get the visible label text (may be nested in .tab-text-hme)
    let label = '';
    const labelEl = headerEl.querySelector('.tab-text-hme');
    if (labelEl) {
      label = labelEl.textContent.trim();
    } else {
      label = headerEl.textContent.trim();
    }

    // Tab content: use the first .slider-base inside the panel, or fallback to panelEl
    let contentEl = panelEl.querySelector('.slider-base') || panelEl;

    // Clean up extraneous attributes and classes from contentEl and its descendants
    const cleanContent = contentEl.cloneNode(true);
    const cleanAttrs = (el) => {
      // Remove all style, class, and data-* attributes
      el.removeAttribute('style');
      el.removeAttribute('class');
      // Remove all data-* attributes
      [...el.attributes].forEach(attr => {
        if (attr.name.startsWith('data-')) {
          el.removeAttribute(attr.name);
        }
      });
      // Recursively clean children
      Array.from(el.children).forEach(cleanAttrs);
    };
    cleanAttrs(cleanContent);

    rows.push([
      label,
      cleanContent
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
