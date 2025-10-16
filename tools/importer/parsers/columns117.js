/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns117)'];

  // Try to extract the nav row in a flexible way, ensuring all text content is included
  let navRowElements = [];

  // Try desktop nav first
  const filtersNav = element.querySelector('.sticky-bar__filters-nav');
  if (filtersNav) {
    // Find all direct children divs that have text or links
    const menuitems = Array.from(filtersNav.querySelectorAll(':scope > div'));
    // Only keep the label and the four navigation links (skip any icon/backtotop)
    // Find the div with the label ("Explore more:") and the next four divs with links
    // The structure is: [icon], [label], [link], [link], [link], [link]
    if (menuitems.length >= 6) {
      // menuitems[1] is label, menuitems[2-5] are links
      const labelDiv = menuitems[1];
      const labelText = labelDiv.textContent.trim();
      const linkCells = [];
      for (let i = 2; i <= 5; i++) {
        const linkDiv = menuitems[i];
        const link = linkDiv.querySelector('a');
        if (link) {
          linkCells.push(link);
        } else {
          linkCells.push(linkDiv.textContent.trim());
        }
      }
      navRowElements = [labelText, ...linkCells];
    } else if (menuitems.length >= 5) {
      // Sometimes no icon, so menuitems[0] is label, menuitems[1-4] are links
      const labelDiv = menuitems[0];
      const labelText = labelDiv.textContent.trim();
      const linkCells = [];
      for (let i = 1; i <= 4; i++) {
        const linkDiv = menuitems[i];
        const link = linkDiv.querySelector('a');
        if (link) {
          linkCells.push(link);
        } else {
          linkCells.push(linkDiv.textContent.trim());
        }
      }
      navRowElements = [labelText, ...linkCells];
    }
  }

  // Fallback: try mobile nav structure
  if (navRowElements.length === 0) {
    const mobileHeaders = element.querySelector('.sticky-bar__mobile-nav__headers');
    if (mobileHeaders) {
      const headerLinks = Array.from(mobileHeaders.querySelectorAll(':scope > div'));
      if (headerLinks.length >= 5) {
        // First cell: label, next four: links
        const labelDiv = headerLinks[0];
        const labelText = labelDiv.textContent.trim();
        const linkCells = [];
        for (let i = 1; i <= 4; i++) {
          const linkDiv = headerLinks[i];
          const link = linkDiv.querySelector('a');
          if (link) {
            linkCells.push(link);
          } else {
            linkCells.push(linkDiv.textContent.trim());
          }
        }
        navRowElements = [labelText, ...linkCells];
      }
    }
  }

  // Defensive: If still nothing, fallback to a single cell with all content
  if (navRowElements.length === 0) {
    navRowElements = [element.innerText.trim()];
  }

  // Build the table
  const rows = [headerRow, navRowElements];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
