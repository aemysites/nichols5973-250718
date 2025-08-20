/* global WebImporter */
export default function parse(element, { document }) {
  // Extract tab labels and contents from the filters section
  const headerRow = ['Tabs (tabs5)'];

  // Get the tab labels from the nav menu
  const nav = element.querySelector('.latest-insights-insights__filters-nav');
  if (!nav) return;
  const navItems = Array.from(nav.querySelectorAll('[role="menuitem"]'));

  // Get all dropdowns (each represents a tab's content)
  const dropdowns = Array.from(element.querySelectorAll('.latest-insights-insights__filters-dropdown'));

  // For each tab, extract label and tab content
  const tabRows = navItems.map((navItem, i) => {
    // Label
    const labelDiv = navItem.querySelector('div[role="listbox"]');
    const label = labelDiv ? labelDiv.textContent.trim() : '';

    // Corresponding dropdown for tab content
    const dropdown = dropdowns[i];
    let tabContent = '';
    if (dropdown) {
      const itemsWrap = dropdown.querySelector('.latest-insights-insights__items');
      if (itemsWrap) {
        // Get only visible tab items (ignore visually-hidden)
        const tabItems = Array.from(itemsWrap.children).filter(el => !el.classList.contains('visually-hidden'));
        // If there are tab items, build a list
        if (tabItems.length) {
          const ul = document.createElement('ul');
          tabItems.forEach(item => {
            const li = document.createElement('li');
            const p = item.querySelector('p');
            const span = item.querySelector('span');
            // Reference the text directly
            if (p && span) {
              li.textContent = `${p.textContent.trim()} (${span.textContent.trim()})`;
            } else if (p) {
              li.textContent = p.textContent.trim();
            }
            ul.appendChild(li);
          });
          tabContent = ul;
        }
      }
    }
    // Only add this tab if it has a label and content
    if (label && tabContent && tabContent.children.length > 0) {
      return [label, tabContent];
    } else {
      return null;
    }
  }).filter(Boolean);

  // If there are no tabs, do not create the block
  if (!tabRows.length) return;
  // Compose the table: header then one row per tab
  const cells = [headerRow, ...tabRows];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
