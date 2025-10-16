/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns14)'];

  // We'll collect all visible navigation content from the source HTML
  // 1. Main nav: The New CEO Workbook, The New CEO Book
  // 2. Subnav: All chapter and overview links under each main nav
  // 3. Additional nav: How We can Help, Download Workbook, Additional Content

  // Helper to extract all links from a .sticky-bar__items container
  function extractLinks(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll('.sticky-bar__item a')).map(a => {
      const aEl = document.createElement('a');
      aEl.href = a.href;
      aEl.textContent = a.textContent.trim();
      if (a.title) aEl.title = a.title;
      return aEl;
    });
  }

  // Find main nav containers
  const navHeaders = Array.from(element.querySelectorAll('.sticky-bar__mobile-nav__header'));
  const columns = navHeaders.map(header => {
    // Main nav label
    const mainLabel = header.querySelector('a')?.textContent.trim() || header.textContent.trim();
    // Subnav items
    const itemsContainer = header.querySelector('.sticky-bar__mobile-nav__items .sticky-bar__items');
    const links = extractLinks(itemsContainer);
    // Compose cell: main label + subnav links (if any)
    if (links.length) {
      const cell = document.createElement('div');
      cell.append(mainLabel);
      const ul = document.createElement('ul');
      links.forEach(linkEl => {
        const li = document.createElement('li');
        li.appendChild(linkEl);
        ul.appendChild(li);
      });
      cell.appendChild(ul);
      return cell;
    } else {
      return mainLabel;
    }
  });

  // Add additional nav links (How We can Help, Download Workbook, Additional Content)
  const extraLinks = Array.from(element.querySelectorAll('.sticky-bar__mobile-nav__header-link a, .sticky-bar__mobile-nav-link'));
  extraLinks.forEach(a => {
    let txt = a.textContent.trim();
    if (a.tagName === 'A') {
      const aEl = document.createElement('a');
      aEl.href = a.href;
      aEl.textContent = txt;
      if (a.title) aEl.title = a.title;
      columns.push(aEl);
    } else if (txt) {
      columns.push(txt);
    }
  });

  // Second row: all content in separate columns
  const contentRow = columns;

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
